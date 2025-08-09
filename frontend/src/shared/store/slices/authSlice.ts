import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api/client';
import { AUTH_CONFIG } from '../../constants';
import type { 
  AuthState, 
  User, 
  Tenant, 
  LoginCredentials, 
  LoginResponse 
} from '../../types';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tenant: null,
  tokens: {
    access: null,
    refresh: null,
  },
  permissions: [],
  loading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>('/api/v1/accounts/login/', credentials);
      
      // Store tokens in API client
      api.setTokens(response.data.access, response.data.refresh);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.tokens.refresh;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ access: string }>('/api/v1/accounts/token/refresh/', {
        refresh: refreshToken,
      });
      
      return response.data.access;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>('/api/v1/accounts/me/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get current user');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.tokens.refresh;
      
      if (refreshToken) {
        await api.post('/api/v1/accounts/logout/', { refresh: refreshToken });
      }
      
      // Clear tokens from API client
      api.logout();
      
      return null;
    } catch (error: any) {
      // Even if logout fails, we should clear local tokens
      api.logout();
      return null;
    }
  }
);

// Auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set authentication state from stored data
    setAuthFromStorage: (state, action: PayloadAction<{ 
      user: User; 
      tenant?: Tenant; 
      permissions: string[];
      tokens: { access: string; refresh: string };
    }>) => {
      const { user, tenant, permissions, tokens } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.tenant = tenant || null;
      state.permissions = permissions;
      state.tokens = tokens;
      state.error = null;
    },

    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Update permissions
    updatePermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },

    // Set tenant context
    setTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenant = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear auth state
    clearAuth: (state) => {
      return { ...initialState };
    },

    // Update access token
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.tokens.access = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { access, refresh, user, tenant, permissions } = action.payload;
        
        state.loading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.tenant = tenant || null;
        state.permissions = permissions;
        state.tokens = { access, refresh };
        state.error = null;

        // Store user data in localStorage for persistence
        localStorage.setItem(AUTH_CONFIG.USER_STORAGE_KEY, JSON.stringify({
          user,
          tenant,
          permissions,
          tokens: { access, refresh },
        }));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Token refresh
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.tokens.access = action.payload;
        
        // Update stored tokens
        const storedData = localStorage.getItem(AUTH_CONFIG.USER_STORAGE_KEY);
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            parsed.tokens.access = action.payload;
            localStorage.setItem(AUTH_CONFIG.USER_STORAGE_KEY, JSON.stringify(parsed));
          } catch (error) {
            console.error('Failed to update stored token:', error);
          }
        }
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        // Token refresh failed, clear auth state
        return { ...initialState };
      });

    // Get current user
    builder
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        
        // Update stored user data
        const storedData = localStorage.getItem(AUTH_CONFIG.USER_STORAGE_KEY);
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            parsed.user = action.payload;
            localStorage.setItem(AUTH_CONFIG.USER_STORAGE_KEY, JSON.stringify(parsed));
          } catch (error) {
            console.error('Failed to update stored user:', error);
          }
        }
      })
      .addCase(getCurrentUserAsync.rejected, (state) => {
        // User fetch failed, might be session expired
        state.error = 'Failed to verify user session';
      });

    // Logout
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        // Clear localStorage
        localStorage.removeItem(AUTH_CONFIG.USER_STORAGE_KEY);
        return { ...initialState };
      });
  },
});

// Export actions
export const {
  setAuthFromStorage,
  updateUserProfile,
  updatePermissions,
  setTenant,
  clearError,
  clearAuth,
  updateAccessToken,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
