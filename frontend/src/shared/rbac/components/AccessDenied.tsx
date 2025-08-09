import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePermissions, useRoleCapabilities } from '../../hooks/usePermissions';
import { PermissionAction } from '../../types/permissions';

/**
 * AccessDenied - Comprehensive access denied page component
 *
 * This component provides detailed feedback when users lack required permissions.
 * It shows current permissions, required permissions, and helpful navigation.
 */

interface AccessDeniedProps {
  /** Required permissions that user lacks */
  requiredPermissions?: Array<{
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  }>;

  /** Simple required resource */
  requiredResource?: string;

  /** Simple required action */
  requiredAction?: PermissionAction;

  /** Custom message to display */
  customMessage?: string;

  /** Show detailed permission information */
  showDetails?: boolean;

  /** Hide navigation buttons */
  hideNavigation?: boolean;

  /** Custom navigation actions */
  customActions?: React.ReactNode;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredPermissions,
  requiredResource,
  requiredAction = 'VIEW',
  customMessage,
  showDetails = true,
  hideNavigation = false,
  customActions,
}) => {
  const navigate = useNavigate();
  const { userPermissions, currentPortal, isAuthenticated } = usePermissions();
  const { capabilities, primaryRole } = useRoleCapabilities();

  // Format required permissions for display
  const getRequiredPermissionsDisplay = () => {
    if (requiredPermissions && requiredPermissions.length > 0) {
      return requiredPermissions.map(p => ({
        resource: p.resource,
        action: p.action,
        display: `${p.action} ${p.resource}`,
      }));
    } else if (requiredResource) {
      return [
        {
          resource: requiredResource,
          action: requiredAction,
          display: `${requiredAction} ${requiredResource}`,
        },
      ];
    }
    return [];
  };

  const requiredPermsDisplay = getRequiredPermissionsDisplay();

  // Navigation handlers
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    const homePath = currentPortal === 'saas' ? '/saas/dashboard' : '/tenant/dashboard';
    navigate(homePath);
  };

  const handleContactSupport = () => {
    // Navigate to support or help page
    const supportPath = currentPortal === 'saas' ? '/saas/support' : '/tenant/help';
    navigate(supportPath);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4} alignItems="center">
        {/* Main Error Display */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            width: '100%',
            backgroundColor: 'background.paper',
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.contrastText',
              }}
            >
              <LockIcon sx={{ fontSize: 40 }} />
            </Box>

            {/* Title */}
            <Typography variant="h4" color="error" gutterBottom>
              Access Denied
            </Typography>

            {/* Message */}
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {customMessage || 'You do not have permission to access this resource.'}
            </Typography>

            {/* Portal Context */}
            <Chip
              icon={<SecurityIcon />}
              label={`${currentPortal.toUpperCase()} Portal`}
              color="default"
              variant="outlined"
            />
          </Stack>
        </Paper>

        {/* Detailed Information */}
        {showDetails && isAuthenticated && (
          <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
            <Stack spacing={3}>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <VpnKeyIcon color="primary" />
                Permission Details
              </Typography>

              <Divider />

              {/* Current User Information */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Your Current Role:
                </Typography>
                <Chip
                  label={primaryRole || 'Unknown'}
                  color="primary"
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>

              {/* Required Permissions */}
              {requiredPermsDisplay.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Required Permissions:
                  </Typography>
                  <List dense>
                    {requiredPermsDisplay.map((perm, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon>
                          <LockIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={perm.display}
                          primaryTypographyProps={{
                            color: 'error.main',
                            fontWeight: 'medium',
                            textTransform: 'capitalize',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Current Permissions Summary */}
              {userPermissions.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Your Current Permissions:
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You have {userPermissions.length} permission(s) in the {currentPortal} portal
                  </Alert>

                  {capabilities && (
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Available sections: {capabilities.dashboardSections?.join(', ')}
                      </Typography>
                      {capabilities.navigationAccess && (
                        <Typography variant="body2" color="text.secondary">
                          Navigation access: {capabilities.navigationAccess}
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Box>
              )}
            </Stack>
          </Paper>
        )}

        {/* Action Buttons */}
        {!hideNavigation && (
          <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
            <Stack spacing={2}>
              <Typography variant="h6" gutterBottom>
                What would you like to do?
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                  size="large"
                >
                  Go Back
                </Button>

                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={handleGoHome}
                  size="large"
                >
                  Go to Dashboard
                </Button>

                <Button variant="outlined" color="info" onClick={handleContactSupport} size="large">
                  Contact Support
                </Button>
              </Stack>

              {customActions && (
                <>
                  <Divider />
                  {customActions}
                </>
              )}
            </Stack>
          </Paper>
        )}

        {/* Help Text */}
        <Alert severity="warning" sx={{ width: '100%' }}>
          <Typography variant="body2">
            If you believe you should have access to this resource, please contact your{' '}
            {currentPortal === 'saas' ? 'system administrator' : 'school administrator'} or check
            your role permissions.
          </Typography>
        </Alert>
      </Stack>
    </Container>
  );
};

export default AccessDenied;

// Simplified version for inline use
export const InlineAccessDenied: React.FC<{
  message?: string;
  requiredResource?: string;
  requiredAction?: PermissionAction;
}> = ({ message, requiredResource, requiredAction = 'VIEW' }) => (
  <Alert severity="warning" sx={{ my: 2 }} icon={<LockIcon />}>
    <Typography variant="body2">
      {message || `Access denied. Required permission: ${requiredAction} on ${requiredResource}`}
    </Typography>
  </Alert>
);

// Minimal version for compact spaces
export const CompactAccessDenied: React.FC<{
  message?: string;
}> = ({ message = 'Access denied' }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      p: 2,
      border: 1,
      borderColor: 'warning.main',
      borderRadius: 1,
      backgroundColor: 'warning.light',
      color: 'warning.contrastText',
    }}
  >
    <LockIcon fontSize="small" />
    <Typography variant="body2" fontWeight="medium">
      {message}
    </Typography>
  </Box>
);
