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
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  School,
  Assignment,
  Schedule,
  Assessment,
  Book,
  TrendingUp,
  CalendarToday,
  Message,
  Grade,
  Attendance,
  LibraryBooks,
  Notifications,
} from '@mui/icons-material';
import { DashboardLayout, useDashboard } from '@shared/dashboard';
import PermissionGate from '@shared/rbac/components/PermissionGate';

interface StudentDashboardProps {
  className?: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ className }) => {
  const theme = useTheme();

  const { widgets, isEditMode, isLoading, error, refreshAll, toggleEditMode } =
    useDashboard('student-dashboard');

  // Sidebar items for student navigation
  const sidebarItems = [
    {
      id: 'overview',
      label: 'My Dashboard',
      icon: 'dashboard',
      href: '/student/overview',
      active: true,
    },
    {
      id: 'schedule',
      label: 'My Schedule',
      icon: 'schedule',
      href: '/student/schedule',
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: 'assignment',
      href: '/student/assignments',
    },
    {
      id: 'grades',
      label: 'My Grades',
      icon: 'assessment',
      href: '/student/grades',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: 'schedule',
      href: '/student/attendance',
    },
    {
      id: 'library',
      label: 'Library',
      icon: 'book',
      href: '/student/library',
    },
    {
      id: 'communication',
      label: 'Messages',
      icon: 'message',
      href: '/student/messages',
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
  ];

  // Mock data for demonstration
  const studentInfo = {
    name: 'John Doe',
    grade: '10A',
    studentId: 'STU2024001',
    gpa: 3.85,
    attendanceRate: 96.5,
    totalClasses: 6,
    pendingAssignments: 3,
  };

  const currentClasses = [
    {
      id: '1',
      subject: 'Mathematics',
      teacher: 'Ms. Smith',
      grade: 'A-',
      attendance: 95,
      nextClass: 'Tomorrow 8:00 AM',
    },
    {
      id: '2',
      subject: 'English Literature',
      teacher: 'Mr. Johnson',
      grade: 'A',
      attendance: 98,
      nextClass: 'Today 10:30 AM',
    },
    {
      id: '3',
      subject: 'Physics',
      teacher: 'Dr. Brown',
      grade: 'B+',
      attendance: 92,
      nextClass: 'Wednesday 1:00 PM',
    },
  ];

  const upcomingAssignments = [
    {
      id: '1',
      title: 'Algebra Quiz',
      subject: 'Mathematics',
      dueDate: 'Tomorrow',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Essay on Shakespeare',
      subject: 'English Literature',
      dueDate: 'Friday',
      status: 'in_progress',
    },
    {
      id: '3',
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: 'Next Monday',
      status: 'not_started',
    },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return theme.palette.success.main;
    if (grade.includes('B')) return theme.palette.warning.main;
    if (grade.includes('C')) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in_progress':
        return theme.palette.warning.main;
      case 'pending':
        return theme.palette.info.main;
      case 'not_started':
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  if (error) {
    return (
      <DashboardLayout
        title="Student Dashboard"
        subtitle="Error loading dashboard"
        layoutId="student-dashboard"
        permissions={['student.dashboard.view']}
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
      title="Student Dashboard"
      subtitle={`Welcome back, ${studentInfo.name}!`}
      layoutId="student-dashboard"
      permissions={['student.dashboard.view']}
      sidebarItems={sidebarItems}
      headerActions={headerActions}
      isLoading={isLoading}
      className={className}
    >
      <Box className="space-y-6" p={3}>
        {/* Student Overview */}
        <PermissionGate resource="student.stats" action="VIEW">
          <Card
            elevation={2}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: theme.palette.primary.main,
                    mr: 3,
                  }}
                >
                  {studentInfo.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h5" fontWeight="bold">
                    {studentInfo.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Grade {studentInfo.grade} • ID: {studentInfo.studentId}
                  </Typography>
                </Box>
                <Chip
                  label={`GPA: ${studentInfo.gpa}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {studentInfo.totalClasses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Classes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {studentInfo.pendingAssignments}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Assignments
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {studentInfo.attendanceRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {studentInfo.gpa}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current GPA
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
            {/* Current Classes */}
            <PermissionGate resource="classes" action="VIEW">
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <School
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

                  <Grid container spacing={2}>
                    {currentClasses.map(classInfo => (
                      <Grid item xs={12} md={6} key={classInfo.id}>
                        <Card
                          elevation={1}
                          sx={{
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                            >
                              <Typography variant="h6" fontWeight="bold">
                                {classInfo.subject}
                              </Typography>
                              <Chip
                                label={classInfo.grade}
                                size="small"
                                sx={{
                                  bgcolor: alpha(getGradeColor(classInfo.grade), 0.1),
                                  color: getGradeColor(classInfo.grade),
                                  fontWeight: 'bold',
                                }}
                              />
                            </Box>

                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Teacher: {classInfo.teacher}
                            </Typography>

                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={1}
                            >
                              <Typography variant="body2" color="text.secondary">
                                Attendance
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {classInfo.attendance}%
                              </Typography>
                            </Box>

                            <LinearProgress
                              variant="determinate"
                              value={classInfo.attendance}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                mb: 2,
                              }}
                            />

                            <Typography variant="caption" color="text.secondary">
                              Next: {classInfo.nextClass}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </PermissionGate>

            {/* Upcoming Assignments */}
            <PermissionGate resource="assignments" action="VIEW">
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Assignment
                      sx={{
                        mr: 2,
                        color: theme.palette.warning.main,
                        fontSize: 24,
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      Upcoming Assignments
                    </Typography>
                  </Box>

                  <List dense>
                    {upcomingAssignments.map((assignment, index) => (
                      <React.Fragment key={assignment.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: alpha(getAssignmentStatusColor(assignment.status), 0.1),
                                color: getAssignmentStatusColor(assignment.status),
                              }}
                            >
                              <Assignment sx={{ fontSize: 20 }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={assignment.title}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {assignment.subject} • Due: {assignment.dueDate}
                                </Typography>
                                <Chip
                                  label={assignment.status.replace('_', ' ')}
                                  size="small"
                                  sx={{
                                    mt: 0.5,
                                    bgcolor: alpha(
                                      getAssignmentStatusColor(assignment.status),
                                      0.1
                                    ),
                                    color: getAssignmentStatusColor(assignment.status),
                                    textTransform: 'capitalize',
                                  }}
                                />
                              </Box>
                            }
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => console.log('View assignment', assignment.id)}
                          >
                            View
                          </Button>
                        </ListItem>
                        {index < upcomingAssignments.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </PermissionGate>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Quick Actions */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Quick Actions
                </Typography>
                <Box className="space-y-2">
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Assignment />}
                    onClick={() => console.log('View assignments')}
                  >
                    View Assignments
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Assessment />}
                    onClick={() => console.log('View grades')}
                  >
                    Check Grades
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Schedule />}
                    onClick={() => console.log('View schedule')}
                  >
                    My Schedule
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<LibraryBooks />}
                    onClick={() => console.log('Access library')}
                  >
                    School Library
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Notifications
                    sx={{
                      mr: 2,
                      color: theme.palette.info.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Recent Notifications
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                        <Grade sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New Grade Posted"
                      secondary="Mathematics Quiz - 2 hours ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 32, height: 32 }}>
                        <Assignment sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Assignment Due Soon"
                      secondary="Physics Lab Report - Tomorrow"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.info.main, width: 32, height: 32 }}>
                        <Message sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="New Message" secondary="From Ms. Smith - 1 day ago" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Academic Progress */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Academic Progress
                </Typography>
                <Box className="space-y-3">
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Overall GPA</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {studentInfo.gpa}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(studentInfo.gpa / 4) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Attendance</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {studentInfo.attendanceRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={studentInfo.attendanceRate}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Assignments</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {studentInfo.pendingAssignments} pending
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={((6 - studentInfo.pendingAssignments) / 6) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default StudentDashboard;
