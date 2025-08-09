/**
 * RBAC System - Complete Role-Based Access Control for Multi-Tenant School ERP
 *
 * This module provides a comprehensive RBAC system supporting both SaaS and Tenant portals
 * with enterprise-grade permission management, role-based components, and security controls.
 *
 * Key Features:
 * - Dual portal support (SaaS/Tenant)
 * - Component-level permission gates
 * - Route-level protection
 * - Service layer abstraction
 * - Type-safe permission checking
 * - Contextual access control
 * - Portal-aware navigation
 */

// Core Components
export { default as PermissionGate } from './components/PermissionGate';
export {
  MultiPermissionGate,
  AnyPermissionGate,
  CanView,
  CanCreate,
  CanUpdate,
  CanDelete,
  CanManage,
} from './components/PermissionGate';

export { default as RoleBasedRoute } from './components/RoleBasedRoute';
export {
  ResourceRoute,
  AdminRoute,
  TeacherRoute,
  StudentRoute,
  ParentRoute,
  withRoleBasedAccess,
} from './components/RoleBasedRoute';

export { default as AccessDenied } from './components/AccessDenied';
export { InlineAccessDenied, CompactAccessDenied } from './components/AccessDenied';

export { default as ConditionalRender } from './components/ConditionalRender';
export {
  IfCan,
  IfRole,
  IfAnyRole,
  IfPortal,
  IfAdmin,
  IfTeacher,
  IfStudent,
  IfParent,
  Unless,
  IfConditions,
  IfCapability,
} from './components/ConditionalRender';

// Services
export { SaasPermissionService, saasPermissionService } from './services/saasPermissionService';

export {
  TenantPermissionService,
  tenantPermissionService,
} from './services/tenantPermissionService';

// Portal-specific Hooks
export {
  useSaasPermissions,
  useSaasRoleCheck,
  useSaasNavigation,
  useSaasDataAccess,
} from './hooks/useSaasPermissions';

export {
  useTenantPermissions,
  useTenantRoleCheck,
  useTenantNavigation,
  useTenantDataAccess,
} from './hooks/useTenantPermissions';

// Re-export core utilities and types from shared
export {
  // Permission utilities
  detectPortalType,
  getUserPermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getAccessibleResources,
  getAllowedActions,
  checkPermission,
  generatePermissionMatrix,
  formatPermissionForDisplay,
  groupPermissionsByResource,
} from '../utils/permissionUtils';

export {
  // Permission hooks
  usePermissions,
  useRoleCapabilities,
  usePortalNavigation,
  useSpecificPermissions,
} from '../hooks/usePermissions';

export {
  // Permission types
  type Permission,
  type PermissionAction,
  type PermissionCheckRequest,
  type PermissionCheckResponse,
  type PermissionContext,
  type PermissionCondition,
  type Role,
  type UserRole,
  type PortalType,
  type AnyPermission,
  SAAS_PERMISSIONS,
  TENANT_PERMISSIONS,
  RESOURCE_CATEGORIES,
} from '../types/permissions';

export {
  // SaaS role types
  type SaasRoleType,
  SAAS_ROLES,
  SAAS_ROLE_HIERARCHY,
  SAAS_ROLE_CAPABILITIES,
  SAAS_ROLE_COLORS,
  hasHigherPrivileges,
  getInheritedPermissions,
  DEFAULT_SAAS_ROLE,
} from '../types/saasRoles';

export {
  // Tenant role types
  type TenantRoleType,
  type StaffSubRole,
  TENANT_ROLES,
  TENANT_ROLE_HIERARCHY,
  TENANT_ROLE_CAPABILITIES,
  TENANT_ROLE_COLORS,
  TENANT_ROLE_ICONS,
  STAFF_SUBROLE_PERMISSIONS,
  getStaffPermissions,
  canAccessResource,
  DEFAULT_TENANT_ROLE,
} from '../types/tenantRoles';

// Common RBAC patterns and utilities
export const RBACPatterns = {
  /**
   * Common permission check patterns
   */
  Permissions: {
    // SaaS Portal patterns
    canManagePlatform: (userRoles: string[]) => saasPermissionService.canManagePlatform(userRoles),
    canManageTenants: (userRoles: string[]) => saasPermissionService.canManageTenants(userRoles),
    canViewBilling: (userRoles: string[]) => saasPermissionService.canViewBillingData(userRoles),

    // Tenant Portal patterns
    canManageSchool: (userRoles: string[]) => tenantPermissionService.canManageSchool(userRoles),
    canManageStudents: (userRoles: string[]) =>
      tenantPermissionService.canManageStudents(userRoles),
    canViewGrades: (userRoles: string[]) =>
      tenantPermissionService.canManageGrades(userRoles, 'VIEW'),
  },

  /**
   * Role checking utilities
   */
  Roles: {
    isSuperAdmin: (roles: string[]) => roles.includes('system_superadmin'),
    isSchoolAdmin: (roles: string[]) => roles.includes('admin'),
    isTeacher: (roles: string[]) => roles.includes('teacher'),
    isStudent: (roles: string[]) => roles.includes('student'),
    isParent: (roles: string[]) => roles.includes('parent'),
    isStaff: (roles: string[]) => roles.includes('staff'),
  },

  /**
   * Portal detection utilities
   */
  Portal: {
    isSaasPortal: () => detectPortalType() === 'saas',
    isTenantPortal: () => detectPortalType() === 'tenant',
    getCurrentPortal: () => detectPortalType(),
  },
};

// Quick access exports for common scenarios
export const Quick = {
  // Component wrappers
  AdminOnly: IfAdmin,
  TeacherOnly: IfTeacher,
  StudentOnly: IfStudent,
  ParentOnly: IfParent,
  SaasPortalOnly: (props: { children: React.ReactNode; fallback?: React.ReactNode }) =>
    IfPortal({ portal: 'saas', ...props }),
  TenantPortalOnly: (props: { children: React.ReactNode; fallback?: React.ReactNode }) =>
    IfPortal({ portal: 'tenant', ...props }),

  // Permission checks
  canView: (resource: string) => ({ resource, action: 'VIEW' as PermissionAction }),
  canCreate: (resource: string) => ({ resource, action: 'CREATE' as PermissionAction }),
  canUpdate: (resource: string) => ({ resource, action: 'UPDATE' as PermissionAction }),
  canDelete: (resource: string) => ({ resource, action: 'DELETE' as PermissionAction }),
  canManage: (resource: string) => ({ resource, action: 'MANAGE' as PermissionAction }),
};

// RBAC Configuration
export const RBACConfig = {
  // Default fallbacks
  DEFAULT_ACCESS_DENIED_MESSAGE: 'You do not have permission to access this resource.',
  DEFAULT_UNAUTHORIZED_REDIRECT: '/unauthorized',

  // Portal routes
  SAAS_LOGIN_ROUTE: '/saas/login',
  TENANT_LOGIN_ROUTE: '/tenant/login',
  SAAS_UNAUTHORIZED_ROUTE: '/saas/unauthorized',
  TENANT_UNAUTHORIZED_ROUTE: '/tenant/unauthorized',

  // Common resources
  RESOURCES: {
    PLATFORM: 'platform',
    TENANTS: 'tenants',
    USERS: 'users',
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    GRADES: 'grades',
    ATTENDANCE: 'attendance',
    LIBRARY: 'library',
    TRANSPORT: 'transport',
    REPORTS: 'reports',
    BILLING: 'billing',
    SECURITY: 'security',
  },

  // Common actions
  ACTIONS: {
    VIEW: 'VIEW' as PermissionAction,
    CREATE: 'CREATE' as PermissionAction,
    UPDATE: 'UPDATE' as PermissionAction,
    DELETE: 'DELETE' as PermissionAction,
    MANAGE: 'MANAGE' as PermissionAction,
    APPROVE: 'APPROVE' as PermissionAction,
    EXPORT: 'EXPORT' as PermissionAction,
    IMPORT: 'IMPORT' as PermissionAction,
  },
};

// Type definitions for external usage
export type {
  // Component props
  PermissionGateProps,
  RoleBasedRouteProps,
  AccessDeniedProps,
  ConditionalRenderProps,
} from './components/PermissionGate';

// Default export for convenience
export default {
  Components: {
    PermissionGate,
    RoleBasedRoute,
    AccessDenied,
    ConditionalRender,
  },
  Services: {
    saasPermissionService,
    tenantPermissionService,
  },
  Hooks: {
    useSaasPermissions,
    useTenantPermissions,
    usePermissions,
  },
  Utils: RBACPatterns,
  Quick,
  Config: RBACConfig,
};
