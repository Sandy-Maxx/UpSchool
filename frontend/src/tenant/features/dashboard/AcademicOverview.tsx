import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { School, Class, Book, Assignment, Schedule, TrendingUp, Add } from '@mui/icons-material';

interface GradeLevel {
  id: string;
  name: string;
  classes: number;
  students: number;
  teachers: number;
  subjects: number;
  status: 'active' | 'inactive';
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teachers: number;
  students: number;
  type: 'core' | 'elective' | 'optional';
}

const AcademicOverview: React.FC = () => {
  const theme = useTheme();

  const gradeLevels: GradeLevel[] = [
    {
      id: '1',
      name: 'Grade 9',
      classes: 8,
      students: 240,
      teachers: 12,
      subjects: 8,
      status: 'active',
    },
    {
      id: '2',
      name: 'Grade 10',
      classes: 7,
      students: 210,
      teachers: 10,
      subjects: 8,
      status: 'active',
    },
    {
      id: '3',
      name: 'Grade 11',
      classes: 6,
      students: 180,
      teachers: 8,
      subjects: 7,
      status: 'active',
    },
    {
      id: '4',
      name: 'Grade 12',
      classes: 5,
      students: 150,
      teachers: 7,
      subjects: 7,
      status: 'active',
    },
  ];

  const subjects: Subject[] = [
    {
      id: '1',
      name: 'Mathematics',
      code: 'MATH',
      teachers: 8,
      students: 780,
      type: 'core',
    },
    {
      id: '2',
      name: 'English Literature',
      code: 'ENG',
      teachers: 6,
      students: 780,
      type: 'core',
    },
    {
      id: '3',
      name: 'Physics',
      code: 'PHY',
      teachers: 4,
      students: 420,
      type: 'core',
    },
    {
      id: '4',
      name: 'Computer Science',
      code: 'CS',
      teachers: 3,
      students: 180,
      type: 'elective',
    },
  ];

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case 'core':
        return theme.palette.primary.main;
      case 'elective':
        return theme.palette.success.main;
      case 'optional':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const academicStats = {
    totalGrades: gradeLevels.length,
    totalClasses: gradeLevels.reduce((sum, grade) => sum + grade.classes, 0),
    totalStudents: gradeLevels.reduce((sum, grade) => sum + grade.students, 0),
    totalTeachers: gradeLevels.reduce((sum, grade) => sum + grade.teachers, 0),
    totalSubjects: subjects.length,
    averageClassSize: Math.round(
      gradeLevels.reduce((sum, grade) => sum + grade.students, 0) /
        gradeLevels.reduce((sum, grade) => sum + grade.classes, 0)
    ),
  };

  return (
    <Box>
      {/* Academic Statistics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                <School sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
                {academicStats.totalGrades}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Grade Levels
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  mb: 2,
                }}
              >
                <Class sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
                {academicStats.totalClasses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  mb: 2,
                }}
              >
                <Book sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
                {academicStats.totalSubjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subjects
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  mb: 2,
                }}
              >
                <TrendingUp sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
                {academicStats.averageClassSize}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Class Size
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Grade Levels */}
        <Grid item xs={12} md={6}>
          <Card elevation={1}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Grade Levels
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => console.log('Add grade level')}
                >
                  Add Grade
                </Button>
              </Box>

              <List dense>
                {gradeLevels.map((grade, index) => (
                  <React.Fragment key={grade.id}>
                    <ListItem>
                      <ListItemIcon>
                        <School sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={grade.name}
                        secondary={
                          <Box display="flex" gap={2} mt={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              {grade.classes} Classes
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {grade.students} Students
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {grade.teachers} Teachers
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={grade.status}
                        size="small"
                        color={grade.status === 'active' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </ListItem>
                    {index < gradeLevels.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Subjects */}
        <Grid item xs={12} md={6}>
          <Card elevation={1}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Subjects
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => console.log('Add subject')}
                >
                  Add Subject
                </Button>
              </Box>

              <List dense>
                {subjects.map((subject, index) => (
                  <React.Fragment key={subject.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Book sx={{ color: getSubjectTypeColor(subject.type) }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={subject.name}
                        secondary={
                          <Box display="flex" gap={2} mt={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              Code: {subject.code}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {subject.teachers} Teachers
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {subject.students} Students
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={subject.type}
                        size="small"
                        sx={{
                          bgcolor: alpha(getSubjectTypeColor(subject.type), 0.1),
                          color: getSubjectTypeColor(subject.type),
                          textTransform: 'capitalize',
                        }}
                      />
                    </ListItem>
                    {index < subjects.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AcademicOverview;
