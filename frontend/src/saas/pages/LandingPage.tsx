import React from 'react';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';

// Create a custom theme for the landing page
const landingTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Blue
      dark: '#1d4ed8',
      light: '#60a5fa',
    },
    secondary: {
      main: '#9333ea', // Purple
      dark: '#7c2d12',
      light: '#c084fc',
    },
    success: {
      main: '#059669',
      dark: '#047857',
      light: '#34d399',
    },
    warning: {
      main: '#d97706',
      dark: '#b45309',
      light: '#fbbf24',
    },
    error: {
      main: '#dc2626',
      dark: '#b91c1c',
      light: '#f87171',
    },
    info: {
      main: '#0891b2',
      dark: '#0e7490',
      light: '#22d3ee',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export const LandingPage: React.FC = () => {
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  React.useEffect(() => {
    // Set document title
    document.title = 'UpSchool - Complete School Management ERP Solution';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Transform your school operations with UpSchool - a comprehensive, cloud-based ERP solution for educational institutions. Student management, academics, library, transport & more.'
      );
    }

    // Smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <ThemeProvider theme={landingTheme}>
      <AnimatePresence mode="wait">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Box
            sx={{
              minHeight: '100vh',
              background: 'linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)',
              overflowX: 'hidden',
            }}
          >
            {/* Navigation would go here in future */}
            
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Additional sections would go here:
                - StatsSection
                - TestimonialsSection  
                - PricingSection
                - CTASection
                - Footer
            */}
            
            {/* Temporary footer */}
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                color: 'text.secondary',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ typography: 'body2' }}>
                © 2025 UpSchool. All rights reserved.
              </Box>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default LandingPage;
