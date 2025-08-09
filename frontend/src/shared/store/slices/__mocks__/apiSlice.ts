import { createApi } from '@reduxjs/toolkit/query/react';

// Manual Jest mock for apiSlice
export const apiSlice = {
  reducerPath: 'api',
  reducer: (state = {}, _action: any) => state,
  middleware: (_api: any) => (next: any) => (action: any) => next(action),
  // Mock endpoints object to support tests that access endpoint options
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
  useGetStudentsQuery: jest.fn().mockReturnValue({ data: { results: [], count: 0 }, isLoading: false, refetch: jest.fn() }),
  useUpdateStudentMutation: jest.fn().mockReturnValue([jest.fn().mockResolvedValue({}), { isLoading: false }]),
  useDeleteStudentMutation: jest.fn().mockReturnValue([jest.fn().mockResolvedValue({}), { isLoading: false }]),
};

// Export individual hooks for named imports
export const useGetStudentsQuery = apiSlice.useGetStudentsQuery;
export const useUpdateStudentMutation = apiSlice.useUpdateStudentMutation;
export const useDeleteStudentMutation = apiSlice.useDeleteStudentMutation;

export default apiSlice as unknown as ReturnType<typeof createApi>;
