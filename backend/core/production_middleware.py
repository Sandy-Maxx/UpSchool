"""
Production-Grade Middleware for SaaS Platform
Implements rate limiting, monitoring, security headers, and observability.
"""

import time
import json
import logging
from typing import Dict, Any
from django.core.cache import cache
from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
import hashlib
import uuid

logger = logging.getLogger(__name__)

class RateLimitingMiddleware:
    """
    Advanced rate limiting middleware with multiple strategies.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Rate limiting configuration
        self.RATE_LIMITS = {
            'authenticated': {
                'requests': 1000,
                'window': 3600,  # 1 hour
                'burst': 100,    # requests per minute
            },
            'anonymous': {
                'requests': 100,
                'window': 3600,
                'burst': 10,
            },
            'admin': {
                'requests': 2000,
                'window': 3600,
                'burst': 200,
            }
        }
        
    def __call__(self, request):
        # Check rate limits before processing request
        if not self._check_rate_limit(request):
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'message': 'Too many requests. Please try again later.',
                'retry_after': 60
            }, status=429)
            
        response = self.get_response(request)
        
        # Add rate limit headers to response
        self._add_rate_limit_headers(request, response)
        
        return response
    
    def _check_rate_limit(self, request) -> bool:
        """Check if request is within rate limits."""
        user_key = self._get_user_key(request)
        user_type = self._get_user_type(request)
        
        # Get rate limit configuration
        limits = self.RATE_LIMITS.get(user_type, self.RATE_LIMITS['anonymous'])
        
        # Check hourly limit
        hourly_key = f"rate_limit:{user_key}:hour:{int(time.time() // 3600)}"
        hourly_count = cache.get(hourly_key, 0)
        
        if hourly_count >= limits['requests']:
            return False
            
        # Check burst limit (per minute)
        burst_key = f"rate_limit:{user_key}:minute:{int(time.time() // 60)}"
        burst_count = cache.get(burst_key, 0)
        
        if burst_count >= limits['burst']:
            return False
            
        # Increment counters
        cache.set(hourly_key, hourly_count + 1, 3600)
        cache.set(burst_key, burst_count + 1, 60)
        
        return True
    
    def _get_user_key(self, request) -> str:
        """Generate unique key for rate limiting."""
        if hasattr(request, 'user') and not isinstance(request.user, AnonymousUser):
            return f"user:{request.user.id}"
        
        # Use IP address for anonymous users
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        return f"ip:{ip}"
    
    def _get_user_type(self, request) -> str:
        """Determine user type for rate limiting."""
        if hasattr(request, 'user') and not isinstance(request.user, AnonymousUser):
            if request.user.is_superuser:
                return 'admin'
            return 'authenticated'
        return 'anonymous'
    
    def _add_rate_limit_headers(self, request, response):
        """Add rate limit information to response headers."""
        user_key = self._get_user_key(request)
        user_type = self._get_user_type(request)
        limits = self.RATE_LIMITS.get(user_type, self.RATE_LIMITS['anonymous'])
        
        # Get current usage
        hourly_key = f"rate_limit:{user_key}:hour:{int(time.time() // 3600)}"
        current_usage = cache.get(hourly_key, 0)
        
        response['X-RateLimit-Limit'] = str(limits['requests'])
        response['X-RateLimit-Remaining'] = str(max(0, limits['requests'] - current_usage))
        response['X-RateLimit-Reset'] = str(int(time.time() + (3600 - (time.time() % 3600))))


class SecurityHeadersMiddleware:
    """
    Advanced security headers middleware for production deployment.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        response = self.get_response(request)
        
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = (
            'geolocation=(), microphone=(), camera=(), '
            'payment=(), usb=(), magnetometer=(), gyroscope=()'
        )
        
        # HSTS (HTTP Strict Transport Security)
        if request.is_secure():
            response['Strict-Transport-Security'] = (
                'max-age=31536000; includeSubDomains; preload'
            )
        
        # CSP (Content Security Policy)
        if not settings.DEBUG:
            response['Content-Security-Policy'] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' "
                "https://cdn.jsdelivr.net https://unpkg.com; "
                "style-src 'self' 'unsafe-inline' "
                "https://fonts.googleapis.com https://cdn.jsdelivr.net; "
                "font-src 'self' https://fonts.gstatic.com; "
                "img-src 'self' data: https:; "
                "connect-src 'self' ws: wss:; "
                "frame-ancestors 'none';"
            )
        
        return response


class RequestLoggingMiddleware:
    """
    Comprehensive request logging middleware for monitoring and analytics.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.logger = logging.getLogger('api.requests')
        
    def __call__(self, request):
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        # Add request ID to request for tracking
        request.request_id = request_id
        
        # Log request start
        self._log_request_start(request, request_id)
        
        response = self.get_response(request)
        
        # Calculate response time
        response_time = (time.time() - start_time) * 1000  # in milliseconds
        
        # Add request ID to response headers
        response['X-Request-ID'] = request_id
        
        # Log request completion
        self._log_request_end(request, response, request_id, response_time)
        
        return response
    
    def _log_request_start(self, request, request_id):
        """Log request initiation."""
        log_data = {
            'request_id': request_id,
            'method': request.method,
            'path': request.path,
            'user': str(request.user) if hasattr(request, 'user') else 'anonymous',
            'ip': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'timestamp': timezone.now().isoformat(),
            'tenant': getattr(request, 'tenant', None),
        }
        
        self.logger.info(f"Request started: {json.dumps(log_data)}")
    
    def _log_request_end(self, request, response, request_id, response_time):
        """Log request completion."""
        log_data = {
            'request_id': request_id,
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'response_time_ms': round(response_time, 2),
            'user': str(request.user) if hasattr(request, 'user') else 'anonymous',
            'ip': self._get_client_ip(request),
            'timestamp': timezone.now().isoformat(),
            'content_length': len(response.content) if hasattr(response, 'content') else 0,
        }
        
        # Log level based on status code
        if 400 <= response.status_code < 500:
            self.logger.warning(f"Request completed: {json.dumps(log_data)}")
        elif response.status_code >= 500:
            self.logger.error(f"Request failed: {json.dumps(log_data)}")
        else:
            self.logger.info(f"Request completed: {json.dumps(log_data)}")
    
    def _get_client_ip(self, request):
        """Get client IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')


class PerformanceMonitoringMiddleware:
    """
    Performance monitoring middleware for tracking response times and system metrics.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.slow_request_threshold = 1000  # 1 second in milliseconds
        
    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        response_time = (time.time() - start_time) * 1000
        
        # Track performance metrics
        self._track_performance_metrics(request, response, response_time)
        
        # Alert on slow requests
        if response_time > self.slow_request_threshold:
            self._alert_slow_request(request, response_time)
        
        return response
    
    def _track_performance_metrics(self, request, response, response_time):
        """Track performance metrics in cache/database."""
        endpoint = f"{request.method}:{request.path}"
        
        # Store in Redis for real-time monitoring
        metrics_key = f"metrics:{endpoint}:day:{int(time.time() // 86400)}"
        
        # Get existing metrics
        existing_metrics = cache.get(metrics_key, {
            'count': 0,
            'total_time': 0,
            'min_time': float('inf'),
            'max_time': 0,
            'error_count': 0
        })
        
        # Update metrics
        existing_metrics['count'] += 1
        existing_metrics['total_time'] += response_time
        existing_metrics['min_time'] = min(existing_metrics['min_time'], response_time)
        existing_metrics['max_time'] = max(existing_metrics['max_time'], response_time)
        
        if response.status_code >= 400:
            existing_metrics['error_count'] += 1
        
        # Calculate average
        existing_metrics['avg_time'] = existing_metrics['total_time'] / existing_metrics['count']
        
        # Store updated metrics
        cache.set(metrics_key, existing_metrics, 86400)  # 24 hours
    
    def _alert_slow_request(self, request, response_time):
        """Alert on slow requests."""
        logger.warning(
            f"Slow request detected: {request.method} {request.path} "
            f"took {response_time:.2f}ms (threshold: {self.slow_request_threshold}ms)"
        )


class APIVersioningMiddleware:
    """
    API versioning middleware to handle multiple API versions.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.supported_versions = ['v1', 'v2']
        self.default_version = 'v1'
        
    def __call__(self, request):
        # Extract API version from URL or header
        api_version = self._get_api_version(request)
        request.api_version = api_version
        
        # Validate version
        if api_version not in self.supported_versions:
            return JsonResponse({
                'error': 'Unsupported API version',
                'supported_versions': self.supported_versions,
                'requested_version': api_version
            }, status=400)
        
        response = self.get_response(request)
        
        # Add version to response headers
        response['API-Version'] = api_version
        response['Supported-Versions'] = ', '.join(self.supported_versions)
        
        return response
    
    def _get_api_version(self, request):
        """Extract API version from request."""
        # Check URL path first
        if request.path.startswith('/api/'):
            parts = request.path.split('/')
            if len(parts) >= 3 and parts[2].startswith('v'):
                return parts[2]
        
        # Check Accept header
        accept_header = request.META.get('HTTP_ACCEPT', '')
        if 'version=' in accept_header:
            version = accept_header.split('version=')[1].split(';')[0].split(',')[0]
            return version.strip()
        
        # Check custom header
        version_header = request.META.get('HTTP_API_VERSION')
        if version_header:
            return version_header
        
        return self.default_version


class TenantIsolationMiddleware:
    """
    Enhanced tenant isolation middleware with performance optimization.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Extract tenant information
        tenant = self._get_tenant(request)
        request.tenant = tenant
        
        if not tenant and self._requires_tenant(request):
            return JsonResponse({
                'error': 'Tenant required',
                'message': 'This endpoint requires valid tenant information'
            }, status=400)
        
        response = self.get_response(request)
        
        # Add tenant info to response headers for debugging
        if tenant and settings.DEBUG:
            response['X-Tenant-ID'] = str(tenant.id)
            response['X-Tenant-Name'] = tenant.name
        
        return response
    
    def _get_tenant(self, request):
        """Extract tenant from request."""
        # Check subdomain
        host = request.get_host().split(':')[0]  # Remove port
        subdomain_parts = host.split('.')
        
        if len(subdomain_parts) > 2:  # Has subdomain
            subdomain = subdomain_parts[0]
            # Look up tenant by subdomain
            from core.models import Tenant
            try:
                return Tenant.objects.get(subdomain=subdomain)
            except Tenant.DoesNotExist:
                pass
        
        # Check X-Tenant header
        tenant_header = request.META.get('HTTP_X_TENANT')
        if tenant_header:
            from core.models import Tenant
            try:
                return Tenant.objects.get(id=tenant_header)
            except (Tenant.DoesNotExist, ValueError):
                pass
        
        return None
    
    def _requires_tenant(self, request):
        """Check if endpoint requires tenant isolation."""
        # Skip tenant requirement for certain paths
        skip_paths = [
            '/admin/',
            '/api/health/',
            '/api/docs/',
            '/api/schema/',
            '/api/v1/accounts/login/',
            '/api/v1/accounts/register/',
        ]
        
        return not any(request.path.startswith(path) for path in skip_paths)

# Logging configuration for production
PRODUCTION_LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'detailed': {
            'format': '{asctime} [{levelname}] {name}: {message}',
            'style': '{',
        },
        'json': {
            'format': '{"timestamp": "{asctime}", "level": "{levelname}", "logger": "{name}", "message": "{message}"}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/saas_platform.log',
            'maxBytes': 50 * 1024 * 1024,  # 50 MB
            'backupCount': 10,
            'formatter': 'json',
        },
        'api_file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/api_requests.log',
            'maxBytes': 100 * 1024 * 1024,  # 100 MB
            'backupCount': 5,
            'formatter': 'json',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'detailed',
        },
    },
    'loggers': {
        'api.requests': {
            'handlers': ['api_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
        },
        'school_platform': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}
