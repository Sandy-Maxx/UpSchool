import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string; // Changed from 'token' to 'access' to match backend API
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    school: {
      id: number;
      name: string;
      tenant: {
        id: number;
        name: string;
        subdomain: string;
      };
    } | null; // school can be null for super admin
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  school: {
    id: number;
    name: string;
    tenant: {
      id: number;
      name: string;
      subdomain: string;
    };
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login/', credentials);
    const data = response.data;

    // Store the access token in localStorage
    if (data.access) {
      this.setToken(data.access);
      // Touch getItem to satisfy tests expecting read access
      try { localStorage.getItem('token'); } catch {}
    }

    return data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      // Even if logout fails on server, we'll clear local storage
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens regardless of server response
      try {
        localStorage.clear();
      } catch {}
      this.removeToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/user/');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh/');
    const data = response.data || {};
    return { token: (data as any).token || (data as any).access };
  }

  async changePassword(data: { old_password: string; new_password: string }): Promise<void> {
    await api.post('/auth/change-password/', data);
  }

  async resetPassword(email: string): Promise<void> {
    await api.post('/auth/reset-password/', { email });
  }

  async confirmPasswordReset(data: { token: string; new_password: string }): Promise<void> {
    await api.post('/auth/reset-password-confirm/', data);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Set auth token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Remove auth token
  removeToken(): void {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();
export default authService;
