import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import { useAcademicService } from './hooks/useAcademicService';

const AcademicCalendar: React.FC = () => {
  const { calendar } = useAcademicService();

  return (
    <PermissionGate resource="academic" action="view">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Academic Calendar</Typography>
        <Paper>
          <List>
            {calendar.map(ev => (
              <ListItem key={ev.id} divider>
                <ListItemText
                  primary={`${ev.title} (${ev.type})`}
                  secondary={ev.date}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </PermissionGate>
  );
};

export default AcademicCalendar;

