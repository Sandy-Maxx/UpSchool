import { useMemo, useState } from 'react';
import type { AcademicCalendarEvent, ClassRoom, Exam, Grade, Subject, TeacherAssignment, TimetableEntry } from '../types/academic';

// Lightweight in-memory mock service to enable UI scaffolding and tests
export function useAcademicService() {
  const [grades] = useState<Grade[]>([
    { id: 'grade-7', name: 'Grade 7', order: 7, sections: ['A', 'B'] },
    { id: 'grade-8', name: 'Grade 8', order: 8, sections: ['A', 'B'] },
  ]);

  const [subjects] = useState<Subject[]>([
    { id: 'math', name: 'Mathematics', code: 'MTH' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'sci', name: 'Science', code: 'SCI' },
  ]);

  const [classes] = useState<ClassRoom[]>([
    { id: 'grade-8-A', gradeId: 'grade-8', section: 'A', name: 'Grade 8 - A', capacity: 30, status: 'active' },
    { id: 'grade-7-B', gradeId: 'grade-7', section: 'B', name: 'Grade 7 - B', capacity: 30, status: 'active' },
  ]);

  const [assignments] = useState<TeacherAssignment[]>([
    { id: 'ta-1', teacherId: 't-1', teacherName: 'Dr. Sarah Johnson', classId: 'grade-8-A', subjectId: 'math' },
    { id: 'ta-2', teacherId: 't-2', teacherName: 'Mr. Mike Chen', classId: 'grade-8-A', subjectId: 'eng' },
  ]);

  const [timetable] = useState<TimetableEntry[]>([
    { id: 'tt-1', classId: 'grade-8-A', day: 'Mon', startTime: '08:00', endTime: '08:45', subjectId: 'math', teacherId: 't-1' },
    { id: 'tt-2', classId: 'grade-8-A', day: 'Mon', startTime: '08:50', endTime: '09:35', subjectId: 'eng', teacherId: 't-2' },
  ]);

  const [exams] = useState<Exam[]>([
    { id: 'ex-1', title: 'Midterm', gradeId: 'grade-8', subjectId: 'math', date: '2025-10-20', startTime: '09:00', endTime: '11:00' },
  ]);

  const [calendar] = useState<AcademicCalendarEvent[]>([
    { id: 'cal-1', title: 'School Reopens', date: '2025-09-01', type: 'event' },
    { id: 'cal-2', title: 'Founders Day', date: '2025-11-15', type: 'holiday' },
  ]);

  return useMemo(
    () => ({ grades, subjects, classes, assignments, timetable, exams, calendar }),
    [grades, subjects, classes, assignments, timetable, exams, calendar]
  );
}

