import React, { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Divider, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SchoolIcon from '@mui/icons-material/School'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import BadgeIcon from '@mui/icons-material/Badge'
import { TenantRole } from '../types/auth'

export interface TenantLoginFormProps {
  onSubmit: (data: { email: string; password: string; remember: boolean; role: TenantRole }) => Promise<void> | void
  defaultRole?: TenantRole
  recentUsers?: { email: string; role: TenantRole }[]
}

const roleOptions: { value: TenantRole; label: string; icon: React.ReactNode }[] = [
  { value: 'admin', label: 'Administrator', icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { value: 'teacher', label: 'Teacher', icon: <BadgeIcon fontSize="small" /> },
  { value: 'student', label: 'Student', icon: <SchoolIcon fontSize="small" /> },
  { value: 'parent', label: 'Parent', icon: <FamilyRestroomIcon fontSize="small" /> },
  { value: 'staff', label: 'Staff', icon: <PersonOutlineIcon fontSize="small" /> },
]

export const TenantLoginForm: React.FC<TenantLoginFormProps> = ({ onSubmit, defaultRole = 'admin', recentUsers = [] }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [role, setRole] = useState<TenantRole>(defaultRole)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => email && password && role, [email, password, role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ email, password, remember, role })
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Tenant Login</Typography>
          <Typography variant="body2" color="text.secondary">Select your role</Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as TenantRole)}
              fullWidth
            >
              {roleOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              autoComplete="username"
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography variant="body2" color="error">{error}</Typography>
            )}

            <Button type="submit" variant="contained" disabled={!canSubmit || submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>

            {recentUsers.length > 0 && (
              <>
                <Divider textAlign="left">Recent users</Divider>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {recentUsers.map((u) => (
                    <Button key={`${u.email}-${u.role}`} size="small" variant="outlined" onClick={() => { setEmail(u.email); setRole(u.role) }}>
                      {u.email} • {u.role}
                    </Button>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
