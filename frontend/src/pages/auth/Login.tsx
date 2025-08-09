import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useAuth } from '@/shared/contexts/AuthContext'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ username: email, password })
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Paper sx={{ p: 3, width: '100%' }} elevation={2}>
        <Typography variant="h5" mb={2}>
          Sign in
        </Typography>
        {isAuthenticated && <Alert severity="success">You are signed in</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

