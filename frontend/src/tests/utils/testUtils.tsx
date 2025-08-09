/**
 * Test Utilities - Custom Render Functions and Helpers
 * Multi-Tenant School ERP Platform - Production Testing
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore, Store } from '@reduxjs/toolkit';
import { apiSlice as importedApiSlice } from '@shared/store/slices/apiSlice';

// Fallback in case moduleNameMapper doesn't apply in a specific test context
const apiSlice = importedApiSlice ?? {
  reducerPath: 'api',
  reducer: (state = {}, _action: any) => state,
  middleware: (_api: any) => (next: any) => (action: any) => next(action),
};

// Import your reducers
import authReducer from '@shared/store/slices/authSlice';
import uiReducer from '@shared/store/slices/uiSlice';
import { theme } from '@shared/theme/theme';

// Mock store configuration for testing
export const createMockStore = (preloadedState?: any): Store => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for testing
      }).concat(apiSlice.middleware),
  });
};

// Default mock user data
export const mockSuperAdminUser = {
  id: 'test-super-admin-id',
  email: 'superadmin@schoolerp.com',
  name: 'Super Admin Test User',
  role: 'SUPER_ADMIN',
  roles: ['superadmin'],
  metadata: {},
  permissions: [
    'PLATFORM_ADMIN',
    'TENANT_MANAGEMENT',
    'SYSTEM_MONITORING',
    'REVENUE_ANALYTICS',
    'SECURITY_MANAGEMENT',
    'PLATFORM_METRICS',
    'TENANT_CREATE',
    'TENANT_READ',
    'TENANT_UPDATE',
    'TENANT_DELETE',
  ],
  tenantId: null, // Super admin is not associated with a tenant
  portalType: 'SAAS',
};

export const mockTenantAdminUser = {
  id: 'test-tenant-admin-id',
  email: 'admin@testschool.com',
  name: 'School Admin Test User',
  role: 'SCHOOL_ADMIN',
  roles: ['school_admin'],
  metadata: {},
  permissions: [
    'STUDENT_MANAGEMENT',
    'TEACHER_MANAGEMENT',
    'CLASS_MANAGEMENT',
    'ACADEMIC_MANAGEMENT',
    'FINANCIAL_MANAGEMENT',
    'REPORTING_ACCESS',
  ],
  tenantId: 'test-tenant-123',
  portalType: 'TENANT',
};

// Mock authentication state
export const mockAuthState = {
  isAuthenticated: true,
  user: mockSuperAdminUser,
  token: 'mock-jwt-token.test.signature',
  refreshToken: 'mock-refresh-token',
  loading: false,
  error: null,
  loginAttempts: 0,
  isLocked: false,
  lastActivity: new Date().toISOString(),
};

// Mock UI state
export const mockUIState = {
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  loading: false,
  error: null,
};

// Create test query client
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
        cacheTime: 0, // Don't cache in tests
      },
    },
  });

// AllTheProviders wrapper for testing
interface AllTheProvidersProps {
  children: React.ReactNode;
  initialState?: any;
  queryClient?: QueryClient;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  initialState = {},
  queryClient = createTestQueryClient(),
}) => {
  const store = createMockStore({
    auth: mockAuthState,
    ui: mockUIState,
    ...initialState,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { initialState, queryClient, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders initialState={initialState} queryClient={queryClient}>
      {children}
    </AllTheProviders>
  );

  // Ensure a deterministic default location for permission detection
  if (typeof window !== 'undefined' && window.location) {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, pathname: '/tenant' },
      writable: true,
    });
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Helper for testing authenticated components
export const renderWithAuth = (
  ui: ReactElement,
  user = mockSuperAdminUser,
  options: CustomRenderOptions = {}
) => {
  const authState = {
    ...mockAuthState,
    user,
  };

  return renderWithProviders(ui, {
    ...options,
    initialState: {
      auth: authState,
      ...options.initialState,
    },
  });
};

// Helper for testing unauthenticated state
export const renderWithoutAuth = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const unauthenticatedState = {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
    loginAttempts: 0,
    isLocked: false,
    lastActivity: null,
  };

  return renderWithProviders(ui, {
    ...options,
    initialState: {
      auth: unauthenticatedState,
      ...options.initialState,
    },
  });
};

// Helper for testing different user roles
export const renderWithRole = (
  ui: ReactElement,
  role: string,
  permissions: string[] = [],
  options: CustomRenderOptions = {}
) => {
  const user = {
    ...mockSuperAdminUser,
    role,
    permissions,
  };

  return renderWithAuth(ui, user, options);
};

// Helper for testing tenant-specific components
export const renderWithTenant = (
  ui: ReactElement,
  tenantId: string = 'test-tenant-123',
  options: CustomRenderOptions = {}
) => {
  const user = {
    ...mockTenantAdminUser,
    tenantId,
  };

  return renderWithAuth(ui, user, options);
};

// Security testing helpers
export const createMaliciousPayload = (type: 'XSS' | 'INJECTION' | 'OVERFLOW') => {
  switch (type) {
    case 'XSS':
      return '<script>alert("XSS")</script>';
    case 'INJECTION':
      return "'; DROP TABLE users; --";
    case 'OVERFLOW':
      return 'A'.repeat(10000);
    default:
      return '';
  }
};

export const generateMockJWT = (payload: any = {}) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000),
    })
  );
  const signature = 'mock-signature-for-testing';

  return `${header}.${body}.${signature}`;
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export const waitForLoadingToComplete = async (container: HTMLElement) => {
  // Wait for any loading spinners to disappear
  const loadingElements = container.querySelectorAll('[data-testid="loading"]');
  if (loadingElements.length > 0) {
    await new Promise(resolve => {
      const observer = new MutationObserver(() => {
        const currentLoadingElements = container.querySelectorAll('[data-testid="loading"]');
        if (currentLoadingElements.length === 0) {
          observer.disconnect();
          resolve(void 0);
        }
      });
      observer.observe(container, { childList: true, subtree: true });
    });
  }
};

// Accessibility testing helpers
export const checkAccessibility = (container: HTMLElement) => {
  // Check for basic accessibility requirements
  const images = container.querySelectorAll('img');
  const buttons = container.querySelectorAll('button');
  const inputs = container.querySelectorAll('input');

  const accessibilityIssues: string[] = [];

  // Check images have alt attributes
  images.forEach((img, index) => {
    if (!img.getAttribute('alt')) {
      accessibilityIssues.push(`Image ${index} missing alt attribute`);
    }
  });

  // Check buttons have accessible text
  buttons.forEach((button, index) => {
    if (!button.textContent && !button.getAttribute('aria-label')) {
      accessibilityIssues.push(`Button ${index} missing accessible text`);
    }
  });

  // Check inputs have labels
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      if (!label && !input.getAttribute('aria-label')) {
        accessibilityIssues.push(`Input ${index} missing label`);
      }
    }
  });

  return accessibilityIssues;
};

// Mock API response helpers
export const createMockApiResponse = (data: any, status: number = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
  config: {},
});

export const createMockErrorResponse = (message: string, status: number = 500) => ({
  response: {
    data: { message },
    status,
    statusText: 'Error',
    headers: {},
    config: {},
  },
});

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
