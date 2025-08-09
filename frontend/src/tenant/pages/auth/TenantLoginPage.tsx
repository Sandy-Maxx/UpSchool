import React from 'react'
import { Box, Container, Stack, Typography } from '@mui/material'
import { TenantLoginForm } from '../../features/auth/components/LoginForm'
import { useTenantAuth } from '../../features/auth/hooks/useAuth'
import { tenantAuthService } from '../../features/auth/services/authService'
import { ForgotPasswordForm } from '../../features/auth/components/ForgotPasswordForm'
import { ChangePasswordForm } from '../../features/auth/components/ChangePasswordForm'

export const TenantLoginPage: React.FC = () => {
  const auth = useTenantAuth()
  const [tab, setTab] = React.useState<'login' | 'forgot' | 'reset'>('login')

  const handleLogin = async (data: { email: string; password: string; remember: boolean; role: any }): Promise<void> => {
    await auth.login({ ...data })
    // In real app, redirect based on role
    // e.g., navigate(`/tenant/${auth.tenantId}/dashboard`)
  }

  const handleRequest = async (email: string): Promise<void> => {
    await tenantAuthService.requestPasswordReset({ email })
  }

  const handleChange = async (data: { email: string; code: string; newPassword: string }): Promise<void> => {
    await tenantAuthService.changePassword(data)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={3}>
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold">School Portal</Typography>
          <Typography variant="body1" color="text.secondary">Sign in to your school account</Typography>
        </Box>

        {tab === 'login' && (
          <>
            <TenantLoginForm onSubmit={handleLogin} />
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={() => setTab('forgot')}>
              Forgot password?
            </Typography>
          </>
        )}

        {tab === 'forgot' && (
          <>
            <ForgotPasswordForm onRequest={handleRequest} />
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={() => setTab('reset')}>
              I have a code
            </Typography>
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={() => setTab('login')}>
              Back to login
            </Typography>
          </>
        )}

        {tab === 'reset' && (
          <>
            <ChangePasswordForm onChange={handleChange} />
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={() => setTab('login')}>
              Back to login
            </Typography>
          </>
        )}
      </Stack>
    </Container>
  )
}
