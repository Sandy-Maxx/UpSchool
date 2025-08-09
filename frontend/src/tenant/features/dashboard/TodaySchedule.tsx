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
import { Schedule, Class, People, LocationOn } from '@mui/icons-material';

interface ScheduleItem {
  id: number;
  time: string;
  subject: string;
  class: string;
  room: string;
  students: number;
}

interface TodayScheduleProps {
  schedule: ScheduleItem[];
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ schedule }) => {
  const theme = useTheme();

  const getTimeColor = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 10) return theme.palette.primary.main;
    if (hour < 12) return theme.palette.success.main;
    if (hour < 15) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const getTimeStatus = (time: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [startHour] = time.split(':').map(Number);

    if (startHour < currentHour) return 'completed';
    if (startHour === currentHour) return 'current';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.palette.grey[500];
      case 'current':
        return theme.palette.success.main;
      case 'upcoming':
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <List dense>
      {schedule.map((item, index) => {
        const status = getTimeStatus(item.time);
        const statusColor = getStatusColor(status);

        return (
          <ListItem
            key={item.id}
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
                  width: 40,
                  height: 40,
                  bgcolor: alpha(getTimeColor(item.time), 0.1),
                  color: getTimeColor(item.time),
                }}
              >
                <Schedule sx={{ fontSize: 20 }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1" fontWeight="medium">
                    {item.time}
                  </Typography>
                  <Chip
                    label={status}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      bgcolor: alpha(statusColor, 0.1),
                      color: statusColor,
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" fontWeight="medium" color="text.primary">
                    {item.subject} - {item.class}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {item.room}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <People sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {item.students} students
                      </Typography>
                    </Box>
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

export default TodaySchedule;
