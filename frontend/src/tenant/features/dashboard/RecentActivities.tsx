import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PersonAdd,
  School,
  Assignment,
  Assessment,
  Notifications,
  Payment,
  Security,
  Settings,
} from '@mui/icons-material';

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const theme = useTheme();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'student_enrollment':
        return <PersonAdd sx={{ fontSize: 20 }} />;
      case 'grade_update':
        return <Assessment sx={{ fontSize: 20 }} />;
      case 'attendance':
        return <School sx={{ fontSize: 20 }} />;
      case 'teacher_assignment':
        return <Assignment sx={{ fontSize: 20 }} />;
      case 'notification':
        return <Notifications sx={{ fontSize: 20 }} />;
      case 'payment':
        return <Payment sx={{ fontSize: 20 }} />;
      case 'security':
        return <Security sx={{ fontSize: 20 }} />;
      case 'settings':
        return <Settings sx={{ fontSize: 20 }} />;
      default:
        return <School sx={{ fontSize: 20 }} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'student_enrollment':
        return theme.palette.primary.main;
      case 'grade_update':
        return theme.palette.success.main;
      case 'attendance':
        return theme.palette.info.main;
      case 'teacher_assignment':
        return theme.palette.warning.main;
      case 'notification':
        return theme.palette.secondary.main;
      case 'payment':
        return theme.palette.success.main;
      case 'security':
        return theme.palette.error.main;
      case 'settings':
        return theme.palette.grey[600];
      default:
        return theme.palette.grey[500];
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'student_enrollment':
        return 'Enrollment';
      case 'grade_update':
        return 'Grade Update';
      case 'attendance':
        return 'Attendance';
      case 'teacher_assignment':
        return 'Assignment';
      case 'notification':
        return 'Notification';
      case 'payment':
        return 'Payment';
      case 'security':
        return 'Security';
      case 'settings':
        return 'Settings';
      default:
        return 'Activity';
    }
  };

  return (
    <List dense>
      {activities.map((activity, index) => {
        const color = getActivityColor(activity.type);

        return (
          <ListItem
            key={activity.id}
            sx={{
              px: 0,
              py: 1,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                borderRadius: 1,
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: alpha(color, 0.1),
                  color: color,
                }}
              >
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="medium">
                    {activity.title}
                  </Typography>
                  <Chip
                    label={getActivityTypeLabel(activity.type)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      bgcolor: alpha(color, 0.1),
                      color: color,
                      fontWeight: 'medium',
                    }}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {activity.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      by {activity.user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.timestamp}
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default RecentActivities;
