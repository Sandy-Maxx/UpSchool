import React from 'react';
import { Box, Alert, Typography } from '@mui/material';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionAction } from '../../types/permissions';

/**
 * PermissionGate - Portal-aware permission wrapper component
 *
 * This component conditionally renders children based on user permissions.
 * It's the primary building block for implementing RBAC at the component level.
 */

interface PermissionGateProps {
  /** Permission resource (e.g., 'students', 'grades', 'users') */
  resource: string;

  /** Permission action required (defaults to 'VIEW') */
  action?: PermissionAction;

  /** Additional context for conditional permissions */
  context?: Record<string, any>;

  /** Component to render when permission is denied */
  fallback?: React.ReactNode;

  /** Show access denied message when permission fails */
  showAccessDenied?: boolean;

  /** Custom access denied message */
  accessDeniedMessage?: string;

  /** Children to render when permission is granted */
  children: React.ReactNode;

  /** Optional className for styling */
  className?: string;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  resource,
  action = 'VIEW',
  context,
  fallback = null,
  showAccessDenied = false,
  accessDeniedMessage,
  children,
  className,
}) => {
  const { hasPermission, currentPortal } = usePermissions();

  // Check if user has the required permission
  const hasRequiredPermission = hasPermission(resource, action, context);

  // Render children if permission granted
  if (hasRequiredPermission) {
    return <Box className={className}>{children}</Box>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show access denied message if requested
  if (showAccessDenied) {
    const defaultMessage =
      accessDeniedMessage || `Access denied. Required permission: ${action} on ${resource}`;

    return (
      <Alert severity="warning" className={className} sx={{ my: 2 }}>
        <Typography variant="body2">{defaultMessage}</Typography>
      </Alert>
    );
  }

  // Return null by default (hide component)
  return null;
};

export default PermissionGate;

// Convenience wrapper for multiple permissions (AND logic)
interface MultiPermissionGateProps extends Omit<PermissionGateProps, 'resource' | 'action'> {
  /** Array of required permissions - all must be satisfied */
  permissions: Array<{
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  }>;
}

export const MultiPermissionGate: React.FC<MultiPermissionGateProps> = ({
  permissions,
  fallback = null,
  showAccessDenied = false,
  accessDeniedMessage,
  children,
  className,
}) => {
  const { hasAllPermissions } = usePermissions();

  const hasRequiredPermissions = hasAllPermissions(permissions);

  if (hasRequiredPermissions) {
    return <Box className={className}>{children}</Box>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessDenied) {
    const defaultMessage =
      accessDeniedMessage ||
      `Access denied. Required permissions: ${permissions.map(p => `${p.action} on ${p.resource}`).join(', ')}`;

    return (
      <Alert severity="warning" className={className} sx={{ my: 2 }}>
        <Typography variant="body2">{defaultMessage}</Typography>
      </Alert>
    );
  }

  return null;
};

// Convenience wrapper for any of multiple permissions (OR logic)
interface AnyPermissionGateProps extends Omit<PermissionGateProps, 'resource' | 'action'> {
  /** Array of permission options - any one must be satisfied */
  permissionOptions: Array<{
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  }>;
}

export const AnyPermissionGate: React.FC<AnyPermissionGateProps> = ({
  permissionOptions,
  fallback = null,
  showAccessDenied = false,
  accessDeniedMessage,
  children,
  className,
}) => {
  const { hasAnyPermission } = usePermissions();

  const hasAnyRequiredPermission = hasAnyPermission(permissionOptions);

  if (hasAnyRequiredPermission) {
    return <Box className={className}>{children}</Box>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessDenied) {
    const defaultMessage =
      accessDeniedMessage ||
      `Access denied. Required permissions: Any of ${permissionOptions.map(p => `${p.action} on ${p.resource}`).join(', ')}`;

    return (
      <Alert severity="warning" className={className} sx={{ my: 2 }}>
        <Typography variant="body2">{defaultMessage}</Typography>
      </Alert>
    );
  }

  return null;
};

// Quick permission check components for common scenarios
export const CanView: React.FC<Omit<PermissionGateProps, 'action'>> = props => (
  <PermissionGate {...props} action="VIEW" />
);

export const CanCreate: React.FC<Omit<PermissionGateProps, 'action'>> = props => (
  <PermissionGate {...props} action="CREATE" />
);

export const CanUpdate: React.FC<Omit<PermissionGateProps, 'action'>> = props => (
  <PermissionGate {...props} action="UPDATE" />
);

export const CanDelete: React.FC<Omit<PermissionGateProps, 'action'>> = props => (
  <PermissionGate {...props} action="DELETE" />
);

export const CanManage: React.FC<Omit<PermissionGateProps, 'action'>> = props => (
  <PermissionGate {...props} action="MANAGE" />
);
