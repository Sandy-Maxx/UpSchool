import React from 'react'
import { Alert, Stack } from '@mui/material'

export const SessionExpiry: React.FC<{ remainingMs: number }> = ({ remainingMs }) => {
  const minutes = Math.floor(remainingMs / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)
  return (
    <Stack>
      <Alert severity={remainingMs < 2 * 60000 ? 'warning' : 'info'}>
        Session expires in {minutes}m {seconds}s. Save your work and re-authenticate if needed.
      </Alert>
    </Stack>
  )
}
