# Academic Management System (Future - Stage 4.2)

**Current Status**: Not Implemented - Planned for Future Development
**Stage 1 Status**: ✅ Foundation Complete
**Next Phase**: Stage 2 - Authentication & RBAC (Required first)

This document describes the planned frontend academic module for the Tenant Portal.

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

Development Roadmap

This module is planned for **Stage 4.2: Academic Management System** development.

**Prerequisites (Must Complete First):**
- ✅ Stage 1: Foundation & Core Infrastructure (COMPLETED)
- ⏳ Stage 2: Dual Authentication & RBAC System
- ⏳ Stage 3: Dual Portal Dashboards
- ⏳ Stage 4.1: Student Information System (SIS)

**Future Implementation Steps:**
- Replace useAcademicService with RTK Query selectors and backend endpoints
- Add CRUD forms and mutations for: grades, subjects, teacher assignments, timetable generation, exams, and calendar events
- Add route entries and navigation links in Tenant Portal to expose the pages
- Expand tests to cover CRUD flows and edge cases
- Integrate with the completed RBAC system for proper permission checking

