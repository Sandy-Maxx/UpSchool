import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { Security, Home } from '@mui/icons-material';
import { TenantSecurityAuditLog } from '../components/security';
import { useAuth } from '../../shared/store/hooks';
import { Navigate } from 'react-router-dom';

const TenantSecurityDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated or not admin/staff role
  if (!isAuthenticated || !user) {
    return <Navigate to="/tenant/auth" replace />;
  }

  // Only allow admin and staff to access security dashboard
  if (user.role !== 'admin' && user.role !== 'staff') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Security sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Access Restricted
          </Typography>
          <Typography color="text.secondary">
            You don't have permission to access the security dashboard. This area is restricted to
            administrators and staff members only.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/tenant/dashboard"
            >
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Link>
            <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
              <Security sx={{ mr: 0.5 }} fontSize="inherit" />
              Security
            </Typography>
          </Breadcrumbs>

          <Typography variant="h4" component="h1" fontWeight="bold">
            Security Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Monitor and analyze security events across your school portal
          </Typography>
        </Box>

        {/* Security Audit Log */}
        <TenantSecurityAuditLog />
      </Container>
    </Box>
  );
};

export default TenantSecurityDashboardPage;
