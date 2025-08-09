import React from 'react';
import { Box, Grid, Button, Typography, useTheme, alpha } from '@mui/material';
import {
  PersonAdd,
  School,
  Assignment,
  Assessment,
  Notifications,
  Settings,
  FileDownload,
  CalendarToday,
  Payment,
  Security,
} from '@mui/icons-material';
import PermissionGate from '@shared/rbac/components/PermissionGate';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  permission: {
    resource: string;
    action: string;
  };
  onClick: () => void;
}

const QuickActions: React.FC = () => {
  const theme = useTheme();

  const quickActions: QuickAction[] = [
    {
      id: 'add-student',
      title: 'Add Student',
      description: 'Enroll new student',
      icon: <PersonAdd sx={{ fontSize: 24 }} />,
      color: theme.palette.primary.main,
      permission: { resource: 'students', action: 'CREATE' },
      onClick: () => console.log('Add student'),
    },
    {
      id: 'add-teacher',
      title: 'Add Teacher',
      description: 'Hire new teacher',
      icon: <Assignment sx={{ fontSize: 24 }} />,
      color: theme.palette.success.main,
      permission: { resource: 'teachers', action: 'CREATE' },
      onClick: () => console.log('Add teacher'),
    },
    {
      id: 'manage-classes',
      title: 'Manage Classes',
      description: 'Create/edit classes',
      icon: <School sx={{ fontSize: 24 }} />,
      color: theme.palette.info.main,
      permission: { resource: 'classes', action: 'MANAGE' },
      onClick: () => console.log('Manage classes'),
    },
    {
      id: 'generate-reports',
      title: 'Generate Reports',
      description: 'Create school reports',
      icon: <Assessment sx={{ fontSize: 24 }} />,
      color: theme.palette.warning.main,
      permission: { resource: 'reports', action: 'CREATE' },
      onClick: () => console.log('Generate reports'),
    },
    {
      id: 'send-notifications',
      title: 'Send Notifications',
      description: 'Broadcast messages',
      icon: <Notifications sx={{ fontSize: 24 }} />,
      color: theme.palette.secondary.main,
      permission: { resource: 'notifications', action: 'CREATE' },
      onClick: () => console.log('Send notifications'),
    },
    {
      id: 'manage-events',
      title: 'Manage Events',
      description: 'Schedule school events',
      icon: <CalendarToday sx={{ fontSize: 24 }} />,
      color: theme.palette.info.main,
      permission: { resource: 'events', action: 'MANAGE' },
      onClick: () => console.log('Manage events'),
    },
    {
      id: 'fee-management',
      title: 'Fee Management',
      description: 'Manage student fees',
      icon: <Payment sx={{ fontSize: 24 }} />,
      color: theme.palette.success.main,
      permission: { resource: 'fees', action: 'MANAGE' },
      onClick: () => console.log('Fee management'),
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download school data',
      icon: <FileDownload sx={{ fontSize: 24 }} />,
      color: theme.palette.warning.main,
      permission: { resource: 'data', action: 'EXPORT' },
      onClick: () => console.log('Export data'),
    },
    {
      id: 'security-settings',
      title: 'Security Settings',
      description: 'Configure security',
      icon: <Security sx={{ fontSize: 24 }} />,
      color: theme.palette.error.main,
      permission: { resource: 'security', action: 'MANAGE' },
      onClick: () => console.log('Security settings'),
    },
    {
      id: 'school-settings',
      title: 'School Settings',
      description: 'Configure school',
      icon: <Settings sx={{ fontSize: 24 }} />,
      color: theme.palette.grey[600],
      permission: { resource: 'settings', action: 'MANAGE' },
      onClick: () => console.log('School settings'),
    },
  ];

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Quick access to common administrative tasks
      </Typography>

      <Grid container spacing={2}>
        {quickActions.map(action => (
          <Grid item xs={12} sm={6} key={action.id}>
            <PermissionGate resource={action.permission.resource} action={action.permission.action}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  justifyContent: 'flex-start',
                  p: 2,
                  height: 'auto',
                  borderColor: alpha(action.color, 0.3),
                  color: action.color,
                  '&:hover': {
                    borderColor: action.color,
                    bgcolor: alpha(action.color, 0.05),
                  },
                }}
              >
                <Box textAlign="left">
                  <Typography variant="body2" fontWeight="medium" display="block">
                    {action.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {action.description}
                  </Typography>
                </Box>
              </Button>
            </PermissionGate>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;
