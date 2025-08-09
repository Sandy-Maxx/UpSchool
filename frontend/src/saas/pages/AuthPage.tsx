import React from 'react';
import { Navigate } from 'react-router-dom';
import SaaSLoginForm from '../components/auth/LoginForm';
import { useAuth } from '../../shared/store/hooks';

const SaaSAuthPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated superadmins to dashboard
  if (isAuthenticated && user?.role === 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <SaaSLoginForm />;
};

export default SaaSAuthPage;
