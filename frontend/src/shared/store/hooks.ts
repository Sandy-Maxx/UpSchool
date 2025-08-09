import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience selectors for common auth state
export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  return auth;
};

export const useUser = () => {
  const user = useAppSelector(state => state.auth.user);
  const permissions = useAppSelector(state => state.auth.permissions);
  const portalType = useAppSelector(state => state.auth.portalType);

  return { user, permissions, portalType };
};

export const useAuthStatus = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const loading = useAppSelector(state => state.auth.loading);
  const isRefreshing = useAppSelector(state => state.auth.isRefreshing);

  return { isAuthenticated, loading, isRefreshing };
};

export const useSession = () => {
  const session = useAppSelector(state => state.auth.session);
  const sessionExpiry = useAppSelector(state => state.auth.sessionExpiry);

  return { session, sessionExpiry };
};
