export type TenantRole = 'admin' | 'teacher' | 'student' | 'parent' | 'staff'

export interface TenantContext {
  tenantId: string
  subdomain: string
  displayName?: string
}

export interface TenantUser {
  id: string
  email: string
  name: string
  role: TenantRole
  lastLoginAt?: string
}

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
  role?: TenantRole
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: TenantUser
  tenant: TenantContext
}

export interface PasswordResetRequestPayload {
  email: string
}

export interface PasswordResetVerifyPayload {
  email: string
  code: string
}

export interface PasswordChangePayload {
  email: string
  code: string
  newPassword: string
}

export interface SessionInfo {
  expiresAt: number
  idleTimeoutMs: number
}
