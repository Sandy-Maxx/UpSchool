import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Login as LoginIcon,
  Email as EmailIcon,
  Support as SupportIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface RegistrationSuccessProps {
  open: boolean;
  onClose: () => void;
  tenantData: {
    school_name: string;
    subdomain: string;
    admin_email: string;
    plan_type: string;
    trial_days: number;
    login_url: string;
  };
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ open, onClose, tenantData }) => {
  const handleGoToLogin = () => {
    window.open(tenantData.login_url, '_blank');
    onClose();
  };

  const handleContactSupport = () => {
    window.open(
      'mailto:support@upclass.com?subject=New School Setup Help&body=Hi, I just created a new school platform and need assistance getting started.',
      '_blank'
    );
  };

  const nextSteps = [
    {
      title: 'Check Your Email',
      description: "We've sent login credentials and setup instructions to your email address.",
      icon: <EmailIcon color="primary" />,
      action: 'Check Email',
      actionUrl: 'https://mail.google.com',
    },
    {
      title: 'Access Your Platform',
      description: 'Sign in to your new school platform and start exploring the features.',
      icon: <LoginIcon color="primary" />,
      action: 'Go to Platform',
      actionUrl: tenantData.login_url,
    },
    {
      title: 'Get Support',
      description: 'Our team is ready to help you set up your school and import your data.',
      icon: <SupportIcon color="primary" />,
      action: 'Contact Support',
      actionUrl: 'mailto:support@upclass.com',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            py: 6,
            px: 4,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
            </Box>
          </motion.div>

          <Typography variant="h3" fontWeight="bold" gutterBottom>
            🎉 Congratulations!
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
            Your School Platform is Ready
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
            {tenantData.school_name} is now live and ready to transform your educational management
            experience.
          </Typography>
        </Box>

        {/* Details Section */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* School Details Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', border: '2px solid', borderColor: 'primary.main' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Your School Details
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      School Name
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {tenantData.school_name}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Platform URL
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {tenantData.subdomain}.upclass.com
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Administrator Email
                    </Typography>
                    <Typography variant="body1">{tenantData.admin_email}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Plan & Trial
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${tenantData.plan_type} Plan`}
                        color="primary"
                        variant="filled"
                      />
                      <Chip
                        label={`${tenantData.trial_days} Day Free Trial`}
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Access Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    🚀 Quick Access
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleGoToLogin}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mb: 2,
                      py: 1.5,
                    }}
                    startIcon={<LaunchIcon />}
                  >
                    Go to Your Platform
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleContactSupport}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      mb: 2,
                    }}
                    startIcon={<SupportIcon />}
                  >
                    Get Setup Help
                  </Button>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Important:</strong> Check your email for login credentials and
                      detailed setup instructions.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Next Steps Section */}
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            What's Next?
          </Typography>

          <Grid container spacing={3}>
            {nextSteps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ mb: 2 }}>{step.icon}</Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        {step.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        href={step.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          '&:hover': {
                            borderColor: '#764ba2',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                          },
                        }}
                      >
                        {step.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Additional Information */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📚 Getting Started Resources
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  📖 User Guide
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Complete platform walkthrough
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  🎥 Video Tutorials
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Step-by-step video guides
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  📞 Live Training
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Free onboarding session
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  💬 24/7 Support
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Always here to help
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{
              textAlign: 'center',
              mt: 4,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Welcome to the future of school management! 🎓
            </Typography>
            <Button variant="text" onClick={onClose} sx={{ color: 'grey.600' }}>
              Close and Return to Homepage
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSuccess;
