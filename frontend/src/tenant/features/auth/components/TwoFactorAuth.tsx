import React from 'react'
import { Card, CardContent, Stack, TextField, Typography } from '@mui/material'

export const TwoFactorAuth: React.FC<{ onVerify: (code: string) => Promise<void> | void }> = ({ onVerify }) => {
  const [code, setCode] = React.useState('')
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>Two-Factor Authentication</Typography>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">Enter the 6-digit code from your authenticator app.</Typography>
          <TextField label="Authentication Code" value={code} onChange={(e) => setCode(e.target.value)} />
        </Stack>
      </CardContent>
    </Card>
  )
}
