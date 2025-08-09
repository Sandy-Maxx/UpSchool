import { createApi } from '@reduxjs/toolkit/query/react';

// Minimal mock of RTK Query apiSlice to satisfy tests that import and use hooks
export const apiSlice = {
  reducerPath: 'api',
  reducer: (state = {}, _action: any) => state,
  middleware: (_api: any) => (next: any) => (action: any) => next(action),
  // Mock endpoints object to support tests that reach into endpoint options
  endpoints: {
    getStudents: {
      options: {
        transformResponse: (response: any) => {
          if (response && typeof response === 'object') {
            if (Array.isArray(response.results)) {
              return { results: response.results, count: response.count ?? response.total ?? response.results.length };
            }
            if (Array.isArray(response.data)) {
              return { results: response.data, count: response.count ?? response.total ?? response.data.length };
            }
          }
          return Array.isArray(response) ? { results: response, count: response.length } : { results: [], count: 0 };
        },
      },
    },
  },
  // Mock hooks used by components
  useGetStudentsQuery: (_args: any) => ({ data: { results: [], count: 0 }, isLoading: false, refetch: jest.fn() }),
  useCreateStudentMutation: () => [jest.fn(async (_payload?: any) => ({ success: true })), { isLoading: false }],
  useUpdateStudentMutation: () => [jest.fn(async () => ({})), { isLoading: false }],
  useDeleteStudentMutation: () => [jest.fn(async () => ({})), { isLoading: false }],
};

// Export individual hooks so named imports work in components
export const useGetStudentsQuery = apiSlice.useGetStudentsQuery;
export const useCreateStudentMutation = apiSlice.useCreateStudentMutation;
export const useUpdateStudentMutation = apiSlice.useUpdateStudentMutation;
export const useDeleteStudentMutation = apiSlice.useDeleteStudentMutation;

export default apiSlice as unknown as ReturnType<typeof createApi>;

