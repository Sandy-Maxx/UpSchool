import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import { useAcademicService } from './hooks/useAcademicService';

const ExamScheduler: React.FC = () => {
  const { exams, subjects } = useAcademicService();
  const subjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  return (
    <PermissionGate resource="academic" action="view">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Exam Schedule</Typography>
        <Paper>
          <List>
            {exams.map(ex => (
              <ListItem key={ex.id} divider>
                <ListItemText
                  primary={`${ex.title} — ${subjectName(ex.subjectId)}`}
                  secondary={`${ex.date} • ${ex.startTime}-${ex.endTime}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </PermissionGate>
  );
};

export default ExamScheduler;

