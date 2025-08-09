# Academic Management System (Stage 4.2)

This document describes the frontend academic module for the Tenant Portal.

Scope
- Grade and class structure management
- Subject catalog
- Teacher assignment listing
- Timetable viewing (generator UI scaffold)
- Exam schedule viewing
- Academic calendar

Implemented Components
- tenant/features/academic/GradeManagement.tsx
- tenant/features/academic/SubjectManager.tsx
- tenant/features/academic/TeacherAssignment.tsx
- tenant/features/academic/TimetableGenerator.tsx
- tenant/features/academic/ExamScheduler.tsx
- tenant/features/academic/AcademicCalendar.tsx

Types
- tenant/features/academic/types/academic.ts

Hooks
- tenant/features/academic/hooks/useAcademicService.ts (in-memory mock for UI/tests)

Testing
- tenant/features/academic/__tests__/academic.stage4_2.smoke.test.tsx
  - Verifies each component renders with mock data.

RBAC
- All components are wrapped with PermissionGate and require resource "academic" with action "view".

Next Steps
- Replace useAcademicService with RTK Query selectors and backend endpoints when available.
- Add CRUD forms and mutations for: grades, subjects, teacher assignments, timetable generation, exams, and calendar events.
- Add route entries and navigation links in Tenant Portal to expose the pages.
- Expand tests to cover CRUD flows and edge cases.

