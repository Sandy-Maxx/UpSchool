"""
Middleware for tenant identification and routing.
"""
from django.conf import settings
from django.db import connections
from django.http import Http404
from core.models import Tenant
import re


class TenantMiddleware:
    """
    Middleware to identify and set up tenant context.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get the hostname from the request
        hostname = request.get_host().split(':')[0]
        
        # Skip tenant resolution for certain paths
        if self._should_skip_tenant_resolution(request.path):
            return self.get_response(request)
        
        # Try to identify the tenant
        tenant = self._get_tenant_from_hostname(hostname)
        
        if tenant:
            # Set tenant in request
            request.tenant = tenant
            
            # Configure database connection for tenant
            self._configure_tenant_database(tenant)
        else:
            # No tenant found, this might be the main domain
            request.tenant = None
        
        response = self.get_response(request)
        return response

    def _should_skip_tenant_resolution(self, path):
        """Check if tenant resolution should be skipped for this path."""
        skip_paths = [
            '/admin/',
            '/api/v1/health/',
            '/static/',
            '/media/',
            '/favicon.ico',
        ]
        
        for skip_path in skip_paths:
            if path.startswith(skip_path):
                return True
        return False

    def _get_tenant_from_hostname(self, hostname):
        """Get tenant from hostname."""
        # Extract subdomain from hostname
        # Example: school1.yourplatform.com -> school1
        subdomain = self._extract_subdomain(hostname)
        
        if subdomain:
            try:
                return Tenant.objects.get(
                    subdomain=subdomain,
                    is_active=True
                )
            except Tenant.DoesNotExist:
                return None
        
        return None

    def _extract_subdomain(self, hostname):
        """Extract subdomain from hostname."""
        # Remove port if present
        hostname = hostname.split(':')[0]
        
        # Check if this is a subdomain
        # Pattern: subdomain.domain.com
        parts = hostname.split('.')
        
        if len(parts) >= 3:
            # This looks like a subdomain
            return parts[0]
        elif len(parts) == 2:
            # Check if this is a custom domain
            # For now, we'll assume it's a subdomain
            return parts[0]
        
        return None

    def _configure_tenant_database(self, tenant):
        """Configure database connection for tenant."""
        # For now, we'll use the same database
        # In a production setup, you might want to use separate databases
        # or schema-based isolation
        
        # Set tenant in thread local storage
        from threading import local
        _thread_locals = local()
        _thread_locals.tenant = tenant


def get_current_tenant():
    """Get the current tenant from thread local storage."""
    from threading import local
    _thread_locals = local()
    return getattr(_thread_locals, 'tenant', None)


def get_tenant_from_request(request):
    """Get tenant from request."""
    return getattr(request, 'tenant', None) 