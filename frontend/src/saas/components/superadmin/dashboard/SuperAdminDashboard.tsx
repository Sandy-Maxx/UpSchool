import React from 'react';
import { Box, Grid, Card, CardContent, Typography, useTheme, alpha } from '@mui/material';
import {
  TrendingUp,
  Business,
  People,
  Security,
  Analytics,
  AttachMoney,
  HealthAndSafety,
  AdminPanelSettings,
} from '@mui/icons-material';
import { DashboardLayout, useDashboard } from '@shared/dashboard';
import { PlatformMetrics } from './PlatformMetrics';
import { TenantOverview } from './TenantOverview';
import { SystemHealth } from './SystemHealth';
import { RevenueAnalytics } from './RevenueAnalytics';
import { SecurityCenter } from './SecurityCenter';
import { QuickActions } from './QuickActions';

interface SuperAdminDashboardProps {
  className?: string;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ className }) => {
  const theme = useTheme();

  const { widgets, isEditMode, isLoading, error, refreshAll, toggleEditMode } =
    useDashboard('superadmin-dashboard');

  // Sidebar items for superadmin navigation
  const sidebarItems = [
    {
      id: 'overview',
      label: 'Platform Overview',
      icon: 'dashboard',
      href: '/admin/overview',
      active: true,
    },
    {
      id: 'tenants',
      label: 'Tenant Management',
      icon: 'business',
      href: '/admin/tenants',
    },
    {
      id: 'users',
      label: 'Global Users',
      icon: 'people',
      href: '/admin/users',
    },
    {
      id: 'analytics',
      label: 'Platform Analytics',
      icon: 'analytics',
      href: '/admin/analytics',
    },
    {
      id: 'billing',
      label: 'Billing & Revenue',
      icon: 'attach_money',
      href: '/admin/billing',
    },
    {
      id: 'security',
      label: 'Security Center',
      icon: 'security',
      href: '/admin/security',
    },
    {
      id: 'health',
      label: 'System Health',
      icon: 'health_and_safety',
      href: '/admin/health',
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      icon: 'admin_panel_settings',
      href: '/admin/settings',
    },
  ];

  // Header actions for the dashboard
  const headerActions = [
    {
      id: 'refresh',
      label: 'Refresh All Data',
      icon: 'refresh',
      onClick: refreshAll,
    },
    {
      id: 'edit',
      label: isEditMode ? 'Exit Edit Mode' : 'Customize Dashboard',
      icon: isEditMode ? 'close' : 'edit',
      onClick: toggleEditMode,
    },
    {
      id: 'export',
      label: 'Export Platform Report',
      icon: 'file_download',
      onClick: () => {
        // Export functionality will be implemented later
        console.log('Export platform report');
      },
    },
  ];

  if (error) {
    return (
      <DashboardLayout
        title="System Administration"
        subtitle="Error loading dashboard"
        layoutId="superadmin-dashboard"
        permissions={['admin.dashboard.view']}
        sidebarItems={sidebarItems}
        className={className}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
          flexDirection="column"
        >
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="System Administration"
      subtitle="Platform Overview & Management"
      layoutId="superadmin-dashboard"
      permissions={['admin.dashboard.view']}
      sidebarItems={sidebarItems}
      headerActions={headerActions}
      isLoading={isLoading}
      className={className}
    >
      <Box className="space-y-6" p={3}>
        {/* Platform Metrics Overview */}
        <Card
          elevation={2}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Analytics
                sx={{
                  mr: 2,
                  color: theme.palette.primary.main,
                  fontSize: 28,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary">
                Platform Metrics
              </Typography>
            </Box>
            <PlatformMetrics />
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* Tenant Overview */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Business
                    sx={{
                      mr: 2,
                      color: theme.palette.success.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Tenant Overview
                  </Typography>
                </Box>
                <TenantOverview />
              </CardContent>
            </Card>

            {/* System Health */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <HealthAndSafety
                    sx={{
                      mr: 2,
                      color: theme.palette.info.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    System Health & Performance
                  </Typography>
                </Box>
                <SystemHealth />
              </CardContent>
            </Card>

            {/* Revenue Analytics */}
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AttachMoney
                    sx={{
                      mr: 2,
                      color: theme.palette.warning.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Revenue Analytics
                  </Typography>
                </Box>
                <RevenueAnalytics />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Quick Actions */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AdminPanelSettings
                    sx={{
                      mr: 2,
                      color: theme.palette.primary.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Quick Actions
                  </Typography>
                </Box>
                <QuickActions />
              </CardContent>
            </Card>

            {/* Security Center */}
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Security
                    sx={{
                      mr: 2,
                      color: theme.palette.error.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Security Center
                  </Typography>
                </Box>
                <SecurityCenter />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
