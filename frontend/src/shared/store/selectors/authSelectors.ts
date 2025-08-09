import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { PortalType } from '../../types';

// Base selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectPermissions = (state: RootState) => state.auth.permissions;
export const selectPortalType = (state: RootState) => state.auth.portalType;
export const selectSession = (state: RootState) => state.auth.session;
export const selectSessionExpiry = (state: RootState) => state.auth.sessionExpiry;
export const selectIsLoading = (state: RootState) => state.auth.loading;
export const selectIsRefreshing = (state: RootState) => state.auth.isRefreshing;
export const selectAuthError = (state: RootState) => state.auth.error;

// Computed selectors
export const selectUserRole = createSelector([selectUser], user => user?.role);

export const selectUserSchool = createSelector([selectUser], user => user?.school);

export const selectTenantInfo = createSelector([selectUser], user => user?.school?.tenant);

export const selectIsSessionValid = createSelector([selectSessionExpiry], sessionExpiry => {
  if (!sessionExpiry) return false;
  return Date.now() < sessionExpiry;
});

export const selectSessionTimeRemaining = createSelector([selectSessionExpiry], sessionExpiry => {
  if (!sessionExpiry) return 0;
  return Math.max(0, sessionExpiry - Date.now());
});

export const selectIsSessionExpiringSoon = createSelector(
  [selectSessionTimeRemaining],
  timeRemaining => {
    const fiveMinutes = 5 * 60 * 1000;
    return timeRemaining > 0 && timeRemaining < fiveMinutes;
  }
);

// Permission checking selectors
export const makeSelectHasPermission = () =>
  createSelector(
    [selectPermissions, (state: RootState, permission: string) => permission],
    (permissions, permission) => permissions.includes(permission)
  );

export const makeSelectHasAllPermissions = () =>
  createSelector(
    [selectPermissions, (state: RootState, requiredPermissions: string[]) => requiredPermissions],
    (permissions, requiredPermissions) =>
      requiredPermissions.every(permission => permissions.includes(permission))
  );

export const makeSelectHasAnyPermission = () =>
  createSelector(
    [selectPermissions, (state: RootState, requiredPermissions: string[]) => requiredPermissions],
    (permissions, requiredPermissions) =>
      requiredPermissions.some(permission => permissions.includes(permission))
  );

export const makeSelectHasRole = () =>
  createSelector(
    [selectUserRole, (state: RootState, role: string) => role],
    (userRole, role) => userRole === role
  );

export const makeSelectHasAnyRole = () =>
  createSelector(
    [selectUserRole, (state: RootState, roles: string[]) => roles],
    (userRole, roles) => (userRole ? roles.includes(userRole) : false)
  );

// Portal-specific selectors
export const selectIsSaasPortal = createSelector(
  [selectPortalType],
  portalType => portalType === 'saas'
);

export const selectIsTenantPortal = createSelector(
  [selectPortalType],
  portalType => portalType === 'tenant'
);

// User profile selectors
export const selectUserDisplayName = createSelector([selectUser], user => {
  if (!user) return '';
  return `${user.first_name} ${user.last_name}`.trim() || user.username;
});

export const selectUserInitials = createSelector([selectUser], user => {
  if (!user) return '';
  const firstName = user.first_name?.charAt(0) || '';
  const lastName = user.last_name?.charAt(0) || '';
  return firstName + lastName || user.username.charAt(0).toUpperCase();
});

// Authentication status selectors
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectIsLoading, selectIsRefreshing],
  (isAuthenticated, loading, isRefreshing) => ({
    isAuthenticated,
    loading,
    isRefreshing,
    isReady: !loading && !isRefreshing,
  })
);

export const selectCanAccessPortal = createSelector(
  [
    selectIsAuthenticated,
    selectPortalType,
    (state: RootState, requiredPortal: PortalType) => requiredPortal,
  ],
  (isAuthenticated, currentPortal, requiredPortal) =>
    isAuthenticated && currentPortal === requiredPortal
);
