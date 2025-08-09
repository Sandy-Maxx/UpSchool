import React from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
  Badge,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add,
  Visibility,
  Assessment,
  Settings,
  CloudDownload,
  Email,
  Notifications,
  Security,
  SupportAgent,
  Backup,
  Update,
  MonitorHeart,
  ArrowForward,
} from '@mui/icons-material';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  urgent?: boolean;
}

export const QuickActions: React.FC = () => {
  const theme = useTheme();

  const handleAction = (actionId: string) => {
    console.log(`Executing action: ${actionId}`);
    // Implement actual action logic here
    switch (actionId) {
      case 'create-tenant':
        // Navigate to create tenant page
        break;
      case 'view-analytics':
        // Navigate to platform analytics
        break;
      case 'system-health':
        // Navigate to system health dashboard
        break;
      case 'manage-users':
        // Navigate to global user management
        break;
      case 'export-data':
        // Trigger data export
        break;
      case 'send-announcement':
        // Open announcement composer
        break;
      case 'security-alerts':
        // Navigate to security center
        break;
      case 'support-tickets':
        // Navigate to support dashboard
        break;
      case 'backup-system':
        // Initiate system backup
        break;
      case 'system-update':
        // Navigate to system updates
        break;
      case 'monitor-performance':
        // Navigate to performance monitoring
        break;
      default:
        console.log('Unknown action');
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'create-tenant',
      label: 'Create New Tenant',
      description: 'Add a new school to the platform',
      icon: <Add />,
      action: () => handleAction('create-tenant'),
      color: 'primary',
    },
    {
      id: 'view-analytics',
      label: 'Platform Analytics',
      description: 'View detailed platform metrics',
      icon: <Assessment />,
      action: () => handleAction('view-analytics'),
      color: 'info',
    },
    {
      id: 'system-health',
      label: 'System Health Check',
      description: 'Monitor infrastructure status',
      icon: <MonitorHeart />,
      action: () => handleAction('system-health'),
      color: 'success',
    },
    {
      id: 'manage-users',
      label: 'Global User Management',
      description: 'Manage users across all tenants',
      icon: <Settings />,
      action: () => handleAction('manage-users'),
      color: 'secondary',
    },
    {
      id: 'export-data',
      label: 'Export Platform Data',
      description: 'Generate comprehensive reports',
      icon: <CloudDownload />,
      action: () => handleAction('export-data'),
      color: 'info',
    },
    {
      id: 'send-announcement',
      label: 'Send Announcement',
      description: 'Broadcast message to all tenants',
      icon: <Email />,
      action: () => handleAction('send-announcement'),
      color: 'primary',
    },
  ];

  const urgentActions: QuickAction[] = [
    {
      id: 'security-alerts',
      label: 'Security Alerts',
      description: 'Review security incidents',
      icon: <Security />,
      action: () => handleAction('security-alerts'),
      badge: 3,
      color: 'error',
      urgent: true,
    },
    {
      id: 'support-tickets',
      label: 'Support Tickets',
      description: 'Pending support requests',
      icon: <SupportAgent />,
      action: () => handleAction('support-tickets'),
      badge: 12,
      color: 'warning',
      urgent: true,
    },
    {
      id: 'backup-system',
      label: 'System Backup',
      description: 'Create system backup now',
      icon: <Backup />,
      action: () => handleAction('backup-system'),
      color: 'info',
    },
    {
      id: 'system-update',
      label: 'System Updates',
      description: 'Available system updates',
      icon: <Update />,
      action: () => handleAction('system-update'),
      badge: 2,
      color: 'success',
    },
  ];

  const ActionItem: React.FC<{ action: QuickAction; variant?: 'default' | 'urgent' }> = ({
    action,
    variant = 'default',
  }) => {
    const isUrgent = variant === 'urgent' || action.urgent;
    const actionColor = action.color || 'primary';
    const colorPalette = theme.palette[actionColor];

    return (
      <ListItem disablePadding>
        <ListItemButton
          onClick={action.action}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            background: isUrgent
              ? `linear-gradient(135deg, ${alpha(colorPalette.main, 0.08)} 0%, ${alpha(colorPalette.main, 0.03)} 100%)`
              : 'transparent',
            border: isUrgent
              ? `1px solid ${alpha(colorPalette.main, 0.2)}`
              : `1px solid transparent`,
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(colorPalette.main, 0.12)} 0%, ${alpha(colorPalette.main, 0.06)} 100%)`,
              border: `1px solid ${alpha(colorPalette.main, 0.3)}`,
            },
          }}
        >
          <ListItemIcon sx={{ color: colorPalette.main, minWidth: 40 }}>
            {action.badge ? (
              <Badge badgeContent={action.badge} color={actionColor}>
                {action.icon}
              </Badge>
            ) : (
              action.icon
            )}
          </ListItemIcon>
          <ListItemText
            primary={action.label}
            secondary={action.description}
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: isUrgent ? 'bold' : 'medium',
            }}
            secondaryTypographyProps={{
              variant: 'caption',
              color: 'text.secondary',
            }}
          />
          <ArrowForward sx={{ fontSize: 16, color: 'text.secondary' }} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box>
      {/* Urgent Actions */}
      {urgentActions.length > 0 && (
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Chip label="Urgent" color="error" size="small" variant="outlined" />
            <Badge
              badgeContent={urgentActions
                .filter(a => a.badge)
                .reduce((sum, a) => sum + (a.badge || 0), 0)}
              color="error"
            >
              <Notifications fontSize="small" />
            </Badge>
          </Box>
          <List dense sx={{ p: 0 }}>
            {urgentActions.map(action => (
              <ActionItem key={action.id} action={action} variant="urgent" />
            ))}
          </List>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Regular Actions */}
      <Box>
        <List dense sx={{ p: 0 }}>
          {quickActions.map(action => (
            <ActionItem key={action.id} action={action} />
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Quick Statistics */}
      <Box display="flex" flexDirection="column" gap={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          onClick={() => handleAction('view-analytics')}
          fullWidth
        >
          View Full Platform Analytics
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Settings />}
          onClick={() => handleAction('platform-settings')}
          fullWidth
        >
          Platform Settings
        </Button>
      </Box>
    </Box>
  );
};

export default QuickActions;
