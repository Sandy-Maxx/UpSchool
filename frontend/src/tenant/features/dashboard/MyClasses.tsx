import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import { Class, People, Assignment, Assessment, Schedule } from '@mui/icons-material';

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  grade: string;
  students: number;
  schedule: string;
  room: string;
  pendingAssignments: number;
  averageGrade: number;
  attendanceRate: number;
}

const MyClasses: React.FC = () => {
  const theme = useTheme();

  const classes: ClassInfo[] = [
    {
      id: '1',
      name: 'Grade 10A',
      subject: 'Mathematics',
      grade: '10',
      students: 25,
      schedule: 'Mon, Wed, Fri 8:00 AM',
      room: 'Room 201',
      pendingAssignments: 2,
      averageGrade: 87.5,
      attendanceRate: 96.0,
    },
    {
      id: '2',
      name: 'Grade 9B',
      subject: 'Mathematics',
      grade: '9',
      students: 28,
      schedule: 'Mon, Wed, Fri 9:15 AM',
      room: 'Room 201',
      pendingAssignments: 1,
      averageGrade: 82.3,
      attendanceRate: 94.2,
    },
    {
      id: '3',
      name: 'Grade 11A',
      subject: 'Mathematics',
      grade: '11',
      students: 22,
      schedule: 'Mon, Wed, Fri 10:30 AM',
      room: 'Room 201',
      pendingAssignments: 3,
      averageGrade: 89.1,
      attendanceRate: 97.8,
    },
    {
      id: '4',
      name: 'Grade 10B',
      subject: 'Mathematics',
      grade: '10',
      students: 26,
      schedule: 'Mon, Wed, Fri 1:00 PM',
      room: 'Room 201',
      pendingAssignments: 0,
      averageGrade: 85.7,
      attendanceRate: 95.5,
    },
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return theme.palette.success.main;
    if (grade >= 80) return theme.palette.warning.main;
    if (grade >= 70) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return theme.palette.success.main;
    if (rate >= 90) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Grid container spacing={2}>
      {classes.map(classInfo => (
        <Grid item xs={12} sm={6} md={6} key={classInfo.id}>
          <Card
            elevation={1}
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 2,
                  }}
                >
                  <Class />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {classInfo.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {classInfo.subject}
                  </Typography>
                </Box>
                <Chip
                  label={`Grade ${classInfo.grade}`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {classInfo.students} Students
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {classInfo.schedule}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Class sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {classInfo.room}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <Assignment sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {classInfo.pendingAssignments} Pending
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Assessment sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography
                    variant="body2"
                    sx={{ color: getGradeColor(classInfo.averageGrade) }}
                    fontWeight="medium"
                  >
                    {classInfo.averageGrade}% Avg
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Attendance Rate
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: getAttendanceColor(classInfo.attendanceRate) }}
                  fontWeight="medium"
                >
                  {classInfo.attendanceRate}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MyClasses;
