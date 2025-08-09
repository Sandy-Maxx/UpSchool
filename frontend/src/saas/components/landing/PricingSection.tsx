import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Check as CheckIcon } from '@mui/icons-material';

const PricingLayout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: '#f8f9fa',
}));

const PricingCard = styled(Card)<{ popular?: boolean }>(({ theme, popular }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  background: popular
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: popular ? '2px solid #667eea' : '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: popular ? '0 20px 40px rgba(102, 126, 234, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  color: popular ? 'white' : 'inherit',
}));

const PopularChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#ff4081',
  color: 'white',
  fontWeight: 600,
}));

const PricingSection: React.FC = () => {
  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small schools',
      price: '2,499',
      currency: '₹',
      billing: 'per month',
      student_limit: 100,
      features: [
        'Up to 100 students',
        'Basic student management',
        'Attendance tracking',
        'Grade management',
        'Parent communication',
        'Basic reporting',
        'Email support',
        'GST included',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Most popular for growing schools',
      price: '6,999',
      currency: '₹',
      billing: 'per month',
      student_limit: 500,
      features: [
        'Up to 500 students',
        'Advanced student management',
        'Smart scheduling',
        'Payment processing',
        'Advanced analytics',
        'Custom reports',
        'Mobile app access',
        'Priority support',
        'GST included',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large educational institutions',
      price: '12,999',
      currency: '₹',
      billing: 'per month',
      student_limit: 'Unlimited',
      features: [
        'Unlimited students',
        'Full feature access',
        'API integration',
        'Custom branding',
        'Advanced security',
        'Dedicated support',
        'Training & onboarding',
        'SLA guarantee',
        'GST included',
      ],
      popular: false,
    },
  ];

  return (
    <PricingLayout id="pricing">
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Choose the plan that's right for your institution. All plans include core features and
              free updates.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PricingCard popular={plan.popular}>
                  {plan.popular && <PopularChip label="Most Popular" />}
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box textAlign="center" mb={3}>
                      <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ opacity: 0.8 }}>
                        {plan.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h2" component="span" sx={{ fontWeight: 700 }}>
                          {plan.currency}
                          {plan.price}
                        </Typography>
                        <Typography variant="body1" component="span" sx={{ opacity: 0.8, ml: 1 }}>
                          {plan.billing}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <Box
                          key={featureIndex}
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <CheckIcon
                            sx={{ mr: 1, fontSize: 20, color: plan.popular ? 'white' : '#4caf50' }}
                          />
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant={plan.popular ? 'outlined' : 'contained'}
                      fullWidth
                      size="large"
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: '25px',
                        fontWeight: 600,
                        textTransform: 'none',
                        ...(plan.popular
                          ? {
                              borderColor: 'white',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }
                          : {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                              },
                            }),
                      }}
                    >
                      Start Free Trial
                    </Button>
                  </CardContent>
                </PricingCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mt={6}>
            <Typography variant="body1" color="textSecondary">
              All plans include a 14-day free trial. No credit card required. Prices in Indian
              Rupees (₹) with GST included.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </PricingLayout>
  );
};

export default PricingSection;
