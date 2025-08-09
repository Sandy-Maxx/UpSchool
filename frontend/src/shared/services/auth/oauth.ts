// Minimal Google OAuth stub for Stage 2 tests
export const googleOAuth = {
  init: () => {},
  signIn: async () => ({ token: 'stub', profile: { email: 'test@example.com' } }),
  signOut: async () => {},
}

export const oauthConfig = {
  provider: 'google',
  scopes: ['profile', 'email'],
}

