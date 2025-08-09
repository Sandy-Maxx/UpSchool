import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, AUTH_CONFIG, PORTAL_CONFIG, ERROR_MESSAGES } from '../../constants';
import type { ApiResponse, ApiError, PortalType } from '../../types';

/**
 * Portal-aware API client for dual portal architecture
 * Supports both SaaS and Tenant portals with context detection
 */
class ApiClient {
  private client: AxiosInstance;
  private portalType: PortalType = 'saas';
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
    this.detectPortalContext();
  }

  /**
   * Detect portal context from URL or subdomain
   */
  private detectPortalContext(): void {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    // Check if we're on a known SaaS domain
    const isSaasDomain = PORTAL_CONFIG.SAAS_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (isSaasDomain && subdomain === hostname.split('.')[0]) {
      this.portalType = 'saas';
    } else if (PORTAL_CONFIG.TENANT_SUBDOMAIN_PATTERN.test(subdomain)) {
      this.portalType = 'tenant';
    } else {
      // Default to SaaS for development
      this.portalType = PORTAL_CONFIG.DEFAULT_PORTAL as PortalType;
    }
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Attach auth and portal headers
        const cfg = this.addAuthenticationHeaders(config)
        // Attach CSRF for unsafe methods
        const method = (cfg.method || 'get').toLowerCase()
        if (['post', 'put', 'patch', 'delete'].includes(method)) {
          const token = (typeof document !== 'undefined') ? (document.cookie.split('; ').find((c) => c.startsWith('csrftoken='))?.split('=')[1] || null) : null
          if (token) cfg.headers.set('X-CSRFToken', token)
        }
        return cfg;
      },
      (error) => {
        return Promise.reject(this.normalizeError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * Add authentication headers to request
   */
  private addAuthenticationHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = this.getAccessToken();
    
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // Add portal context header
    config.headers.set('X-Portal-Type', this.portalType);

    // Add tenant context for tenant portal
    if (this.portalType === 'tenant') {
      const subdomain = window.location.hostname.split('.')[0];
      config.headers.set('X-Tenant-Subdomain', subdomain);
    }

    return config;
  }

  /**
   * Handle response errors with automatic token refresh
   */
  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await this.refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return this.client(originalRequest);
      } catch (refreshError) {
        this.handleAuthenticationFailure();
        return Promise.reject(this.normalizeError(error));
      }
    }

    return Promise.reject(this.normalizeError(error));
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  /**
   * Perform the actual token refresh request
   */
  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/accounts/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      this.setAccessToken(access);
      return access;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Handle authentication failure by clearing tokens and redirecting
   */
  private handleAuthenticationFailure(): void {
    this.clearTokens();
    
    // Dispatch custom event for auth failure
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:failure'));
    }
  }

  /**
   * Normalize API response format
   */
  private normalizeResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: response.data?.message,
    };
  }

  /**
   * Normalize error format
   */
  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      const errorData = error.response.data as Record<string, any> | undefined;
      return {
        message: errorData?.message || ERROR_MESSAGES.SERVER_ERROR,
        code: errorData?.code,
        field: errorData?.field,
        details: errorData,
      };
    } else if (error.request) {
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
      };
    } else {
      return {
        message: error.message || ERROR_MESSAGES.SERVER_ERROR,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // Token management methods
  private getAccessToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
  }

  private setAccessToken(token: string): void {
    localStorage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, token);
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_STORAGE_KEY);
  }

  // Public API methods
  public getPortalType(): PortalType {
    return this.portalType;
  }

  public setPortalType(portalType: PortalType): void {
    this.portalType = portalType;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return this.normalizeResponse<T>(response);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return this.normalizeResponse<T>(response);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return this.normalizeResponse<T>(response);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return this.normalizeResponse<T>(response);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return this.normalizeResponse<T>(response);
  }

  public logout(): void {
    this.clearTokens();
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;

