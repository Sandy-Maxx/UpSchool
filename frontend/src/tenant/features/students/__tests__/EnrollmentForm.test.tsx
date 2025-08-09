import React from 'react';
import { waitFor } from '@testing-library/react';

// Targeted hook mock for this suite to stabilize without network
jest.mock('@shared/store/slices/apiSlice', () => ({
  useCreateStudentMutation: jest.fn().mockReturnValue([
    jest.fn().mockResolvedValue({ data: { id: '1' } }),
    { isLoading: false },
  ]),
}));

import { screen, renderWithProviders, fireEvent } from '@/tests/utils/testUtils';
import EnrollmentForm from '../../students/EnrollmentForm';

// Make PermissionGate render children unconditionally during this test
jest.mock('@shared/rbac/components/PermissionGate', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

describe('EnrollmentForm', () => {
  it('submits form', async () => {
    const onSuccess = jest.fn();
    renderWithProviders(<EnrollmentForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), { target: { value: 'John' } });
    fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'john@school.com' } });
// Grade is a select
    const gradeCombo = screen.getByRole('combobox', { name: /grade/i });
    fireEvent.mouseDown(gradeCombo);
    const gradeOption = await screen.findByRole('option', { name: /grade 8/i });
    fireEvent.click(gradeOption);

    fireEvent.click(screen.getByRole('button', { name: /enroll student/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
