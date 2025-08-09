import React from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useGetStudentAttendanceQuery } from '@shared/store/slices/apiSlice';

const StudentAttendance: React.FC<{ id: string | number }> = ({ id }) => {
  const { data, isLoading, error } = useGetStudentAttendanceQuery({ id });

  if (isLoading) return <Typography>Loading attendance...</Typography>;
  if (error) return <Typography color="error">Failed to load attendance</Typography>;

  const summary = data || {};
  const records = Array.isArray(summary.records) ? summary.records : [];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Attendance
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Present: {summary.present ?? 0} • Absent: {summary.absent ?? 0} • Late: {summary.late ?? 0}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Remarks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((r: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{r.date ? new Date(r.date).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>{r.remarks || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StudentAttendance;
