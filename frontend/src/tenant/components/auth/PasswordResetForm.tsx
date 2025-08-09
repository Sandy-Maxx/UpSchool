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
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { Email, Lock, CheckCircle, ArrowBack, School } from '@mui/icons-material';

// Validation schemas for each step
const emailSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
});

const verificationSchema = yup.object().shape({
  verificationCode: yup
    .string()
    .required('Verification code is required')
    .length(6, 'Verification code must be 6 digits'),
});

const resetSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

type EmailFormData = yup.InferType<typeof emailSchema>;
type VerificationFormData = yup.InferType<typeof verificationSchema>;
type ResetFormData = yup.InferType<typeof resetSchema>;

const TenantPasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [tenantInfo, setTenantInfo] = useState({
    name: 'Demo School',
    subdomain: 'demo',
  });

  const emailForm = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
    mode: 'onChange',
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: yupResolver(verificationSchema),
    mode: 'onChange',
  });

  const resetForm = useForm<ResetFormData>({
    resolver: yupResolver(resetSchema),
    mode: 'onChange',
  });

  const steps = ['Enter Email Address', 'Verify Identity', 'Set New Password', 'Password Updated'];

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      // Mock API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 1000));

      setEmail(data.email);
      setActiveStep(1);
    } catch (error) {
      emailForm.setError('email', {
        type: 'manual',
        message: 'Failed to send verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    try {
      // Mock API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - in real implementation, verify with backend
      if (data.verificationCode !== '123456') {
        verificationForm.setError('verificationCode', {
          type: 'manual',
          message: 'Invalid verification code. Please try again.',
        });
        return;
      }

      setActiveStep(2);
    } catch (error) {
      verificationForm.setError('verificationCode', {
        type: 'manual',
        message: 'Failed to verify code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    try {
      // Mock API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1000));

      setActiveStep(3);
    } catch (error) {
      resetForm.setError('newPassword', {
        type: 'manual',
        message: 'Failed to update password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Mock API call to resend verification code
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message (in real implementation, this would be handled by a toast/alert)
      console.log('Verification code resent');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1 }} />
              Enter Your Email Address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We'll send a verification code to your email address to confirm your identity.
            </Typography>

            <Box component="form" onSubmit={emailForm.handleSubmit(handleEmailSubmit)} noValidate>
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    error={!!emailForm.formState.errors.email}
                    helperText={
                      emailForm.formState.errors.email?.message ||
                      `Enter the email address associated with your ${tenantInfo.name} account`
                    }
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!emailForm.formState.isValid || isLoading}
                sx={{ py: 1.5 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 1 }} />
              Enter Verification Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a 6-digit verification code to <strong>{email}</strong>. Please check your
              email and enter the code below.
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>For demo purposes:</strong> Use code <code>123456</code> to proceed.
              </Typography>
            </Alert>

            <Box
              component="form"
              onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)}
              noValidate
            >
              <Controller
                name="verificationCode"
                control={verificationForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Verification Code"
                    inputProps={{
                      maxLength: 6,
                      style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' },
                    }}
                    disabled={isLoading}
                    error={!!verificationForm.formState.errors.verificationCode}
                    helperText={verificationForm.formState.errors.verificationCode?.message}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!verificationForm.formState.isValid || isLoading}
                sx={{ py: 1.5, mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
              </Button>

              <Button fullWidth variant="text" onClick={handleResendCode} disabled={isLoading}>
                Didn't receive the code? Resend
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Lock sx={{ mr: 1 }} />
              Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please create a strong password for your account. Your password should be at least 8
              characters long and include a mix of letters, numbers, and special characters.
            </Typography>

            <Box
              component="form"
              onSubmit={resetForm.handleSubmit(handlePasswordResetSubmit)}
              noValidate
            >
              <Controller
                name="newPassword"
                control={resetForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="New Password"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    error={!!resetForm.formState.errors.newPassword}
                    helperText={resetForm.formState.errors.newPassword?.message}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={resetForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    error={!!resetForm.formState.errors.confirmPassword}
                    helperText={resetForm.formState.errors.confirmPassword?.message}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!resetForm.formState.isValid || isLoading}
                sx={{ py: 1.5 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
              </Button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Paper
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                bgcolor: 'success.main',
              }}
            >
              <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
            </Paper>

            <Typography variant="h6" gutterBottom>
              Password Updated Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your password has been updated. You can now sign in with your new password.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ py: 1.5 }}
            >
              Return to Sign In
            </Button>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Box sx={{ maxWidth: 600, width: '100%' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Paper
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <School sx={{ fontSize: 40, color: 'white' }} />
          </Paper>

          <Typography variant="h4" fontWeight={700} gutterBottom color="white">
            Reset Password
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.8)">
            {tenantInfo.name} - Secure Password Recovery
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>{renderStepContent(index)}</StepContent>
                </Step>
              ))}
            </Stepper>

            {/* Back to Login */}
            {activeStep < 3 && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                  color="inherit"
                >
                  Back to Sign In
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TenantPasswordResetForm;
