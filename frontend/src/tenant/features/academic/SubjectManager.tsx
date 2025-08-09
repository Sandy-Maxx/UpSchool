import React from 'react';
import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import { useAcademicService } from './hooks/useAcademicService';

const SubjectManager: React.FC = () => {
  const { subjects } = useAcademicService();

  return (
    <PermissionGate resource="academic" action="view">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Subject Catalog</Typography>
        <Grid container spacing={2}>
          {subjects.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{s.name}</Typography>
                {s.code && (
                  <Chip label={s.code} size="small" sx={{ mt: 1 }} />
                )}
                {s.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {s.description}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PermissionGate>
  );
};

export default SubjectManager;

