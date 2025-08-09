import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationData {
  // Step 1: School Information
  schoolName: string;
  schoolType: string;
  establishedYear: string;
  studentCapacity: string;
  
  // Step 2: Administrative Contact
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminRole: string;
  
  // Step 3: School Address & Details
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  
  // Step 4: Account Setup
  subdomain: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeToUpdates: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

const steps = [
  'School Information',
  'Administrative Contact',
  'Address & Details', 
  'Account Setup'
];

const schoolTypes = [
  'Primary School',
  'Elementary School',
  'Middle School',
  'High School',
  'Secondary School',
  'International School',
  'Private School',
  'Public School',
  'Charter School',
  'Montessori School',
  'Waldorf School',
  'Religious School',
  'Technical School',
  'Other'
];

const adminRoles = [
  'Principal',
  'Vice Principal',
  'School Administrator',
  'Head of School',
  'Academic Director',
  'IT Administrator',
  'Other'
];

export const TenantRegistrationWizard: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState<RegistrationData>({
    // Step 1
    schoolName: '',
    schoolType: '',
    establishedYear: '',
    studentCapacity: '',
    
    // Step 2
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminRole: '',
    
    // Step 3
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    
    // Step 4
    subdomain: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToUpdates: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Auto-generate subdomain from school name
  useEffect(() => {
    if (formData.schoolName && !formData.subdomain) {
      const suggestedSubdomain = formData.schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
      
      if (suggestedSubdomain.length >= 3) {
        setFormData(prev => ({ ...prev, subdomain: suggestedSubdomain }));
      }
    }
  }, [formData.schoolName, formData.subdomain]);

  // Check subdomain availability
  useEffect(() => {
    const checkSubdomain = async () => {
      if (formData.subdomain.length >= 3) {
        setSubdomainChecking(true);
        
        // Simulate API call
        setTimeout(() => {
          // Mock logic - reject common names
          const unavailableSubdomains = ['admin', 'api', 'www', 'mail', 'test', 'demo'];
          const available = !unavailableSubdomains.includes(formData.subdomain.toLowerCase());
          setSubdomainAvailable(available);
          setSubdomainChecking(false);
        }, 1000);
      } else {
        setSubdomainAvailable(null);
      }
    };

    if (formData.subdomain) {
      const timeoutId = setTimeout(checkSubdomain, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.subdomain]);

  const handleInputChange = (field: keyof RegistrationData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 0: // School Information
        if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
        if (!formData.schoolType) newErrors.schoolType = 'School type is required';
        if (!formData.establishedYear) newErrors.establishedYear = 'Established year is required';
        if (!formData.studentCapacity) newErrors.studentCapacity = 'Student capacity is required';
        
        if (formData.establishedYear && (parseInt(formData.establishedYear) < 1800 || parseInt(formData.establishedYear) > new Date().getFullYear())) {
          newErrors.establishedYear = 'Please enter a valid year';
        }
        break;

      case 1: // Administrative Contact
        if (!formData.adminFirstName.trim()) newErrors.adminFirstName = 'First name is required';
        if (!formData.adminLastName.trim()) newErrors.adminLastName = 'Last name is required';
        if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Email is required';
        if (!formData.adminPhone.trim()) newErrors.adminPhone = 'Phone is required';
        if (!formData.adminRole) newErrors.adminRole = 'Role is required';
        
        // Email validation
        if (formData.adminEmail && !/\S+@\S+\.\S+/.test(formData.adminEmail)) {
          newErrors.adminEmail = 'Please enter a valid email address';
        }
        break;

      case 2: // Address & Details
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State/Province is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        
        // Website validation (optional but must be valid if provided)
        if (formData.website && formData.website.trim() && !/^https?:\/\/.+/.test(formData.website)) {
          newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
        }
        break;

      case 3: // Account Setup
        if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        
        // Subdomain validation
        if (formData.subdomain && !/^[a-z0-9-]+$/.test(formData.subdomain)) {
          newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
        }
        if (formData.subdomain && formData.subdomain.length < 3) {
          newErrors.subdomain = 'Subdomain must be at least 3 characters long';
        }
        if (subdomainAvailable === false) {
          newErrors.subdomain = 'This subdomain is not available';
        }
        
        // Password validation
        if (formData.password && formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
        }
        if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      // Simulate API call to register tenant
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to success page or login
      alert(`Registration successful! Your portal will be available at: https://${formData.subdomain}.upschool.com`);
      
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // School Information
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon color="primary" />
                Tell us about your school
              </Typography>
              
              <TextField
                label="School Name"
                value={formData.schoolName}
                onChange={handleInputChange('schoolName')}
                error={!!errors.schoolName}
                helperText={errors.schoolName}
                required
                fullWidth
              />
              
              <FormControl error={!!errors.schoolType} required fullWidth>
                <InputLabel>School Type</InputLabel>
                <Select
                  value={formData.schoolType}
                  onChange={handleInputChange('schoolType')}
                  label="School Type"
                >
                  {schoolTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
                {errors.schoolType && <FormHelperText>{errors.schoolType}</FormHelperText>}
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Established Year"
                    type="number"
                    value={formData.establishedYear}
                    onChange={handleInputChange('establishedYear')}
                    error={!!errors.establishedYear}
                    helperText={errors.establishedYear}
                    required
                    fullWidth
                    inputProps={{ min: 1800, max: new Date().getFullYear() }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Student Capacity"
                    type="number"
                    value={formData.studentCapacity}
                    onChange={handleInputChange('studentCapacity')}
                    error={!!errors.studentCapacity}
                    helperText={errors.studentCapacity}
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </motion.div>
        );

      case 1: // Administrative Contact
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Primary administrator contact
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    value={formData.adminFirstName}
                    onChange={handleInputChange('adminFirstName')}
                    error={!!errors.adminFirstName}
                    helperText={errors.adminFirstName}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    value={formData.adminLastName}
                    onChange={handleInputChange('adminLastName')}
                    error={!!errors.adminLastName}
                    helperText={errors.adminLastName}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>

              <TextField
                label="Email Address"
                type="email"
                value={formData.adminEmail}
                onChange={handleInputChange('adminEmail')}
                error={!!errors.adminEmail}
                helperText={errors.adminEmail}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Phone Number"
                value={formData.adminPhone}
                onChange={handleInputChange('adminPhone')}
                error={!!errors.adminPhone}
                helperText={errors.adminPhone}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl error={!!errors.adminRole} required fullWidth>
                <InputLabel>Role / Position</InputLabel>
                <Select
                  value={formData.adminRole}
                  onChange={handleInputChange('adminRole')}
                  label="Role / Position"
                >
                  {adminRoles.map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
                {errors.adminRole && <FormHelperText>{errors.adminRole}</FormHelperText>}
              </FormControl>
            </Stack>
          </motion.div>
        );

      case 2: // Address & Details
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" />
                School location and details
              </Typography>
              
              <TextField
                label="Street Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                error={!!errors.address}
                helperText={errors.address}
                required
                fullWidth
                multiline
                rows={2}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                    error={!!errors.city}
                    helperText={errors.city}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State / Province"
                    value={formData.state}
                    onChange={handleInputChange('state')}
                    error={!!errors.state}
                    helperText={errors.state}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ZIP / Postal Code"
                    value={formData.zipCode}
                    onChange={handleInputChange('zipCode')}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    value={formData.country}
                    onChange={handleInputChange('country')}
                    error={!!errors.country}
                    helperText={errors.country}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>

              <TextField
                label="School Website (Optional)"
                value={formData.website}
                onChange={handleInputChange('website')}
                error={!!errors.website}
                helperText={errors.website || "Enter your school's website URL"}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </motion.div>
        );

      case 3: // Account Setup
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack spacing={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                Set up your account
              </Typography>
              
              <Box>
                <TextField
                  label="Subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange('subdomain')}
                  error={!!errors.subdomain}
                  helperText={
                    errors.subdomain || 
                    `Your portal will be accessible at: https://${formData.subdomain || 'yourschool'}.upschool.com`
                  }
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {subdomainChecking ? (
                          <LinearProgress sx={{ width: 20, height: 2 }} />
                        ) : subdomainAvailable === true ? (
                          <Tooltip title="Subdomain available">
                            <CheckCircleIcon color="success" />
                          </Tooltip>
                        ) : subdomainAvailable === false ? (
                          <Tooltip title="Subdomain not available">
                            <InfoIcon color="error" />
                          </Tooltip>
                        ) : null}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password || 'Must be at least 8 characters with uppercase, lowercase, and numbers'}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                fullWidth
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange('agreeToTerms')}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Button variant="text" size="small" sx={{ p: 0, textTransform: 'none' }}>
                      Terms of Service
                    </Button>
                    {' '}and{' '}
                    <Button variant="text" size="small" sx={{ p: 0, textTransform: 'none' }}>
                      Privacy Policy
                    </Button>
                  </Typography>
                }
              />
              {errors.agreeToTerms && (
                <Typography variant="caption" color="error" sx={{ mt: -2 }}>
                  {errors.agreeToTerms}
                </Typography>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.subscribeToUpdates}
                    onChange={handleInputChange('subscribeToUpdates')}
                  />
                }
                label={
                  <Typography variant="body2">
                    Subscribe to product updates and educational content
                  </Typography>
                }
              />
            </Stack>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh' }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <SchoolIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Register Your School
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get started with UpSchool ERP platform in just a few steps
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ minHeight: 400, mb: 4 }}>
          <AnimatePresence mode="wait">
            {renderStepContent(activeStep)}
          </AnimatePresence>
        </Box>

        {/* Navigation Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          <Chip
            label={`Step ${activeStep + 1} of ${steps.length}`}
            color="primary"
            variant="outlined"
          />

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || subdomainAvailable === false}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ minWidth: 120 }}
            >
              Next
            </Button>
          )}
        </Box>

        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>
    </Container>
  );
};

export default TenantRegistrationWizard;
