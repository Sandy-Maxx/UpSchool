import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
// Simplified testimonials without Swiper carousel

const TestimonialsLayout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Principal, Green Valley High',
      avatar: 'JD',
      testimonial:
        'UpClass has revolutionized our school management. It is intuitive, powerful, and has saved us countless hours of administrative work.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'IT Director, Oakwood Academy',
      avatar: 'JS',
      testimonial:
        'The support from the UpClass team has been outstanding. They are always responsive and helpful. The platform is a game-changer for us.',
    },
    {
      id: 3,
      name: 'Samuel Lee',
      role: 'Teacher, Lakeside Middle School',
      avatar: 'SL',
      testimonial:
        'I love how easy it is to track student progress and communicate with parents. UpClass has made my job so much easier.',
    },
  ];

  return (
    <TestimonialsLayout id="testimonials">
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Trusted by Educators Worldwide
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              See what our partners have to say about UpClass and how it has transformed their
              institutions.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={testimonial.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialCard>
                  <CardContent>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      {testimonial.testimonial}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>{testimonial.avatar}</Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </TestimonialCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </TestimonialsLayout>
  );
};

export default TestimonialsSection;
