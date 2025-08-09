import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Fingerprint as FingerprintIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/shared/contexts/AuthContext';

interface SuperAdminLoginProps {
  onLogin?: (credentials: { username: string; password: string }) => void;
  redirectTo?: string;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
}

export const SuperAdminLogin: React.FC<SuperAdminLoginProps> = ({
  onLogin,
  redirectTo = '/saas/admin',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { login, isAuthenticated } = useAuth();

  // Form state
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Security state
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  // Security monitoring
  const [recentSecurityEvents, setRecentSecurityEvents] = useState<SecurityEvent[]>([]);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const timeLeft = Math.max(0, lockoutTime.getTime() - now.getTime());
        setRemainingTime(Math.ceil(timeLeft / 1000));

        if (timeLeft <= 0) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleInputChange = (field: 'username' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (isLocked) {
      setError(`Account temporarily locked. Please try again in ${remainingTime} seconds.`);
      return;
    }

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log security event
      const securityEvent: SecurityEvent = {
        id: Date.now().toString(),
        event_type: 'LOGIN_ATTEMPT',
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1', // Would come from backend
        user_agent: navigator.userAgent,
      };
      setRecentSecurityEvents(prev => [securityEvent, ...prev.slice(0, 4)]);

      // Attempt login
      if (onLogin) {
        await onLogin(credentials);
      } else {
        await login(credentials);
      }

      // Success - redirect or handle success
      if (isAuthenticated) {
        window.location.href = redirectTo;
      }

    } catch (err: any) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);

      // Enhanced error handling
      let errorMessage = 'Authentication failed. Please check your credentials.';
      
      if (err.message?.includes('invalid_credentials')) {
        errorMessage = 'Invalid username or password.';
      } else if (err.message?.includes('account_locked')) {
        errorMessage = 'Account has been locked due to security policies.';
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);

      // Implement progressive lockout
      if (attempts >= 5) {
        const lockoutMinutes = Math.min(30, Math.pow(2, attempts - 5)); // Progressive lockout
        const lockoutUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
        setIsLocked(true);
        setLockoutTime(lockoutUntil);
        setError(`Too many failed attempts. Account locked for ${lockoutMinutes} minutes.`);
      } else if (attempts >= 3) {
        setError(`${errorMessage} ${5 - attempts} attempts remaining.`);
      }

      // Log failed attempt
      const failedEvent: SecurityEvent = {
        id: Date.now().toString(),
        event_type: 'LOGIN_FAILED',
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
      };
      setRecentSecurityEvents(prev => [failedEvent, ...prev.slice(0, 4)]);

    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="stretch">
        
        {/* Main Login Form */}
        <Box flex={1} display="flex" alignItems="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 4,
                maxWidth: 500,
                mx: 'auto',
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}05 100%)`,
                border: `1px solid ${theme.palette.primary.main}20`,
              }}
            >
              {/* Header */}
              <Box textAlign="center" mb={4}>
                <AdminIcon
                  sx={{
                    fontSize: 64,
                    color: theme.palette.primary.main,
                    mb: 2,
                  }}
                />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  SaaS Admin Portal
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  System Administrator Access
                </Typography>
                <Chip
                  icon={<ShieldIcon />}
                  label="Enhanced Security"
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Security Alert */}
              {(loginAttempts > 2 || isLocked) && (
                <Alert 
                  severity={isLocked ? "error" : "warning"} 
                  sx={{ mb: 3 }}
                  icon={<LockIcon />}
                >
                  <Typography variant="body2">
                    {isLocked
                      ? `Account locked. Time remaining: ${formatTimeRemaining(remainingTime)}`
                      : `${loginAttempts}/5 login attempts used. Account will be locked after 5 failed attempts.`
                    }
                  </Typography>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Username / Email"
                    type="email"
                    value={credentials.username}
                    onChange={handleInputChange('username')}
                    required
                    fullWidth
                    disabled={loading || isLocked}
                    autoComplete="username"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AdminIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    required
                    fullWidth
                    disabled={loading || isLocked}
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading || isLocked}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || isLocked || !credentials.username || !credentials.password}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      },
                    }}
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
                  </Button>

                  {loading && <LinearProgress />}
                </Stack>
              </Box>

              {/* Security Features */}
              <Divider sx={{ my: 3 }} />
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Security Features Active
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                  <Chip icon={<FingerprintIcon />} label="IP Tracking" size="small" variant="outlined" />
                  <Chip icon={<ShieldIcon />} label="Brute Force Protection" size="small" variant="outlined" />
                  <Chip icon={<LockIcon />} label="Session Security" size="small" variant="outlined" />
                </Stack>
              </Box>
            </Paper>
          </motion.div>
        </Box>

        {/* Security Dashboard */}
        <Box flex={{ xs: 0, md: 0.4 }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" />
                  Security Monitor
                </Typography>
                
                {/* Current Status */}
                <Box mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Session Status
                  </Typography>
                  <Chip
                    label={isAuthenticated ? "Authenticated" : "Not Authenticated"}
                    color={isAuthenticated ? "success" : "default"}
                    size="small"
                  />
                  {loginAttempts > 0 && (
                    <Chip
                      label={`${loginAttempts} login attempts`}
                      color={loginAttempts > 2 ? "error" : "warning"}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>

                {/* Recent Security Events */}
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Recent Security Events
                </Typography>
                <Stack spacing={1} sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {recentSecurityEvents.length > 0 ? (
                    recentSecurityEvents.map((event) => (
                      <Paper
                        key={event.id}
                        variant="outlined"
                        sx={{ p: 2 }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {event.event_type.replace('_', ' ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.timestamp).toLocaleString()}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
                      No recent events
                    </Typography>
                  )}
                </Stack>

                {/* System Security Info */}
                <Box mt={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    System Security
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">SSL/TLS</Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Firewall</Typography>
                      <Chip label="Protected" color="success" size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Rate Limiting</Typography>
                      <Chip label={isLocked ? "Locked" : "Active"} color={isLocked ? "error" : "success"} size="small" />
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Container>
  );
};

export default SuperAdminLogin;
