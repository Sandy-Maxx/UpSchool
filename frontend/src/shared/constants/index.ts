// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: 'access_token',
  REFRESH_TOKEN_STORAGE_KEY: 'refresh_token',
  USER_STORAGE_KEY: 'user_data',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

// Portal Detection
export const PORTAL_CONFIG = {
  SAAS_DOMAINS: ['localhost', '127.0.0.1', 'upschool.com'],
  TENANT_SUBDOMAIN_PATTERN: /^[a-z0-9-]+$/,
  DEFAULT_PORTAL: 'saas',
} as const;

// Permissions
export const PERMISSIONS = {
  // SaaS Portal Permissions
  SAAS: {
    PLATFORM_VIEW: 'platform.view',
    PLATFORM_ADMIN: 'platform.admin',
    TENANT_CREATE: 'tenant.create',
    TENANT_VIEW: 'tenant.view',
    TENANT_UPDATE: 'tenant.update',
    TENANT_DELETE: 'tenant.delete',
    SYSTEM_HEALTH: 'system.health',
    ANALYTICS_VIEW: 'analytics.view',
  },
  
  // Tenant Portal Permissions
  TENANT: {
    SCHOOL_ADMIN: 'school.admin',
    USERS_VIEW: 'users.view',
    USERS_CREATE: 'users.create',
    USERS_UPDATE: 'users.update',
    USERS_DELETE: 'users.delete',
    STUDENTS_VIEW: 'students.view',
    STUDENTS_CREATE: 'students.create',
    STUDENTS_UPDATE: 'students.update',
    TEACHERS_VIEW: 'teachers.view',
    TEACHERS_CREATE: 'teachers.create',
    ACADEMIC_VIEW: 'academic.view',
    ACADEMIC_MANAGE: 'academic.manage',
    LIBRARY_VIEW: 'library.view',
    LIBRARY_MANAGE: 'library.manage',
    TRANSPORT_VIEW: 'transport.view',
    TRANSPORT_MANAGE: 'transport.manage',
    REPORTS_VIEW: 'reports.view',
    REPORTS_EXPORT: 'reports.export',
  },
} as const;

// User Roles
export const USER_ROLES = {
  // SaaS Portal Roles
  SAAS: {
    SUPER_ADMIN: 'saas_super_admin',
    PLATFORM_ADMIN: 'saas_platform_admin',
    SUPPORT_AGENT: 'saas_support_agent',
  },
  
  // Tenant Portal Roles
  TENANT: {
    SCHOOL_ADMIN: 'school_admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent',
    STAFF: 'staff',
  },
} as const;

// UI Constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  NOTIFICATION_TIMEOUT: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  STORAGE_KEY: 'theme_preference',
  TRANSITION_DURATION: 200,
} as const;

// Form Validation
export const VALIDATION_RULES = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  SUBDOMAIN_PATTERN: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
  SUBDOMAIN_MIN_LENGTH: 3,
  SUBDOMAIN_MAX_LENGTH: 63,
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    max_users: 50,
    features: ['Student Management', 'Basic Reporting', 'Email Support'],
  },
  STANDARD: {
    id: 'standard', 
    name: 'Standard',
    max_users: 200,
    features: ['All Basic Features', 'Academic Management', 'Library System', 'Priority Support'],
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium', 
    max_users: 500,
    features: ['All Standard Features', 'Transport Management', 'Advanced Analytics', 'API Access'],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    max_users: 0, // Unlimited
    features: ['All Premium Features', 'Custom Integrations', '24/7 Support', 'Dedicated Success Manager'],
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid username or password.',
  ACCOUNT_INACTIVE: 'Your account has been deactivated. Please contact support.',
  RATE_LIMITED: 'Too many requests. Please wait a moment before trying again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  DATA_SAVED: 'Data saved successfully!',
  DATA_DELETED: 'Data deleted successfully!',
  EMAIL_SENT: 'Email sent successfully!',
  INVITATION_SENT: 'Invitation sent successfully!',
} as const;

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token', 
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
  RECENT_SEARCHES: 'recent_searches',
  DASHBOARD_LAYOUT: 'dashboard_layout',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy h:mm a',
  TIME: 'h:mm a',
  ISO: 'yyyy-MM-ddTHH:mm:ss.SSSXXX',
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large files
} as const;

// Environment
export const ENVIRONMENT = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  API_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'UpSchool',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;
