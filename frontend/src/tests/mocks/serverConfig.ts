/**
 * Mock Service Worker (MSW) Server Configuration
 * Multi-Tenant School ERP Platform - Production-Grade API Contract Fidelity
 *
 * This MSW setup precisely mirrors the actual backend API contracts to ensure
 * tests are reliable and realistic. All endpoints match the production API structure.
 */

// Production API Base URLs (matching actual backend)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const API_PREFIX = '/api';
export const AUTH_PREFIX = `${API_PREFIX}/auth`;
export const SAAS_PREFIX = `${API_PREFIX}/saas`;
export const TENANT_PREFIX = `${API_PREFIX}/tenant`;
export const PUBLIC_PREFIX = `${API_PREFIX}/v1/public`;

// Standard Backend Response Format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T = unknown> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Helper to create consistent API responses matching backend format
export const createApiResponse = <T>(
  data: T,
  success: boolean = true,
  message?: string
): ApiResponse<T> => ({
  success,
  data: success ? data : undefined,
  error: !success
    ? {
        code: 'API_ERROR',
        message: message || 'An error occurred',
        timestamp: new Date().toISOString(),
        details: {},
      }
    : undefined,
  message,
});

// Helper to create error responses matching backend format
export const createApiErrorResponse = (
  code: string,
  message: string,
  details?: Record<string, unknown>,
  status: number = 400
): { body: any; status: number } => {
  return {
    body: {
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
        details: details || {},
      },
    },
    status,
  };
};

// Helper to create paginated responses matching backend format
export const createPaginatedResponse = <T>(
  results: T[],
  page: number = 1,
  limit: number = 10,
  total: number = results.length,
  endpoint: string = 'endpoint'
): ApiResponse<PaginatedResponse<T>> => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return createApiResponse({
    count: total,
    next: hasNext
      ? `${API_BASE_URL}${API_PREFIX}/${endpoint}?page=${page + 1}&limit=${limit}`
      : null,
    previous: hasPrevious
      ? `${API_BASE_URL}${API_PREFIX}/${endpoint}?page=${page - 1}&limit=${limit}`
      : null,
    results,
  });
};

// Helper to simulate realistic response times
export const getRealisticDelay = (endpoint: string): number => {
  // Simulate realistic latency based on endpoint complexity
  if (endpoint.includes('/auth/')) return Math.random() * 200 + 100; // 100-300ms for auth
  if (endpoint.includes('/search')) return Math.random() * 500 + 200; // 200-700ms for search
  if (endpoint.includes('/upload')) return Math.random() * 2000 + 1000; // 1-3s for uploads
  if (endpoint.includes('/reports')) return Math.random() * 1000 + 500; // 500-1500ms for reports

  // Different simulated performance for SAAS vs TENANT endpoints
  if (endpoint.startsWith(SAAS_PREFIX)) return Math.random() * 200 + 80; // 80-280ms for SaaS admin
  if (endpoint.startsWith(TENANT_PREFIX)) return Math.random() * 250 + 100; // 100-350ms for tenant

  return Math.random() * 150 + 50; // 50-200ms for standard endpoints
};

// Helper to validate JWT tokens in requests
export const validateAuthToken = (request: Request): boolean => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  // In real implementation, you'd verify JWT signature and expiration
  // For testing, we'll just check the format and that it's not empty
  return !!token && token.split('.').length === 3;
};

// Helper to extract tenant ID from subdomain
export const extractTenantFromSubdomain = (request: Request): string | null => {
  const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];

  if (!subdomain || subdomain === 'www' || subdomain === 'localhost') {
    return null;
  }

  // In real implementation, you'd look up the tenant ID from the subdomain
  // For testing, we'll use a standard mapping
  const subdomainMap: Record<string, string> = {
    greenwood: 'tenant-001',
    oakhill: 'tenant-002',
    riverside: 'tenant-003',
  };

  return subdomainMap[subdomain] || null;
};

// Standard HTTP responses for common error scenarios
export const HTTP_RESPONSES = {
  UNAUTHORIZED: createApiErrorResponse('UNAUTHORIZED', 'Authentication required', undefined, 401),
  FORBIDDEN: createApiErrorResponse('FORBIDDEN', 'Insufficient permissions', undefined, 403),
  NOT_FOUND: createApiErrorResponse('NOT_FOUND', 'Resource not found', undefined, 404),
  VALIDATION_ERROR: (details: Record<string, unknown>) =>
    createApiErrorResponse('VALIDATION_ERROR', 'Validation failed', details, 400),
  RATE_LIMITED: createApiErrorResponse(
    'RATE_LIMITED',
    'Too many requests',
    { retryAfter: 60 },
    429
  ),
  SERVER_ERROR: createApiErrorResponse('SERVER_ERROR', 'Internal server error', undefined, 500),
  MAINTENANCE: createApiErrorResponse(
    'MAINTENANCE',
    'Service temporarily unavailable',
    { estimatedCompletion: new Date(Date.now() + 3600000).toISOString() },
    503
  ),
};

// Security headers added to all responses
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, max-age=0',
};

// Add security headers to response
export const addSecurityHeaders = (response: Response): Response => {
  const newResponse = response.clone();
  const newHeaders = new Headers(newResponse.headers);

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(newResponse.body, {
    status: newResponse.status,
    statusText: newResponse.statusText,
    headers: newHeaders,
  });
};

// Realistic error handling based on observed patterns
export const simulateRealisticErrors = (request: Request, chance: number = 0.02): any | null => {
  // Random chance of server errors (2% by default)
  if (Math.random() < chance) {
    // Distribute between different error types
    const errorRandom = Math.random();

    if (errorRandom < 0.05) return HTTP_RESPONSES.MAINTENANCE; // 5% maintenance
    if (errorRandom < 0.15) return HTTP_RESPONSES.SERVER_ERROR; // 10% server error
    if (errorRandom < 0.35) return HTTP_RESPONSES.RATE_LIMITED; // 20% rate limit

    // The rest are 4xx errors which might be test-relevant
    return null;
  }

  return null;
};

// Detailed logging for MSW (when needed)
export const logRequest = (request: Request, enabled: boolean = false): void => {
  if (!enabled) return;

  console.group('MSW Request');
  console.log('URL:', request.url);
  console.log('Method:', request.method);
  console.log('Headers:', Object.fromEntries([...new Headers(request.headers)]));
  console.groupEnd();
};

export const logResponse = (response: Response, enabled: boolean = false): void => {
  if (!enabled) return;

  console.group('MSW Response');
  console.log('Status:', response.status);
  console.log('Headers:', Object.fromEntries([...new Headers(response.headers)]));
  console.groupEnd();
};
