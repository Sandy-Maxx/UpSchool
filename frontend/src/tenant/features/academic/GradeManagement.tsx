import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Chip, Grid } from '@mui/material';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import { useAcademicService } from './hooks/useAcademicService';

const GradeManagement: React.FC = () => {
  const { grades } = useAcademicService();

  return (
    <PermissionGate resource="academic" action="view">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Grade Management</Typography>
        <Grid container spacing={2}>
          {grades.map((g) => (
            <Grid item xs={12} sm={6} md={4} key={g.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{g.name}</Typography>
                <Typography variant="body2" color="text.secondary">Order: {g.order}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {g.sections.map((s) => (
                    <Chip key={s} label={`Section ${s}`} size="small" />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PermissionGate>
  );
};

export default GradeManagement;

