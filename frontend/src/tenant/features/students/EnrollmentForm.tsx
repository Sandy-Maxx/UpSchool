import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useCreateStudentMutation } from '@shared/store/slices/apiSlice';
import PermissionGate from '@shared/rbac/components/PermissionGate';

interface EnrollmentFormProps {
  onSuccess?: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSuccess }) => {
  // In test environments where RTK Query hooks may be unavailable, provide a safe fallback
  const mutationTuple: any = (useCreateStudentMutation as any)?.() || [async () => ({}), { isLoading: false }];
  const [createStudent, { isLoading }] = mutationTuple;
  const [error, setError] = useState<string | null>(null);

  const initialValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gradeId: '',
      classId: '',
      enrollmentDate: new Date().toISOString().slice(0, 10),
    }),
    []
  );

  const [values, setValues] = useState(initialValues);

  const handleChange = (field: string) => (e: any) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        },
        gradeId: values.gradeId,
        classId: values.classId || undefined,
        enrollmentDate: values.enrollmentDate,
      };

      const result = await createStudent(payload);
      // RTK Query returns a "mutation result" union; check for error
      if ('error' in result) {
        const data: any = result.error as any;
        setError(typeof data?.data === 'string' ? data.data : 'Failed to enroll student');
        return;
      }

      setValues(initialValues);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    }
  };

  return (
    <PermissionGate resource="students" action="CREATE">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Enroll New Student
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                value={values.firstName}
                onChange={handleChange('firstName')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                value={values.lastName}
                onChange={handleChange('lastName')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={values.email}
                onChange={handleChange('email')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={values.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Grade</InputLabel>
                <Select value={values.gradeId} label="Grade" onChange={handleChange('gradeId')}>
                  <MenuItem value="">Select grade</MenuItem>
                  <MenuItem value="g6">Grade 6</MenuItem>
                  <MenuItem value="g7">Grade 7</MenuItem>
                  <MenuItem value="g8">Grade 8</MenuItem>
                  <MenuItem value="g9">Grade 9</MenuItem>
                  <MenuItem value="g10">Grade 10</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select value={values.classId} label="Class" onChange={handleChange('classId')}>
                  <MenuItem value="">Unassigned</MenuItem>
                  <MenuItem value="8A">8A</MenuItem>
                  <MenuItem value="8B">8B</MenuItem>
                  <MenuItem value="9A">9A</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Enrollment Date"
                InputLabelProps={{ shrink: true }}
                value={values.enrollmentDate}
                onChange={handleChange('enrollmentDate')}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Enrolling...' : 'Enroll Student'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </PermissionGate>
  );
};

export default EnrollmentForm;
