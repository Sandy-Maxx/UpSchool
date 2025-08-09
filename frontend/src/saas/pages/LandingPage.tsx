import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { School, Dashboard, Security, Analytics } from '@mui/icons-material';

const LandingPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold">
              School ERP Platform
            </Typography>
            <Box>
              <Button color="inherit" sx={{ mr: 2 }}>
                Login
              </Button>
              <Button variant="contained" color="secondary">
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Modern School Management Platform
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Comprehensive ERP solution for educational institutions. Manage students, teachers,
              academics, and operations with our cloud-based platform.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button variant="contained" size="large" sx={{ mr: 2 }}>
                Start Free Trial
              </Button>
              <Button variant="outlined" size="large">
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box textAlign="center">
              <School sx={{ fontSize: 200, color: 'primary.main', opacity: 0.3 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Dashboard sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Comprehensive Dashboards
                  </Typography>
                  <Typography color="text.secondary">
                    Role-based dashboards for administrators, teachers, students, and parents.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Advanced Security
                  </Typography>
                  <Typography color="text.secondary">
                    Enterprise-grade RBAC with multi-tenant isolation and data protection.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Analytics sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Analytics & Reports
                  </Typography>
                  <Typography color="text.secondary">
                    Powerful analytics and reporting tools for data-driven decisions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Ready to Transform Your School?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Join thousands of schools already using our platform to streamline their operations.
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2 }}>
          Get Started Today
        </Button>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography textAlign="center">
            © 2024 School ERP Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
