import React from 'react'
import { Container, Stack, Typography } from '@mui/material'
import { ForgotPasswordForm } from '../../features/auth/components/ForgotPasswordForm'
import { ChangePasswordForm } from '../../features/auth/components/ChangePasswordForm'
import { tenantAuthService } from '../../features/auth/services/authService'

export const PasswordResetPage: React.FC = () => {
  const [hasCode, setHasCode] = React.useState(false)

  // Adapt service return types (Promise<{ok:true}>) to expected Promise<void>
  const handleRequest = async (email: string): Promise<void> => {
    await tenantAuthService.requestPasswordReset({ email })
  }

  const handleChange = async (data: { email: string; code: string; newPassword: string }): Promise<void> => {
    await tenantAuthService.changePassword(data)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight="bold">Reset Password</Typography>
        {!hasCode ? (
          <>
            <ForgotPasswordForm onRequest={handleRequest} />
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={() => setHasCode(true)}>
              I already have a code
            </Typography>
          </>
        ) : (
          <ChangePasswordForm onChange={handleChange} />
        )}
      </Stack>
    </Container>
  )
}
