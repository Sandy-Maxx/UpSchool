import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import { useAcademicService } from './hooks/useAcademicService';

const TeacherAssignment: React.FC = () => {
  const { assignments, subjects } = useAcademicService();

  const subjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  return (
    <PermissionGate resource="academic" action="view">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Teacher Assignments</Typography>
        <Paper>
          <List>
            {assignments.map(a => (
              <ListItem key={a.id} divider>
                <ListItemText
                  primary={`${a.teacherName} — ${subjectName(a.subjectId)}`}
                  secondary={`Class: ${a.classId}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </PermissionGate>
  );
};

export default TeacherAssignment;

