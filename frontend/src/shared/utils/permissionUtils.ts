import {
  PermissionAction,
  PermissionCheckRequest,
  PermissionCheckResponse,
  PermissionContext,
  PortalType,
  SAAS_PERMISSIONS,
  TENANT_PERMISSIONS,
} from '../types/permissions';
import {
  SAAS_ROLES,
  SaasRoleType,
  getInheritedPermissions as getSaasInheritedPermissions,
} from '../types/saasRoles';
import { TENANT_ROLES, TenantRoleType, getStaffPermissions } from '../types/tenantRoles';

// Portal detection utility
export const detectPortalType = (): PortalType => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Check if we're in SaaS portal routes
  if (pathname.startsWith('/saas') || pathname.includes('/superadmin')) {
    return 'saas';
  }

  // Check if we're in tenant portal routes
  if (pathname.startsWith('/tenant') || pathname.startsWith('/school')) {
    return 'tenant';
  }

  // Check subdomain for tenant detection
  const subdomain = hostname.split('.')[0];
  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    return 'tenant';
  }

  // Default to tenant for localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'tenant';
  }

  return 'tenant'; // Default fallback
};

// Get portal-specific permissions
export const getPortalPermissions = (portal: PortalType) => {
  return portal === 'saas' ? SAAS_PERMISSIONS : TENANT_PERMISSIONS;
};

// Get user permissions based on roles and portal
export const getUserPermissions = (
  userRoles: string[],
  portal: PortalType,
  staffSubrole?: string
): string[] => {
  let permissions: string[] = [];

  if (portal === 'saas') {
    // SaaS portal permissions
    userRoles.forEach(roleId => {
      const roleType = roleId as SaasRoleType;
      if (SAAS_ROLES[roleType]) {
        const rolePermissions = getSaasInheritedPermissions(roleType);
        permissions = [...permissions, ...rolePermissions];
      }
    });
  } else {
    // Tenant portal permissions
    userRoles.forEach(roleId => {
      const roleType = roleId as TenantRoleType;
      if (TENANT_ROLES[roleType]) {
        if (roleType === 'staff' && staffSubrole) {
          const staffPermissions = getStaffPermissions(staffSubrole as any);
          permissions = [...permissions, ...staffPermissions];
        } else {
          permissions = [...permissions, ...TENANT_ROLES[roleType].permissionKeys];
        }
      }
    });
  }

  // Remove duplicates
  return [...new Set(permissions)];
};

// Check if user has a specific permission
export const hasPermission = (
  userPermissions: string[],
  resource: string,
  action: PermissionAction = 'VIEW',
  context?: Record<string, any>
): boolean => {
  const permissionString = `${resource.toLowerCase()}.${action.toLowerCase()}`;

  // Direct permission match
  if (userPermissions.includes(permissionString)) {
    return true;
  }

  // Check for MANAGE permission (includes all other actions)
  const managePermission = `${resource.toLowerCase()}.manage`;
  if (userPermissions.includes(managePermission)) {
    return true;
  }

  // Context-based permission checks
  if (context) {
    return checkContextualPermission(userPermissions, resource, action, context);
  }

  return false;
};

// Check contextual permissions (e.g., teacher can only view their own classes)
const checkContextualPermission = (
  userPermissions: string[],
  resource: string,
  action: PermissionAction,
  context: Record<string, any>
): boolean => {
  const { userRole, userId, resourceOwnerId, assignedClasses, childrenIds } = context;

  // Teachers can access student data for their assigned classes
  if (userRole === 'teacher' && resource === 'students' && action === 'VIEW') {
    if (assignedClasses && context.studentClassId) {
      return assignedClasses.includes(context.studentClassId);
    }
  }

  // Parents can only access their children's data
  if (
    userRole === 'parent' &&
    (resource === 'students' || resource === 'grades' || resource === 'attendance')
  ) {
    if (childrenIds && context.studentId) {
      return childrenIds.includes(context.studentId);
    }
  }

  // Users can access their own data
  if (action === 'VIEW' && resourceOwnerId === userId) {
    return true;
  }

  return false;
};

// Check multiple permissions (AND logic)
export const hasAllPermissions = (
  userPermissions: string[],
  requiredPermissions: Array<{
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  }>
): boolean => {
  return requiredPermissions.every(({ resource, action, context }) =>
    hasPermission(userPermissions, resource, action, context)
  );
};

// Check if user has any of the permissions (OR logic)
export const hasAnyPermission = (
  userPermissions: string[],
  permissionOptions: Array<{
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  }>
): boolean => {
  return permissionOptions.some(({ resource, action, context }) =>
    hasPermission(userPermissions, resource, action, context)
  );
};

// Get accessible resources for a user
export const getAccessibleResources = (userPermissions: string[], portal: PortalType): string[] => {
  const resources = new Set<string>();

  userPermissions.forEach(permission => {
    const [resource] = permission.split('.');
    if (resource) {
      resources.add(resource);
    }
  });

  return Array.from(resources);
};

// Get allowed actions for a resource
export const getAllowedActions = (
  userPermissions: string[],
  resource: string
): PermissionAction[] => {
  const actions: PermissionAction[] = [];
  const resourcePermissions = userPermissions.filter(p =>
    p.startsWith(`${resource.toLowerCase()}.`)
  );

  resourcePermissions.forEach(permission => {
    const [, action] = permission.split('.');
    if (action) {
      const normalizedAction = action.toUpperCase() as PermissionAction;
      if (!actions.includes(normalizedAction)) {
        actions.push(normalizedAction);
      }
    }
  });

  return actions;
};

// Permission check for components
export const checkPermission = (
  request: PermissionCheckRequest,
  context: PermissionContext
): PermissionCheckResponse => {
  const userPermissions = getUserPermissions(
    context.userRoles,
    context.portal,
    context.metadata?.staffSubrole
  );

  const allowed = hasPermission(userPermissions, request.resource, request.action, {
    ...request.context,
    ...context.metadata,
    userId: context.userId,
    userRole: context.userRoles[0], // Primary role
  });

  return {
    allowed,
    reason: allowed
      ? undefined
      : `Insufficient permissions for ${request.action} on ${request.resource}`,
  };
};

// Generate permission matrix for debugging
export const generatePermissionMatrix = (
  userRoles: string[],
  portal: PortalType
): Record<string, PermissionAction[]> => {
  const userPermissions = getUserPermissions(userRoles, portal);
  const resources = getAccessibleResources(userPermissions, portal);
  const matrix: Record<string, PermissionAction[]> = {};

  resources.forEach(resource => {
    matrix[resource] = getAllowedActions(userPermissions, resource);
  });

  return matrix;
};

// Validate permission string format
export const validatePermissionString = (permission: string): boolean => {
  const permissionRegex = /^[a-z_]+\.[a-z_]+$/;
  return permissionRegex.test(permission);
};

// Get permission hierarchy level (for role comparison)
export const getPermissionLevel = (permissions: string[]): number => {
  // Simple scoring based on number and type of permissions
  let score = permissions.length;

  // Higher weight for management permissions
  const managePermissions = permissions.filter(p => p.includes('.manage'));
  score += managePermissions.length * 3;

  // Higher weight for create/update/delete permissions
  const writePermissions = permissions.filter(
    p => p.includes('.create') || p.includes('.update') || p.includes('.delete')
  );
  score += writePermissions.length * 2;

  return score;
};

// Format permission for display
export const formatPermissionForDisplay = (permission: string): string => {
  const [resource, action] = permission.split('.');

  const resourceDisplay = resource
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const actionDisplay = action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `${actionDisplay} ${resourceDisplay}`;
};

// Group permissions by resource
export const groupPermissionsByResource = (
  permissions: string[]
): Record<string, PermissionAction[]> => {
  const grouped: Record<string, PermissionAction[]> = {};

  permissions.forEach(permission => {
    const [resource, action] = permission.split('.');
    if (resource && action) {
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      const normalizedAction = action.toUpperCase() as PermissionAction;
      if (!grouped[resource].includes(normalizedAction)) {
        grouped[resource].push(normalizedAction);
      }
    }
  });

  return grouped;
};
