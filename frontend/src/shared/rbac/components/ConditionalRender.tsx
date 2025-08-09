import React from 'react';
import { usePermissions, useRoleCapabilities } from '../../hooks/usePermissions';
import { PermissionAction, PortalType } from '../../types/permissions';

/**
 * ConditionalRender - Flexible permission-based rendering component
 *
 * This component provides various strategies for conditional rendering based on:
 * - User permissions
 * - User roles
 * - Portal context
 * - Custom conditions
 */

interface ConditionalRenderProps {
  /** Children to render when condition is met */
  children: React.ReactNode;

  /** Permission-based conditions */
  permission?: {
    resource: string;
    action?: PermissionAction;
    context?: Record<string, any>;
  };

  /** Multiple permissions (AND logic by default) */
  permissions?: Array<{
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  }>;

  /** Permission logic - 'AND' or 'OR' */
  permissionLogic?: 'AND' | 'OR';

  /** Role-based conditions */
  role?: string;

  /** Multiple roles (OR logic by default) */
  roles?: string[];

  /** Role logic - 'AND' or 'OR' */
  roleLogic?: 'AND' | 'OR';

  /** Portal-specific rendering */
  portal?: PortalType;

  /** Custom condition function */
  condition?: () => boolean;

  /** Fallback content when condition is not met */
  fallback?: React.ReactNode;

  /** Invert the condition logic */
  not?: boolean;
}

const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  permission,
  permissions,
  permissionLogic = 'AND',
  role,
  roles,
  roleLogic = 'OR',
  portal,
  condition,
  fallback = null,
  not = false,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, currentPortal, isAuthenticated } =
    usePermissions();
  const { primaryRole } = useRoleCapabilities();

  // Check various conditions
  let shouldRender = true;

  // Authentication check
  if (!isAuthenticated) {
    shouldRender = false;
  }

  // Permission checks
  if (shouldRender && permission) {
    shouldRender = hasPermission(
      permission.resource,
      permission.action || 'VIEW',
      permission.context
    );
  }

  if (shouldRender && permissions && permissions.length > 0) {
    if (permissionLogic === 'OR') {
      shouldRender = hasAnyPermission(permissions);
    } else {
      shouldRender = hasAllPermissions(permissions);
    }
  }

  // Role checks
  if (shouldRender && role) {
    shouldRender = primaryRole === role;
  }

  if (shouldRender && roles && roles.length > 0) {
    if (roleLogic === 'AND') {
      // User must have ALL specified roles (rare case)
      shouldRender = roles.every(r => primaryRole === r);
    } else {
      // User must have ANY of the specified roles (common case)
      shouldRender = roles.includes(primaryRole || '');
    }
  }

  // Portal check
  if (shouldRender && portal) {
    shouldRender = currentPortal === portal;
  }

  // Custom condition
  if (shouldRender && condition) {
    shouldRender = condition();
  }

  // Apply inversion if requested
  if (not) {
    shouldRender = !shouldRender;
  }

  return shouldRender ? <>{children}</> : <>{fallback}</>;
};

export default ConditionalRender;

// Convenience wrappers for common scenarios

// Permission-based rendering
export const IfCan: React.FC<{
  resource: string;
  action?: PermissionAction;
  context?: Record<string, any>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ resource, action = 'VIEW', context, children, fallback }) => (
  <ConditionalRender permission={{ resource, action, context }} fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Role-based rendering
export const IfRole: React.FC<{
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ role, children, fallback }) => (
  <ConditionalRender role={role} fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Multiple roles (OR logic)
export const IfAnyRole: React.FC<{
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ roles, children, fallback }) => (
  <ConditionalRender roles={roles} roleLogic="OR" fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Portal-specific rendering
export const IfPortal: React.FC<{
  portal: PortalType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ portal, children, fallback }) => (
  <ConditionalRender portal={portal} fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Admin-specific rendering (portal-aware)
export const IfAdmin: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  portalType?: PortalType;
}> = ({ children, fallback, portalType }) => {
  const { currentPortal } = usePermissions();
  const portal = portalType || currentPortal;

  const adminRoles = portal === 'saas' ? ['system_superadmin', 'platform_admin'] : ['admin'];

  return (
    <ConditionalRender roles={adminRoles} roleLogic="OR" fallback={fallback}>
      {children}
    </ConditionalRender>
  );
};

// Teacher-specific rendering (tenant portal only)
export const IfTeacher: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ConditionalRender role="teacher" portal="tenant" fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Student-specific rendering (tenant portal only)
export const IfStudent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ConditionalRender role="student" portal="tenant" fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Parent-specific rendering (tenant portal only)
export const IfParent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <ConditionalRender role="parent" portal="tenant" fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Inverted rendering - show when condition is NOT met
export const Unless: React.FC<{
  permission?: {
    resource: string;
    action?: PermissionAction;
    context?: Record<string, any>;
  };
  role?: string;
  roles?: string[];
  portal?: PortalType;
  condition?: () => boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback, ...props }) => (
  <ConditionalRender {...props} not={true} fallback={fallback}>
    {children}
  </ConditionalRender>
);

// Multi-condition rendering with custom logic
export const IfConditions: React.FC<{
  conditions: Array<{
    type: 'permission' | 'role' | 'portal' | 'custom';
    data: any;
  }>;
  logic?: 'AND' | 'OR';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ conditions, logic = 'AND', children, fallback }) => {
  const { hasPermission, currentPortal, isAuthenticated } = usePermissions();
  const { primaryRole } = useRoleCapabilities();

  const checkCondition = (condition: any): boolean => {
    if (!isAuthenticated) return false;

    switch (condition.type) {
      case 'permission':
        return hasPermission(
          condition.data.resource,
          condition.data.action || 'VIEW',
          condition.data.context
        );
      case 'role':
        return primaryRole === condition.data;
      case 'portal':
        return currentPortal === condition.data;
      case 'custom':
        return condition.data();
      default:
        return false;
    }
  };

  const shouldRender =
    logic === 'OR' ? conditions.some(checkCondition) : conditions.every(checkCondition);

  return shouldRender ? <>{children}</> : <>{fallback}</>;
};

// Capability-based rendering
export const IfCapability: React.FC<{
  capability: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ capability, children, fallback }) => {
  const { capabilities } = useRoleCapabilities();

  const hasCapability = capabilities && (capabilities as any)[capability];

  return hasCapability ? <>{children}</> : <>{fallback}</>;
};
