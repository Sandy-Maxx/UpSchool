import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionAction } from '../../types/permissions';
import AccessDenied from './AccessDenied';

/**
 * RoleBasedRoute - Protected route wrapper with RBAC integration
 *
 * This component protects entire routes based on user permissions and roles.
 * It can redirect unauthorized users or show access denied pages.
 */

interface RoleBasedRouteProps {
  /** Component to render when access is granted */
  component: React.ComponentType;

  /** Required permissions for route access */
  permissions?: Array<{
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  }>;

  /** Simple permission check - resource name */
  resource?: string;

  /** Simple permission check - action (defaults to VIEW) */
  action?: PermissionAction;

  /** Redirect path for unauthorized access (defaults to access denied page) */
  redirectTo?: string;

  /** Show access denied page instead of redirecting */
  showAccessDenied?: boolean;

  /** Custom access denied component */
  accessDeniedComponent?: React.ComponentType;

  /** Additional props to pass to the component */
  componentProps?: Record<string, any>;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  component: Component,
  permissions,
  resource,
  action = 'VIEW',
  redirectTo,
  showAccessDenied = true,
  accessDeniedComponent: AccessDeniedComponent = AccessDenied,
  componentProps = {},
}) => {
  const { hasPermission, hasAllPermissions, isAuthenticated, currentPortal } = usePermissions();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    const loginPath = currentPortal === 'saas' ? '/saas/login' : '/tenant/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  let hasRequiredPermissions = false;

  // Check permissions based on provided props
  if (permissions && permissions.length > 0) {
    // Multiple permissions check (AND logic)
    hasRequiredPermissions = hasAllPermissions(permissions);
  } else if (resource) {
    // Single permission check
    hasRequiredPermissions = hasPermission(resource, action);
  } else {
    // No specific permissions required, just authentication
    hasRequiredPermissions = true;
  }

  // Grant access if permissions are satisfied
  if (hasRequiredPermissions) {
    return <Component {...componentProps} />;
  }

  // Handle unauthorized access
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (showAccessDenied) {
    return (
      <AccessDeniedComponent
        requiredPermissions={permissions}
        requiredResource={resource}
        requiredAction={action}
      />
    );
  }

  // Default: redirect to appropriate unauthorized page
  const unauthorizedPath = currentPortal === 'saas' ? '/saas/unauthorized' : '/tenant/unauthorized';

  return <Navigate to={unauthorizedPath} replace />;
};

export default RoleBasedRoute;

// Convenience wrapper for routes that require specific resource access
interface ResourceRouteProps extends Omit<RoleBasedRouteProps, 'resource' | 'action'> {
  resource: string;
  action?: PermissionAction;
}

export const ResourceRoute: React.FC<ResourceRouteProps> = props => <RoleBasedRoute {...props} />;

// Convenience wrapper for admin-only routes
interface AdminRouteProps extends Omit<RoleBasedRouteProps, 'permissions' | 'resource' | 'action'> {
  /** Portal-specific admin permissions */
  portalType?: 'saas' | 'tenant';
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ portalType, ...props }) => {
  const { currentPortal } = usePermissions();
  const portal = portalType || currentPortal;

  // Define admin permissions based on portal
  const adminPermissions =
    portal === 'saas'
      ? [{ resource: 'platform', action: 'VIEW' as PermissionAction }]
      : [{ resource: 'school', action: 'MANAGE' as PermissionAction }];

  return <RoleBasedRoute {...props} permissions={adminPermissions} />;
};

// Convenience wrapper for teacher-only routes (tenant portal)
export const TeacherRoute: React.FC<
  Omit<RoleBasedRouteProps, 'permissions' | 'resource' | 'action'>
> = props => (
  <RoleBasedRoute
    {...props}
    permissions={[
      { resource: 'grades', action: 'VIEW' },
      { resource: 'attendance', action: 'VIEW' },
    ]}
  />
);

// Convenience wrapper for student-accessible routes (tenant portal)
export const StudentRoute: React.FC<
  Omit<RoleBasedRouteProps, 'permissions' | 'resource' | 'action'>
> = props => <RoleBasedRoute {...props} resource="academics" action="VIEW" />;

// Convenience wrapper for parent-accessible routes (tenant portal)
export const ParentRoute: React.FC<
  Omit<RoleBasedRouteProps, 'permissions' | 'resource' | 'action'>
> = props => (
  <RoleBasedRoute
    {...props}
    permissions={[
      { resource: 'students', action: 'VIEW' },
      { resource: 'grades', action: 'VIEW' },
    ]}
  />
);

// HOC version for class components or more complex routing scenarios
export const withRoleBasedAccess = <P extends object>(
  Component: React.ComponentType<P>,
  permissionConfig: {
    permissions?: Array<{
      resource: string;
      action: PermissionAction;
      context?: Record<string, any>;
    }>;
    resource?: string;
    action?: PermissionAction;
    redirectTo?: string;
    showAccessDenied?: boolean;
  }
) => {
  return (props: P) => (
    <RoleBasedRoute component={() => <Component {...props} />} {...permissionConfig} />
  );
};
