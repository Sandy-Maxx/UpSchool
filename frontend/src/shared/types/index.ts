// ============================================================================
// SHARED TYPE DEFINITIONS
// Core types used across both SaaS and Tenant portals
// ============================================================================

// Base Entity Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Portal Context Types
export type PortalType = 'saas' | 'tenant';

export interface PortalContext {
  type: PortalType;
  subdomain?: string;
  tenantId?: string;
}

// User Types (Shared across portals)
export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'student' | 'parent' | 'staff';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
}

// Permission Types
export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'export'
  | 'import'
  | 'manage';

export interface Permission {
  resource: string;
  action: PermissionAction;
  conditions?: Record<string, unknown>;
}

export interface Role extends BaseEntity {
  name: string;
  description: string;
  permissions: Permission[];
  level: 'system' | 'tenant' | 'school';
}

// Tenant Types
export type TenantStatus = 'trial' | 'active' | 'suspended' | 'inactive';

export interface Tenant extends BaseEntity {
  name: string;
  subdomain: string;
  status: TenantStatus;
  trialEndsAt?: string;
  settings: TenantSettings;
  subscription?: Subscription;
}

export interface TenantSettings {
  timezone: string;
  locale: string;
  dateFormat: string;
  currency: string;
  academicYearStart: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// Subscription Types
export type PlanType = 'basic' | 'standard' | 'premium' | 'enterprise';

export interface Subscription extends BaseEntity {
  tenantId: string;
  plan: PlanType;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'date' | 'tel';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface NotificationState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  id: string;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  permissions: string[];
  children?: NavigationItem[];
  badge?: {
    text: string;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
}

// Dashboard Types
export interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'table' | 'calendar' | 'list';
  size: 'small' | 'medium' | 'large' | 'full';
  data?: unknown;
  config?: Record<string, unknown>;
  permissions: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  layout: Widget[];
  isDefault: boolean;
  permissions: string[];
}

// Chart Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
  data: ChartDataPoint[];
  options?: Record<string, unknown>;
}

// File Types
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Search Types
export interface SearchFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin';
  value: unknown;
}

export interface SearchParams {
  query?: string;
  filters: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Generic utility types for better type safety
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type ValueOf<T> = T[keyof T];

export type KeysOfUnion<T> = T extends T ? keyof T : never;
