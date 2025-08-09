import React from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { useGetStudentGradesQuery } from '@shared/store/slices/apiSlice';

const gradeColor = (score?: number) => {
  if (score == null) return 'default';
  if (score >= 85) return 'success';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warning';
  return 'error';
};

const StudentGrades: React.FC<{ id: string | number }> = ({ id }) => {
  const { data, isLoading, error } = useGetStudentGradesQuery({ id });

  if (isLoading) return <Typography>Loading grades...</Typography>;
  if (error) return <Typography color="error">Failed to load grades</Typography>;

  const items = Array.isArray(data) ? data : [];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Academic Records
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>Assessment</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((g: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{g.subject?.name || g.subject || '-'}</TableCell>
              <TableCell>{g.assessment || g.type || '-'}</TableCell>
              <TableCell>
                <Chip label={g.score ?? g.grade ?? '-'} size="small" color={gradeColor(g.score) as any} />
              </TableCell>
              <TableCell>{g.date ? new Date(g.date).toLocaleDateString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StudentGrades;
