import { Role, SAAS_PERMISSIONS } from './permissions';

// SaaS Portal Role Types
export type SaasRoleType =
  | 'system_superadmin'
  | 'platform_admin'
  | 'support_admin'
  | 'billing_admin'
  | 'readonly_admin';

// SaaS Portal Role Configurations
export const SAAS_ROLES: Record<
  SaasRoleType,
  Omit<Role, 'id' | 'permissions'> & { permissionKeys: string[] }
> = {
  // System Superadmin - Complete platform control
  system_superadmin: {
    name: 'System Superadmin',
    description: 'Complete administrative control over the entire platform',
    portal: 'saas',
    isActive: true,
    hierarchy: 1, // Highest level
    permissionKeys: [
      // Platform Management
      SAAS_PERMISSIONS.PLATFORM_VIEW,
      SAAS_PERMISSIONS.PLATFORM_MANAGE,

      // Tenant Management - Full Control
      SAAS_PERMISSIONS.TENANTS_VIEW,
      SAAS_PERMISSIONS.TENANTS_CREATE,
      SAAS_PERMISSIONS.TENANTS_UPDATE,
      SAAS_PERMISSIONS.TENANTS_DELETE,
      SAAS_PERMISSIONS.TENANTS_SUSPEND,
      SAAS_PERMISSIONS.TENANTS_ACTIVATE,

      // Analytics - Full Access
      SAAS_PERMISSIONS.ANALYTICS_VIEW,
      SAAS_PERMISSIONS.ANALYTICS_EXPORT,

      // Billing - Full Control
      SAAS_PERMISSIONS.BILLING_VIEW,
      SAAS_PERMISSIONS.BILLING_MANAGE,

      // Security - Full Control
      SAAS_PERMISSIONS.SECURITY_VIEW,
      SAAS_PERMISSIONS.SECURITY_MANAGE,
      SAAS_PERMISSIONS.AUDIT_LOGS_VIEW,
      SAAS_PERMISSIONS.AUDIT_LOGS_EXPORT,

      // Configuration - Full Control
      SAAS_PERMISSIONS.CONFIG_VIEW,
      SAAS_PERMISSIONS.CONFIG_UPDATE,
    ],
  },

  // Platform Admin - Platform operations without system config
  platform_admin: {
    name: 'Platform Administrator',
    description: 'Administrative control over platform operations and tenant management',
    portal: 'saas',
    isActive: true,
    hierarchy: 2,
    inheritsFrom: ['readonly_admin'],
    permissionKeys: [
      // Platform Management
      SAAS_PERMISSIONS.PLATFORM_VIEW,

      // Tenant Management - Management without delete
      SAAS_PERMISSIONS.TENANTS_VIEW,
      SAAS_PERMISSIONS.TENANTS_CREATE,
      SAAS_PERMISSIONS.TENANTS_UPDATE,
      SAAS_PERMISSIONS.TENANTS_SUSPEND,
      SAAS_PERMISSIONS.TENANTS_ACTIVATE,

      // Analytics
      SAAS_PERMISSIONS.ANALYTICS_VIEW,
      SAAS_PERMISSIONS.ANALYTICS_EXPORT,

      // Security - View and basic management
      SAAS_PERMISSIONS.SECURITY_VIEW,
      SAAS_PERMISSIONS.AUDIT_LOGS_VIEW,
      SAAS_PERMISSIONS.AUDIT_LOGS_EXPORT,

      // Configuration - View only
      SAAS_PERMISSIONS.CONFIG_VIEW,
    ],
  },

  // Support Admin - Support and monitoring focused
  support_admin: {
    name: 'Support Administrator',
    description: 'Support operations and monitoring with limited management capabilities',
    portal: 'saas',
    isActive: true,
    hierarchy: 3,
    inheritsFrom: ['readonly_admin'],
    permissionKeys: [
      // Platform - View only
      SAAS_PERMISSIONS.PLATFORM_VIEW,

      // Tenant Management - View and basic updates
      SAAS_PERMISSIONS.TENANTS_VIEW,
      SAAS_PERMISSIONS.TENANTS_UPDATE,

      // Analytics - View only
      SAAS_PERMISSIONS.ANALYTICS_VIEW,

      // Security - Monitoring focused
      SAAS_PERMISSIONS.SECURITY_VIEW,
      SAAS_PERMISSIONS.AUDIT_LOGS_VIEW,
      SAAS_PERMISSIONS.AUDIT_LOGS_EXPORT,
    ],
  },

  // Billing Admin - Financial operations focused
  billing_admin: {
    name: 'Billing Administrator',
    description: 'Financial operations and billing management',
    portal: 'saas',
    isActive: true,
    hierarchy: 3,
    inheritsFrom: ['readonly_admin'],
    permissionKeys: [
      // Platform - View only
      SAAS_PERMISSIONS.PLATFORM_VIEW,

      // Tenant Management - View for billing context
      SAAS_PERMISSIONS.TENANTS_VIEW,

      // Billing - Full Control
      SAAS_PERMISSIONS.BILLING_VIEW,
      SAAS_PERMISSIONS.BILLING_MANAGE,

      // Analytics - Billing related
      SAAS_PERMISSIONS.ANALYTICS_VIEW,
      SAAS_PERMISSIONS.ANALYTICS_EXPORT,
    ],
  },

  // Readonly Admin - Monitoring and reporting only
  readonly_admin: {
    name: 'Readonly Administrator',
    description: 'Read-only access for monitoring and reporting purposes',
    portal: 'saas',
    isActive: true,
    hierarchy: 4, // Lowest level
    permissionKeys: [
      // Platform - View only
      SAAS_PERMISSIONS.PLATFORM_VIEW,

      // Tenant Management - View only
      SAAS_PERMISSIONS.TENANTS_VIEW,

      // Analytics - View only
      SAAS_PERMISSIONS.ANALYTICS_VIEW,

      // Billing - View only
      SAAS_PERMISSIONS.BILLING_VIEW,

      // Security - View only
      SAAS_PERMISSIONS.SECURITY_VIEW,
      SAAS_PERMISSIONS.AUDIT_LOGS_VIEW,

      // Configuration - View only
      SAAS_PERMISSIONS.CONFIG_VIEW,
    ],
  },
};

// SaaS Role Hierarchy - Higher numbers = more permissions
export const SAAS_ROLE_HIERARCHY: Record<SaasRoleType, number> = {
  system_superadmin: 1,
  platform_admin: 2,
  support_admin: 3,
  billing_admin: 3,
  readonly_admin: 4,
};

// Role capabilities for UI rendering
export const SAAS_ROLE_CAPABILITIES = {
  system_superadmin: {
    canManagePlatform: true,
    canManageTenants: true,
    canManageBilling: true,
    canManageSecurity: true,
    canManageConfig: true,
    canViewAnalytics: true,
    canExportData: true,
    dashboardSections: ['overview', 'tenants', 'analytics', 'billing', 'security', 'config'],
  },
  platform_admin: {
    canManagePlatform: false,
    canManageTenants: true,
    canManageBilling: false,
    canManageSecurity: false,
    canManageConfig: false,
    canViewAnalytics: true,
    canExportData: true,
    dashboardSections: ['overview', 'tenants', 'analytics', 'security'],
  },
  support_admin: {
    canManagePlatform: false,
    canManageTenants: false,
    canManageBilling: false,
    canManageSecurity: false,
    canManageConfig: false,
    canViewAnalytics: true,
    canExportData: true,
    dashboardSections: ['overview', 'tenants', 'security'],
  },
  billing_admin: {
    canManagePlatform: false,
    canManageTenants: false,
    canManageBilling: true,
    canManageSecurity: false,
    canManageConfig: false,
    canViewAnalytics: true,
    canExportData: true,
    dashboardSections: ['overview', 'billing', 'analytics'],
  },
  readonly_admin: {
    canManagePlatform: false,
    canManageTenants: false,
    canManageBilling: false,
    canManageSecurity: false,
    canManageConfig: false,
    canViewAnalytics: true,
    canExportData: false,
    dashboardSections: ['overview', 'analytics'],
  },
} as const;

// Helper function to check if a role has higher privileges than another
export const hasHigherPrivileges = (roleA: SaasRoleType, roleB: SaasRoleType): boolean => {
  return SAAS_ROLE_HIERARCHY[roleA] < SAAS_ROLE_HIERARCHY[roleB];
};

// Helper function to get inherited permissions
export const getInheritedPermissions = (roleType: SaasRoleType): string[] => {
  const role = SAAS_ROLES[roleType];
  let permissions = [...role.permissionKeys];

  if (role.inheritsFrom) {
    role.inheritsFrom.forEach(parentRole => {
      const parentPermissions = SAAS_ROLES[parentRole as SaasRoleType]?.permissionKeys || [];
      permissions = [...permissions, ...parentPermissions];
    });
  }

  // Remove duplicates
  return [...new Set(permissions)];
};

// Default role assignment for new SaaS users
export const DEFAULT_SAAS_ROLE: SaasRoleType = 'readonly_admin';

// Role color coding for UI
export const SAAS_ROLE_COLORS = {
  system_superadmin: '#d32f2f', // Red - Highest privilege
  platform_admin: '#f57c00', // Orange - High privilege
  support_admin: '#1976d2', // Blue - Support role
  billing_admin: '#388e3c', // Green - Financial role
  readonly_admin: '#7b1fa2', // Purple - Read-only
} as const;
