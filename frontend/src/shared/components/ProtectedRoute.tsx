import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useAppDispatch } from '../store/hooks';
import { validateSession } from '../store/slices/authSlice';
import { Box, CircularProgress, Typography } from '@mui/material';
import { PortalType } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  portalType?: PortalType;
  fallbackPath?: string;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  portalType,
  fallbackPath = '/login',
  requireAuth = true,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    loading,
    user,
    permissions,
    portalType: currentPortalType,
    sessionExpiry,
    isRefreshing,
  } = useAuth();

  // Validate session on route change if authenticated
  useEffect(() => {
    if (isAuthenticated && !isRefreshing) {
      // Check if session is close to expiry (within 5 minutes)
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (sessionExpiry && sessionExpiry - now < fiveMinutes) {
        dispatch(validateSession());
      }
    }
  }, [location.pathname, isAuthenticated, sessionExpiry, isRefreshing, dispatch]);

  // Show loading spinner while checking auth or refreshing
  if (loading || isRefreshing) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          {isRefreshing ? 'Refreshing session...' : 'Loading...'}
        </Typography>
      </Box>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check portal type if specified
  if (portalType && currentPortalType !== portalType) {
    const redirectPath = portalType === 'saas' ? '/' : `/${currentPortalType}`;
    return <Navigate to={redirectPath} replace />;
  }

  // Check required roles
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check required permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      permissions.includes(permission)
    );
    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
