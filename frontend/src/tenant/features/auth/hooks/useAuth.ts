import { useCallback, useMemo, useState } from 'react'
import { tenantAuthService } from '../services/authService'
import { LoginPayload, LoginResponse, TenantRole, TenantUser } from '../types/auth'
import { useSession } from './useSession'

export interface TenantAuthState {
  isAuthenticated: boolean
  user: TenantUser | null
  role: TenantRole | null
  tenantId: string | null
}

export const useTenantAuth = () => {
  const [state, setState] = useState<TenantAuthState>({ isAuthenticated: false, user: null, role: null, tenantId: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const session = useSession()

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true)
    setError(null)
    try {
      const res: LoginResponse = await tenantAuthService.login(payload)
      setState({
        isAuthenticated: true,
        user: res.user,
        role: res.user.role,
        tenantId: res.tenant.tenantId,
      })
      // Demo: 60 minutes validity
      session.start(60 * 60 * 1000)
      return res
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
      throw e
    } finally {
      setLoading(false)
    }
  }, [session])

  const logout = useCallback(() => {
    setState({ isAuthenticated: false, user: null, role: null, tenantId: null })
    session.clear()
  }, [session])

  const value = useMemo(() => ({ ...state, loading, error }), [state, loading, error])
  return { ...value, login, logout, session }
}
