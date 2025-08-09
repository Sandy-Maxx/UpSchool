import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  PermissionAction,
  PermissionCheckRequest,
  PermissionCheckResponse,
  PortalType,
} from '../types/permissions';
import {
  detectPortalType,
  getUserPermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getAccessibleResources,
  getAllowedActions,
  checkPermission,
  generatePermissionMatrix,
} from '../utils/permissionUtils';

// Main permissions hook
export const usePermissions = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const currentPortal = useMemo(() => detectPortalType(), []);

  // Get user permissions based on current portal and roles
  const userPermissions = useMemo(() => {
    if (!isAuthenticated || !user?.roles) {
      return [];
    }

    return getUserPermissions(user.roles, currentPortal, user.metadata?.staffSubrole);
  }, [isAuthenticated, user?.roles, user?.metadata?.staffSubrole, currentPortal]);

  // Check if user has a specific permission
  const hasUserPermission = useCallback(
    (
      resource: string,
      action: PermissionAction = 'VIEW',
      context?: Record<string, any>
    ): boolean => {
      if (!isAuthenticated || !user) return false;

      return hasPermission(userPermissions, resource, action, {
        ...context,
        userId: user.id,
        userRole: user.roles?.[0],
        tenantId: user.tenantId,
        ...user.metadata,
      });
    },
    [userPermissions, isAuthenticated, user]
  );

  // Check multiple permissions (AND logic)
  const hasAllUserPermissions = useCallback(
    (
      requiredPermissions: Array<{
        resource: string;
        action: PermissionAction;
        context?: Record<string, any>;
      }>
    ): boolean => {
      if (!isAuthenticated || !user) return false;

      const contextWithUser = requiredPermissions.map(perm => ({
        ...perm,
        context: {
          ...perm.context,
          userId: user.id,
          userRole: user.roles?.[0],
          tenantId: user.tenantId,
          ...user.metadata,
        },
      }));

      return hasAllPermissions(userPermissions, contextWithUser);
    },
    [userPermissions, isAuthenticated, user]
  );

  // Check if user has any of the permissions (OR logic)
  const hasAnyUserPermission = useCallback(
    (
      permissionOptions: Array<{
        resource: string;
        action: PermissionAction;
        context?: Record<string, any>;
      }>
    ): boolean => {
      if (!isAuthenticated || !user) return false;

      const contextWithUser = permissionOptions.map(perm => ({
        ...perm,
        context: {
          ...perm.context,
          userId: user.id,
          userRole: user.roles?.[0],
          tenantId: user.tenantId,
          ...user.metadata,
        },
      }));

      return hasAnyPermission(userPermissions, contextWithUser);
    },
    [userPermissions, isAuthenticated, user]
  );

  // Get accessible resources
  const accessibleResources = useMemo(() => {
    return getAccessibleResources(userPermissions, currentPortal);
  }, [userPermissions, currentPortal]);

  // Get allowed actions for a resource
  const getUserAllowedActions = useCallback(
    (resource: string): PermissionAction[] => {
      return getAllowedActions(userPermissions, resource);
    },
    [userPermissions]
  );

  // Permission check for components
  const checkUserPermission = useCallback(
    (request: PermissionCheckRequest): PermissionCheckResponse => {
      if (!isAuthenticated || !user) {
        return { allowed: false, reason: 'User not authenticated' };
      }

      return checkPermission(request, {
        portal: currentPortal,
        userId: user.id,
        tenantId: user.tenantId,
        userRoles: user.roles || [],
        metadata: user.metadata,
      });
    },
    [isAuthenticated, user, currentPortal]
  );

  // Generate permission matrix for debugging
  const permissionMatrix = useMemo(() => {
    if (!isAuthenticated || !user?.roles) return {};

    return generatePermissionMatrix(user.roles, currentPortal);
  }, [isAuthenticated, user?.roles, currentPortal]);

  return {
    // Core permission checking
    hasPermission: hasUserPermission,
    hasAllPermissions: hasAllUserPermissions,
    hasAnyPermission: hasAnyUserPermission,
    checkPermission: checkUserPermission,

    // Resource and action utilities
    accessibleResources,
    getAllowedActions: getUserAllowedActions,

    // User context
    userPermissions,
    currentPortal,
    isAuthenticated,

    // Debugging
    permissionMatrix,
  };
};

// Hook for role-based capabilities
export const useRoleCapabilities = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentPortal = useMemo(() => detectPortalType(), []);

  const capabilities = useMemo(() => {
    if (!user?.roles?.[0]) return null;

    const primaryRole = user.roles[0];

    if (currentPortal === 'saas') {
      // Import SaaS role capabilities
      const { SAAS_ROLE_CAPABILITIES } = require('../types/saasRoles');
      return SAAS_ROLE_CAPABILITIES[primaryRole as keyof typeof SAAS_ROLE_CAPABILITIES];
    } else {
      // Import Tenant role capabilities
      const { TENANT_ROLE_CAPABILITIES } = require('../types/tenantRoles');
      return TENANT_ROLE_CAPABILITIES[primaryRole as keyof typeof TENANT_ROLE_CAPABILITIES];
    }
  }, [user?.roles, currentPortal]);

  return {
    capabilities,
    primaryRole: user?.roles?.[0],
    currentPortal,
    canManageUsers: capabilities?.canManageUsers || false,
    canViewAnalytics: capabilities?.canViewAnalytics || false,
    canExportData: capabilities?.canExportData || false,
    dashboardSections: capabilities?.dashboardSections || [],
    navigationAccess: capabilities?.navigationAccess || 'limited',
  };
};

// Hook for portal-aware navigation
export const usePortalNavigation = () => {
  const { hasPermission, currentPortal } = usePermissions();
  const { capabilities } = useRoleCapabilities();

  const getNavigationItems = useCallback(() => {
    const baseItems = [];

    if (currentPortal === 'saas') {
      // SaaS portal navigation
      if (hasPermission('platform', 'VIEW')) {
        baseItems.push({
          key: 'overview',
          label: 'Platform Overview',
          path: '/saas/dashboard',
          icon: 'Dashboard',
        });
      }

      if (hasPermission('tenants', 'VIEW')) {
        baseItems.push({
          key: 'tenants',
          label: 'Tenant Management',
          path: '/saas/tenants',
          icon: 'Business',
        });
      }

      if (hasPermission('analytics', 'VIEW')) {
        baseItems.push({
          key: 'analytics',
          label: 'Analytics',
          path: '/saas/analytics',
          icon: 'Analytics',
        });
      }

      if (hasPermission('billing', 'VIEW')) {
        baseItems.push({
          key: 'billing',
          label: 'Billing',
          path: '/saas/billing',
          icon: 'Payment',
        });
      }

      if (hasPermission('security', 'VIEW')) {
        baseItems.push({
          key: 'security',
          label: 'Security',
          path: '/saas/security',
          icon: 'Security',
        });
      }
    } else {
      // Tenant portal navigation
      if (hasPermission('school', 'VIEW')) {
        baseItems.push({
          key: 'overview',
          label: 'Dashboard',
          path: '/tenant/dashboard',
          icon: 'Dashboard',
        });
      }

      if (hasPermission('students', 'VIEW')) {
        baseItems.push({
          key: 'students',
          label: 'Students',
          path: '/tenant/students',
          icon: 'People',
        });
      }

      if (hasPermission('grades', 'VIEW')) {
        baseItems.push({
          key: 'academics',
          label: 'Academics',
          path: '/tenant/academics',
          icon: 'School',
        });
      }

      if (hasPermission('library', 'VIEW')) {
        baseItems.push({
          key: 'library',
          label: 'Library',
          path: '/tenant/library',
          icon: 'LocalLibrary',
        });
      }

      if (hasPermission('reports', 'VIEW')) {
        baseItems.push({
          key: 'reports',
          label: 'Reports',
          path: '/tenant/reports',
          icon: 'Assessment',
        });
      }
    }

    return baseItems;
  }, [hasPermission, currentPortal]);

  return {
    navigationItems: getNavigationItems(),
    currentPortal,
    capabilities,
  };
};

// Hook for specific permission patterns
export const useSpecificPermissions = () => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  return {
    // User management permissions
    canViewUsers: hasPermission('users', 'VIEW'),
    canCreateUsers: hasPermission('users', 'CREATE'),
    canEditUsers: hasPermission('users', 'UPDATE'),
    canDeleteUsers: hasPermission('users', 'DELETE'),
    canManageUsers: hasPermission('users', 'MANAGE'),

    // Student permissions
    canViewStudents: hasPermission('students', 'VIEW'),
    canCreateStudents: hasPermission('students', 'CREATE'),
    canEditStudents: hasPermission('students', 'UPDATE'),
    canDeleteStudents: hasPermission('students', 'DELETE'),

    // Grade permissions
    canViewGrades: hasPermission('grades', 'VIEW'),
    canCreateGrades: hasPermission('grades', 'CREATE'),
    canEditGrades: hasPermission('grades', 'UPDATE'),
    canApproveGrades: hasPermission('grades', 'APPROVE'),

    // Administrative permissions
    canViewReports: hasPermission('reports', 'VIEW'),
    canCreateReports: hasPermission('reports', 'CREATE'),
    canExportData: hasAnyPermission([
      { resource: 'students', action: 'EXPORT' },
      { resource: 'grades', action: 'EXPORT' },
      { resource: 'reports', action: 'EXPORT' },
    ]),

    // Security permissions
    canViewAuditLogs: hasPermission('audit_logs', 'VIEW'),
    canExportAuditLogs: hasPermission('audit_logs', 'EXPORT'),
    canViewSecuritySettings: hasPermission('security', 'VIEW'),
  };
};
