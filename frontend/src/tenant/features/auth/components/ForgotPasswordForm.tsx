import React, { useState } from 'react'
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

export const ForgotPasswordForm: React.FC<{ onRequest: (email: string) => Promise<void> | void }> = ({ onRequest }) => {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      await onRequest(email)
      setMessage('If an account exists for this email, a verification code has been sent.')
    } catch (e: any) {
      setError(e?.message ?? 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>Forgot Password</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            {message && <Typography color="success.main" variant="body2">{message}</Typography>}
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={!email || submitting}>{submitting ? 'Submitting…' : 'Send Code'}</Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
