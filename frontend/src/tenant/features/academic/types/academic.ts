// Academic domain types

export interface Grade {
  id: string; // e.g., "grade-8"
  name: string; // e.g., "Grade 8"
  order: number;
  sections: string[]; // e.g., ["A", "B"]
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  gradeIds?: string[]; // subjects offered in which grades
}

export interface ClassRoom {
  id: string; // e.g., "grade-8-A"
  gradeId: string;
  section: string; // e.g., "A"
  name: string; // derived label, e.g., "Grade 8 - A"
  capacity?: number;
  room?: string;
  status?: 'active' | 'inactive';
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string; // ClassRoom id
  subjectId: string;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  subjectId: string;
  teacherId: string;
  room?: string;
}

export interface Exam {
  id: string;
  title: string;
  gradeId: string;
  subjectId: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  room?: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date
  type: 'holiday' | 'event' | 'exam' | 'meeting';
  gradeIds?: string[];
}

