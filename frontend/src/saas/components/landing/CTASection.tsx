import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const CTALayout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

const CTASection: React.FC = () => {
  return (
    <CTALayout id="cta">
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Elevate Your School?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Join hundreds of schools already transforming their educational management with
              UpClass. Get started today and experience the future of school administration.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '25px',
                px: 5,
                py: 1.5,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              Start Your Free Trial
            </Button>
          </Box>
        </motion.div>
      </Container>
    </CTALayout>
  );
};

export default CTASection;
