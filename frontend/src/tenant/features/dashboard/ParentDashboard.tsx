import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  School,
  Assignment,
  Event,
  Payment,
  Notifications,
  TrendingUp,
  Schedule,
  Grade,
} from '@mui/icons-material';
import DashboardLayout from '@shared/dashboard';
import { useDashboard } from '@shared/dashboard';
import PermissionGate from '@shared/rbac/components/PermissionGate';

// Child Overview Component
const ChildOverview: React.FC = () => {
  const children = [
    {
      id: 1,
      name: 'John Smith',
      grade: 'Grade 8',
      class: '8A',
      attendance: 95,
      performance: 'Excellent',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      grade: 'Grade 6',
      class: '6B',
      attendance: 88,
      performance: 'Good',
    },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        My Children
      </Typography>
      <Grid container spacing={2}>
        {children.map((child) => (
          <Grid item xs={12} sm={6} key={child.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {child.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {child.grade} - {child.class}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`Attendance: ${child.attendance}%`}
                    size="small"
                    color={child.attendance >= 90 ? 'success' : 'warning'}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={child.performance}
                    size="small"
                    color="primary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// Academic Progress Component
const AcademicProgress: React.FC = () => {
  const subjects = [
    { name: 'Mathematics', grade: 'A', progress: 85 },
    { name: 'English', grade: 'A-', progress: 82 },
    { name: 'Science', grade: 'B+', progress: 78 },
    { name: 'History', grade: 'A', progress: 88 },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Academic Progress
      </Typography>
      <List>
        {subjects.map((subject, index) => (
          <React.Fragment key={subject.name}>
            <ListItem>
              <ListItemIcon>
                <Grade color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={subject.name}
                secondary={`Grade: ${subject.grade} | Progress: ${subject.progress}%`}
              />
              <Chip
                label={subject.grade}
                color={subject.grade.startsWith('A') ? 'success' : 'primary'}
                size="small"
              />
            </ListItem>
            {index < subjects.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

// Upcoming Events Component
const UpcomingEvents: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: '2024-01-15',
      time: '14:00',
      type: 'Meeting',
    },
    {
      id: 2,
      title: 'Annual Sports Day',
      date: '2024-01-20',
      time: '09:00',
      type: 'Event',
    },
    {
      id: 3,
      title: 'Science Fair',
      date: '2024-01-25',
      time: '15:30',
      type: 'Event',
    },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Events
      </Typography>
      <List>
        {events.map((event, index) => (
          <React.Fragment key={event.id}>
            <ListItem>
              <ListItemIcon>
                <Event color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={event.title}
                secondary={`${event.date} at ${event.time}`}
              />
              <Chip
                label={event.type}
                size="small"
                color={event.type === 'Meeting' ? 'warning' : 'info'}
              />
            </ListItem>
            {index < events.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

// Fee Management Component
const FeeManagement: React.FC = () => {
  const feeDetails = {
    totalAmount: 5000,
    paidAmount: 3500,
    dueAmount: 1500,
    dueDate: '2024-01-31',
  };

  const paymentHistory = [
    { month: 'January 2024', amount: 1500, status: 'Paid' },
    { month: 'December 2023', amount: 2000, status: 'Paid' },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Fee Management
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h6" color="primary">
              ${feeDetails.totalAmount}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Due Amount
            </Typography>
            <Typography variant="h6" color="error">
              ${feeDetails.dueAmount}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Due Date: {feeDetails.dueDate}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<Payment />}
          sx={{ mt: 2 }}
          fullWidth
        >
          Pay Fees
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>
        Recent Payments
      </Typography>
      <List dense>
        {paymentHistory.map((payment) => (
          <ListItem key={payment.month}>
            <ListItemText
              primary={payment.month}
              secondary={`$${payment.amount}`}
            />
            <Chip
              label={payment.status}
              size="small"
              color="success"
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'View Attendance',
      icon: <School />,
      action: () => console.log('View Attendance'),
    },
    {
      title: 'Check Assignments',
      icon: <Assignment />,
      action: () => console.log('Check Assignments'),
    },
    {
      title: 'Schedule Meeting',
      icon: <Schedule />,
      action: () => console.log('Schedule Meeting'),
    },
    {
      title: 'View Reports',
      icon: <TrendingUp />,
      action: () => console.log('View Reports'),
    },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action) => (
          <Grid item xs={6} key={action.title}>
            <Button
              variant="outlined"
              startIcon={action.icon}
              onClick={action.action}
              fullWidth
              sx={{ height: 60 }}
            >
              {action.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// Notifications Component
const Notifications: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: 'Assignment Due',
      message: 'Math homework due tomorrow',
      time: '2 hours ago',
      type: 'assignment',
    },
    {
      id: 2,
      title: 'Attendance Alert',
      message: 'Your child was absent today',
      time: '1 day ago',
      type: 'attendance',
    },
    {
      id: 3,
      title: 'Grade Update',
      message: 'New grades posted for Science',
      time: '2 days ago',
      type: 'grade',
    },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Notifications
      </Typography>
      <List>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem>
              <ListItemIcon>
                <Notifications color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={`${notification.message} • ${notification.time}`}
              />
            </ListItem>
            {index < notifications.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

const ParentDashboard: React.FC = () => {
  const { isMobile } = useDashboard();

  return (
    <PermissionGate resource="dashboard" action="view">
      <DashboardLayout>
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          <Typography variant="h4" gutterBottom>
            Parent Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            {/* Child Overview */}
            <Grid item xs={12} lg={6}>
              <ChildOverview />
            </Grid>
            
            {/* Academic Progress */}
            <Grid item xs={12} lg={6}>
              <AcademicProgress />
            </Grid>
            
            {/* Upcoming Events */}
            <Grid item xs={12} md={6}>
              <UpcomingEvents />
            </Grid>
            
            {/* Fee Management */}
            <Grid item xs={12} md={6}>
              <FeeManagement />
            </Grid>
            
            {/* Quick Actions */}
            <Grid item xs={12} md={6}>
              <QuickActions />
            </Grid>
            
            {/* Notifications */}
            <Grid item xs={12} md={6}>
              <Notifications />
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </PermissionGate>
  );
};

export default ParentDashboard;
