import React from 'react';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import { useAcademicService } from './hooks/useAcademicService';

const TimetableGenerator: React.FC = () => {
  const { timetable, subjects } = useAcademicService();
  const subjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  return (
    <PermissionGate resource="academic" action="view">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Timetable</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Subject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timetable.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.classId}</TableCell>
                  <TableCell>{t.day}</TableCell>
                  <TableCell>{t.startTime} - {t.endTime}</TableCell>
                  <TableCell>{subjectName(t.subjectId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </PermissionGate>
  );
};

export default TimetableGenerator;

