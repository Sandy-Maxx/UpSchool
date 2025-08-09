import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { Box, Typography, Alert, Button } from '@mui/material';
import { LoadingStates } from './LoadingStates';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requiredPortal?: 'saas' | 'tenant';
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Advanced ProtectedRoute component with comprehensive access control
 * Handles authentication, role-based access, and portal-specific routing
 */
export function ProtectedRoute({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requiredPortal,
  redirectTo = '/auth/login',
  fallback,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { 
    isAuthenticated, 
    user, 
    permissions, 
    loading,
    tokens 
  } = useAppSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (loading || (isAuthenticated && !user)) {
    return <LoadingStates data-testid="loading-spinner" text="Verifying authentication..." />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !tokens?.access) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && user) {
    const userRole = user.user_type || user.role;
    const hasRequiredRole = requiredRoles.includes(userRole) || 
                           (user.is_superuser && requiredRoles.includes('admin'));
    
    if (!hasRequiredRole) {
      return (
        <AccessDenied 
          reason={`This page requires one of the following roles: ${requiredRoles.join(', ')}`}
          userRole={userRole}
          fallback={fallback}
        />
      );
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      permissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return (
        <AccessDenied 
          reason="You don't have the required permissions to access this page."
          requiredPermissions={requiredPermissions}
          userPermissions={permissions}
          fallback={fallback}
        />
      );
    }
  }

  // Check portal-specific access
  if (requiredPortal && user) {
    const userPortal = determineUserPortal(user);
    
    if (userPortal !== requiredPortal) {
      return (
        <AccessDenied 
          reason={`This page is only available in the ${requiredPortal} portal.`}
          userPortal={userPortal}
          requiredPortal={requiredPortal}
          fallback={fallback}
        />
      );
    }
  }

  // All checks passed - render children
  return <>{children}</>;
}

/**
 * Access Denied component
 */
interface AccessDeniedProps {
  reason: string;
  userRole?: string;
  requiredPermissions?: string[];
  userPermissions?: string[];
  userPortal?: string;
  requiredPortal?: string;
  fallback?: React.ReactNode;
}

function AccessDenied({
  reason,
  userRole,
  requiredPermissions,
  userPermissions,
  userPortal,
  requiredPortal,
  fallback,
}: AccessDeniedProps) {
  // Use custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      textAlign="center"
      p={4}
    >
      <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" paragraph>
          {reason}
        </Typography>
        
        {userRole && (
          <Typography variant="body2" color="text.secondary">
            Your current role: {userRole}
          </Typography>
        )}
        
        {requiredPermissions && userPermissions && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Required permissions: {requiredPermissions.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your permissions: {userPermissions.join(', ') || 'None'}
            </Typography>
          </Box>
        )}
        
        {userPortal && requiredPortal && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            You are in the {userPortal} portal, but this page requires {requiredPortal} portal access.
          </Typography>
        )}
      </Alert>
      
      <Box display="flex" gap={2}>
        <Button 
          variant="contained" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
}

/**
 * Determine user portal based on user properties
 */
function determineUserPortal(user: any): 'saas' | 'tenant' {
  // Super users are typically in SaaS portal
  if (user.is_superuser) {
    return 'saas';
  }
  
  // Check if user has portal property
  if (user.portal) {
    return user.portal;
  }
  
  // Check user type
  if (user.user_type === 'super_admin' || user.role === 'super_admin') {
    return 'saas';
  }
  
  // Default to tenant portal
  return 'tenant';
}

export default ProtectedRoute;
