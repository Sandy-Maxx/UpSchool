import React, { useState } from 'react'
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

export const ChangePasswordForm: React.FC<{
  onChange: (data: { email: string; code: string; newPassword: string }) => Promise<void> | void
}> = ({ onChange }) => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      await onChange({ email, code, newPassword })
      setMessage('Password successfully changed. You can now sign in.')
    } catch (e: any) {
      setError(e?.message ?? 'Change failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>Reset Password</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
            <TextField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth />
            {message && <Typography color="success.main" variant="body2">{message}</Typography>}
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={!email || !code || !newPassword || submitting}>{submitting ? 'Changing…' : 'Change Password'}</Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
