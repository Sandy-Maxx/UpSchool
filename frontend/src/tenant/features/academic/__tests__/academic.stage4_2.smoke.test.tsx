import React from 'react';
import { render, screen } from '@testing-library/react';
import GradeManagement from '../GradeManagement';
import SubjectManager from '../SubjectManager';
import TeacherAssignment from '../TeacherAssignment';
import TimetableGenerator from '../TimetableGenerator';
import ExamScheduler from '../ExamScheduler';
import AcademicCalendar from '../AcademicCalendar';

// Bypass RBAC/Redux in smoke tests
jest.mock('@shared/rbac/components/PermissionGate', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Smoke tests to ensure components render with the mock academic service

describe('Academic Management (Stage 4.2) components', () => {
  it('renders GradeManagement', () => {
    render(<GradeManagement />);
    expect(screen.getByText(/Grade Management/i)).toBeInTheDocument();
  });

  it('renders SubjectManager', () => {
    render(<SubjectManager />);
    expect(screen.getByText(/Subject Catalog/i)).toBeInTheDocument();
  });

  it('renders TeacherAssignment', () => {
    render(<TeacherAssignment />);
    expect(screen.getByText(/Teacher Assignments/i)).toBeInTheDocument();
  });

  it('renders TimetableGenerator', () => {
    render(<TimetableGenerator />);
    expect(screen.getByText(/Timetable/i)).toBeInTheDocument();
  });

  it('renders ExamScheduler', () => {
    render(<ExamScheduler />);
    expect(screen.getByText(/Exam Schedule/i)).toBeInTheDocument();
  });

  it('renders AcademicCalendar', () => {
    render(<AcademicCalendar />);
    expect(screen.getByText(/Academic Calendar/i)).toBeInTheDocument();
  });
});

