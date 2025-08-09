import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './shared/contexts/AuthContext'
// Import pages
import Login from './pages/auth/Login'
import Health from './pages/Health'
import LandingPage from './saas/pages/LandingPage'
// Import SaaS Portal pages
import SuperAdminLoginPage from './saas/pages/auth/SuperAdminLoginPage'
import TenantRegistrationPage from './saas/pages/auth/TenantRegistrationPage'
import SecurityAuditPage from './saas/pages/admin/SecurityAuditPage'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  return children
}

// Component to detect portal context
function PortalRouter() {
  const location = useLocation()
  
  // Check if we're on the main domain (SaaS portal)
  // In development, we'll use path-based routing
  // In production, this would check subdomain
  const isSaasPortal = location.pathname.startsWith('/saas') || location.pathname === '/'
  
  if (isSaasPortal && location.pathname === '/') {
    return <LandingPage />
  }
  
  return (
    <Routes>
      {/* SaaS Portal Routes */}
      <Route path="/saas" element={<LandingPage />} />
      <Route path="/saas/register" element={<TenantRegistrationPage />} />
      <Route path="/saas/admin/login" element={<SuperAdminLoginPage />} />
      <Route path="/saas/admin/security" element={
        <ProtectedRoute>
          <SecurityAuditPage />
        </ProtectedRoute>
      } />
      <Route path="/saas/admin" element={<div>Super Admin Portal Dashboard (Coming Soon)</div>} />
      
      {/* Shared routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/health" element={<Health />} />
      
      {/* Tenant Portal Routes (Coming Soon) */}
      <Route path="/tenant/*" element={<div>Tenant Portal (Coming Soon)</div>} />
      
      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div style={{ padding: 16 }}>Welcome to School ERP Dashboard</div>
          </ProtectedRoute>
        }
      />
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <PortalRouter />
    </AuthProvider>
  )
}

