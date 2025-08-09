import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { refreshTokenAsync, clearAuth, setAuthFromStorage } from '../slices/authSlice';
import { addErrorNotification } from '../slices/notificationSlice';
import { AUTH_CONFIG, ERROR_MESSAGES } from '../../constants';

/**
 * Session middleware for automatic token management and session monitoring
 */
export const sessionMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);
  
  // Initialize auth state from localStorage on app start
  if ((action as AnyAction).type === '@@INIT' || (action as AnyAction).type === 'persist/REHYDRATE') {
    initializeAuthFromStorage(store);
  }

  // Handle auth failures
  if ((action as AnyAction).type === 'auth/failure') {
    handleAuthFailure(store);
  }

  // Monitor session expiry
  if ((action as AnyAction).type && (action as AnyAction).type.startsWith('auth/')) {
    monitorSessionExpiry(store);
  }

  return result;
};

/**
 * Initialize authentication state from localStorage
 */
function initializeAuthFromStorage(store: any) {
  try {
    const storedData = localStorage.getItem(AUTH_CONFIG.USER_STORAGE_KEY);
    
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const { user, tenant, permissions, tokens } = parsed;

      // Validate required fields
      if (user && tokens?.access && tokens?.refresh) {
        // Check if token is expired
        const tokenPayload = parseJWT(tokens.access);
        const currentTime = Date.now() / 1000;

        if (tokenPayload && tokenPayload.exp > currentTime) {
          // Token is still valid, restore auth state
          store.dispatch(setAuthFromStorage({
            user,
            tenant,
            permissions: permissions || [],
            tokens,
          }));

          // Set up token refresh if needed
          const timeUntilExpiry = (tokenPayload.exp * 1000) - Date.now();
          const refreshThreshold = AUTH_CONFIG.REFRESH_THRESHOLD;

          if (timeUntilExpiry < refreshThreshold) {
            // Token expires soon, refresh it
            store.dispatch(refreshTokenAsync());
          } else {
            // Set up timer to refresh token before expiry
            setTimeout(() => {
              const state = store.getState();
              if (state.auth.isAuthenticated) {
                store.dispatch(refreshTokenAsync());
              }
            }, timeUntilExpiry - refreshThreshold);
          }
        } else {
          // Token is expired, try to refresh
          if (tokens.refresh) {
            store.dispatch(refreshTokenAsync());
          } else {
            // No refresh token, clear auth
            localStorage.removeItem(AUTH_CONFIG.USER_STORAGE_KEY);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to initialize auth from storage:', error);
    localStorage.removeItem(AUTH_CONFIG.USER_STORAGE_KEY);
  }
}

/**
 * Handle authentication failures
 */
function handleAuthFailure(store: any) {
  store.dispatch(clearAuth());
  store.dispatch(addErrorNotification({
    title: 'Session Expired',
    message: ERROR_MESSAGES.SESSION_EXPIRED,
  }));

  // Redirect to login if not already there
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    // Use setTimeout to avoid dispatching during render
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 100);
  }
}

/**
 * Monitor session expiry and set up automatic refresh
 */
function monitorSessionExpiry(store: any) {
  const state = store.getState();
  
  if (!state.auth.isAuthenticated || !state.auth.tokens.access) {
    return;
  }

  try {
    const tokenPayload = parseJWT(state.auth.tokens.access);
    
    if (tokenPayload) {
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (tokenPayload.exp * 1000) - Date.now();
      const refreshThreshold = AUTH_CONFIG.REFRESH_THRESHOLD;

      if (timeUntilExpiry < 0) {
        // Token is already expired
        handleAuthFailure(store);
      } else if (timeUntilExpiry < refreshThreshold) {
        // Token expires soon, refresh immediately
        store.dispatch(refreshTokenAsync());
      } else {
        // Set up timer to refresh token before expiry
        setTimeout(() => {
          const currentState = store.getState();
          if (currentState.auth.isAuthenticated) {
            store.dispatch(refreshTokenAsync());
          }
        }, timeUntilExpiry - refreshThreshold);
      }
    }
  } catch (error) {
    console.error('Failed to monitor session expiry:', error);
  }
}

/**
 * Parse JWT token to get payload
 */
function parseJWT(token: string): { exp: number; [key: string]: any } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
}

/**
 * Listen for custom auth events
 */
if (typeof window !== 'undefined') {
  window.addEventListener('auth:failure', () => {
    // This will be handled by the middleware when dispatched
  });

  // Handle browser tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Tab became visible, check session validity
      const storedData = localStorage.getItem(AUTH_CONFIG.USER_STORAGE_KEY);
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          const tokenPayload = parseJWT(parsed.tokens?.access);
          const currentTime = Date.now() / 1000;

          if (!tokenPayload || tokenPayload.exp < currentTime) {
            // Token expired while tab was hidden, trigger auth failure
            window.dispatchEvent(new CustomEvent('auth:failure'));
          }
        } catch (error) {
          console.error('Failed to validate session on tab focus:', error);
        }
      }
    }
  });
}
