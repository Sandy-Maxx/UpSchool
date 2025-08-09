import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  loginAsync, 
  logoutAsync, 
  getCurrentUserAsync,
  setAuthFromStorage,
  clearError 
} from '../store/slices/authSlice';
import { addSuccessNotification, addErrorNotification } from '../store/slices/notificationSlice';
import { SUCCESS_MESSAGES, AUTH_CONFIG } from '../constants';
import type { User, Tenant, LoginCredentials } from '../types';

// Auth context type definition
type AuthContextType = {
  // State
  isAuthenticated: boolean;
  user: User | null;
  tenant: Tenant | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  
  // Utility functions
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Enhanced AuthProvider using Redux for state management
 * Provides comprehensive authentication functionality
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Select auth state from Redux store
  const {
    isAuthenticated,
    user,
    tenant,
    permissions,
    loading,
    error,
  } = useAppSelector((state) => state.auth);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listen for auth failure events
  useEffect(() => {
    const handleAuthFailure = () => {
      navigate('/auth/login');
    };

    window.addEventListener('auth:failure', handleAuthFailure);
    return () => {
      window.removeEventListener('auth:failure', handleAuthFailure);
    };
  }, [navigate]);

  /**
   * Initialize authentication state from storage
   */
  const initializeAuth = async () => {
    try {
      const storedData = localStorage.getItem(AUTH_CONFIG.USER_STORAGE_KEY);
      
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const { user, tenant, permissions, tokens } = parsed;

        if (user && tokens?.access && tokens?.refresh) {
          dispatch(setAuthFromStorage({
            user,
            tenant,
            permissions: permissions || [],
            tokens,
          }));

          // Verify user session is still valid
          try {
            await dispatch(getCurrentUserAsync()).unwrap();
          } catch (error) {
            console.warn('Session validation failed, user may need to re-login');
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      localStorage.removeItem(AUTH_CONFIG.USER_STORAGE_KEY);
    }
  };

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      await dispatch(loginAsync(credentials)).unwrap();
      
      dispatch(addSuccessNotification({
        title: 'Welcome!',
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      }));

      // Navigate based on user role and portal type
      const portalType = determinePortalType();
      if (portalType === 'saas') {
        navigate('/saas/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      dispatch(addErrorNotification({
        title: 'Login Failed',
        message: error || 'Please check your credentials and try again.',
      }));
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      await dispatch(logoutAsync()).unwrap();
      
      dispatch(addSuccessNotification({
        title: 'Logged Out',
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      }));

      navigate('/auth/login');
    } catch (error) {
      // Even if logout API fails, clear local state
      console.error('Logout API failed:', error);
      navigate('/auth/login');
    }
  };

  /**
   * Get current user data
   */
  const getCurrentUser = async (): Promise<void> => {
    try {
      await dispatch(getCurrentUserAsync()).unwrap();
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  };

  /**
   * Clear authentication errors
   */
  const clearAuthError = (): void => {
    dispatch(clearError());
  };

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  /**
   * Determine portal type based on current context
   */
  const determinePortalType = (): 'saas' | 'tenant' => {
    // For now, use simple logic - can be enhanced based on subdomain, user role, etc.
    if (user?.is_superuser) {
      return 'saas';
    }
    return 'tenant';
  };

  // Context value
  const contextValue: AuthContextType = {
    // State
    isAuthenticated,
    user,
    tenant,
    permissions,
    loading,
    error,
    
    // Actions
    login,
    logout,
    getCurrentUser,
    clearError: clearAuthError,
    
    // Utility functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthProvider;

