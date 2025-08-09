import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  CloudUpload as CloudIcon,
} from '@mui/icons-material';

export const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const features = [
    { icon: <SchoolIcon />, text: 'Complete School Management' },
    { icon: <SecurityIcon />, text: 'Enterprise Security' },
    { icon: <CloudIcon />, text: 'Cloud-Based Solution' },
    { icon: <TrendingUpIcon />, text: 'Advanced Analytics' },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          filter: 'blur(40px)',
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            spacing={{ xs: 4, md: 8 }}
          >
            {/* Content */}
            <Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
              <motion.div variants={itemVariants}>
                <Chip
                  label="🚀 Now Live - Multi-Tenant School ERP"
                  color="primary"
                  size="small"
                  sx={{ mb: 2, fontSize: '0.75rem' }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                  }}
                >
                  Complete School Management
                  <br />
                  Made Simple
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  paragraph
                  sx={{ maxWidth: 600, mx: { xs: 'auto', md: 0 } }}
                >
                  Streamline your entire school operations with our comprehensive,
                  cloud-based ERP solution. From student management to financial
                  reporting - everything in one secure platform.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mt: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[10],
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View Demo
                  </Button>
                </Stack>
              </motion.div>

              {/* Trust indicators */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 4, mb: 2 }}
                >
                  Trusted by leading educational institutions
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  {['ISO 27001', 'GDPR Compliant', 'SOC 2 Type II', '99.9% Uptime'].map(
                    (badge) => (
                      <Chip
                        key={badge}
                        label={badge}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )
                  )}
                </Stack>
              </motion.div>
            </Box>

            {/* Feature cards */}
            <Box
              flex={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: { xs: '100%', md: 500 },
              }}
            >
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <SchoolIcon
                      sx={{ color: theme.palette.primary.main, fontSize: 40 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        All-in-One Platform
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Student records, academics, library, transport & more
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </motion.div>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {features.slice(1, 3).map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {feature.text}
                      </Typography>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>

              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <TrendingUpIcon
                    sx={{ color: theme.palette.success.main, mb: 1 }}
                  />
                  <Typography variant="body2" fontWeight="medium">
                    Advanced Analytics & Reporting
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
