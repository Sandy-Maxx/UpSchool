import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const HeroLayout = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  overflow: 'hidden',
  position: 'relative',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(8),
}));

const GlassmorphicPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  padding: theme.spacing(4),
}));

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <HeroLayout id="hero">
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                The Future of School Management is Here
              </Typography>
              <Typography variant="h6" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
                UpClass is the all-in-one platform to streamline your school's operations, empower
                your teachers, and engage your students like never before.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    },
                  }}
                >
                  Get Started For Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ ml: 2, borderColor: '#667eea', color: '#667eea' }}
                >
                  Request a Demo
                </Button>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <GlassmorphicPaper>
                <SchoolIcon sx={{ fontSize: isMobile ? 150 : 250, color: '#667eea' }} />
              </GlassmorphicPaper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </HeroLayout>
  );
};

export default HeroSection;
