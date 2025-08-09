import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';

const FeaturesLayout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: '#f8f9fa',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'Comprehensive Dashboard',
      description:
        'Get a complete overview of your school operations with our intuitive dashboard. Monitor student progress, teacher performance, and administrative tasks all in one place.',
      icon: DashboardIcon,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 2,
      title: 'Student Management',
      description:
        'Efficiently manage student records, enrollment, attendance, and academic progress. Keep all student information organized and easily accessible.',
      icon: PeopleIcon,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 3,
      title: 'Advanced Analytics',
      description:
        'Make data-driven decisions with powerful analytics and reporting tools. Track performance metrics and identify areas for improvement.',
      icon: AssessmentIcon,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 4,
      title: 'Smart Scheduling',
      description:
        'Automate class scheduling, room assignments, and resource allocation. Optimize your school timetable with intelligent scheduling algorithms.',
      icon: ScheduleIcon,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      id: 5,
      title: 'Payment Processing',
      description:
        'Streamline fee collection with integrated payment processing. Handle tuition, fees, and other payments securely and efficiently.',
      icon: PaymentIcon,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      id: 6,
      title: 'Cloud Infrastructure',
      description:
        'Access your school data anywhere, anytime with our secure cloud infrastructure. Enjoy 99.9% uptime and automatic backups.',
      icon: CloudIcon,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];

  return (
    <FeaturesLayout id="features">
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Powerful Features for Modern Schools
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Everything you need to manage your school efficiently and effectively, all in one
              comprehensive platform.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard>
                  <CardContent sx={{ p: 4 }}>
                    <IconWrapper sx={{ background: feature.gradient }}>
                      <feature.icon sx={{ fontSize: 40, color: 'white' }} />
                    </IconWrapper>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </FeaturesLayout>
  );
};

export default FeaturesSection;
