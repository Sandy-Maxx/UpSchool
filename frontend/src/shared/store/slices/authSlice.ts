import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/api/auth';
import { PortalType } from '../../types';
import { apiSlice } from './apiSlice';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions: string[];
  school?: {
    id: number;
    name: string;
    tenant: {
      id: number;
      name: string;
      subdomain: string;
    };
  };
}

export interface Session {
  id: string;
  expires_at: string;
  last_activity: string;
  ip_address?: string;
  user_agent?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  session: Session | null;
  portalType: PortalType;
  permissions: string[];
  sessionExpiry: number | null;
  isRefreshing: boolean;
}

// Helper to detect portal type from hostname
const detectPortalType = (): PortalType => {
  if (typeof window === 'undefined') return 'saas';
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname.includes('erp-platform') ? 'saas' : 'tenant';
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  session: null,
  portalType: detectPortalType(),
  permissions: [],
  sessionExpiry: null,
  isRefreshing: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    localStorage.removeItem('token');
    return null;
  } catch (error: any) {
    localStorage.removeItem('token');
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const { refreshToken: token } = state.auth;

    if (!token) {
      return rejectWithValue('No refresh token available');
    }

    try {
      const response = await authService.refreshToken(token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refresh_token', response.refresh_token);
      return response;
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const validateSession = createAsyncThunk(
  'auth/validateSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.validateSession();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Session validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      localStorage.setItem('refresh_token', action.payload);
    },
    setPortalType: (state, action: PayloadAction<PortalType>) => {
      state.portalType = action.payload;
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    setSession: (state, action: PayloadAction<Session>) => {
      state.session = action.payload;
      state.sessionExpiry = new Date(action.payload.expires_at).getTime();
    },
    clearSession: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.session = null;
      state.permissions = [];
      state.sessionExpiry = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    },
    setIsRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, state => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, state => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.permissions = action.payload.permissions || [];
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.error = action.payload as string;
      })
      // Refresh Token
      .addCase(refreshToken.pending, state => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isRefreshing = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.session = null;
        state.sessionExpiry = null;
        state.error = action.payload as string;
      })
      // Validate Session
      .addCase(validateSession.pending, state => {
        state.loading = true;
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.sessionExpiry = new Date(action.payload.expires_at).getTime();
      })
      .addCase(validateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setToken,
  setRefreshToken,
  setPortalType,
  setPermissions,
  setSession,
  clearSession,
  setIsRefreshing,
} = authSlice.actions;

export default authSlice.reducer;
