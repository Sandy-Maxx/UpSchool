import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { apiClient } from '../../services/api/client';

// Custom base query using our existing API client
const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args
) => {
  const exec = async () => {
    if (typeof args === 'string') {
      return await apiClient.get(args);
    }
    const method = (args.method || 'GET').toUpperCase();
    switch (method) {
      case 'GET':
        return await apiClient.get(args.url, { params: args.params, headers: args.headers });
      case 'POST':
        return await apiClient.post(args.url, args.body, { params: args.params, headers: args.headers });
      case 'PUT':
        return await apiClient.put(args.url, args.body, { params: args.params, headers: args.headers });
      case 'PATCH':
        return await apiClient.patch(args.url, args.body, { params: args.params, headers: args.headers });
      case 'DELETE':
        return await apiClient.delete(args.url, { params: args.params, headers: args.headers });
      default:
        return await apiClient.get(args.url, { params: args.params, headers: args.headers });
    }
  };

  const result = await exec();
  if (result.success) {
    return { data: result.data };
  }
  return {
    error: {
      status: typeof result.error?.code === 'string' && result.error.code.startsWith('HTTP_')
        ? Number(result.error.code.replace('HTTP_', ''))
        : 500,
      data: result.error || 'Request failed',
    },
  };
};

// Define the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,

  // Tag types for cache invalidation
  tagTypes: [
    'Auth',
    'User',
    'Student',
    'StudentAttendance',
    'StudentGrades',
    'Teacher',
    'School',
    'Class',
    'Subject',
    'Book',
    'Vehicle',
    'Route',
    'Message',
    'Report',
    'Tenant',
    'SystemHealth',
  ],

  // Keep unused data for 60 seconds
  keepUnusedDataFor: 60,

  // Refetch on mount or arg change
  refetchOnMountOrArgChange: 30,

  // Refetch on focus (when user returns to tab)
  refetchOnFocus: true,

  // Refetch on network reconnect
  refetchOnReconnect: true,

  endpoints: builder => ({
    // Auth endpoints
    login: builder.mutation<
      { token: string; refresh_token: string; user: any; permissions: string[] },
      { email: string; password: string }
    >({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    refreshToken: builder.mutation<
      { token: string; refresh_token: string },
      { refresh_token: string }
    >({
      query: body => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    // User profile endpoints
    getUserProfile: builder.query<any, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<any, Partial<any>>({
      query: updates => ({
        url: '/auth/profile',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),

    // Change password
    changePassword: builder.mutation<
      { message: string },
      { current_password: string; new_password: string }
    >({
      query: body => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),

    // Students endpoints (example)
    getStudents: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = '' }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        return `/students?${params.toString()}`;
      },
      // Normalize to {results, count}
      transformResponse: (response: any) => normalizeStudentsResponse(response),
      providesTags: ['Student'],
    }),

    getStudent: builder.query<any, number | string>({
      query: id => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // Student attendance and grades
    getStudentAttendance: builder.query<any, { id: number | string; from?: string; to?: string }>(
      {
        query: ({ id, from, to }) => {
          const params = new URLSearchParams();
          if (from) params.set('from', from);
          if (to) params.set('to', to);
          const qs = params.toString();
          return `/students/${id}/attendance${qs ? `?${qs}` : ''}`;
        },
        providesTags: (result, error, { id }) => [{ type: 'StudentAttendance', id }],
      }
    ),

    getStudentGrades: builder.query<any, { id: number | string; term?: string }>(
      {
        query: ({ id, term }) => {
          const params = new URLSearchParams();
          if (term) params.set('term', term);
          const qs = params.toString();
          return `/students/${id}/grades${qs ? `?${qs}` : ''}`;
        },
        providesTags: (result, error, { id }) => [{ type: 'StudentGrades', id }],
      }
    ),

    createStudent: builder.mutation<any, Partial<any>>({
      query: student => ({
        url: '/students',
        method: 'POST',
        body: student,
      }),
      invalidatesTags: ['Student'],
    }),

    updateStudent: builder.mutation<any, { id: number | string; updates: Partial<any> }>({
      query: ({ id, updates }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }],
    }),

    deleteStudent: builder.mutation<{ message: string }, number | string>({
      query: id => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),

    // System health (for SaaS portal)
    getSystemHealth: builder.query<any, void>({
      query: () => '/system/health',
      providesTags: ['SystemHealth'],
    }),

    // Tenants (for SaaS portal)
    getTenants: builder.query<any[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/tenants?page=${page}&limit=${limit}`,
      providesTags: ['Tenant'],
    }),

    getTenant: builder.query<any, number>({
      query: id => `/tenants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tenant', id }],
    }),
  }),
});

// Export hooks for usage in components
// Helper exported for tests
export const normalizeStudentsResponse = (response: any) => {
  if (response && typeof response === 'object') {
    if (Array.isArray(response.results)) {
      return { results: response.results, count: response.count ?? (response as any).total ?? response.results.length };
    }
    if (Array.isArray((response as any).data)) {
      return { results: (response as any).data, count: (response as any).count ?? (response as any).total ?? (response as any).data.length };
    }
  }
  return Array.isArray(response) ? { results: response, count: response.length } : { results: [], count: 0 };
};

export const {
  // Auth hooks
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,

  // User profile hooks
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,

  // Students hooks
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,

  // System hooks
  useGetSystemHealthQuery,

  // Tenant hooks
  useGetTenantsQuery,
  useGetTenantQuery,
} = apiSlice;
