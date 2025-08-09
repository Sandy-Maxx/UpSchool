import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Search, PersonAdd, Close } from '@mui/icons-material';
import { useGetStudentsQuery } from '@shared/store/slices/apiSlice';
import PermissionGate from '@shared/rbac/components/PermissionGate';
import StudentDirectory from '@tenant/features/students/StudentDirectory';
import EnrollmentForm from '@tenant/features/students/EnrollmentForm';

const StudentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openEnroll, setOpenEnroll] = useState(false);
  const [page, setPage] = useState(1);

  const { refetch } = useGetStudentsQuery({ page, limit: 10, search });

  const handleEnrollSuccess = () => {
    setOpenEnroll(false);
    refetch();
  };

  return (
    <PermissionGate resource="students" action="VIEW">
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Students</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search students"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <PermissionGate resource="students" action="CREATE">
              <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setOpenEnroll(true)}>
                Enroll Student
              </Button>
            </PermissionGate>
          </Grid>
        </Grid>

        <StudentDirectory
          page={page}
          rowsPerPage={10}
          search={search}
          onPageChange={setPage}
          onRowsPerPageChange={() => {}}
        />

        <Dialog open={openEnroll} onClose={() => setOpenEnroll(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Enroll Student
            <IconButton onClick={() => setOpenEnroll(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <EnrollmentForm onSuccess={handleEnrollSuccess} />
          </DialogContent>
        </Dialog>
      </Box>
    </PermissionGate>
  );
};

export default StudentsPage;
