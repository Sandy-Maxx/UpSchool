import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import {
  School,
  People,
  Class,
  Assessment,
  Notifications,
  TrendingUp,
  CalendarToday,
  Assignment,
  Payment,
  Settings,
  Add,
  MoreVert,
} from '@mui/icons-material';
import { DashboardLayout, useDashboard } from '@shared/dashboard';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import SchoolMetrics from './SchoolMetrics';
import UserOverview from './UserOverview';
import AcademicOverview from './AcademicOverview';
import QuickActions from './QuickActions';
import RecentActivities from './RecentActivities';

interface SchoolAdminDashboardProps {
  className?: string;
}

const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ className }) => {
  const theme = useTheme();

  const { widgets, isEditMode, isLoading, error, refreshAll, toggleEditMode } =
    useDashboard('school-admin-dashboard');

  // Sidebar items for school admin navigation
  const sidebarItems = [
    {
      id: 'overview',
      label: 'School Overview',
      icon: 'dashboard',
      href: '/admin/overview',
      active: true,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'people',
      href: '/admin/users',
    },
    {
      id: 'academic',
      label: 'Academic Structure',
      icon: 'class',
      href: '/admin/academic',
    },
    {
      id: 'students',
      label: 'Students',
      icon: 'school',
      href: '/admin/students',
      active: false,
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: 'person',
      href: '/admin/teachers',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: 'assessment',
      href: '/admin/reports',
    },
    {
      id: 'settings',
      label: 'School Settings',
      icon: 'settings',
      href: '/admin/settings',
    },
  ];

  // Header actions for the dashboard
  const headerActions = [
    {
      id: 'refresh',
      label: 'Refresh Data',
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
      label: 'Export School Report',
      icon: 'file_download',
      onClick: () => {
        console.log('Export school report');
      },
    },
  ];

  // Mock data for demonstration
  const schoolStats = {
    totalStudents: 1247,
    totalTeachers: 89,
    totalClasses: 42,
    activeUsers: 1156,
    attendanceRate: 94.2,
    academicPerformance: 87.5,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'student_enrollment',
      title: 'New Student Enrollment',
      description: 'John Doe enrolled in Grade 10A',
      timestamp: '2 hours ago',
      user: 'Admin User',
    },
    {
      id: 2,
      type: 'grade_update',
      title: 'Grade Update',
      description: 'Mathematics grades updated for Grade 9B',
      timestamp: '4 hours ago',
      user: 'Teacher Smith',
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Attendance Marked',
      description: 'Daily attendance completed for all classes',
      timestamp: '6 hours ago',
      user: 'System',
    },
  ];

  if (error) {
    return (
      <DashboardLayout
        title="School Administration"
        subtitle="Error loading dashboard"
        layoutId="school-admin-dashboard"
        permissions={['school.admin.dashboard.view']}
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
      title="School Administration"
      subtitle="School Overview & Management"
      layoutId="school-admin-dashboard"
      permissions={['school.admin.dashboard.view']}
      sidebarItems={sidebarItems}
      headerActions={headerActions}
      isLoading={isLoading}
      className={className}
    >
      <Box className="space-y-6" p={3}>
        {/* School Metrics Overview */}
        <PermissionGate resource="school.metrics" action="VIEW">
          <Card
            elevation={2}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <School
                  sx={{
                    mr: 2,
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  School Metrics
                </Typography>
              </Box>
              <SchoolMetrics />
            </CardContent>
          </Card>
        </PermissionGate>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* User Overview */}
            <PermissionGate resource="users" action="VIEW">
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <People
                        sx={{
                          mr: 2,
                          color: theme.palette.success.main,
                          fontSize: 24,
                        }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        User Overview
                      </Typography>
                    </Box>
                    <PermissionGate resource="users" action="CREATE">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => console.log('Add new user')}
                      >
                        Add User
                      </Button>
                    </PermissionGate>
                  </Box>
                  <UserOverview />
                </CardContent>
              </Card>
            </PermissionGate>

            {/* Academic Overview */}
            <PermissionGate resource="academic" action="VIEW">
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Class
                      sx={{
                        mr: 2,
                        color: theme.palette.info.main,
                        fontSize: 24,
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      Academic Structure
                    </Typography>
                  </Box>
                  <AcademicOverview />
                </CardContent>
              </Card>
            </PermissionGate>

            {/* Recent Activities */}
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Notifications
                      sx={{
                        mr: 2,
                        color: theme.palette.warning.main,
                        fontSize: 24,
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      Recent Activities
                    </Typography>
                  </Box>
                  <Chip label={`${recentActivities.length} new`} size="small" color="primary" />
                </Box>
                <RecentActivities activities={recentActivities} />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Quick Actions */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Settings
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

            {/* School Statistics */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  School Statistics
                </Typography>
                <Box className="space-y-3">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <People sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2">Total Students</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {schoolStats.totalStudents.toLocaleString()}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <Assignment sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2">Total Teachers</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {schoolStats.totalTeachers}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <Class sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2">Total Classes</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {schoolStats.totalClasses}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <TrendingUp sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2">Attendance Rate</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {schoolStats.attendanceRate}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday
                    sx={{
                      mr: 2,
                      color: theme.palette.info.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Upcoming Events
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                        <Assessment sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Parent-Teacher Meeting" secondary="Tomorrow, 3:00 PM" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                        <School sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Annual Sports Day" secondary="Next Friday, 9:00 AM" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 32, height: 32 }}>
                        <Payment sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Fee Due Date" secondary="Next Monday" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default SchoolAdminDashboard;
