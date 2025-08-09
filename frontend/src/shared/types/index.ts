// Base Entity Interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// User Types
export interface User extends BaseEntity {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login?: string;
  job_title?: string;
  profile_image?: string;
}

// Permission Types
export interface Permission {
  id: string;
  name: string;
  codename: string;
  content_type: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface UserRole extends BaseEntity {
  user_id: string;
  role_id: string;
  tenant_id?: string;
}

// Tenant Types
export interface Tenant extends BaseEntity {
  name: string;
  subdomain: string;
  database_name: string;
  is_active: boolean;
  subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled';
  subscription_plan: 'basic' | 'standard' | 'premium' | 'enterprise';
  max_users: number;
  admin_name: string;
  admin_email: string;
  phone_number?: string;
  address?: string;
  academic_year_start?: string;
  first_login_at?: string;
  last_activity_at?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  tenant?: Tenant;
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tenant: Tenant | null;
  tokens: {
    access: string | null;
    refresh: string | null;
  };
  permissions: string[];
  loading: boolean;
  error: string | null;
}

// UI State Types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Portal Context
export type PortalType = 'saas' | 'tenant';

export interface PortalContext {
  type: PortalType;
  tenant?: Tenant;
  subdomain?: string;
}

// Common Component Props
export interface CommonProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  loading: boolean;
  errors: FormError[];
  touched: Record<string, boolean>;
}

