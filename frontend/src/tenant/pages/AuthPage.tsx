import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { School, Security, VpnKey } from '@mui/icons-material';
import { LoginForm, PasswordResetForm } from '../components/auth';
import { useAuth } from '../../shared/store/hooks';
import { Navigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const TenantAuthPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tenantInfo, setTenantInfo] = useState<{
    name: string;
    subdomain: string;
    logo?: string;
  } | null>(null);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const roleRedirects = {
      admin: '/tenant/admin/dashboard',
      teacher: '/tenant/teacher/dashboard',
      student: '/tenant/student/dashboard',
      parent: '/tenant/parent/dashboard',
      staff: '/tenant/staff/dashboard',
    };
    return (
      <Navigate
        to={roleRedirects[user.role as keyof typeof roleRedirects] || '/tenant/dashboard'}
        replace
      />
    );
  }

  // Extract tenant info from subdomain or use demo data for localhost
  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Demo tenant for development
      setTenantInfo({
        name: 'Greenfield High School',
        subdomain: 'greenfield-hs',
        logo: undefined,
      });
    } else if (subdomain && subdomain !== 'www') {
      // Extract tenant from subdomain in production
      // This would normally fetch from an API
      setTenantInfo({
        name: `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} School`,
        subdomain: subdomain,
        logo: undefined,
      });
    } else {
      // Fallback for direct domain access
      setTenantInfo({
        name: 'School Portal',
        subdomain: 'demo',
        logo: undefined,
      });
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <School
                  sx={{
                    fontSize: { xs: 40, md: 48 },
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography
                  variant={isMobile ? 'h4' : 'h3'}
                  component="h1"
                  fontWeight="bold"
                  color="primary"
                >
                  {tenantInfo.name}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Welcome to your school portal. Sign in to access your dashboard, manage classes,
                view grades, and connect with your school community.
              </Typography>
            </Box>

            {/* Main Auth Card */}
            <Paper
              elevation={8}
              sx={{
                maxWidth: 500,
                mx: 'auto',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'background.paper',
              }}
            >
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{ bgcolor: 'grey.50' }}
                >
                  <Tab
                    icon={<VpnKey />}
                    label="Sign In"
                    id="auth-tab-0"
                    aria-controls="auth-tabpanel-0"
                    sx={{ py: 2 }}
                  />
                  <Tab
                    icon={<Security />}
                    label="Reset Password"
                    id="auth-tab-1"
                    aria-controls="auth-tabpanel-1"
                    sx={{ py: 2 }}
                  />
                </Tabs>
              </Box>

              {/* Tab Panels */}
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <TabPanel value={activeTab} index={0}>
                  <LoginForm onSwitchToReset={() => setActiveTab(1)} />
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  <PasswordResetForm onBackToLogin={() => setActiveTab(0)} />
                </TabPanel>
              </Box>
            </Paper>

            {/* Security Notice */}
            <Card sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
              <CardContent sx={{ py: 2 }}>
                <Alert severity="info" sx={{ border: 'none', bgcolor: 'transparent' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    <strong>Security Notice:</strong> Your session is protected by enterprise-grade
                    security. All activities are logged for audit purposes. If you're having trouble
                    accessing your account, please contact your school administrator.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Powered by School Management Platform
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tenant: {tenantInfo.subdomain} | Secure Connection Established
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default TenantAuthPage;
