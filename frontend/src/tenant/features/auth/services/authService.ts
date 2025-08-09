import { LoginPayload, LoginResponse, PasswordResetRequestPayload, PasswordResetVerifyPayload, PasswordChangePayload, TenantContext } from '../types/auth'

// Placeholder API client - replace with real client when backend is ready
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export const detectTenantFromSubdomain = (): TenantContext => {
  const host = window.location.hostname // e.g., school1.localhost or school1.example.com
  const parts = host.split('.')
  // Development fallback: localhost or 127.0.0.1 => use demo school
  if (host === 'localhost' || host === '127.0.0.1') {
    return { tenantId: 'demo', subdomain: 'demo', displayName: 'Demo School' }
  }
  // Assume first segment is subdomain
  const subdomain = parts[0]
  return { tenantId: subdomain, subdomain, displayName: `${subdomain.toUpperCase()} School` }
}

export const tenantAuthService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    // Simulate latency and basic auth logic
    await delay(800)
    const tenant = detectTenantFromSubdomain()

    if (!payload.email || !payload.password) {
      throw new Error('Missing credentials')
    }

    // Simple demo acceptance
    return {
      accessToken: 'tenant_access_token_demo',
      refreshToken: 'tenant_refresh_token_demo',
      user: {
        id: 'u_demo',
        email: payload.email,
        name: payload.email.split('@')[0],
        role: payload.role ?? 'admin',
        lastLoginAt: new Date().toISOString(),
      },
      tenant,
    }
  },

  async requestPasswordReset(payload: PasswordResetRequestPayload): Promise<{ ok: true }> {
    await delay(700)
    if (!payload.email) throw new Error('Email is required')
    return { ok: true }
  },

  async verifyResetCode(payload: PasswordResetVerifyPayload): Promise<{ ok: true }> {
    await delay(500)
    if (!payload.code) throw new Error('Code is required')
    return { ok: true }
  },

  async changePassword(payload: PasswordChangePayload): Promise<{ ok: true }> {
    await delay(800)
    if (!payload.newPassword || payload.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    return { ok: true }
  },
}
