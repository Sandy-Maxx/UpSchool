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
  Button,
  Divider,
} from '@mui/material';
import {
  Class,
  Assignment,
  Schedule,
  Assessment,
  Notifications,
  People,
  Book,
  TrendingUp,
  Add,
  Today,
  CalendarToday,
  Message,
} from '@mui/icons-material';
import { DashboardLayout, useDashboard } from '@shared/dashboard';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import MyClasses from './MyClasses';
import TodaySchedule from './TodaySchedule';
import QuickActions from './QuickActions';

interface TeacherDashboardProps {
  className?: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ className }) => {
  const theme = useTheme();

  const { widgets, isEditMode, isLoading, error, refreshAll, toggleEditMode } =
    useDashboard('teacher-dashboard');

  // Sidebar items for teacher navigation
  const sidebarItems = [
    {
      id: 'overview',
      label: 'My Dashboard',
      icon: 'dashboard',
      href: '/teacher/overview',
      active: true,
    },
    {
      id: 'classes',
      label: 'My Classes',
      icon: 'class',
      href: '/teacher/classes',
    },
    {
      id: 'students',
      label: 'Students',
      icon: 'people',
      href: '/teacher/students',
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: 'assignment',
      href: '/teacher/assignments',
    },
    {
      id: 'grades',
      label: 'Grade Book',
      icon: 'assessment',
      href: '/teacher/grades',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: 'schedule',
      href: '/teacher/attendance',
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: 'message',
      href: '/teacher/communication',
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: 'book',
      href: '/teacher/resources',
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
  ];

  // Mock data for demonstration
  const teacherStats = {
    totalClasses: 5,
    totalStudents: 125,
    pendingAssignments: 3,
    ungradedSubmissions: 12,
    todayClasses: 4,
    attendanceRate: 96.8,
  };

  const todaySchedule = [
    {
      id: 1,
      time: '08:00 - 09:00',
      subject: 'Mathematics',
      class: 'Grade 10A',
      room: 'Room 201',
      students: 25,
    },
    {
      id: 2,
      time: '09:15 - 10:15',
      subject: 'Mathematics',
      class: 'Grade 9B',
      room: 'Room 201',
      students: 28,
    },
    {
      id: 3,
      time: '10:30 - 11:30',
      subject: 'Mathematics',
      class: 'Grade 11A',
      room: 'Room 201',
      students: 22,
    },
    {
      id: 4,
      time: '13:00 - 14:00',
      subject: 'Mathematics',
      class: 'Grade 10B',
      room: 'Room 201',
      students: 26,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment_submitted',
      title: 'Assignment Submitted',
      description: 'Algebra homework submitted by 15 students',
      timestamp: '1 hour ago',
    },
    {
      id: 2,
      type: 'grade_updated',
      title: 'Grades Updated',
      description: 'Updated grades for Geometry quiz',
      timestamp: '2 hours ago',
    },
    {
      id: 3,
      type: 'attendance_marked',
      title: 'Attendance Marked',
      description: 'Marked attendance for Grade 10A',
      timestamp: '3 hours ago',
    },
  ];

  if (error) {
    return (
      <DashboardLayout
        title="Teacher Dashboard"
        subtitle="Error loading dashboard"
        layoutId="teacher-dashboard"
        permissions={['teacher.dashboard.view']}
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
      title="Teacher Dashboard"
      subtitle="Welcome back, Teacher!"
      layoutId="teacher-dashboard"
      permissions={['teacher.dashboard.view']}
      sidebarItems={sidebarItems}
      headerActions={headerActions}
      isLoading={isLoading}
      className={className}
    >
      <Box className="space-y-6" p={3}>
        {/* Teacher Statistics Overview */}
        <PermissionGate resource="teacher.stats" action="VIEW">
          <Card
            elevation={2}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment
                  sx={{
                    mr: 2,
                    color: theme.palette.primary.main,
                    fontSize: 28,
                  }}
                />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  My Teaching Overview
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {teacherStats.totalClasses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Classes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {teacherStats.totalStudents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {teacherStats.pendingAssignments}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Assignments
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {teacherStats.attendanceRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </PermissionGate>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* My Classes */}
            <PermissionGate resource="classes" action="VIEW">
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Class
                        sx={{
                          mr: 2,
                          color: theme.palette.success.main,
                          fontSize: 24,
                        }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        My Classes
                      </Typography>
                    </Box>
                    <PermissionGate resource="classes" action="VIEW">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => console.log('View all classes')}
                      >
                        View All
                      </Button>
                    </PermissionGate>
                  </Box>
                  <MyClasses />
                </CardContent>
              </Card>
            </PermissionGate>

            {/* Today's Schedule */}
            <PermissionGate resource="schedule" action="VIEW">
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Today
                      sx={{
                        mr: 2,
                        color: theme.palette.info.main,
                        fontSize: 24,
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      Today's Schedule
                    </Typography>
                  </Box>
                  <TodaySchedule schedule={todaySchedule} />
                </CardContent>
              </Card>
            </PermissionGate>

            {/* Recent Activities */}
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
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
                <List dense>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            <Assessment sx={{ fontSize: 16 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.timestamp}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Quick Actions */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Add
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

            {/* Upcoming Deadlines */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday
                    sx={{
                      mr: 2,
                      color: theme.palette.error.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Upcoming Deadlines
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.error.main, width: 32, height: 32 }}>
                        <Assignment sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Algebra Quiz Due" secondary="Grade 10A - Tomorrow" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 32, height: 32 }}>
                        <Assessment sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Grade Reports Due" secondary="All Classes - Friday" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.info.main, width: 32, height: 32 }}>
                        <Message sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Parent Meeting" secondary="Grade 9B - Next Monday" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Teaching Resources */}
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Book
                    sx={{
                      mr: 2,
                      color: theme.palette.success.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Teaching Resources
                  </Typography>
                </Box>
                <Box className="space-y-2">
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Book />}
                    onClick={() => console.log('Access library')}
                  >
                    School Library
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Assessment />}
                    onClick={() => console.log('Access materials')}
                  >
                    Teaching Materials
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<TrendingUp />}
                    onClick={() => console.log('View analytics')}
                  >
                    Student Analytics
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
