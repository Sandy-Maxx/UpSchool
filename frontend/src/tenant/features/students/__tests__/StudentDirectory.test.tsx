import React from 'react';

jest.mock('@shared/store/slices/apiSlice', () => ({
  useGetStudentsQuery: jest.fn().mockReturnValue({
    data: { results: [
      { id: '1', user: { firstName: 'John', lastName: 'Doe', email: 'john@school.com' }, grade: { name: 'Grade 8' }, class: { name: '8A' }, status: 'active', enrollmentDate: '2024-01-01' },
    ], count: 1 },
    isLoading: false,
    refetch: jest.fn(),
  }),
  useUpdateStudentMutation: jest.fn().mockReturnValue([jest.fn()]),
  useDeleteStudentMutation: jest.fn().mockReturnValue([jest.fn()]),
}));

// Make PermissionGate render children unconditionally during this test
jest.mock('@shared/rbac/components/PermissionGate', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

import { screen, renderWithProviders } from '@/tests/utils/testUtils';
import StudentDirectory from '../../students/StudentDirectory';

describe('StudentDirectory', () => {
  it('renders students and actions', async () => {
    renderWithProviders(
      <StudentDirectory page={1} rowsPerPage={10} onPageChange={() => {}} onRowsPerPageChange={() => {}} />
    );

expect(await screen.findByText(/John\s+Doe/)).toBeInTheDocument();
    expect(screen.getByLabelText('view')).toBeInTheDocument();
  });
});
