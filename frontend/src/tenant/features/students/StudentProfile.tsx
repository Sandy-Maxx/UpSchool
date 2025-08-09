import React from 'react';
import { Box, Paper, Typography, Grid, Chip, Avatar, Tabs, Tab } from '@mui/material';
import { useGetStudentQuery, useGetStudentAttendanceQuery, useGetStudentGradesQuery } from '@shared/store/slices/apiSlice';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import { useParams } from 'react-router-dom';

const StudentProfile: React.FC<{ id?: string | number }> = ({ id }) => {
  const params = useParams();
  const effectiveId = id ?? (params.id as string);
  const { data, isLoading, error } = useGetStudentQuery(effectiveId!);
  const { data: attendance } = useGetStudentAttendanceQuery({ id: effectiveId! }, { skip: !effectiveId });
  const { data: grades } = useGetStudentGradesQuery({ id: effectiveId! }, { skip: !effectiveId });

  if (isLoading) return <Typography>Loading profile...</Typography>;
  if (error) return <Typography color="error">Failed to load profile</Typography>;
  if (!data) return null;

  const student = data as any;
  const fullName = `${student?.user?.firstName ?? ''} ${student?.user?.lastName ?? ''}`.trim();
  const [tab, setTab] = React.useState(0);

  return (
    <PermissionGate resource="students" action="VIEW">
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
            {fullName
              .split(' ')
              .filter(Boolean)
              .map((n: string) => n[0])
              .join('')}
          </Avatar>
          <Box>
            <Typography variant="h6">{fullName || 'Student'}</Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {student?.studentId}
            </Typography>
          </Box>
          <Box flex={1} />
          <Chip label={student?.status ?? 'active'} size="small" color="success" />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Personal Info
              </Typography>
              <Typography variant="body2">Email: {student?.user?.email}</Typography>
              {student?.user?.phone && (
                <Typography variant="body2">Phone: {student.user.phone}</Typography>
              )}
              {student?.grade?.name && (
                <Typography variant="body2">Grade: {student.grade.name}</Typography>
              )}
              {student?.class?.name && (
                <Typography variant="body2">Class: {student.class.name}</Typography>
              )}
              {student?.enrollmentDate && (
                <Typography variant="body2">
                  Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Academic Record
              </Typography>
              <Typography variant="body2">
                GPA: {student?.academicRecord?.gpa ?? '-'}
              </Typography>
              <Typography variant="body2">
                Attendance: {student?.academicRecord?.attendance?.present ?? 0} present /
                {` ${student?.academicRecord?.attendance?.absent ?? 0}`} absent
              </Typography>
              {student?.academicRecord?.totalCredits != null && (
                <Typography variant="body2">
                  Credits: {student.academicRecord.totalCredits}
                </Typography>
              )}
              {Array.isArray(grades) && grades.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Recent Grades</Typography>
                  {grades.slice(0, 3).map((g: any, idx: number) => (
                    <Typography key={idx} variant="body2" color="text.secondary">
                      {g.subject?.name || g.subject}: {g.score ?? g.grade}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 0 }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="student tabs">
                <Tab label="Attendance" />
                <Tab label="Grades" />
              </Tabs>
              <Box sx={{ p: 2 }}>
                {tab === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Present: {attendance?.present ?? 0} • Absent: {attendance?.absent ?? 0} • Late: {attendance?.late ?? 0}
                  </Typography>
                )}
                {tab === 1 && (
                  <Typography variant="body2" color="text.secondary">
                    {Array.isArray(grades) && grades.length > 0 ? 'Recent grades listed above.' : 'No grades data'}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </PermissionGate>
  );
};

export default StudentProfile;
