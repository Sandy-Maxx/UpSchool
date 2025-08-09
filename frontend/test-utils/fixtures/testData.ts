// User fixtures
export const mockSaaSUser = {
  id: '1',
  email: 'saas-admin@upschool.com',
  name: 'SaaS Admin',
  role: 'saas_admin',
  permissions: ['manage_tenants', 'view_analytics', 'manage_billing'],
}

export const mockTenantUser = {
  id: '2',
  email: 'school-admin@testschool.com',
  name: 'School Admin',
  role: 'school_admin',
  tenantId: '1',
  permissions: ['manage_students', 'manage_teachers', 'view_reports'],
}

export const mockStudent = {
  id: '3',
  email: 'student@testschool.com',
  name: 'John Doe Student',
  role: 'student',
  tenantId: '1',
  permissions: ['view_grades', 'view_schedule'],
}

export const mockTeacher = {
  id: '4',
  email: 'teacher@testschool.com',
  name: 'Jane Smith',
  role: 'teacher',
  tenantId: '1',
  permissions: ['manage_grades', 'manage_attendance', 'view_students'],
}

// Tenant fixtures
export const mockTenant = {
  id: '1',
  name: 'Test School District',
  domain: 'testschool.upschool.com',
  status: 'active' as const,
  plan: 'professional' as const,
  settings: {
    branding: {
      logo: 'https://example.com/logo.png',
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
    },
    features: {
      studentPortal: true,
      parentPortal: true,
      mobileApp: true,
      advancedReporting: true,
    },
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

// Student data fixtures
export const mockStudents = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.testschool.com',
    studentId: 'STU001',
    class: '10A',
    grade: 10,
    dateOfBirth: '2008-05-15',
    parentEmail: 'parent.doe@email.com',
    enrollmentDate: '2024-01-15',
    status: 'active' as const,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@student.testschool.com',
    studentId: 'STU002',
    class: '10B',
    grade: 10,
    dateOfBirth: '2008-07-22',
    parentEmail: 'parent.smith@email.com',
    enrollmentDate: '2024-01-15',
    status: 'active' as const,
  },
]

// Dashboard metrics fixtures
export const mockDashboardMetrics = {
  saas: {
    totalTenants: 45,
    activeTenants: 42,
    totalRevenue: 125000,
    monthlyGrowth: 15.5,
    systemHealth: 98.5,
    supportTickets: 12,
  },
  tenant: {
    totalStudents: 450,
    totalTeachers: 32,
    totalClasses: 18,
    activeUsers: 298,
    attendanceRate: 94.2,
    gradeAverage: 87.3,
  },
}

// Form data fixtures
export const mockLoginFormData = {
  email: 'test@upschool.com',
  password: 'TestPassword123!',
  rememberMe: false,
}

export const mockRegistrationFormData = {
  schoolName: 'New Test School',
  adminFirstName: 'Admin',
  adminLastName: 'User',
  adminEmail: 'admin@newtestschool.com',
  domain: 'newtestschool',
  plan: 'professional' as const,
  agreeToTerms: true,
}

// API response fixtures
export const mockApiResponses = {
  loginSuccess: {
    user: mockSaaSUser,
    token: 'mock-jwt-token-12345',
    refreshToken: 'mock-refresh-token-12345',
  },
  loginError: {
    message: 'Invalid email or password',
    code: 'INVALID_CREDENTIALS',
  },
  tenantList: [mockTenant],
  studentList: mockStudents,
  dashboardMetrics: mockDashboardMetrics,
}

// Error fixtures
export const mockErrors = {
  networkError: new Error('Network Error'),
  validationError: {
    message: 'Validation failed',
    errors: {
      email: 'Email is required',
      password: 'Password must be at least 8 characters',
    },
  },
  serverError: {
    message: 'Internal Server Error',
    status: 500,
  },
  notFoundError: {
    message: 'Resource not found',
    status: 404,
  },
}
