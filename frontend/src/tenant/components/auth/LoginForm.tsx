import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Paper,
  Chip,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Person,
  PersonOutline,
  Groups,
  SupervisorAccount,
  AccountBalance,
  Security,
  Warning,
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
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: yup.boolean(),
});

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface TenantLoginFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

// Role configurations
const roleConfigs = {
  admin: {
    label: 'School Administrator',
    icon: SupervisorAccount,
    color: '#1976d2',
    description: 'Complete school management access',
  },
  teacher: {
    label: 'Teacher',
    icon: Person,
    color: '#388e3c',
    description: 'Class and student management',
  },
  student: {
    label: 'Student',
    icon: PersonOutline,
    color: '#f57c00',
    description: 'Academic progress and assignments',
  },
  parent: {
    label: 'Parent',
    icon: Groups,
    color: '#7b1fa2',
    description: 'Child monitoring and communication',
  },
  staff: {
    label: 'Staff Member',
    icon: AccountBalance,
    color: '#5d4037',
    description: 'Administrative and support functions',
  },
};

const TenantLoginForm: React.FC<TenantLoginFormProps> = ({
  onSuccess,
  redirectPath = '/dashboard',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loginMutation, { isLoading, error }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [tenantInfo, setTenantInfo] = useState<{
    name: string;
    subdomain: string;
    logo?: string;
    primaryColor?: string;
  } | null>(null);
  const [recentUsers, setRecentUsers] = useState<
    Array<{
      email: string;
      role: string;
      name: string;
      lastLogin: Date;
    }>
  >([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    setValue,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Extract subdomain and fetch tenant info
  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    // Skip subdomain detection for localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setTenantInfo({
        name: 'Demo School',
        subdomain: 'demo',
        primaryColor: '#1976d2',
      });
    } else {
      // Fetch tenant information based on subdomain
      fetchTenantInfo(subdomain);
    }

    // Load recent users from localStorage
    const stored = localStorage.getItem(`recentUsers_${subdomain}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentUsers(parsed.slice(0, 3)); // Show only last 3 users
      } catch (e) {
        console.error('Failed to parse recent users:', e);
      }
    }
  }, []);

  const fetchTenantInfo = async (subdomain: string) => {
    try {
      // Mock API call - in real implementation, fetch from API
      const mockTenantData = {
        name: 'Bright Future Academy',
        subdomain,
        logo: null,
        primaryColor: '#1976d2',
      };
      setTenantInfo(mockTenantData);
    } catch (error) {
      console.error('Failed to fetch tenant info:', error);
      setTenantInfo({
        name: 'School Portal',
        subdomain,
      });
    }
  };

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

      // Validate that user belongs to this tenant
      if (result.user.school?.tenant?.subdomain !== tenantInfo?.subdomain) {
        setError('email', {
          type: 'manual',
          message: 'This account does not have access to this school portal.',
        });
        setLoginAttempts(prev => prev + 1);
        return;
      }

      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('remember_me', 'true');
        localStorage.setItem('last_email', data.email);
      }

      // Update recent users
      const updatedRecentUsers = [
        {
          email: data.email,
          role: result.user.role,
          name: `${result.user.first_name} ${result.user.last_name}`,
          lastLogin: new Date(),
        },
        ...recentUsers.filter(u => u.email !== data.email),
      ].slice(0, 3);

      localStorage.setItem(
        `recentUsers_${tenantInfo?.subdomain}`,
        JSON.stringify(updatedRecentUsers)
      );

      // Reset login attempts on success
      setLoginAttempts(0);

      // Role-based redirection
      const roleRedirects = {
        admin: '/admin/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        staff: '/staff/dashboard',
      };

      const redirectTo =
        roleRedirects[result.user.role as keyof typeof roleRedirects] || redirectPath;
      const from = (location.state as any)?.from?.pathname || redirectTo;

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
          message: 'Account is temporarily locked. Please contact your school administrator.',
        });
      } else if (err.status === 403) {
        setError('email', {
          type: 'manual',
          message:
            'Your account access has been suspended. Please contact your school administrator.',
        });
      } else {
        setError('email', {
          type: 'manual',
          message: 'Login failed. Please try again or contact support.',
        });
      }
    }
  };

  const handleQuickLogin = (userEmail: string) => {
    setValue('email', userEmail);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!tenantInfo) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

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
      <Grid container maxWidth={1200} spacing={4}>
        {/* School Info Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
                <School sx={{ fontSize: 40, color: 'white' }} />
              </Paper>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                {tenantInfo.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Welcome to your school portal
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                User Roles Supported
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(roleConfigs).map(([key, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: config.color, width: 32, height: 32 }}>
                        <IconComponent sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight={600}>
                          {config.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.description}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Login Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Access your {tenantInfo.name} portal
              </Typography>

              {/* Recent Users */}
              {recentUsers.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Users
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {recentUsers.map(user => {
                      const roleConfig = roleConfigs[user.role as keyof typeof roleConfigs];
                      return (
                        <Chip
                          key={user.email}
                          avatar={
                            <Avatar sx={{ bgcolor: roleConfig?.color }}>
                              {user.name.charAt(0)}
                            </Avatar>
                          }
                          label={`${user.name} (${roleConfig?.label})`}
                          onClick={() => handleQuickLogin(user.email)}
                          clickable
                          size="medium"
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Security Notice */}
              <Alert severity="info" icon={<Security />} sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Secure Access:</strong> This portal is for authorized {tenantInfo.name}{' '}
                  users only. All login attempts are monitored.
                </Typography>
              </Alert>

              {/* Error Messages */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {typeof error === 'string' ? error : 'Login failed. Please try again.'}
                </Alert>
              )}

              {isBlocked && (
                <Alert severity="warning" sx={{ mb: 3 }}>
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
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
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

                  <Button
                    variant="text"
                    onClick={() => navigate('/forgot-password')}
                    disabled={isLoading || isBlocked}
                  >
                    Forgot Password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!isValid || isLoading || isBlocked}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </Box>

              {/* Login Attempts Warning */}
              {loginAttempts > 2 && !isBlocked && (
                <Alert severity="warning" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Security Warning:</strong> {5 - loginAttempts} attempt(s) remaining
                    before temporary lockout.
                  </Typography>
                </Alert>
              )}

              {/* Need Help */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Need help accessing your account?
                </Typography>
                <Button variant="text" onClick={() => navigate('/support')} sx={{ mt: 1 }}>
                  Contact School Support
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TenantLoginForm;
