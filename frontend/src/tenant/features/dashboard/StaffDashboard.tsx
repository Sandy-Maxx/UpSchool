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
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Work,
  Schedule,
  Assignment,
  Notifications,
  TrendingUp,
  People,
  Event,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import DashboardLayout from '@shared/dashboard';
import { useDashboard } from '@shared/dashboard';
import PermissionGate from '@shared/rbac/components/PermissionGate';

// Work Overview Component
const WorkOverview: React.FC = () => {
  const workStats = {
    totalTasks: 15,
    completedTasks: 12,
    pendingTasks: 3,
    efficiency: 80,
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Work Overview
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {workStats.totalTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {workStats.completedTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Efficiency Rate
        </Typography>
        <LinearProgress
          variant="determinate"
          value={workStats.efficiency}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {workStats.efficiency}% efficiency
        </Typography>
      </Box>
    </Paper>
  );
};

// Today's Schedule Component
const TodaySchedule: React.FC = () => {
  const schedule = [
    {
      id: 1,
      time: '08:00 - 09:00',
      activity: 'Morning Assembly',
      location: 'Main Hall',
      status: 'completed',
    },
    {
      id: 2,
      time: '09:00 - 10:00',
      activity: 'Administrative Tasks',
      location: 'Office',
      status: 'in-progress',
    },
    {
      id: 3,
      time: '10:00 - 11:00',
      activity: 'Student Support',
      location: 'Student Center',
      status: 'pending',
    },
    {
      id: 4,
      time: '11:00 - 12:00',
      activity: 'Team Meeting',
      location: 'Conference Room',
      status: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'in-progress':
        return <Warning />;
      case 'pending':
        return <Info />;
      default:
        return <Info />;
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Today's Schedule
      </Typography>
      <List>
        {schedule.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem>
              <ListItemIcon>
                {React.cloneElement(getStatusIcon(item.status), {
                  color: getStatusColor(item.status) as any,
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.activity}
                secondary={`${item.time} • ${item.location}`}
              />
              <Chip
                label={item.status.replace('-', ' ')}
                size="small"
                color={getStatusColor(item.status) as any}
              />
            </ListItem>
            {index < schedule.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

// Pending Tasks Component
const PendingTasks: React.FC = () => {
  const tasks = [
    {
      id: 1,
      title: 'Update student records',
      priority: 'High',
      dueDate: '2024-01-15',
      assignedBy: 'Admin',
    },
    {
      id: 2,
      title: 'Prepare monthly report',
      priority: 'Medium',
      dueDate: '2024-01-20',
      assignedBy: 'Manager',
    },
    {
      id: 3,
      title: 'Review attendance data',
      priority: 'Low',
      dueDate: '2024-01-25',
      assignedBy: 'Supervisor',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Pending Tasks
      </Typography>
      <List>
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <ListItem>
              <ListItemIcon>
                <Assignment color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={`Due: ${task.dueDate} • Assigned by: ${task.assignedBy}`}
              />
              <Chip
                label={task.priority}
                size="small"
                color={getPriorityColor(task.priority) as any}
              />
            </ListItem>
            {index < tasks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

// Team Overview Component
const TeamOverview: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Administrative Assistant',
      status: 'Online',
      avatar: 'JD',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Office Manager',
      status: 'Busy',
      avatar: 'JS',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'IT Support',
      status: 'Offline',
      avatar: 'MJ',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online':
        return 'success';
      case 'Busy':
        return 'warning';
      case 'Offline':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Team Overview
      </Typography>
      <List>
        {teamMembers.map((member, index) => (
          <React.Fragment key={member.id}>
            <ListItem>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {member.avatar}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={member.name}
                secondary={member.role}
              />
              <Chip
                label={member.status}
                size="small"
                color={getStatusColor(member.status) as any}
              />
            </ListItem>
            {index < teamMembers.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'View Schedule',
      icon: <Schedule />,
      action: () => console.log('View Schedule'),
    },
    {
      title: 'Submit Report',
      icon: <Assignment />,
      action: () => console.log('Submit Report'),
    },
    {
      title: 'Team Chat',
      icon: <People />,
      action: () => console.log('Team Chat'),
    },
    {
      title: 'View Analytics',
      icon: <TrendingUp />,
      action: () => console.log('View Analytics'),
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
      title: 'New Task Assigned',
      message: 'You have been assigned a new administrative task',
      time: '1 hour ago',
      type: 'task',
    },
    {
      id: 2,
      title: 'Meeting Reminder',
      message: 'Team meeting in 30 minutes',
      time: '2 hours ago',
      type: 'meeting',
    },
    {
      id: 3,
      title: 'System Update',
      message: 'New features available in the system',
      time: '1 day ago',
      type: 'system',
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

const StaffDashboard: React.FC = () => {
  const { isMobile } = useDashboard();

  return (
    <PermissionGate resource="dashboard" action="view">
      <DashboardLayout>
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          <Typography variant="h4" gutterBottom>
            Staff Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            {/* Work Overview */}
            <Grid item xs={12} lg={6}>
              <WorkOverview />
            </Grid>
            
            {/* Today's Schedule */}
            <Grid item xs={12} lg={6}>
              <TodaySchedule />
            </Grid>
            
            {/* Pending Tasks */}
            <Grid item xs={12} md={6}>
              <PendingTasks />
            </Grid>
            
            {/* Team Overview */}
            <Grid item xs={12} md={6}>
              <TeamOverview />
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

export default StaffDashboard;
