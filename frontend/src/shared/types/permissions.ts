// Permission Actions - What operations can be performed
export type PermissionAction =
  | 'VIEW' // Read-only access
  | 'CREATE' // Add new records
  | 'UPDATE' // Modify existing data
  | 'DELETE' // Remove records
  | 'APPROVE' // Workflow approval
  | 'REJECT' // Workflow rejection
  | 'EXPORT' // Data export
  | 'IMPORT' // Bulk data import
  | 'MANAGE'; // Complete administrative control

// Portal Types for context-aware permissions
export type PortalType = 'saas' | 'tenant';

// Base Permission Interface
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: PermissionAction;
  portal: PortalType;
  conditions?: PermissionCondition[];
}

// Permission Conditions for advanced RBAC
export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
  value: any;
}

// Permission Check Request
export interface PermissionCheckRequest {
  resource: string;
  action: PermissionAction;
  context?: Record<string, any>;
  portal?: PortalType;
}

// Permission Check Response
export interface PermissionCheckResponse {
  allowed: boolean;
  reason?: string;
  conditions?: PermissionCondition[];
}

// Role Definition
export interface Role {
  id: string;
  name: string;
  description: string;
  portal: PortalType;
  permissions: Permission[];
  isActive: boolean;
  hierarchy?: number; // For role inheritance
  inheritsFrom?: string[]; // Parent roles
}

// User Role Assignment
export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  context?: Record<string, any>; // Additional context (e.g., school-specific)
}

// SaaS Portal Permissions - System-level operations
export const SAAS_PERMISSIONS = {
  // Platform Management
  PLATFORM_VIEW: 'platform.view',
  PLATFORM_MANAGE: 'platform.manage',

  // Tenant Management
  TENANTS_VIEW: 'tenants.view',
  TENANTS_CREATE: 'tenants.create',
  TENANTS_UPDATE: 'tenants.update',
  TENANTS_DELETE: 'tenants.delete',
  TENANTS_SUSPEND: 'tenants.suspend',
  TENANTS_ACTIVATE: 'tenants.activate',

  // System Analytics
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',

  // Billing & Subscriptions
  BILLING_VIEW: 'billing.view',
  BILLING_MANAGE: 'billing.manage',

  // Security & Compliance
  SECURITY_VIEW: 'security.view',
  SECURITY_MANAGE: 'security.manage',
  AUDIT_LOGS_VIEW: 'audit_logs.view',
  AUDIT_LOGS_EXPORT: 'audit_logs.export',

  // System Configuration
  CONFIG_VIEW: 'config.view',
  CONFIG_UPDATE: 'config.update',
} as const;

// Tenant Portal Permissions - School-level operations
export const TENANT_PERMISSIONS = {
  // School Management
  SCHOOL_VIEW: 'school.view',
  SCHOOL_UPDATE: 'school.update',
  SCHOOL_MANAGE: 'school.manage',

  // User Management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_IMPORT: 'users.import',
  USERS_EXPORT: 'users.export',

  // Student Management
  STUDENTS_VIEW: 'students.view',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_UPDATE: 'students.update',
  STUDENTS_DELETE: 'students.delete',
  STUDENTS_IMPORT: 'students.import',
  STUDENTS_EXPORT: 'students.export',

  // Academic Management
  ACADEMICS_VIEW: 'academics.view',
  ACADEMICS_UPDATE: 'academics.update',
  ACADEMICS_MANAGE: 'academics.manage',

  // Grades & Assessment
  GRADES_VIEW: 'grades.view',
  GRADES_CREATE: 'grades.create',
  GRADES_UPDATE: 'grades.update',
  GRADES_APPROVE: 'grades.approve',
  GRADES_EXPORT: 'grades.export',

  // Attendance
  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_CREATE: 'attendance.create',
  ATTENDANCE_UPDATE: 'attendance.update',
  ATTENDANCE_EXPORT: 'attendance.export',

  // Library Management
  LIBRARY_VIEW: 'library.view',
  LIBRARY_MANAGE: 'library.manage',
  LIBRARY_CIRCULATION: 'library.circulation',

  // Transport Management
  TRANSPORT_VIEW: 'transport.view',
  TRANSPORT_MANAGE: 'transport.manage',

  // Communication
  MESSAGES_VIEW: 'messages.view',
  MESSAGES_CREATE: 'messages.create',
  MESSAGES_MANAGE: 'messages.manage',
  ANNOUNCEMENTS_CREATE: 'announcements.create',
  ANNOUNCEMENTS_MANAGE: 'announcements.manage',

  // Reports & Analytics
  REPORTS_VIEW: 'reports.view',
  REPORTS_CREATE: 'reports.create',
  REPORTS_EXPORT: 'reports.export',
  ANALYTICS_VIEW: 'analytics.view',

  // Financial Management
  FEES_VIEW: 'fees.view',
  FEES_MANAGE: 'fees.manage',
  PAYMENTS_VIEW: 'payments.view',
  PAYMENTS_MANAGE: 'payments.manage',

  // Security & Audit
  SECURITY_VIEW: 'security.view',
  AUDIT_LOGS_VIEW: 'audit_logs.view',
  AUDIT_LOGS_EXPORT: 'audit_logs.export',
} as const;

// Resource Categories for easier management
export const RESOURCE_CATEGORIES = {
  PLATFORM: 'platform',
  TENANTS: 'tenants',
  USERS: 'users',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  ACADEMICS: 'academics',
  GRADES: 'grades',
  ATTENDANCE: 'attendance',
  LIBRARY: 'library',
  TRANSPORT: 'transport',
  COMMUNICATION: 'communication',
  REPORTS: 'reports',
  BILLING: 'billing',
  SECURITY: 'security',
  CONFIG: 'config',
} as const;

// Permission utility types
export type SaasPermission = (typeof SAAS_PERMISSIONS)[keyof typeof SAAS_PERMISSIONS];
export type TenantPermission = (typeof TENANT_PERMISSIONS)[keyof typeof TENANT_PERMISSIONS];
export type AnyPermission = SaasPermission | TenantPermission;

// Permission context for conditional access
export interface PermissionContext {
  portal: PortalType;
  tenantId?: string;
  userId: string;
  userRoles: string[];
  metadata?: Record<string, any>;
}
