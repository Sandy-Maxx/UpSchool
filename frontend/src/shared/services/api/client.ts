/*
 * Minimal API client used by RTK Query apiSlice for tests and development.
 * Provides a unified interface with { success, data, error } semantics.
 */
export interface ApiResult<T = any> {
  success: boolean;
  data?: T;
  error?: { code?: string | number; message?: string; details?: any } | any;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function request<T = any>(input: RequestInfo, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(
      typeof input === 'string' && !input.startsWith('http') ? `${API_BASE_URL}/api${input}` : input,
      {
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
        ...init,
      }
    );
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : ((await res.text()) as any);
    if (!res.ok) {
      return { success: false, error: { code: res.status, message: res.statusText, details: data } };
    }
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: { message: e?.message || 'Network error' } };
  }
}

export const apiClient = {
  get: <T = any>(url: string, init?: { params?: any; headers?: any }) => request<T>(url, { method: 'GET', headers: init?.headers }),
  post: <T = any>(url: string, body?: any, init?: { params?: any; headers?: any }) =>
    request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined, headers: init?.headers }),
  put: <T = any>(url: string, body?: any, init?: { params?: any; headers?: any }) =>
    request<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, headers: init?.headers }),
  patch: <T = any>(url: string, body?: any, init?: { params?: any; headers?: any }) =>
    request<T>(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, headers: init?.headers }),
  delete: <T = any>(url: string, init?: { params?: any; headers?: any }) => request<T>(url, { method: 'DELETE', headers: init?.headers }),
  // No-op auth helpers for tests and simple client
  setAuthToken: (_token?: string) => {},
  clearAuth: () => {},
};

// Basic portal context detection. In tests this can be mocked.
export function detectPortalContext(): { type: 'saas' | 'tenant' } {
  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    if (host.startsWith('app.') || host.includes('saas')) return { type: 'saas' } as const;
  } catch {}
  return { type: 'tenant' } as const;
}

// Lightweight clients routing through the main apiClient. In a full app these
// could point to distinct base URLs; for tests we just forward the calls.
export const saasApiClient = {
  post: apiClient.post,
  get: apiClient.get,
  patch: apiClient.patch,
  delete: apiClient.delete,
};

export const tenantApiClient = {
  post: apiClient.post,
  get: apiClient.get,
  patch: apiClient.patch,
  delete: apiClient.delete,
};
