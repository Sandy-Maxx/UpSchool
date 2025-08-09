import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { refreshToken, setIsRefreshing, clearSession } from '../slices/authSlice';
import type { RootState } from '../index';

// Create the middleware instance
export const sessionMiddleware = createListenerMiddleware();

// Session expiry check interval (5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

// Token refresh threshold (refresh when less than 10 minutes remaining)
const REFRESH_THRESHOLD = 10 * 60 * 1000;

// Auto-refresh logic
sessionMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    const state = currentState as RootState;
    const prevState = previousState as RootState;

    // Check if user just became authenticated or session changed
    return (
      state.auth.isAuthenticated &&
      (!prevState.auth.isAuthenticated || state.auth.sessionExpiry !== prevState.auth.sessionExpiry)
    );
  },
  effect: async (action, listenerApi) => {
    const { dispatch, getState } = listenerApi;

    // Set up periodic session checking
    const checkSession = () => {
      const state = getState() as RootState;
      const { sessionExpiry, isRefreshing, isAuthenticated } = state.auth;

      if (!isAuthenticated || isRefreshing || !sessionExpiry) {
        return;
      }

      const now = Date.now();
      const timeUntilExpiry = sessionExpiry - now;

      // If session has expired, clear it
      if (timeUntilExpiry <= 0) {
        dispatch(clearSession());
        return;
      }

      // If session is close to expiry, refresh the token
      if (timeUntilExpiry <= REFRESH_THRESHOLD) {
        dispatch(refreshToken());
      }
    };

    // Check immediately
    checkSession();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkSession, SESSION_CHECK_INTERVAL);

    // Clean up when user logs out or session is cleared
    await listenerApi.condition((action, currentState) => {
      const state = currentState as RootState;
      return !state.auth.isAuthenticated;
    });

    clearInterval(intervalId);
  },
});

// Handle failed token refresh
sessionMiddleware.startListening({
  actionCreator: refreshToken.rejected,
  effect: async (action, listenerApi) => {
    const { dispatch } = listenerApi;

    // If refresh failed, clear the session
    dispatch(clearSession());

    // Optionally redirect to login
    if (typeof window !== 'undefined') {
      // Check if we're not already on a login page
      const currentPath = window.location.pathname;
      const loginPaths = ['/login', '/auth', '/signin'];

      if (!loginPaths.some(path => currentPath.includes(path))) {
        window.location.href = '/login';
      }
    }
  },
});

// Handle successful token refresh
sessionMiddleware.startListening({
  actionCreator: refreshToken.fulfilled,
  effect: async (action, listenerApi) => {
    console.log('Token refreshed successfully');

    // Optionally dispatch a notification or update UI
    // dispatch(addNotification({
    //   type: 'info',
    //   message: 'Session refreshed',
    //   duration: 3000
    // }));
  },
});

// Handle token refresh start
sessionMiddleware.startListening({
  actionCreator: refreshToken.pending,
  effect: async (action, listenerApi) => {
    const { dispatch } = listenerApi;
    dispatch(setIsRefreshing(true));
  },
});

// Handle token refresh completion (success or failure)
sessionMiddleware.startListening({
  matcher: isAnyOf(refreshToken.fulfilled, refreshToken.rejected),
  effect: async (action, listenerApi) => {
    const { dispatch } = listenerApi;
    dispatch(setIsRefreshing(false));
  },
});

// Export the middleware
export default sessionMiddleware;
