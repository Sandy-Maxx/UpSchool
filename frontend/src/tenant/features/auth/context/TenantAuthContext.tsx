import React, { createContext, useContext } from 'react'
import { useTenantAuth } from '../hooks/useAuth'

export type TenantAuthContextValue = ReturnType<typeof useTenantAuth>

const TenantAuthContext = createContext<TenantAuthContextValue | null>(null)

export const TenantAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useTenantAuth()
  return <TenantAuthContext.Provider value={value}>{children}</TenantAuthContext.Provider>
}

export const useTenantAuthContext = () => {
  const ctx = useContext(TenantAuthContext)
  if (!ctx) throw new Error('useTenantAuthContext must be used within TenantAuthProvider')
  return ctx
}
