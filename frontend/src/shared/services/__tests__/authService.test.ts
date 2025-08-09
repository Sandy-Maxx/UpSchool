/**
 * Authentication Service Tests - Production-Grade Security Testing
 * Stage 1.3 - Authentication Core Tests
 * Multi-Tenant School ERP Platform
 *
 * Following the comprehensive testing plan - Priority 1: Security-First Testing
 * Testing all authentication security features as per testing-plan.md
 */

// Mock the client module BEFORE importing the service under test
jest.mock('../api/client', () => ({
  __esModule: true,
  detectPortalContext: jest.fn(() => ({ type: 'saas' })),
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    setAuthToken: jest.fn(),
    clearAuth: jest.fn(),
  },
  saasApiClient: {
    post: jest.fn(),
  },
  tenantApiClient: {
    post: jest.fn(),
  },
}));

// Now import the service under test (after mocks are in place)
import { authService } from '../api/auth';
import { AUTH_CONFIG } from '@shared/constants';
import type { AuthUser } from '@types/api';

// Spy on localStorage methods
const localStorageSpy = {
  getItem: jest.spyOn(Storage.prototype, 'getItem'),
  setItem: jest.spyOn(Storage.prototype, 'setItem'),
  removeItem: jest.spyOn(Storage.prototype, 'removeItem'),
  clear: jest.spyOn(Storage.prototype, 'clear'),
};

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe('Authentication Service - Production Security (Stage 1.3)', () => {
const { saasApiClient, apiClient, detectPortalContext } = require('../api/client');

  // Ensure portal context is set for all tests
  (detectPortalContext as jest.Mock).mockReturnValue({ type: 'saas' });

  const mockUser: AuthUser = {
    id: '1',
    email: 'admin@school.edu',
    firstName: 'Admin',
    lastName: 'User',
    role: 'superadmin',
    isActive: true,
    tenant: {
      id: '1',
      name: 'Test Tenant',
      subdomain: 'test',
    }
  };

  const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MTYyMzkwMjJ9.7_I0nI2-y1p9k_GZ-rZk8-tY6mIeN4s3E0iTjRz7xGg';
  const mockRefreshToken = 'mock-refresh-token';

  describe('Token Management Security', () => {
    test('should securely store JWT tokens on login', async () => {
      const credentials = { email: 'admin@school.edu', password: 'SecurePass123!' };

      saasApiClient.post.mockResolvedValue({
        success: true,
        data: {
          access: mockJwt,
          refresh: mockRefreshToken,
          user: mockUser,
          permissions: ['PLATFORM_ADMIN'],
        },
      });

      const response = await authService.login(credentials);

      expect(response.success).toBe(true);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(AUTH_CONFIG.TOKEN_KEY, mockJwt);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(AUTH_CONFIG.REFRESH_TOKEN_KEY, mockRefreshToken);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(AUTH_CONFIG.USER_KEY, JSON.stringify(mockUser));
    });

    test('should handle token refresh securely', async () => {
      localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, mockRefreshToken);
      const newAccessToken = 'new-access-token-12345';
      
      apiClient.post.mockResolvedValue({ success: true, data: { access: newAccessToken } });

      const response = await authService.refreshToken();

      expect(response.success).toBe(true);
      expect(response.data?.access).toBe(newAccessToken);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(AUTH_CONFIG.TOKEN_KEY, newAccessToken);
    });

    test('should clear tokens on logout', async () => {
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, mockJwt);
      apiClient.post.mockResolvedValue({ success: true });

      await authService.logout();
      
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith(AUTH_CONFIG.TOKEN_KEY);
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith(AUTH_CONFIG.USER_KEY);
      expect(apiClient.clearAuth).toHaveBeenCalled();
    });
  });

  describe('Session Security', () => {
    test('isAuthenticated should return false for expired tokens', () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.WHAPj1nJ5i1e9i4uS3jwcS_5tYse-UTatFdZ1a_gMss';
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, expiredToken);
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(mockUser));

        expect(authService.isAuthenticated()).toBe(false);
        expect(localStorageSpy.clear).toHaveBeenCalled();
    });

    test('isAuthenticated should return true for valid tokens', () => {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, mockJwt);
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(mockUser));

        expect(authService.isAuthenticated()).toBe(true);
    });
  });
});
