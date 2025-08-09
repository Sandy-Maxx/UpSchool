import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Link,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  onForgotPassword: () => void;
  onRegisterClick: () => void;
}

interface LoginFormData {
  subdomain: string;
  email: string;
  password: string;
  remember_me: boolean;
}

const validationSchema = Yup.object({
  subdomain: Yup.string()
    .required('School subdomain is required')
    .min(3, 'Subdomain must be at least 3 characters')
    .matches(/^[a-z0-9]+([a-z0-9-]*[a-z0-9]+)?$/, 'Invalid subdomain format'),
  email: Yup.string().required('Email is required').email('Please enter a valid email address'),
  password: Yup.string().required('Password is required').min(1, 'Password is required'),
});

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onSuccess,
  onForgotPassword,
  onRegisterClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'subdomain' | 'credentials'>('subdomain');

  const formik = useFormik<LoginFormData>({
    initialValues: {
      subdomain: '',
      email: '',
      password: '',
      remember_me: false,
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      setError(null);

      try {
        // First, verify the subdomain exists
        if (step === 'subdomain') {
          const subdomainResponse = await fetch(
            `/api/v1/public/check-subdomain/?subdomain=${values.subdomain}`
          );
          const subdomainData = await subdomainResponse.json();

          if (!subdomainData.exists) {
            throw new Error(
              'School not found. Please check your subdomain or contact your administrator.'
            );
          }

          setStep('credentials');
          setLoading(false);
          return;
        }

        // Perform login
        const loginResponse = await fetch('/api/v1/accounts/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Subdomain': values.subdomain,
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            remember_me: values.remember_me,
          }),
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json();

          if (loginResponse.status === 401) {
            throw new Error(
              'Invalid email or password. Please check your credentials and try again.'
            );
          } else if (loginResponse.status === 403) {
            throw new Error('Your account is not active. Please contact your administrator.');
          } else if (loginResponse.status === 429) {
            throw new Error(
              'Too many login attempts. Please wait a few minutes before trying again.'
            );
          } else {
            throw new Error(errorData.message || 'Login failed. Please try again.');
          }
        }

        const userData = await loginResponse.json();

        // Store authentication data
        localStorage.setItem('auth_token', userData.access_token);
        localStorage.setItem('refresh_token', userData.refresh_token);
        localStorage.setItem('user_data', JSON.stringify(userData.user));
        localStorage.setItem('tenant_subdomain', values.subdomain);

        // Redirect to the tenant's subdomain
        const tenantUrl = `https://${values.subdomain}.upclass.com`;
        if (process.env.NODE_ENV === 'development') {
          // In development, we might handle this differently
          onSuccess(userData);
        } else {
          window.location.href = tenantUrl;
        }
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleBack = () => {
    setStep('subdomain');
    setError(null);
  };

  const handleForgotPassword = () => {
    onClose();
    onForgotPassword();
  };

  const handleRegisterClick = () => {
    onClose();
    onRegisterClick();
  };

  const renderSubdomainStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <SchoolIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Access Your School
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Enter your school's subdomain to get started
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="School Subdomain"
        name="subdomain"
        value={formik.values.subdomain}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.subdomain && Boolean(formik.errors.subdomain)}
        helperText={
          (formik.touched.subdomain && formik.errors.subdomain) ||
          'Enter the subdomain provided by your school administrator'
        }
        placeholder="yourschool"
        InputProps={{
          startAdornment: (
            <Typography color="textSecondary" sx={{ mr: 1 }}>
              https://
            </Typography>
          ),
          endAdornment: <Typography color="textSecondary">.upclass.com</Typography>,
        }}
        sx={{ mb: 3 }}
        autoFocus
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !formik.values.subdomain}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
          mb: 3,
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Checking...
          </>
        ) : (
          'Continue'
        )}
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="textSecondary">
          Don't have a school platform yet?
        </Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleRegisterClick}
        sx={{
          borderColor: '#667eea',
          color: '#667eea',
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          '&:hover': {
            borderColor: '#764ba2',
            backgroundColor: 'rgba(102, 126, 234, 0.05)',
          },
        }}
      >
        Create New School Platform
      </Button>
    </motion.div>
  );

  const renderCredentialsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <LoginIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Sign in to {formik.values.subdomain}.upclass.com
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        InputProps={{
          startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
        }}
        sx={{ mb: 3 }}
        autoFocus
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        InputProps={{
          startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={handleForgotPassword}
          sx={{ textDecoration: 'none', color: '#667eea', cursor: 'pointer' }}
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
          mb: 2,
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={handleBack}
        sx={{
          color: '#667eea',
          py: 1,
        }}
      >
        ← Back to School Selection
      </Button>
    </motion.div>
  );

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '500px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            Sign In to UpClass
          </Typography>
          {!loading && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: 4, pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          {step === 'subdomain' ? renderSubdomainStep() : renderCredentialsStep()}
        </form>

        {step === 'subdomain' && (
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2} sx={{ textAlign: 'center' }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Need help finding your school?
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Link
                  href="mailto:support@upclass.com"
                  sx={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Contact Support
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link
                  href="/schools"
                  sx={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  Browse Schools
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
