import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import {
  School,
  Business,
  Person,
  Security,
  CheckCircle,
  Phone,
  Email,
  LocationOn,
  Group,
} from '@mui/icons-material';

// Validation schemas for each step
const schoolInfoSchema = yup.object().shape({
  name: yup
    .string()
    .required('School name is required')
    .min(2, 'School name must be at least 2 characters'),
  type: yup.string().required('School type is required'),
  subdomain: yup
    .string()
    .required('Subdomain is required')
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be less than 63 characters')
    .matches(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
    .matches(/^[a-z0-9]/, 'Subdomain must start with a letter or number')
    .matches(/[a-z0-9]$/, 'Subdomain must end with a letter or number'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
  phone: yup.string().required('Phone number is required'),
  website: yup.string().url('Please enter a valid URL'),
});

const adminInfoSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  phone: yup.string().required('Phone number is required'),
  title: yup.string().required('Title is required'),
});

const subscriptionSchema = yup.object().shape({
  plan: yup.string().required('Please select a subscription plan'),
  studentCapacity: yup
    .number()
    .required('Student capacity is required')
    .min(1, 'Must be at least 1'),
  agreedToTerms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
  agreedToPrivacy: yup.boolean().oneOf([true], 'You must agree to the privacy policy'),
});

interface SchoolInfoData {
  name: string;
  type: string;
  subdomain: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  website: string;
}

interface AdminInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
}

interface SubscriptionData {
  plan: string;
  studentCapacity: number;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

interface TenantRegistrationData extends SchoolInfoData, AdminInfoData, SubscriptionData {}

const schoolTypes = [
  'Elementary School',
  'Middle School',
  'High School',
  'K-12 School',
  'Private School',
  'International School',
  'Montessori School',
  'Charter School',
  'Boarding School',
  'Special Education School',
];

const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    maxStudents: 100,
    features: ['Basic Student Management', 'Grade Book', 'Parent Portal', 'Basic Reports'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 59,
    maxStudents: 500,
    features: [
      'All Starter Features',
      'Library Management',
      'Transport Management',
      'Advanced Reports',
      'API Access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    maxStudents: 2000,
    features: [
      'All Professional Features',
      'Custom Integrations',
      'Advanced Analytics',
      'Priority Support',
      'SSO Integration',
    ],
  },
];

const TenantRegistrationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [subdomainChecking, setSubdomainChecking] = useState(false);

  // Form instances for each step
  const schoolForm = useForm<SchoolInfoData>({
    resolver: yupResolver(schoolInfoSchema),
    mode: 'onChange',
  });

  const adminForm = useForm<AdminInfoData>({
    resolver: yupResolver(adminInfoSchema),
    mode: 'onChange',
  });

  const subscriptionForm = useForm<SubscriptionData>({
    resolver: yupResolver(subscriptionSchema),
    mode: 'onChange',
  });

  const steps = [
    'School Information',
    'Administrator Details',
    'Subscription Plan',
    'Review & Submit',
  ];

  // Check subdomain availability
  const checkSubdomainAvailability = async (subdomain: string) => {
    if (subdomain.length < 3) return;

    setSubdomainChecking(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock availability check (in real implementation, call API)
      const unavailableSubdomains = ['admin', 'www', 'api', 'test', 'demo'];
      const isAvailable = !unavailableSubdomains.includes(subdomain.toLowerCase());
      setSubdomainAvailable(isAvailable);
    } finally {
      setSubdomainChecking(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;

    switch (activeStep) {
      case 0:
        isValid = await schoolForm.trigger();
        break;
      case 1:
        isValid = await adminForm.trigger();
        break;
      case 2:
        isValid = await subscriptionForm.trigger();
        break;
      case 3:
        return handleSubmit();
      default:
        isValid = false;
    }

    if (isValid) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const schoolData = schoolForm.getValues();
      const adminData = adminForm.getValues();
      const subscriptionData = subscriptionForm.getValues();

      const registrationData: TenantRegistrationData = {
        ...schoolData,
        ...adminData,
        ...subscriptionData,
      };

      console.log('Registration data:', registrationData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to success page
      navigate('/registration/success', {
        state: {
          schoolName: schoolData.name,
          subdomain: schoolData.subdomain,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
            >
              <School sx={{ mr: 1 }} />
              School Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="School Name"
                      error={!!schoolForm.formState.errors.name}
                      helperText={schoolForm.formState.errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="type"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!schoolForm.formState.errors.type}>
                      <InputLabel>School Type</InputLabel>
                      <Select {...field} label="School Type">
                        {schoolTypes.map(type => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="subdomain"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Subdomain"
                      error={
                        !!schoolForm.formState.errors.subdomain || subdomainAvailable === false
                      }
                      helperText={
                        schoolForm.formState.errors.subdomain?.message ||
                        (subdomainAvailable === false && 'This subdomain is not available') ||
                        (subdomainAvailable === true && 'This subdomain is available') ||
                        'Your school portal URL will be: https://[subdomain].yourschool.com'
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {subdomainChecking ? (
                              <CircularProgress size={20} />
                            ) : subdomainAvailable === true ? (
                              <CheckCircle color="success" />
                            ) : null}
                          </InputAdornment>
                        ),
                      }}
                      onChange={e => {
                        field.onChange(e);
                        if (e.target.value.length >= 3) {
                          checkSubdomainAvailability(e.target.value);
                        } else {
                          setSubdomainAvailable(null);
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address"
                      multiline
                      rows={2}
                      error={!!schoolForm.formState.errors.address}
                      helperText={schoolForm.formState.errors.address?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="city"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      error={!!schoolForm.formState.errors.city}
                      helperText={schoolForm.formState.errors.city?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="state"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State/Province"
                      error={!!schoolForm.formState.errors.state}
                      helperText={schoolForm.formState.errors.state?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="zipCode"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="ZIP/Postal Code"
                      error={!!schoolForm.formState.errors.zipCode}
                      helperText={schoolForm.formState.errors.zipCode?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="country"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Country"
                      error={!!schoolForm.formState.errors.country}
                      helperText={schoolForm.formState.errors.country?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="phone"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!schoolForm.formState.errors.phone}
                      helperText={schoolForm.formState.errors.phone?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="website"
                  control={schoolForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Website (Optional)"
                      error={!!schoolForm.formState.errors.website}
                      helperText={schoolForm.formState.errors.website?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
            >
              <Person sx={{ mr: 1 }} />
              Administrator Details
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              This person will be the primary administrator for your school's portal and will
              receive login credentials.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={adminForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="First Name"
                      error={!!adminForm.formState.errors.firstName}
                      helperText={adminForm.formState.errors.firstName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastName"
                  control={adminForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Last Name"
                      error={!!adminForm.formState.errors.lastName}
                      helperText={adminForm.formState.errors.lastName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={adminForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      type="email"
                      error={!!adminForm.formState.errors.email}
                      helperText={adminForm.formState.errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="phone"
                  control={adminForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!adminForm.formState.errors.phone}
                      helperText={adminForm.formState.errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="title"
                  control={adminForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Title/Position"
                      error={!!adminForm.formState.errors.title}
                      helperText={adminForm.formState.errors.title?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
            >
              <Business sx={{ mr: 1 }} />
              Choose Your Subscription Plan
            </Typography>

            <Grid container spacing={3}>
              {subscriptionPlans.map(plan => (
                <Grid item xs={12} md={4} key={plan.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      border: subscriptionForm.watch('plan') === plan.id ? 2 : 1,
                      borderColor:
                        subscriptionForm.watch('plan') === plan.id ? 'primary.main' : 'divider',
                    }}
                    onClick={() => subscriptionForm.setValue('plan', plan.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        {plan.name}
                      </Typography>
                      <Typography variant="h3" color="primary" fontWeight={700} gutterBottom>
                        ${plan.price}
                        <Typography component="span" variant="body2" color="text.secondary">
                          /month
                        </Typography>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Up to {plan.maxStudents} students
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ textAlign: 'left' }}>
                        {plan.features.map(feature => (
                          <Typography
                            key={feature}
                            variant="body2"
                            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                          >
                            <CheckCircle sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Controller
                name="studentCapacity"
                control={subscriptionForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Expected Number of Students"
                    type="number"
                    error={!!subscriptionForm.formState.errors.studentCapacity}
                    helperText={subscriptionForm.formState.errors.studentCapacity?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Group />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Controller
                name="agreedToTerms"
                control={subscriptionForm.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="I agree to the Terms and Conditions"
                  />
                )}
              />
              {subscriptionForm.formState.errors.agreedToTerms && (
                <Typography color="error" variant="caption">
                  {subscriptionForm.formState.errors.agreedToTerms.message}
                </Typography>
              )}
            </Box>

            <Box>
              <Controller
                name="agreedToPrivacy"
                control={subscriptionForm.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="I agree to the Privacy Policy"
                  />
                )}
              />
              {subscriptionForm.formState.errors.agreedToPrivacy && (
                <Typography color="error" variant="caption">
                  {subscriptionForm.formState.errors.agreedToPrivacy.message}
                </Typography>
              )}
            </Box>
          </Box>
        );

      case 3:
        const schoolData = schoolForm.getValues();
        const adminData = adminForm.getValues();
        const subscriptionData = subscriptionForm.getValues();
        const selectedPlan = subscriptionPlans.find(plan => plan.id === subscriptionData.plan);

        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
            >
              <CheckCircle sx={{ mr: 1 }} />
              Review Your Registration
            </Typography>

            <Grid container spacing={3}>
              {/* School Information */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <School sx={{ mr: 1 }} />
                    School Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Name:
                      </Typography>
                      <Typography variant="body1">{schoolData.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Type:
                      </Typography>
                      <Typography variant="body1">{schoolData.type}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Portal URL:
                      </Typography>
                      <Typography variant="body1">
                        https://{schoolData.subdomain}.yourschool.com
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone:
                      </Typography>
                      <Typography variant="body1">{schoolData.phone}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Administrator Information */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Person sx={{ mr: 1 }} />
                    Administrator Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Name:
                      </Typography>
                      <Typography variant="body1">
                        {adminData.firstName} {adminData.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Title:
                      </Typography>
                      <Typography variant="body1">{adminData.title}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body1">{adminData.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone:
                      </Typography>
                      <Typography variant="body1">{adminData.phone}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Subscription Information */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Business sx={{ mr: 1 }} />
                    Subscription Plan
                  </Typography>
                  {selectedPlan && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Plan:
                        </Typography>
                        <Typography variant="body1">{selectedPlan.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Cost:
                        </Typography>
                        <Typography variant="body1">${selectedPlan.price}/month</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Student Capacity:
                        </Typography>
                        <Typography variant="body1">
                          Up to {selectedPlan.maxStudents} students
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Expected Students:
                        </Typography>
                        <Typography variant="body1">{subscriptionData.studentCapacity}</Typography>
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Next Steps:</strong> After submission, you'll receive an email with setup
                instructions and login credentials for your school administrator.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            School Registration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set up your school's ERP system in just a few steps
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {renderStepContent(index)}

                    <Box sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={
                          isSubmitting ||
                          (activeStep === 0 &&
                            (!schoolForm.formState.isValid || subdomainAvailable !== true)) ||
                          (activeStep === 1 && !adminForm.formState.isValid) ||
                          (activeStep === 2 && !subscriptionForm.formState.isValid)
                        }
                        sx={{ mr: 1 }}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} />
                        ) : activeStep === steps.length - 1 ? (
                          'Complete Registration'
                        ) : (
                          'Continue'
                        )}
                      </Button>
                      <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack}>
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TenantRegistrationWizard;
