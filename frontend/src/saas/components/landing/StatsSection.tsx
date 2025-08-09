import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
// Simplified stats without CountUp

const StatsLayout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const StatItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '15px',
  color: theme.palette.text.primary,
}));

const StatsSection: React.FC = () => {
  const stats = {
    students: 15000,
    schools: 200,
    teachers: 1000,
    countries: 15,
  };

  return (
    <StatsLayout>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <StatItem elevation={4}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {stats.students.toLocaleString()}+
                </Typography>
                <Typography variant="h6" component="div">
                  Students Enrolled
                </Typography>
              </StatItem>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <StatItem elevation={4}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: '#764ba2' }}>
                  {stats.schools.toLocaleString()}+
                </Typography>
                <Typography variant="h6" component="div">
                  Schools Partnered
                </Typography>
              </StatItem>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <StatItem elevation={4}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {stats.teachers.toLocaleString()}+
                </Typography>
                <Typography variant="h6" component="div">
                  Teachers Using
                </Typography>
              </StatItem>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <StatItem elevation={4}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: '#764ba2' }}>
                  {stats.countries.toLocaleString()}+
                </Typography>
                <Typography variant="h6" component="div">
                  Countries Reached
                </Typography>
              </StatItem>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </StatsLayout>
  );
};

export default StatsSection;
