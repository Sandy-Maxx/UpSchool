import React from 'react';
import { Box, Typography, Container, Grid, Link, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const FooterLayout = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: 'white',
  padding: theme.spacing(6, 0, 3, 0),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '0.9rem',
  '&:hover': {
    color: '#667eea',
  },
}));

const SocialIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: '#333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#667eea',
    transform: 'translateY(-2px)',
  },
}));

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterLayout id="contact">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                UpClass
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 3 }}>
              Empowering educational institutions with modern, comprehensive school management
              solutions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <SocialIcon>
                <FacebookIcon sx={{ fontSize: 20 }} />
              </SocialIcon>
              <SocialIcon>
                <TwitterIcon sx={{ fontSize: 20 }} />
              </SocialIcon>
              <SocialIcon>
                <LinkedInIcon sx={{ fontSize: 20 }} />
              </SocialIcon>
            </Box>
          </Grid>

          {/* Product Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#demo">Demo</FooterLink>
              <FooterLink href="#integrations">Integrations</FooterLink>
              <FooterLink href="#security">Security</FooterLink>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#careers">Careers</FooterLink>
              <FooterLink href="#blog">Blog</FooterLink>
              <FooterLink href="#press">Press</FooterLink>
              <FooterLink href="#partners">Partners</FooterLink>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: '#667eea' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  support@upclass.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: '#667eea' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 18, color: '#667eea' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  123 Education St, Learning City, LC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: '#333', my: 4 }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              © {currentYear} UpClass. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                gap: 3,
                mt: { xs: 2, md: 0 },
              }}
            >
              <FooterLink href="#privacy">Privacy Policy</FooterLink>
              <FooterLink href="#terms">Terms of Service</FooterLink>
              <FooterLink href="#cookies">Cookie Policy</FooterLink>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </FooterLayout>
  );
};

export default Footer;
