import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  CloudUpload as CloudIcon,
  Support as SupportIcon,
  Devices as DevicesIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  LocalLibrary as LibraryIcon,
  DirectionsBus as TransportIcon,
} from '@mui/icons-material';

export const FeaturesSection: React.FC = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
    }
  }
};

  const features = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Student Information System',
      description: 'Complete student lifecycle management from admission to graduation with comprehensive record keeping.',
      color: theme.palette.primary.main,
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Academic Management',
      description: 'Manage curricula, timetables, examinations, and grades with intelligent academic planning tools.',
      color: theme.palette.secondary.main,
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      title: 'Performance Analytics',
      description: 'Advanced analytics and reporting for data-driven decisions with real-time dashboards.',
      color: theme.palette.success.main,
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with role-based access control and multi-tenant data isolation.',
      color: theme.palette.error.main,
    },
    {
      icon: <LibraryIcon sx={{ fontSize: 40 }} />,
      title: 'Library Management',
      description: 'Complete library operations including catalog management, borrowing, and digital resources.',
      color: theme.palette.info.main,
    },
    {
      icon: <TransportIcon sx={{ fontSize: 40 }} />,
      title: 'Transport Management',
      description: 'Fleet management, route optimization, and real-time tracking for school transportation.',
      color: theme.palette.warning.main,
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      title: 'Cloud Infrastructure',
      description: 'Scalable, reliable cloud infrastructure with 99.9% uptime and automatic backups.',
      color: theme.palette.primary.dark,
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      title: 'Multi-Device Access',
      description: 'Responsive design that works seamlessly across desktop, tablet, and mobile devices.',
      color: theme.palette.secondary.dark,
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance with sub-second load times and real-time synchronization.',
      color: theme.palette.success.dark,
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Round-the-clock technical support with dedicated customer success managers.',
      color: theme.palette.info.dark,
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Business Intelligence',
      description: 'Comprehensive reporting and analytics with customizable dashboards and insights.',
      color: theme.palette.error.dark,
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      title: 'Communication Hub',
      description: 'Integrated messaging, notifications, and announcements for seamless communication.',
      color: theme.palette.warning.dark,
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 12 },
        backgroundColor: 'background.default',
        position: 'relative',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 20%, ${theme.palette.primary.main}08 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section header */}
          <Stack spacing={2} textAlign="center" mb={{ xs: 4, md: 8 }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h3"
                component="h2"
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Everything Your School Needs
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                Our comprehensive platform covers every aspect of school management,
                from student records to financial reporting, all in one integrated solution.
              </Typography>
            </motion.div>
          </Stack>

          {/* Features grid */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      p: { xs: 2, md: 3 },
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[10],
                        borderColor: feature.color,
                        '& .feature-icon': {
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                      <Stack spacing={2}>
                        {/* Icon */}
                        <Box
                          className="feature-icon"
                          sx={{
                            color: feature.color,
                            transition: 'transform 0.3s ease',
                            alignSelf: 'flex-start',
                          }}
                        >
                          {feature.icon}
                        </Box>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight="bold"
                          sx={{ lineHeight: 1.3 }}
                        >
                          {feature.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.5 }}
                        >
                          {feature.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Bottom CTA */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                mt: { xs: 6, md: 10 },
                textAlign: 'center',
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ready to transform your school operations?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Join hundreds of educational institutions already using our platform
                to streamline their operations and improve educational outcomes.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '24px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  Start Your Free Trial
                </motion.button>
              </Stack>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
