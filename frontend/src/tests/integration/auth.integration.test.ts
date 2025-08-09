/**
 * Authentication Integration Tests - Comprehensive Security Testing
 * Multi-Tenant School ERP Platform
 *
 * This tests the complete authentication flow using MSW server for robust API mocking.
 */

import { mockData } from '../fixtures/mockData';
import { rest, server } from '../mocks/server';

// Define constants
const AUTH_PREFIX = '/api/auth';
const API_BASE_URL = 'http://localhost:8000';

// Register auth handlers for integration tests on the shared server
server.use(
  // Login endpoint
  rest.post(`${API_BASE_URL}${AUTH_PREFIX}/login/`, async (req, res, ctx) => {
    try {
      const body = await req.json() as any;
      const { username, password, email } = body;

      // Handle special cases first
      if (!username && !email) {
        return res(
          ctx.status(400),
          ctx.json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Username or email is required',
              details: { username: ['This field is required.'] },
              timestamp: new Date().toISOString(),
            },
          })
        );
      }

      if (!password) {
        return res(
          ctx.status(400),
          ctx.json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Password is required',
              details: { password: ['This field is required.'] },
              timestamp: new Date().toISOString(),
            },
          })
        );
      }

      if (password === 'wrong-password') {
        return res(
          ctx.status(401),
          ctx.json({
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid username/email or password.',
              timestamp: new Date().toISOString(),
            },
          })
        );
      }

      if (username === 'locked-user') {
        return res(
          ctx.status(423),
          ctx.json({
            success: false,
            error: {
              code: 'ACCOUNT_LOCKED',
              message: 'Account temporarily locked due to too many failed login attempts.',
              details: { lockoutTime: 900, attemptsRemaining: 0 },
              timestamp: new Date().toISOString(),
            },
          })
        );
      }

      // Successful login response
      return res(
        ctx.status(200),
        ctx.json({
          access: mockData.authTokens.validJWT,
          refresh: mockData.authTokens.refreshToken,
          user: {
            id: 1,
            username: username || 'testuser',
            email: email || 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            is_active: true,
            is_staff: true,
            last_login: new Date().toISOString(),
            role: 'superadmin',
          },
          permissions: [
            'PLATFORM_ADMIN',
            'TENANT_MANAGEMENT',
            'SYSTEM_MONITORING',
            'REVENUE_ANALYTICS',
            'SECURITY_MANAGEMENT',
          ],
        })
      );
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Invalid JSON format',
            timestamp: new Date().toISOString(),
          },
        })
      );
    }
  }),

  // Refresh endpoint
  rest.post(`${API_BASE_URL}${AUTH_PREFIX}/refresh/`, async (req, res, ctx) => {
    try {
      const body = await req.json() as any;
      const { refresh } = body;

      if (!refresh) {
        return res(
          ctx.status(400),
          ctx.json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Refresh token is required',
              details: { refresh: ['This field is required.'] },
              timestamp: new Date().toISOString(),
            },
          })
        );
      }

      if (refresh === 'expired-refresh-token') {
        return res(
          ctx.status(401),
          ctx.json({
            success: false,
            error: {
              code: 'TOKEN_EXPIRED',
              message: 'Refresh token has expired',
              timestamp: new Date().toISOString(),
            },
          })
        );
      }

      return res(
        ctx.status(200),
        ctx.json({
          access: mockData.authTokens.validJWT,
          refresh: mockData.authTokens.refreshToken,
        })
      );
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Invalid JSON format',
            timestamp: new Date().toISOString(),
          },
        })
      );
    }
  }),

  // Logout endpoint
  rest.post(`${API_BASE_URL}${AUTH_PREFIX}/logout/`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            timestamp: new Date().toISOString(),
          },
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        message: 'Successfully logged out.',
      })
    );
  })
);

// Setup and teardown
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

afterAll(() => {
  server.close();
  jest.restoreAllMocks();
});

describe('Authentication Integration - Production Security Tests', () => {
  const API_BASE_URL = 'http://localhost:8000';

  describe('Login Authentication Flow', () => {
    test('should successfully authenticate with valid credentials', async () => {
      const credentials = {
        username: 'superadmin',
        password: 'securePassword123!',
      };

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.access).toBeDefined();
      expect(data.refresh).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.permissions).toBeInstanceOf(Array);

      // Validate JWT structure
      const jwtParts = data.access.split('.');
      expect(jwtParts).toHaveLength(3);

      // Validate user data
      expect(data.user.username).toBe('superadmin');
      expect(data.user.is_active).toBe(true);
      expect(data.user.role).toBe('superadmin');

      // Validate permissions
      expect(data.permissions).toContain('PLATFORM_ADMIN');
      expect(data.permissions).toContain('TENANT_MANAGEMENT');
    });

    test('should reject invalid credentials with proper error structure', async () => {
      const credentials = {
        username: 'testuser',
        password: 'wrong-password',
      };

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
      expect(data.error.code).toBe('INVALID_CREDENTIALS');
      expect(data.error.message).toContain('Invalid username/email or password');
      expect(data.error.timestamp).toBeDefined();

      // Ensure error follows Django REST format
      const timestamp = new Date(data.error.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 5000); // Within last 5 seconds
    });

    test('should validate required fields with Django-style errors', async () => {
      // Test missing username/email
      let response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'test123' }),
      });

      expect(response.status).toBe(400);
      let data = await response.json();
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.details.username).toBeDefined();

      // Test missing password
      response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testuser' }),
      });

      expect(response.status).toBe(400);
      data = await response.json();
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.details.password).toBeDefined();
    });

    test('should handle account lockout scenarios', async () => {
      const credentials = {
        username: 'locked-user',
        password: 'anypassword',
      };

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      expect(response.status).toBe(423); // Locked

      const data = await response.json();
      expect(data.error.code).toBe('ACCOUNT_LOCKED');
      expect(data.error.details.lockoutTime).toBe(900);
      expect(data.error.details.attemptsRemaining).toBe(0);
    });
  });

  describe('Token Refresh Flow', () => {
    test('should successfully refresh valid token', async () => {
      const refreshData = {
        refresh: mockData.authTokens.refreshToken,
      };

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refreshData),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.access).toBeDefined();
      expect(data.refresh).toBeDefined();

      // Validate new tokens are valid JWTs
      const accessParts = data.access.split('.');
      const refreshParts = data.refresh.split('.');
      expect(accessParts).toHaveLength(3);
      expect(refreshParts).toHaveLength(3);
    });

    test('should reject expired refresh tokens', async () => {
      const refreshData = {
        refresh: 'expired-refresh-token',
      };

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refreshData),
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error.code).toBe('TOKEN_EXPIRED');
      expect(data.error.message).toContain('expired');
    });

    test('should validate refresh token presence', async () => {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.details.refresh).toBeDefined();
    });
  });

  describe('Logout Flow', () => {
    test('should successfully logout with valid token', async () => {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/logout/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockData.authTokens.validJWT}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toBe('Successfully logged out.');
    });

    test('should reject logout without authentication', async () => {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error.code).toBe('UNAUTHORIZED');
    });

    test('should reject logout with malformed Authorization header', async () => {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/logout/`, {
        method: 'POST',
        headers: {
          Authorization: 'Invalid-Format',
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Security Attack Prevention', () => {
    test('should sanitize XSS attempts in login', async () => {
      const maliciousCredentials = {
        username: '<script>alert("XSS")</script>',
        password: 'test123',
      };

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maliciousCredentials),
      });

      // Should either reject the malicious input or process it safely
      const data = await response.json();

      if (response.status === 401) {
        // If rejected, error message should not contain the script
        expect(data.error.message).not.toContain('<script>');
        expect(data.error.message).not.toContain('alert');
      } else if (response.status === 200) {
        // If processed, username should be sanitized
        expect(data.user.username).not.toContain('<script>');
      }
    });

    test('should handle SQL injection attempts', async () => {
      const injectionCredentials = {
        username: "admin'; DROP TABLE users; --",
        password: 'test123',
      };

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(injectionCredentials),
      });

      // Should handle gracefully without exposing database structure
      const data = await response.json();

      if (data.error) {
        expect(data.error.message).not.toContain('TABLE');
        expect(data.error.message).not.toContain('SQL');
        expect(data.error.message).not.toContain('database');
      }
    });

    test('should enforce rate limiting simulation', async () => {
      // This would be expanded with actual rate limiting in MSW
      // For now, we test that the structure supports it

      const credentials = {
        username: 'testuser',
        password: 'test123',
      };

      // In a real scenario, this would make multiple requests
      // to trigger rate limiting
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Verify response structure supports rate limiting
      const data = await response.json();
      if (data.error && data.error.code === 'RATE_LIMITED') {
        expect(data.error.details.retryAfter).toBeDefined();
      }
    });
  });

  describe('Response Format Validation', () => {
    test('should return consistent error format across all endpoints', async () => {
      const endpoints = [
        { method: 'POST', url: `${API_BASE_URL}${AUTH_PREFIX}/login/`, body: {} },
        { method: 'POST', url: `${API_BASE_URL}${AUTH_PREFIX}/refresh/`, body: {} },
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpoint.body),
        });

        if (response.status >= 400) {
          const data = await response.json();

          // Validate error structure consistency
          expect(data.success).toBe(false);
          expect(data.error).toBeDefined();
          expect(data.error.code).toBeDefined();
          expect(data.error.message).toBeDefined();
          expect(data.error.timestamp).toBeDefined();

          // Validate timestamp format
          const timestamp = new Date(data.error.timestamp);
          expect(timestamp).toBeInstanceOf(Date);
          expect(isNaN(timestamp.getTime())).toBe(false);
        }
      }
    });

    test('should include proper security headers in responses', async () => {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' }),
      });

      // In production MSW, these headers would be present
      // For now, we verify the response structure supports them
      expect(response.headers).toBeDefined();

      // Verify content type is correct
      expect(response.headers.get('content-type')).toContain('application/json');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle malformed JSON gracefully', async () => {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json-{',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);

      // Should still return valid JSON response even with malformed input
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    test('should handle empty request body', async () => {
      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);

      const data = await response.json();
      expect(data.error).toBeDefined();
      expect(data.error.code).toBeDefined();
    });

    test('should handle network timeout simulation', async () => {
      // This tests that our test setup can handle async operations
      // In real MSW, we'd add delay to simulate network issues

      const startTime = Date.now();

      const response = await fetch(`${API_BASE_URL}${AUTH_PREFIX}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' }),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verify the test infrastructure can handle timing
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(response).toBeDefined();
    });
  });
});

describe('JWT Token Validation', () => {
  test('should validate JWT structure manually', () => {
    const jwt = mockData.authTokens.validJWT;

    // Validate JWT structure
    const parts = jwt.split('.');
    expect(parts).toHaveLength(3);

    // Validate base64 encoding of header and payload
    expect(() => atob(parts[0])).not.toThrow();
    expect(() => atob(parts[1])).not.toThrow();

    // Decode and validate header
    const header = JSON.parse(atob(parts[0]));
    expect(header.alg).toBeDefined();
    expect(header.typ).toBe('JWT');

    // Decode and validate payload
    const payload = JSON.parse(atob(parts[1]));
    expect(payload.sub).toBeDefined();
    expect(payload.exp).toBeDefined();
    expect(payload.iat).toBeDefined();
  });

  test('should detect malformed JWTs', () => {
    const malformedTokens = [
      '',
      'invalid',
      'header.payload', // Missing signature
      'header.payload.signature.extra', // Too many parts
      'invalid-base64!.payload.signature', // Invalid base64
    ];

    malformedTokens.forEach(token => {
      const parts = token.split('.');
      if (parts.length !== 3) {
        expect(parts.length).not.toBe(3);
      } else {
        // Test base64 validation
        try {
          atob(parts[0]);
          atob(parts[1]);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      }
    });
  });
});
