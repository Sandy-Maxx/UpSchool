import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, School as SchoolIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface HeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignUpClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                  }}
                >
                  UpClass
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {menuItems.map((item, index) => (
                    <Button
                      key={item.label}
                      onClick={() => scrollToSection(item.href)}
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}

                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '25px',
                      px: 3,
                      '&:hover': {
                        borderColor: '#764ba2',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      },
                    }}
                    onClick={onLoginClick} // Updated
                  >
                    Login
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '25px',
                      px: 3,
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      },
                    }}
                    onClick={onSignUpClick} // Updated
                  >
                    Sign Up
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
            UpClass
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map(item => (
            <ListItem key={item.label} sx={{ px: 0, py: 1 }}>
              <Button
                fullWidth
                onClick={() => scrollToSection(item.href)}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.primary',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                  },
                }}
              >
                {item.label}
              </Button>
            </ListItem>
          ))}

          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '25px',
                py: 1.5,
              }}
              onClick={onLoginClick} // Updated
            >
              Login
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '25px',
                py: 1.5,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              }}
              onClick={onSignUpClick} // Updated
            >
              Sign Up Free
            </Button>
          </Box>
        </List>
      </Drawer>
    </>
  );
};

export default Header;
