// ============================================================================
// APPLICATION CONSTANTS
// Centralized constants for both SaaS and Tenant portals
// ============================================================================

// Environment Configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  SAAS_API_URL: process.env.REACT_APP_SAAS_API_URL || 'http://localhost:8000/api/v1/public',
  TENANT_API_URL: process.env.REACT_APP_TENANT_API_URL || 'http://localhost:8000/api/v1',
  SAAS_DOMAIN: process.env.REACT_APP_SAAS_DOMAIN || 'localhost:3000',
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'school_erp_token',
  REFRESH_TOKEN_KEY: 'school_erp_refresh_token',
  USER_KEY: 'school_erp_user',
  SESSION_TIMEOUT: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '3600000'), // 1 hour
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// Portal Configuration
export const PORTAL_CONFIG = {
  SAAS: {
    NAME: 'UpClass',
    DESCRIPTION: 'School Management System',
    LOGO_URL: '/assets/logos/upclass-logo.png',
    FAVICON_URL: '/assets/favicons/saas-favicon.ico',
  },
  TENANT: {
    DEFAULT_LOGO_URL: '/assets/logos/default-school-logo.png',
    DEFAULT_FAVICON_URL: '/assets/favicons/tenant-favicon.ico',
  },
} as const;

// User Roles and Permissions
export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  STAFF: 'staff',
} as const;

export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  EXPORT: 'export',
  IMPORT: 'import',
  MANAGE: 'manage',
} as const;

export const PERMISSION_RESOURCES = {
  // System-level resources (SaaS Portal)
  TENANTS: 'tenants',
  SYSTEM_USERS: 'system_users',
  PLATFORM_ANALYTICS: 'platform_analytics',
  BILLING: 'billing',
  SYSTEM_SETTINGS: 'system_settings',

  // School-level resources (Tenant Portal)
  USERS: 'users',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  PARENTS: 'parents',
  STAFF: 'staff',
  CLASSES: 'classes',
  SUBJECTS: 'subjects',
  GRADES: 'grades',
  ATTENDANCE: 'attendance',
  LIBRARY: 'library',
  TRANSPORT: 'transport',
  COMMUNICATION: 'communication',
  REPORTS: 'reports',
  SCHOOL_SETTINGS: 'school_settings',
} as const;

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#1976d2',
    SECONDARY_COLOR: '#dc004e',
    SUCCESS_COLOR: '#2e7d32',
    ERROR_COLOR: '#d32f2f',
    WARNING_COLOR: '#ed6c02',
    INFO_COLOR: '#0288d1',
  },
  LAYOUT: {
    SIDEBAR_WIDTH: 280,
    HEADER_HEIGHT: 64,
    FOOTER_HEIGHT: 40,
  },
  BREAKPOINTS: {
    XS: 0,
    SM: 600,
    MD: 900,
    LG: 1200,
    XL: 1536,
  },
  ANIMATION: {
    DURATION_SHORT: 150,
    DURATION_STANDARD: 300,
    DURATION_COMPLEX: 375,
    EASING: {
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
} as const;

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 seconds
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 8000,
  WARNING_DURATION: 6000,
  INFO_DURATION: 4000,
  MAX_NOTIFICATIONS: 5,
  POSITION: {
    VERTICAL: 'top',
    HORIZONTAL: 'right',
  },
} as const;

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE:
      'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
  },
  PHONE: {
    PATTERN: /^\+?[1-9]\d{1,14}$/,
    MESSAGE: 'Please enter a valid phone number',
  },
  REQUIRED: {
    MESSAGE: 'This field is required',
  },
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    SPREADSHEETS: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
    AUDIO: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  },
  UPLOAD_PATH: {
    AVATARS: 'uploads/avatars',
    DOCUMENTS: 'uploads/documents',
    IMAGES: 'uploads/images',
    VIDEOS: 'uploads/videos',
    AUDIO: 'uploads/audio',
  },
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: ['#1976d2', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb'],
    SECONDARY: ['#dc004e', '#f06292', '#f48fb1', '#f8bbd9', '#fce4ec'],
    SUCCESS: ['#2e7d32', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'],
    WARNING: ['#ed6c02', '#ffb74d', '#ffcc02', '#ffd54f', '#ffe082'],
    ERROR: ['#d32f2f', '#e57373', '#ef5350', '#f44336', '#ffcdd2'],
  },
  DEFAULT_OPTIONS: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  },
} as const;

// Date and Time Configuration
export const DATE_CONFIG = {
  FORMATS: {
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY_DATE: 'MMM DD, YYYY',
    DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm',
  },
  TIMEZONES: [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Kolkata', label: 'India' },
  ],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  SERVER: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Please contact your administrator.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
  SAVED: 'Successfully saved!',
  SENT: 'Successfully sent!',
  UPLOADED: 'Successfully uploaded!',
  COPIED: 'Successfully copied to clipboard!',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  DEFAULT: 'Loading...',
  SAVING: 'Saving...',
  UPLOADING: 'Uploading...',
  PROCESSING: 'Processing...',
  DELETING: 'Deleting...',
  SENDING: 'Sending...',
} as const;

// Route Paths
export const ROUTES = {
  // SaaS Portal Routes
  SAAS: {
    HOME: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    SUPERADMIN: '/superadmin',
    TENANT_MANAGEMENT: '/superadmin/tenants',
    PLATFORM_ANALYTICS: '/superadmin/analytics',
    BILLING: '/superadmin/billing',
    SETTINGS: '/superadmin/settings',
  },

  // Tenant Portal Routes
  TENANT: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',

    // Admin Routes
    ADMIN: '/admin',
    USER_MANAGEMENT: '/admin/users',
    SCHOOL_SETTINGS: '/admin/settings',

    // Academic Routes
    STUDENTS: '/students',
    TEACHERS: '/teachers',
    CLASSES: '/classes',
    SUBJECTS: '/subjects',
    GRADES: '/grades',
    ATTENDANCE: '/attendance',

    // School Features
    LIBRARY: '/library',
    TRANSPORT: '/transport',
    COMMUNICATION: '/communication',
    REPORTS: '/reports',
  },
} as const;

// Export all constants as a single object for easy access
export const CONSTANTS = {
  ENV,
  API_CONFIG,
  AUTH_CONFIG,
  PORTAL_CONFIG,
  USER_ROLES,
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
  UI_CONFIG,
  NOTIFICATION_CONFIG,
  VALIDATION_RULES,
  FILE_CONFIG,
  PAGINATION_CONFIG,
  CHART_CONFIG,
  DATE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  ROUTES,
} as const;
