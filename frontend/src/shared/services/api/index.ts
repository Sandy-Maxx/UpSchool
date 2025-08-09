// ============================================================================
// API SERVICES INDEX
// Central export point for all API services and utilities
// ============================================================================

// Core API client and utilities
export {
  ApiClient,
  apiClient,
  saasApiClient,
  tenantApiClient,
  detectPortalContext,
} from './client';

// Authentication service
export {
  AuthService,
  authService,
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
} from './auth';

// Type exports for convenience
export type {
  // API Types
  ApiResponse,
  ApiError,
  PaginatedResponse,

  // Authentication Types
  LoginCredentials,
  LoginResponse,
  AuthUser,
  RefreshTokenRequest,
  RefreshTokenResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,

  // Tenant Registration Types
  TenantRegistrationData,
  TenantRegistrationResponse,
  SubdomainCheckRequest,
  SubdomainCheckResponse,

  // User Management Types
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
  BulkUserOperation,

  // Student Management Types
  Student,
  ParentGuardian,
  CreateStudentRequest,

  // Academic Management Types
  Grade,
  Class,
  Subject,
  ClassSchedule,

  // Library Management Types
  Book,
  BookCategory,
  BookBorrowing,

  // Transport Management Types
  Vehicle,
  Driver,
  Route,
  RouteStop,

  // Communication Types
  Message,
  MessageAttachment,
  Announcement,

  // Reports & Analytics Types
  Report,
  ReportParameter,
  AnalyticsData,

  // System Types
  SystemHealth,
  TenantMetrics,
  ApiEndpoints,
} from '@types/api';

// Utility functions
export const createApiService = <T = unknown>(baseUrl: string) => {
  return {
    get: (url: string) => apiClient.get<T>(url),
    post: (url: string, data?: unknown) => apiClient.post<T>(url, data),
    put: (url: string, data?: unknown) => apiClient.put<T>(url, data),
    patch: (url: string, data?: unknown) => apiClient.patch<T>(url, data),
    delete: (url: string) => apiClient.delete<T>(url),
  };
};

// API endpoint constants
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  REFRESH: '/auth/refresh/',
  PASSWORD_RESET: '/auth/password/reset/',
  PASSWORD_RESET_CONFIRM: '/auth/password/reset/confirm/',
  CHANGE_PASSWORD: '/auth/password/change/',

  // User Management
  USERS: '/users/',
  USER_PROFILE: '/users/profile/',
  USER_ROLES: '/users/roles/',
  USER_PERMISSIONS: '/users/permissions/',

  // Student Management
  STUDENTS: '/students/',
  STUDENT_ENROLLMENT: '/students/enrollment/',
  PARENT_GUARDIANS: '/students/parents/',

  // Academic Management
  GRADES: '/academic/grades/',
  CLASSES: '/academic/classes/',
  SUBJECTS: '/academic/subjects/',
  SCHEDULES: '/academic/schedules/',

  // Library Management
  BOOKS: '/library/books/',
  BOOK_CATEGORIES: '/library/categories/',
  BORROWINGS: '/library/borrowings/',

  // Transport Management
  VEHICLES: '/transport/vehicles/',
  DRIVERS: '/transport/drivers/',
  ROUTES: '/transport/routes/',

  // Communication
  MESSAGES: '/communication/messages/',
  ANNOUNCEMENTS: '/communication/announcements/',

  // Reports
  REPORTS: '/reports/',
  ANALYTICS: '/reports/analytics/',

  // System (SaaS Portal)
  TENANTS: '/tenants/',
  SYSTEM_HEALTH: '/system/health/',
  TENANT_REGISTRATION: '/public/register/',
  SUBDOMAIN_CHECK: '/public/check-subdomain/',
} as const;

// Helper functions for common API patterns
export const buildQueryString = (params: Record<string, unknown>): string => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => [key, String(value)]);

  if (filteredParams.length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams(filteredParams);
  return `?${searchParams.toString()}`;
};

export const handleApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as any;

    // Check for API error format
    if (apiError.message) {
      return apiError.message;
    }

    // Check for axios error format
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }

    if (apiError.response?.data?.detail) {
      return apiError.response.data.detail;
    }

    // Check for validation errors
    if (apiError.response?.data?.errors) {
      const errors = apiError.response.data.errors;
      if (typeof errors === 'object') {
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError)) {
          return firstError[0] as string;
        }
        return firstError as string;
      }
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

// Type guards
export const isApiError = (response: any): response is { success: false; error: any } => {
  return response && response.success === false && response.error;
};

export const isApiSuccess = <T>(response: any): response is { success: true; data: T } => {
  return response && response.success === true && response.data !== undefined;
};
