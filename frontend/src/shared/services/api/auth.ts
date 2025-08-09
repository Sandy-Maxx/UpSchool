// ============================================================================
// AUTHENTICATION SERVICE
// Complete authentication API service for both SaaS and Tenant portals
// ============================================================================

import { apiClient, saasApiClient, tenantApiClient, detectPortalContext } from './client';
import { AUTH_CONFIG } from '@shared/constants';
import type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  AuthUser,
  ApiResponse,
} from '@types/api';

class AuthService {
  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  /**
   * User login with portal-aware routing
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const portalContext = detectPortalContext();
    const client = portalContext.type === 'saas' ? saasApiClient : tenantApiClient;

    try {
      const response = await client.post<LoginResponse>('/auth/login/', credentials);

      if (response.success && response.data) {
        this.handleLoginSuccess(response.data);
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error as any,
      };
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>('/auth/logout/');
      this.clearAuthData();
      return response;
    } catch (error) {
      // Clear local data even if logout fails on server
      this.clearAuthData();
      return {
        success: false,
        error: error as any,
      };
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = this.getStoredRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        error: {
          code: 'NO_REFRESH_TOKEN',
          message: 'No refresh token available',
          timestamp: new Date().toISOString(),
        },
      };
    }

    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh/', {
      refresh: refreshToken,
    });

    if (response.success && response.data) {
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.data.access);
    }

    return response;
  }

  // ============================================================================
  // PASSWORD MANAGEMENT
  // ============================================================================

  /**
   * Initiate password reset
   */
  async resetPassword(data: PasswordResetRequest): Promise<ApiResponse<void>> {
    const portalContext = detectPortalContext();
    const client = portalContext.type === 'saas' ? saasApiClient : tenantApiClient;

    return await client.post<void>('/auth/password/reset/', data);
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<ApiResponse<void>> {
    const portalContext = detectPortalContext();
    const client = portalContext.type === 'saas' ? saasApiClient : tenantApiClient;

    return await client.post<void>('/auth/password/reset/confirm/', data);
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return await apiClient.post<void>('/auth/password/change/', data);
  }

  // ============================================================================
  // USER PROFILE MANAGEMENT
  // ============================================================================

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return await apiClient.get<AuthUser>('/users/profile/');
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    return await apiClient.patch<AuthUser>('/users/profile/', data);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return await apiClient.post<{ avatar: string }>('/users/profile/avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (!token || !user) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        this.clearAuthData();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Check if token needs refresh
   */
  needsTokenRefresh(): boolean {
    const token = this.getStoredToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const refreshThreshold = AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD / 1000;

      return payload.exp - currentTime < refreshThreshold;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get session info
   */
  getSessionInfo(): {
    isAuthenticated: boolean;
    user: AuthUser | null;
    expiresAt: Date | null;
    needsRefresh: boolean;
  } {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    let expiresAt: Date | null = null;
    let needsRefresh = false;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        expiresAt = new Date(payload.exp * 1000);
        needsRefresh = this.needsTokenRefresh();
      } catch (error) {
        // Token is invalid
      }
    }

    return {
      isAuthenticated: this.isAuthenticated(),
      user,
      expiresAt,
      needsRefresh,
    };
  }

  // ============================================================================
  // PERMISSIONS & ROLES
  // ============================================================================

  /**
   * Get user permissions
   */
  async getUserPermissions(): Promise<ApiResponse<string[]>> {
    return await apiClient.get<string[]>('/users/permissions/');
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(permission: string): Promise<boolean> {
    try {
      const response = await this.getUserPermissions();
      if (response.success && response.data) {
        return response.data.includes(permission);
      }
      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(permissions: string[]): Promise<boolean> {
    try {
      const response = await this.getUserPermissions();
      if (response.success && response.data) {
        return permissions.some(permission => response.data!.includes(permission));
      }
      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  // ============================================================================
  // STORAGE UTILITIES
  // ============================================================================

  private handleLoginSuccess(loginResponse: LoginResponse): void {
    // Store tokens
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, loginResponse.access);
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, loginResponse.refresh);

    // Store user data
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(loginResponse.user));

    // Store permissions
    if (loginResponse.permissions) {
      localStorage.setItem('user_permissions', JSON.stringify(loginResponse.permissions));
    }

    // Set token in API client
    apiClient.setAuthToken(loginResponse.access);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  }

  private getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        return null;
      }
    }
    return null;
  }

  private clearAuthData(): void {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem('user_permissions');
    apiClient.clearAuth();
  }

  // ============================================================================
  // PORTAL-SPECIFIC METHODS
  // ============================================================================

  /**
   * Get portal context information
   */
  getPortalContext() {
    return detectPortalContext();
  }

  /**
   * Check if current session is for SaaS portal
   */
  isSaasPortal(): boolean {
    return this.getPortalContext().type === 'saas';
  }

  /**
   * Check if current session is for Tenant portal
   */
  isTenantPortal(): boolean {
    return this.getPortalContext().type === 'tenant';
  }

  /**
   * Get current tenant information (for tenant portal)
   */
  getCurrentTenant(): { id: string; name: string; subdomain: string } | null {
    const user = this.getStoredUser();
    return user?.tenant || null;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Redirect to appropriate login page based on portal context
   */
  redirectToLogin(): void {
    const portalContext = this.getPortalContext();

    if (portalContext.type === 'saas') {
      window.location.href = '/login';
    } else {
      window.location.href = '/auth/login';
    }
  }

  /**
   * Redirect to appropriate dashboard after successful login
   */
  redirectToDashboard(): void {
    const user = this.getStoredUser();
    const portalContext = this.getPortalContext();

    if (portalContext.type === 'saas') {
      // SaaS portal - redirect to superadmin dashboard
      window.location.href = '/superadmin';
    } else {
      // Tenant portal - redirect based on user role
      switch (user?.role) {
        case 'admin':
          window.location.href = '/admin/dashboard';
          break;
        case 'teacher':
          window.location.href = '/teacher/dashboard';
          break;
        case 'student':
          window.location.href = '/student/dashboard';
          break;
        case 'parent':
          window.location.href = '/parent/dashboard';
          break;
        case 'staff':
          window.location.href = '/staff/dashboard';
          break;
        default:
          window.location.href = '/dashboard';
      }
    }
  }

  /**
   * Get appropriate API base URL for current portal
   */
  getApiBaseUrl(): string {
    const portalContext = this.getPortalContext();
    return portalContext.type === 'saas'
      ? process.env.REACT_APP_SAAS_API_URL!
      : process.env.REACT_APP_TENANT_API_URL!;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export the class for potential custom instances
export { AuthService };

// Export commonly used functions
export const {
  login,
  logout,
  refreshToken,
  resetPassword,
  confirmPasswordReset,
  changePassword,
  getCurrentUser,
  updateProfile,
  isAuthenticated,
  hasPermission,
  hasAnyPermission,
  getPortalContext,
  redirectToLogin,
  redirectToDashboard,
} = authService;
