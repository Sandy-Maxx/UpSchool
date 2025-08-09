import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './shared/store';

// SaaS Portal Components
import LandingPage from './saas/pages/LandingPage';
import SuperAdminDashboardPage from './saas/pages/SuperAdminDashboard';

// Tenant Portal Components
import SchoolAdminDashboard from './tenant/features/dashboard/SchoolAdminDashboard';
import TeacherDashboard from './tenant/features/dashboard/TeacherDashboard';
import StudentDashboard from './tenant/features/dashboard/StudentDashboard';
import StudentsPage from './tenant/pages/StudentsPage';
import StudentProfile from './tenant/features/students/StudentProfile';
// Academic Management (Stage 4.2)
import {
  GradeManagement,
  SubjectManager,
  TeacherAssignment as TeacherAssignmentPage,
  TimetableGenerator,
  ExamScheduler,
  AcademicCalendar,
} from './tenant/features/academic';

// Test Components
import TestDashboard from './TestDashboard';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* SaaS Portal Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin/dashboard" element={<SuperAdminDashboardPage />} />
              <Route path="/admin/overview" element={<SuperAdminDashboardPage />} />

              {/* Tenant Portal Routes */}
              <Route path="/admin/overview" element={<SchoolAdminDashboard />} />
              <Route path="/teacher/overview" element={<TeacherDashboard />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/student/overview" element={<StudentDashboard />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/admin/students" element={<StudentsPage />} />
              <Route path="/admin/students/:id" element={<StudentProfile />} />

              {/* Academic Management (Stage 4.2) */}
              <Route path="/admin/academic/grades" element={<GradeManagement />} />
              <Route path="/admin/academic/subjects" element={<SubjectManager />} />
              <Route path="/admin/academic/assignments" element={<TeacherAssignmentPage />} />
              <Route path="/admin/academic/timetable" element={<TimetableGenerator />} />
              <Route path="/admin/academic/exams" element={<ExamScheduler />} />
              <Route path="/admin/academic/calendar" element={<AcademicCalendar />} />

              {/* Test Routes */}
              <Route path="/test-dashboard" element={<TestDashboard />} />

              {/* Fallback Route */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
