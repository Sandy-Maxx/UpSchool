import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { TenantLoginPage, PasswordResetPage } from '../pages/auth'

export const TenantRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<TenantLoginPage />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />
      {/* Default redirect to login for tenant auth */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
