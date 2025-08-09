import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Security,
  Business,
} from '@mui/icons-material';
import { useAppDispatch } from '../../../shared/store/hooks';
import { login } from '../../../shared/store/slices/authSlice';
import { useLoginMutation } from '../../../shared/store/slices/apiSlice';

// Validation schema
const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: yup.boolean(),
});

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

const SaaSLoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectPath = '/dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loginMutation, { isLoading, error }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Handle login blocking after failed attempts
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true);
      setBlockTimeRemaining(300); // 5 minutes
      const interval = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loginAttempts]);

  const onSubmit = async (data: LoginFormData) => {
    if (isBlocked) return;

    try {
      const result = await loginMutation({
        email: data.email,
        password: data.password,
      }).unwrap();

      // Check if user has superadmin role
      if (result.user.role !== 'superadmin') {
        setError('email', {
          type: 'manual',
          message: 'Access denied. This portal is for system administrators only.',
        });
        setLoginAttempts(prev => prev + 1);
        return;
      }

      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }

      // Reset login attempts on success
      setLoginAttempts(0);

      // Redirect to intended page or dashboard
      const from = (location.state as any)?.from?.pathname || redirectPath;

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginAttempts(prev => prev + 1);

      // Handle specific error types
      if (err.status === 401) {
        setError('password', {
          type: 'manual',
          message: 'Invalid credentials. Please check your email and password.',
        });
      } else if (err.status === 423) {
        setError('email', {
          type: 'manual',
          message: 'Account is locked. Please contact support.',
        });
      } else {
        setError('email', {
          type: 'manual',
          message: 'Login failed. Please try again.',
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Paper
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />
            </Paper>

            <Typography variant="h4" fontWeight={700} gutterBottom>
              System Admin Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access the platform management dashboard
            </Typography>
          </Box>

          {/* Security Notice */}
          <Alert severity="info" icon={<Security />} sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Secure Access:</strong> This portal is for authorized system administrators
              only. All login attempts are monitored and logged.
            </Typography>
          </Alert>

          {/* Error Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {typeof error === 'string' ? error : 'Login failed. Please try again.'}
            </Alert>
          )}

          {isBlocked && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Account temporarily locked</strong>
                <br />
                Too many failed attempts. Please try again in {formatTime(blockTimeRemaining)}.
              </Typography>
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading || isBlocked}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isLoading || isBlocked}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading || isBlocked}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        disabled={isLoading || isBlocked}
                      />
                    }
                    label="Remember me"
                  />
                )}
              />

              <Link
                to="/auth/forgot-password"
                style={{
                  textDecoration: 'none',
                  color: '#667eea',
                  fontSize: '0.875rem',
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isValid || isLoading || isBlocked}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In to Admin Portal'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Platform Information
            </Typography>
          </Divider>

          {/* Platform Info */}
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Business sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Multi-Tenant School ERP Platform
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              System Administrator Access Portal
            </Typography>
          </Box>

          {/* Login Attempts Warning */}
          {loginAttempts > 2 && !isBlocked && (
            <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Security Warning:</strong> {5 - loginAttempts} attempt(s) remaining before
                temporary lockout.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SaaSLoginForm;
