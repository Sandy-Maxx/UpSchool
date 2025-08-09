/**
 * Simplified Authentication Service Tests
 * Multi-Tenant School ERP Platform
 *
 * Basic authentication service tests with axios mocking
 */

// Mock axios completely before any imports
jest.mock('axios', () => {
  const mockApiInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  const mockAxios = {
    create: jest.fn(() => mockApiInstance),
    defaults: {},
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
  };

  // Store the instance reference for tests to use
  (mockAxios as any).mockInstance = mockApiInstance;

  return {
    __esModule: true,
    default: mockAxios,
  };
});

// Import after mocking
import axios from 'axios';
import authService from '../authService';

// Get the mocked instance
const mockApiInstance = (axios as any).mockInstance;

describe('Authentication Service - Basic Tests', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Token Management', () => {
    test('should store and retrieve tokens', () => {
      const token = 'test-jwt-token';

      authService.setToken(token);

      expect(authService.getToken()).toBe(token);
      // Verify token is actually stored in localStorage
      expect(localStorage.getItem('token')).toBe(token);
    });

    test('should remove tokens', () => {
      const token = 'test-jwt-token';

      authService.setToken(token);
      expect(localStorage.getItem('token')).toBe(token);

      authService.removeToken();

      expect(authService.getToken()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });

    test('should check authentication status', () => {
      expect(authService.isAuthenticated()).toBe(false);

      authService.setToken('valid-token');
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('Login Flow', () => {
    test('should handle successful login', async () => {
      const mockResponse = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: { id: 1, username: 'testuser' },
      };

      mockApiInstance.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const credentials = { username: 'testuser', password: 'password' };
      const result = await authService.login(credentials);

      expect(result.access).toBe(mockResponse.access);
      expect(authService.getToken()).toBe(mockResponse.access);
    });

    test('should handle login failure', async () => {
      const error = new Error('Request failed with status code 401');
      mockApiInstance.post.mockRejectedValueOnce(error);

      const credentials = { username: 'testuser', password: 'wrongpass' };

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });

  describe('Logout Flow', () => {
    test('should handle successful logout', async () => {
      authService.setToken('test-token');

      mockApiInstance.post.mockResolvedValueOnce({
        data: { message: 'Logged out successfully' },
      });

      await authService.logout();

      expect(authService.getToken()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });

    test('should clear tokens even if server request fails', async () => {
      authService.setToken('test-token');

      mockApiInstance.post.mockRejectedValueOnce(new Error('Network error'));

      await authService.logout();

      expect(authService.getToken()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('Token Refresh', () => {
    test('should handle successful token refresh', async () => {
      const mockResponse = {
        token: 'new-access-token',
        refresh: 'new-refresh-token',
      };

      mockApiInstance.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await authService.refreshToken();

      expect(result.token).toBe(mockResponse.token);
    });

    test('should handle refresh failure', async () => {
      const error = new Error('Request failed with status code 401');
      mockApiInstance.post.mockRejectedValueOnce(error);

      await expect(authService.refreshToken()).rejects.toThrow();
    });
  });

  describe('User Management', () => {
    test('should get current user when authenticated', async () => {
      authService.setToken('valid-token');

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      };

      mockApiInstance.get.mockResolvedValueOnce({
        data: mockUser,
      });

      const user = await authService.getCurrentUser();

      expect(user.username).toBe(mockUser.username);
      expect(user.email).toBe(mockUser.email);
    });

    test('should handle password change', async () => {
      authService.setToken('valid-token');

      mockApiInstance.post.mockResolvedValueOnce({
        data: { message: 'Password changed successfully' },
      });

      const passwordData = {
        old_password: 'oldpass',
        new_password: 'newpass123',
      };

      await expect(authService.changePassword(passwordData)).resolves.not.toThrow();
    });

    test('should handle password reset request', async () => {
      mockApiInstance.post.mockResolvedValueOnce({
        data: { message: 'Reset email sent' },
      });

      await expect(authService.resetPassword('test@example.com')).resolves.not.toThrow();
    });

    test('should handle password reset confirmation', async () => {
      mockApiInstance.post.mockResolvedValueOnce({
        data: { message: 'Password reset successful' },
      });

      const resetData = {
        token: 'reset-token',
        new_password: 'newpass123',
      };

      await expect(authService.confirmPasswordReset(resetData)).resolves.not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      mockApiInstance.post.mockRejectedValueOnce(new Error('Network error'));

      const credentials = { username: 'testuser', password: 'password' };

      await expect(authService.login(credentials)).rejects.toThrow('Network error');
    });

    test('should handle malformed responses', async () => {
      const error = new Error('Invalid response format');
      mockApiInstance.post.mockRejectedValueOnce(error);

      const credentials = { username: 'testuser', password: 'password' };

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });
});
