import { useEffect, useState } from 'react'
import { api } from '@/shared/services/api/client'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'

export default function Health() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const check = async () => {
    try {
      setStatus('loading')
      const res = await api.get('/api/health/')
      setStatus('ok')
      setMessage(typeof res.data === 'string' ? res.data : JSON.stringify(res.data))
    } catch (e: any) {
      setStatus('error')
      setMessage(e?.message || 'Health check failed')
    }
  }

  useEffect(() => {
    check()
  }, [])

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">Backend Health Check</Typography>
      {status === 'loading' && <CircularProgress />}
      {status === 'ok' && <Alert severity="success">Healthy: {message}</Alert>}
      {status === 'error' && <Alert severity="error">Error: {message}</Alert>}
      <Box>
        <Button variant="contained" onClick={check} disabled={status === 'loading'}>
          Re-check
        </Button>
      </Box>
    </Box>
  )
}

