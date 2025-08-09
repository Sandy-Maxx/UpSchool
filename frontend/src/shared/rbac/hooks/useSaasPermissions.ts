import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { usePermissions } from '../../hooks/usePermissions';
import { saasPermissionService } from '../services/saasPermissionService';
import { SaasRoleType } from '../../types/saasRoles';
import { PermissionAction } from '../../types/permissions';

/**
 * useSaasPermissions - SaaS portal-specific permission hooks
 *
 * This hook provides convenient methods for checking SaaS platform permissions
 * including tenant management, billing, platform administration, etc.
 */

export const useSaasPermissions = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentPortal } = usePermissions();

  const userRoles = useMemo(() => {
    return isAuthenticated && user?.roles ? user.roles : [];
  }, [isAuthenticated, user?.roles]);

  // Ensure we're in the SaaS portal
  const isValidPortal = currentPortal === 'saas';

  // Platform management permissions
  const canManagePlatform = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canManagePlatform(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Tenant management permissions
  const canManageTenants = useCallback(
    (action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SUSPEND' | 'ACTIVATE' | 'VIEW' = 'VIEW') => {
      if (!isValidPortal || !isAuthenticated) return false;
      return saasPermissionService.canManageTenants(userRoles, action);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  const canAccessTenantData = useCallback(
    (tenantId: string, action: 'VIEW' | 'UPDATE' | 'DELETE' = 'VIEW') => {
      if (!isValidPortal || !isAuthenticated) return false;
      return saasPermissionService.canAccessTenantData(userRoles, tenantId, action);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Billing permissions
  const canManageBilling = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canManageBilling(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canViewBillingData = useCallback(
    (tenantId?: string) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return saasPermissionService.canViewBillingData(userRoles, tenantId);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Analytics permissions
  const canViewPlatformAnalytics = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canViewPlatformAnalytics(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canExportPlatformData = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canExportPlatformData(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Security permissions
  const canManagePlatformSecurity = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canManagePlatformSecurity(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canViewAuditLogs = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canViewAuditLogs(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canExportAuditLogs = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canExportAuditLogs(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Configuration permissions
  const canViewPlatformConfig = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canViewPlatformConfig(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canUpdatePlatformConfig = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return saasPermissionService.canUpdatePlatformConfig(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Role management
  const canAssignRole = useCallback(
    (targetRole: SaasRoleType) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return saasPermissionService.canAssignRole(userRoles, targetRole);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Bulk operations
  const canPerformBulkOperations = useCallback(
    (resource: string) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return saasPermissionService.canPerformBulkOperations(userRoles, resource);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Dashboard and navigation
  const availableDashboardSections = useMemo(() => {
    if (!isValidPortal || !isAuthenticated) return [];
    return saasPermissionService.getAvailableDashboardSections(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Data access helpers
  const getAccessibleTenants = useCallback(
    (allTenants: any[]) => {
      if (!isValidPortal || !isAuthenticated) return [];
      return saasPermissionService.getAccessibleTenants(userRoles, allTenants);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Role capabilities
  const getRoleCapabilities = useCallback(
    (roleType: SaasRoleType) => {
      if (!isValidPortal) return null;
      return saasPermissionService.getRoleCapabilities(roleType);
    },
    [isValidPortal]
  );

  // Permission summary for debugging
  const getPermissionSummary = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return null;
    return saasPermissionService.getPermissionSummary(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Quick permission checks for common scenarios
  const isSuperAdmin = useMemo(() => {
    return userRoles.includes('system_superadmin');
  }, [userRoles]);

  const isPlatformAdmin = useMemo(() => {
    return userRoles.includes('platform_admin');
  }, [userRoles]);

  const isBillingAdmin = useMemo(() => {
    return userRoles.includes('billing_admin');
  }, [userRoles]);

  const isSupportAdmin = useMemo(() => {
    return userRoles.includes('support_admin');
  }, [userRoles]);

  const hasReadOnlyAccess = useMemo(() => {
    return userRoles.includes('readonly_admin') && userRoles.length === 1;
  }, [userRoles]);

  return {
    // Core checks
    isValidPortal,
    isAuthenticated,
    userRoles,

    // Platform permissions
    canManagePlatform,

    // Tenant permissions
    canManageTenants,
    canAccessTenantData,

    // Billing permissions
    canManageBilling,
    canViewBillingData,

    // Analytics permissions
    canViewPlatformAnalytics,
    canExportPlatformData,

    // Security permissions
    canManagePlatformSecurity,
    canViewAuditLogs,
    canExportAuditLogs,

    // Configuration permissions
    canViewPlatformConfig,
    canUpdatePlatformConfig,

    // Role management
    canAssignRole,

    // Bulk operations
    canPerformBulkOperations,

    // Navigation and UI
    availableDashboardSections,

    // Data access
    getAccessibleTenants,

    // Role utilities
    getRoleCapabilities,
    getPermissionSummary,

    // Role checks
    isSuperAdmin,
    isPlatformAdmin,
    isBillingAdmin,
    isSupportAdmin,
    hasReadOnlyAccess,

    // Admin checks
    isAnyAdmin: isSuperAdmin || isPlatformAdmin,
    hasFullAccess: isSuperAdmin,
    hasLimitedAccess: hasReadOnlyAccess || isSupportAdmin,
  };
};

// Convenience hook for specific role checks
export const useSaasRoleCheck = () => {
  const { userRoles, isValidPortal, isAuthenticated } = useSaasPermissions();

  const hasRole = useCallback(
    (role: SaasRoleType) => {
      return isValidPortal && isAuthenticated && userRoles.includes(role);
    },
    [userRoles, isValidPortal, isAuthenticated]
  );

  const hasAnyRole = useCallback(
    (roles: SaasRoleType[]) => {
      return isValidPortal && isAuthenticated && roles.some(role => userRoles.includes(role));
    },
    [userRoles, isValidPortal, isAuthenticated]
  );

  const hasAllRoles = useCallback(
    (roles: SaasRoleType[]) => {
      return isValidPortal && isAuthenticated && roles.every(role => userRoles.includes(role));
    },
    [userRoles, isValidPortal, isAuthenticated]
  );

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    userRoles,
    isValidPortal,
    isAuthenticated,
  };
};

// Hook for SaaS navigation permissions
export const useSaasNavigation = () => {
  const {
    availableDashboardSections,
    canManagePlatform,
    canManageTenants,
    canViewBillingData,
    canViewPlatformAnalytics,
    canViewAuditLogs,
    canViewPlatformConfig,
    isValidPortal,
    isAuthenticated,
  } = useSaasPermissions();

  const navigationItems = useMemo(() => {
    if (!isValidPortal || !isAuthenticated) return [];

    const items = [];

    if (canManagePlatform() || availableDashboardSections.includes('overview')) {
      items.push({
        key: 'overview',
        label: 'Platform Overview',
        path: '/saas/dashboard',
        icon: 'Dashboard',
      });
    }

    if (canManageTenants('VIEW')) {
      items.push({
        key: 'tenants',
        label: 'Tenant Management',
        path: '/saas/tenants',
        icon: 'Business',
      });
    }

    if (canViewPlatformAnalytics()) {
      items.push({
        key: 'analytics',
        label: 'Analytics',
        path: '/saas/analytics',
        icon: 'Analytics',
      });
    }

    if (canViewBillingData()) {
      items.push({
        key: 'billing',
        label: 'Billing & Subscriptions',
        path: '/saas/billing',
        icon: 'Payment',
      });
    }

    if (canViewAuditLogs()) {
      items.push({
        key: 'security',
        label: 'Security & Audit',
        path: '/saas/security',
        icon: 'Security',
      });
    }

    if (canViewPlatformConfig()) {
      items.push({
        key: 'settings',
        label: 'Platform Settings',
        path: '/saas/settings',
        icon: 'Settings',
      });
    }

    return items;
  }, [
    isValidPortal,
    isAuthenticated,
    availableDashboardSections,
    canManagePlatform,
    canManageTenants,
    canViewBillingData,
    canViewPlatformAnalytics,
    canViewAuditLogs,
    canViewPlatformConfig,
  ]);

  return {
    navigationItems,
    availableSections: availableDashboardSections,
    isValidPortal,
    isAuthenticated,
  };
};

// Hook for SaaS data access patterns
export const useSaasDataAccess = () => {
  const {
    canAccessTenantData,
    canViewBillingData,
    getAccessibleTenants,
    canPerformBulkOperations,
    isValidPortal,
    isAuthenticated,
  } = useSaasPermissions();

  const canAccessTenant = useCallback(
    (tenantId: string, action: 'VIEW' | 'UPDATE' | 'DELETE' = 'VIEW') => {
      return canAccessTenantData(tenantId, action);
    },
    [canAccessTenantData]
  );

  const canAccessTenantBilling = useCallback(
    (tenantId: string) => {
      return canViewBillingData(tenantId);
    },
    [canViewBillingData]
  );

  const canBulkManageTenants = useCallback(() => {
    return canPerformBulkOperations('tenants');
  }, [canPerformBulkOperations]);

  const filterAccessibleTenants = useCallback(
    (tenants: any[]) => {
      return getAccessibleTenants(tenants);
    },
    [getAccessibleTenants]
  );

  return {
    canAccessTenant,
    canAccessTenantBilling,
    canBulkManageTenants,
    filterAccessibleTenants,
    isValidPortal,
    isAuthenticated,
  };
};
