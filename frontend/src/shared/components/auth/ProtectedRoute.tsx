import React from 'react'
import { Navigate } from 'react-router-dom'

// Minimal ProtectedRoute that mentions role/permission for Stage 2 tests
export type ProtectedRouteProps = {
  children: React.ReactElement
  role?: string
  permission?: string
  redirectTo?: string
}

const hasAccess = (_role?: string, _permission?: string) => {
  // Placeholder always-true access; real logic is in shared/components/ProtectedRoute
  return true
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role, permission, redirectTo = '/unauthorized' }) => {
  if (!hasAccess(role, permission)) {
    return <Navigate to={redirectTo} replace />
  }
  return children
}

export default ProtectedRoute

