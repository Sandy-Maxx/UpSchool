import {
  Permission,
  PermissionCheckRequest,
  PermissionCheckResponse,
  PermissionContext,
  SAAS_PERMISSIONS,
} from '../../types/permissions';
import { SAAS_ROLES, SaasRoleType, getInheritedPermissions } from '../../types/saasRoles';
import { getUserPermissions, hasPermission, checkPermission } from '../../utils/permissionUtils';

/**
 * SaasPermissionService - Platform-level permission management
 *
 * This service handles all SaaS portal permission operations including:
 * - Permission validation for platform operations
 * - Tenant management permissions
 * - System-wide analytics access
 * - Billing and subscription controls
 */

export class SaasPermissionService {
  private static instance: SaasPermissionService;

  private constructor() {}

  public static getInstance(): SaasPermissionService {
    if (!SaasPermissionService.instance) {
      SaasPermissionService.instance = new SaasPermissionService();
    }
    return SaasPermissionService.instance;
  }

  /**
   * Check if user can perform platform operations
   */
  canManagePlatform(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'platform', 'MANAGE');
  }

  /**
   * Check tenant management permissions
   */
  canManageTenants(
    userRoles: string[],
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SUSPEND' | 'ACTIVATE' = 'VIEW'
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'tenants', action);
  }

  /**
   * Check if user can access specific tenant data
   */
  canAccessTenantData(
    userRoles: string[],
    tenantId: string,
    action: 'VIEW' | 'UPDATE' | 'DELETE' = 'VIEW'
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');

    // System superadmin can access any tenant
    if (userPermissions.includes(SAAS_PERMISSIONS.TENANTS_DELETE)) {
      return true;
    }

    // Check specific permission
    return hasPermission(userPermissions, 'tenants', action, {
      tenantId,
      userRoles,
    });
  }

  /**
   * Check billing and subscription permissions
   */
  canManageBilling(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'billing', 'MANAGE');
  }

  canViewBillingData(userRoles: string[], tenantId?: string): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');

    if (hasPermission(userPermissions, 'billing', 'VIEW')) {
      return true;
    }

    // Check tenant-specific billing access if tenantId provided
    if (tenantId) {
      return hasPermission(userPermissions, 'billing', 'VIEW', {
        tenantId,
        userRoles,
      });
    }

    return false;
  }

  /**
   * Check analytics and reporting permissions
   */
  canViewPlatformAnalytics(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'analytics', 'VIEW');
  }

  canExportPlatformData(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'analytics', 'EXPORT');
  }

  /**
   * Check security and audit permissions
   */
  canManagePlatformSecurity(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'security', 'MANAGE');
  }

  canViewAuditLogs(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'audit_logs', 'VIEW');
  }

  canExportAuditLogs(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'audit_logs', 'EXPORT');
  }

  /**
   * Check system configuration permissions
   */
  canViewPlatformConfig(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'config', 'VIEW');
  }

  canUpdatePlatformConfig(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    return hasPermission(userPermissions, 'config', 'UPDATE');
  }

  /**
   * Get dashboard sections available to user
   */
  getAvailableDashboardSections(userRoles: string[]): string[] {
    const sections: string[] = [];
    const userPermissions = getUserPermissions(userRoles, 'saas');

    if (hasPermission(userPermissions, 'platform', 'VIEW')) {
      sections.push('overview');
    }

    if (hasPermission(userPermissions, 'tenants', 'VIEW')) {
      sections.push('tenants');
    }

    if (hasPermission(userPermissions, 'analytics', 'VIEW')) {
      sections.push('analytics');
    }

    if (hasPermission(userPermissions, 'billing', 'VIEW')) {
      sections.push('billing');
    }

    if (hasPermission(userPermissions, 'security', 'VIEW')) {
      sections.push('security');
    }

    if (hasPermission(userPermissions, 'config', 'VIEW')) {
      sections.push('config');
    }

    return sections;
  }

  /**
   * Check comprehensive permission with context
   */
  checkPermission(
    request: PermissionCheckRequest,
    context: PermissionContext
  ): PermissionCheckResponse {
    // Ensure we're in SaaS portal context
    const saasContext = {
      ...context,
      portal: 'saas' as const,
    };

    return checkPermission(request, saasContext);
  }

  /**
   * Get role-based capabilities
   */
  getRoleCapabilities(roleType: SaasRoleType) {
    const role = SAAS_ROLES[roleType];
    if (!role) {
      throw new Error(`Invalid SaaS role type: ${roleType}`);
    }

    const permissions = getInheritedPermissions(roleType);

    return {
      role: role.name,
      description: role.description,
      hierarchy: role.hierarchy,
      permissions,
      canManagePlatform: permissions.includes(SAAS_PERMISSIONS.PLATFORM_MANAGE),
      canManageTenants: permissions.includes(SAAS_PERMISSIONS.TENANTS_CREATE),
      canManageBilling: permissions.includes(SAAS_PERMISSIONS.BILLING_MANAGE),
      canManageSecurity: permissions.includes(SAAS_PERMISSIONS.SECURITY_MANAGE),
      canViewAnalytics: permissions.includes(SAAS_PERMISSIONS.ANALYTICS_VIEW),
      canExportData: permissions.includes(SAAS_PERMISSIONS.ANALYTICS_EXPORT),
    };
  }

  /**
   * Validate role assignment (hierarchy check)
   */
  canAssignRole(assignerRoles: string[], targetRole: SaasRoleType): boolean {
    const assignerPermissions = getUserPermissions(assignerRoles, 'saas');

    // Only system superadmin can assign roles
    if (!hasPermission(assignerPermissions, 'platform', 'MANAGE')) {
      return false;
    }

    // System superadmin can assign any role
    if (assignerRoles.includes('system_superadmin')) {
      return true;
    }

    // Platform admin cannot assign system superadmin role
    if (targetRole === 'system_superadmin' && assignerRoles.includes('platform_admin')) {
      return false;
    }

    return true;
  }

  /**
   * Get filtered tenant list based on permissions
   */
  getAccessibleTenants(userRoles: string[], allTenants: any[]): any[] {
    const userPermissions = getUserPermissions(userRoles, 'saas');

    // System superadmin can see all tenants
    if (hasPermission(userPermissions, 'platform', 'MANAGE')) {
      return allTenants;
    }

    // Filter based on specific permissions or context
    return allTenants.filter(tenant => {
      return hasPermission(userPermissions, 'tenants', 'VIEW', {
        tenantId: tenant.id,
        userRoles,
      });
    });
  }

  /**
   * Check if user can perform bulk operations
   */
  canPerformBulkOperations(userRoles: string[], resource: string): boolean {
    const userPermissions = getUserPermissions(userRoles, 'saas');

    // Bulk operations require manage permission
    return hasPermission(userPermissions, resource, 'MANAGE');
  }

  /**
   * Get permission summary for debugging
   */
  getPermissionSummary(userRoles: string[]) {
    const userPermissions = getUserPermissions(userRoles, 'saas');
    const capabilities = userRoles.map(role => this.getRoleCapabilities(role as SaasRoleType));

    return {
      roles: userRoles,
      permissions: userPermissions,
      capabilities,
      dashboardSections: this.getAvailableDashboardSections(userRoles),
      summary: {
        totalPermissions: userPermissions.length,
        canManagePlatform: this.canManagePlatform(userRoles),
        canManageTenants: this.canManageTenants(userRoles, 'CREATE'),
        canManageBilling: this.canManageBilling(userRoles),
        canViewAnalytics: this.canViewPlatformAnalytics(userRoles),
        canExportData: this.canExportPlatformData(userRoles),
      },
    };
  }
}

// Export singleton instance
export const saasPermissionService = SaasPermissionService.getInstance();
