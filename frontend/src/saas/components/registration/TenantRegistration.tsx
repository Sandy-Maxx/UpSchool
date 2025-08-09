import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  ContactMail as ContactIcon,
  Security as SecurityIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface TenantRegistrationProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (tenantData: any) => void;
}

interface TenantFormData {
  // School Information
  school_name: string;
  subdomain: string;
  school_type: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;

  // Admin User Information
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  job_title: string;

  // Business Information
  student_count: string;
  staff_count: string;
  plan_type: string;

  // Terms and Privacy
  agree_terms: boolean;
  agree_privacy: boolean;
  marketing_emails: boolean;
}

const validationSchema = Yup.object({
  // School Information
  school_name: Yup.string()
    .required('School name is required')
    .min(2, 'School name must be at least 2 characters')
    .max(100, 'School name must be less than 100 characters'),
  subdomain: Yup.string()
    .required('Subdomain is required')
    .min(3, 'Subdomain must be at least 3 characters')
    .max(50, 'Subdomain must be less than 50 characters')
    .matches(
      /^[a-z0-9]+([a-z0-9-]*[a-z0-9]+)?$/,
      'Subdomain must contain only lowercase letters, numbers, and hyphens'
    ),
  school_type: Yup.string().required('School type is required'),
  website: Yup.string().url('Please enter a valid URL').optional(),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postal_code: Yup.string().required('Postal code is required'),
  country: Yup.string().required('Country is required'),

  // Admin User Information
  first_name: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string().required('Email is required').email('Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirm_password: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  job_title: Yup.string().required('Job title is required'),

  // Business Information
  student_count: Yup.string().required('Student count range is required'),
  staff_count: Yup.string().required('Staff count range is required'),
  plan_type: Yup.string().required('Plan type is required'),

  // Terms and Privacy
  agree_terms: Yup.boolean()
    .required('You must agree to the Terms of Service')
    .oneOf([true], 'You must agree to the Terms of Service'),
  agree_privacy: Yup.boolean()
    .required('You must agree to the Privacy Policy')
    .oneOf([true], 'You must agree to the Privacy Policy'),
});

const TenantRegistration: React.FC<TenantRegistrationProps> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    'School Information',
    'Administrator Account',
    'Business Details',
    'Terms & Confirmation',
  ];

  const schoolTypes = [
    'Primary School',
    'Elementary School',
    'Middle School',
    'High School',
    'University',
    'Technical College',
    'Community College',
    'Private School',
    'International School',
    'Online School',
  ];

  const studentCountRanges = [
    '1-50',
    '51-100',
    '101-250',
    '251-500',
    '501-1000',
    '1001-2500',
    '2500+',
  ];

  const staffCountRanges = ['1-10', '11-25', '26-50', '51-100', '101-250', '250+'];

  const planTypes = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '$29/month',
      features: ['Up to 100 students', 'Basic features', 'Email support'],
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: '$79/month',
      features: ['Up to 500 students', 'Advanced features', 'Priority support'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '$199/month',
      features: ['Unlimited students', 'All features', '24/7 phone support'],
    },
  ];

  const formik = useFormik<TenantFormData>({
    initialValues: {
      // School Information
      school_name: '',
      subdomain: '',
      school_type: '',
      website: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',

      // Admin User Information
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      job_title: '',

      // Business Information
      student_count: '',
      staff_count: '',
      plan_type: 'professional',

      // Terms and Privacy
      agree_terms: false,
      agree_privacy: false,
      marketing_emails: false,
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      setError(null);

      try {
        // Prepare registration data according to Django serializer
        const registrationData = {
          // School information (production-grade fields)
          school_name: values.school_name,
          school_type: values.school_type,
          subdomain: values.subdomain,
          school_address: values.address,
          school_city: values.city,
          school_state: values.state,
          school_postal_code: values.postal_code,
          school_country: values.country,
          school_phone: values.phone,
          school_email: values.email, // Use admin email as school email
          school_website: values.website || '',

          // Admin user fields (production-grade)
          admin_first_name: values.first_name,
          admin_last_name: values.last_name,
          admin_email: values.email,
          admin_phone: values.phone,
          admin_password: values.password,
          admin_job_title: values.job_title,

          // Business and academic information
          student_count_range: values.student_count,
          staff_count_range: values.staff_count,
          academic_year_start: 'September', // Default value
          grade_system: 'K-12', // Default value

          // Map frontend plan types to Django serializer choices
          subscription_plan:
            {
              starter: 'basic',
              professional: 'standard',
              enterprise: 'premium',
            }[values.plan_type] || 'basic',

          // Marketing and communication preferences
          marketing_emails_consent: values.marketing_emails,
          newsletter_subscription: false, // Not collected in frontend currently

          // Terms acceptance
          terms_accepted: true,
        };

        // Call the API
        const response = await fetch('/api/v1/public/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed. Please try again.');
        }

        const result = await response.json();
        onSuccess(result);
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) return;

    try {
      const response = await fetch('/api/v1/public/check-subdomain/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subdomain }),
      });
      const data = await response.json();
      setSubdomainAvailable(data.available);
    } catch (error) {
      setSubdomainAvailable(null);
    }
  };

  const handleNext = () => {
    // Validate current step fields before proceeding
    const stepFields = getStepFields(activeStep);
    const stepErrors = Object.keys(formik.errors).filter(
      field => stepFields.includes(field) && formik.touched[field as keyof TenantFormData]
    );

    if (stepErrors.length === 0) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      // Touch all fields in current step to show validation errors
      stepFields.forEach(field => {
        formik.setFieldTouched(field as keyof TenantFormData, true);
      });
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0:
        return [
          'school_name',
          'subdomain',
          'school_type',
          'website',
          'phone',
          'address',
          'city',
          'state',
          'postal_code',
          'country',
        ];
      case 1:
        return ['first_name', 'last_name', 'email', 'password', 'confirm_password', 'job_title'];
      case 2:
        return ['student_count', 'staff_count', 'plan_type'];
      case 3:
        return ['agree_terms', 'agree_privacy'];
      default:
        return [];
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Name"
                name="school_name"
                value={formik.values.school_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.school_name && Boolean(formik.errors.school_name)}
                helperText={formik.touched.school_name && formik.errors.school_name}
                InputProps={{
                  startAdornment: <SchoolIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Subdomain"
                name="subdomain"
                value={formik.values.subdomain}
                onChange={e => {
                  formik.handleChange(e);
                  checkSubdomainAvailability(e.target.value);
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.subdomain &&
                  (Boolean(formik.errors.subdomain) || subdomainAvailable === false)
                }
                helperText={
                  (formik.touched.subdomain && formik.errors.subdomain) ||
                  (subdomainAvailable === false && 'Subdomain is not available') ||
                  (subdomainAvailable === true && 'Subdomain is available') ||
                  'Your school will be accessible at: https://yoursubdomain.upclass.com'
                }
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" color="textSecondary">
                      .upclass.com
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="School Type"
                name="school_type"
                value={formik.values.school_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.school_type && Boolean(formik.errors.school_type)}
                helperText={formik.touched.school_type && formik.errors.school_type}
                SelectProps={{ native: true }}
              >
                <option value="">Select school type</option>
                {schoolTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website (Optional)"
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website}
                placeholder="https://yourschool.edu"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postal_code"
                value={formik.values.postal_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                helperText={formik.touched.postal_code && formik.errors.postal_code}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                <ContactIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Administrator Account
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                This person will have full administrative access to your school's platform.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Job Title"
                name="job_title"
                value={formik.values.job_title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.job_title && Boolean(formik.errors.job_title)}
                helperText={formik.touched.job_title && formik.errors.job_title}
                placeholder="e.g., Principal, Director"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: <SecurityIcon color="action" sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                School Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Number of Students"
                name="student_count"
                value={formik.values.student_count}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.student_count && Boolean(formik.errors.student_count)}
                helperText={formik.touched.student_count && formik.errors.student_count}
                SelectProps={{ native: true }}
              >
                <option value="">Select student count</option>
                {studentCountRanges.map(range => (
                  <option key={range} value={range}>
                    {range} students
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Number of Staff"
                name="staff_count"
                value={formik.values.staff_count}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.staff_count && Boolean(formik.errors.staff_count)}
                helperText={formik.touched.staff_count && formik.errors.staff_count}
                SelectProps={{ native: true }}
              >
                <option value="">Select staff count</option>
                {staffCountRanges.map(range => (
                  <option key={range} value={range}>
                    {range} staff members
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 3 }}>
                Choose Your Plan
              </Typography>
              <Grid container spacing={2}>
                {planTypes.map(plan => (
                  <Grid item xs={12} md={4} key={plan.id}>
                    <Box
                      onClick={() => formik.setFieldValue('plan_type', plan.id)}
                      sx={{
                        p: 3,
                        border: '2px solid',
                        borderColor:
                          formik.values.plan_type === plan.id ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        bgcolor:
                          formik.values.plan_type === plan.id ? 'primary.50' : 'background.paper',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50',
                        },
                      }}
                    >
                      <Typography variant="h6" color="primary" gutterBottom>
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {plan.price}
                      </Typography>
                      {plan.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          sx={{ m: 0.5 }}
                          color={formik.values.plan_type === plan.id ? 'primary' : 'default'}
                        />
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Terms & Confirmation
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agree_terms"
                    checked={formik.values.agree_terms}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Typography
                      component="a"
                      href="/terms"
                      target="_blank"
                      color="primary"
                      sx={{ textDecoration: 'underline' }}
                    >
                      Terms of Service
                    </Typography>{' '}
                    *
                  </Typography>
                }
              />
              {formik.touched.agree_terms && formik.errors.agree_terms && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                  {formik.errors.agree_terms}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agree_privacy"
                    checked={formik.values.agree_privacy}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Typography
                      component="a"
                      href="/privacy"
                      target="_blank"
                      color="primary"
                      sx={{ textDecoration: 'underline' }}
                    >
                      Privacy Policy
                    </Typography>{' '}
                    *
                  </Typography>
                }
              />
              {formik.touched.agree_privacy && formik.errors.agree_privacy && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                  {formik.errors.agree_privacy}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="marketing_emails"
                    checked={formik.values.marketing_emails}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I would like to receive marketing emails about new features and updates
                    (optional)
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>What happens next?</strong>
                  <br />
                  • Your school platform will be created instantly
                  <br />
                  • You'll receive login credentials via email
                  <br />
                  • Free 14-day trial starts immediately
                  <br />• Our support team will help you get started
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="div" fontWeight="bold">
            Create Your School Platform
          </Typography>
          {!loading && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Set up your complete school management system in minutes
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleBack} disabled={activeStep === 0 || loading} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: 1 }} />
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minWidth: 120,
            }}
          >
            Next Step
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={loading || !formik.values.agree_terms || !formik.values.agree_privacy}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minWidth: 160,
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              'Create School Platform'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TenantRegistration;
