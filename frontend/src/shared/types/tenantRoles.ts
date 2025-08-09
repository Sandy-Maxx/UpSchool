import { Role, TENANT_PERMISSIONS } from './permissions';

// Tenant Portal Role Types - School-specific roles
export type TenantRoleType = 'admin' | 'teacher' | 'student' | 'parent' | 'staff';

// Staff Sub-roles for more granular permissions
export type StaffSubRole =
  | 'registrar'
  | 'accountant'
  | 'librarian'
  | 'it_support'
  | 'counselor'
  | 'coordinator';

// Tenant Portal Role Configurations
export const TENANT_ROLES: Record<
  TenantRoleType,
  Omit<Role, 'id' | 'permissions'> & { permissionKeys: string[] }
> = {
  // School Administrator - Complete school control
  admin: {
    name: 'School Administrator',
    description: 'Complete administrative control over the school portal',
    portal: 'tenant',
    isActive: true,
    hierarchy: 1, // Highest level in tenant
    permissionKeys: [
      // School Management - Full Control
      TENANT_PERMISSIONS.SCHOOL_VIEW,
      TENANT_PERMISSIONS.SCHOOL_UPDATE,
      TENANT_PERMISSIONS.SCHOOL_MANAGE,

      // User Management - Full Control
      TENANT_PERMISSIONS.USERS_VIEW,
      TENANT_PERMISSIONS.USERS_CREATE,
      TENANT_PERMISSIONS.USERS_UPDATE,
      TENANT_PERMISSIONS.USERS_DELETE,
      TENANT_PERMISSIONS.USERS_IMPORT,
      TENANT_PERMISSIONS.USERS_EXPORT,

      // Student Management - Full Control
      TENANT_PERMISSIONS.STUDENTS_VIEW,
      TENANT_PERMISSIONS.STUDENTS_CREATE,
      TENANT_PERMISSIONS.STUDENTS_UPDATE,
      TENANT_PERMISSIONS.STUDENTS_DELETE,
      TENANT_PERMISSIONS.STUDENTS_IMPORT,
      TENANT_PERMISSIONS.STUDENTS_EXPORT,

      // Academic Management - Full Control
      TENANT_PERMISSIONS.ACADEMICS_VIEW,
      TENANT_PERMISSIONS.ACADEMICS_UPDATE,
      TENANT_PERMISSIONS.ACADEMICS_MANAGE,

      // Grades & Assessment - Full Control
      TENANT_PERMISSIONS.GRADES_VIEW,
      TENANT_PERMISSIONS.GRADES_CREATE,
      TENANT_PERMISSIONS.GRADES_UPDATE,
      TENANT_PERMISSIONS.GRADES_APPROVE,
      TENANT_PERMISSIONS.GRADES_EXPORT,

      // Attendance - Full Control
      TENANT_PERMISSIONS.ATTENDANCE_VIEW,
      TENANT_PERMISSIONS.ATTENDANCE_CREATE,
      TENANT_PERMISSIONS.ATTENDANCE_UPDATE,
      TENANT_PERMISSIONS.ATTENDANCE_EXPORT,

      // Library Management
      TENANT_PERMISSIONS.LIBRARY_VIEW,
      TENANT_PERMISSIONS.LIBRARY_MANAGE,
      TENANT_PERMISSIONS.LIBRARY_CIRCULATION,

      // Transport Management
      TENANT_PERMISSIONS.TRANSPORT_VIEW,
      TENANT_PERMISSIONS.TRANSPORT_MANAGE,

      // Communication - Full Control
      TENANT_PERMISSIONS.MESSAGES_VIEW,
      TENANT_PERMISSIONS.MESSAGES_CREATE,
      TENANT_PERMISSIONS.MESSAGES_MANAGE,
      TENANT_PERMISSIONS.ANNOUNCEMENTS_CREATE,
      TENANT_PERMISSIONS.ANNOUNCEMENTS_MANAGE,

      // Reports & Analytics - Full Control
      TENANT_PERMISSIONS.REPORTS_VIEW,
      TENANT_PERMISSIONS.REPORTS_CREATE,
      TENANT_PERMISSIONS.REPORTS_EXPORT,
      TENANT_PERMISSIONS.ANALYTICS_VIEW,

      // Financial Management
      TENANT_PERMISSIONS.FEES_VIEW,
      TENANT_PERMISSIONS.FEES_MANAGE,
      TENANT_PERMISSIONS.PAYMENTS_VIEW,
      TENANT_PERMISSIONS.PAYMENTS_MANAGE,

      // Security & Audit
      TENANT_PERMISSIONS.SECURITY_VIEW,
      TENANT_PERMISSIONS.AUDIT_LOGS_VIEW,
      TENANT_PERMISSIONS.AUDIT_LOGS_EXPORT,
    ],
  },

  // Teacher - Teaching and classroom management
  teacher: {
    name: 'Teacher',
    description: 'Teaching staff with classroom and student management capabilities',
    portal: 'tenant',
    isActive: true,
    hierarchy: 2,
    permissionKeys: [
      // Student Management - View and limited update (their classes only)
      TENANT_PERMISSIONS.STUDENTS_VIEW,
      TENANT_PERMISSIONS.STUDENTS_UPDATE, // Limited to assigned classes

      // Academic Management - View only
      TENANT_PERMISSIONS.ACADEMICS_VIEW,

      // Grades & Assessment - Teaching related
      TENANT_PERMISSIONS.GRADES_VIEW,
      TENANT_PERMISSIONS.GRADES_CREATE,
      TENANT_PERMISSIONS.GRADES_UPDATE,
      TENANT_PERMISSIONS.GRADES_EXPORT,

      // Attendance - Teaching related
      TENANT_PERMISSIONS.ATTENDANCE_VIEW,
      TENANT_PERMISSIONS.ATTENDANCE_CREATE,
      TENANT_PERMISSIONS.ATTENDANCE_UPDATE,
      TENANT_PERMISSIONS.ATTENDANCE_EXPORT,

      // Library - Basic access
      TENANT_PERMISSIONS.LIBRARY_VIEW,

      // Communication - Teaching related
      TENANT_PERMISSIONS.MESSAGES_VIEW,
      TENANT_PERMISSIONS.MESSAGES_CREATE,

      // Reports - Teaching related
      TENANT_PERMISSIONS.REPORTS_VIEW,
      TENANT_PERMISSIONS.REPORTS_CREATE,
      TENANT_PERMISSIONS.REPORTS_EXPORT,
    ],
  },

  // Student - Student-focused access
  student: {
    name: 'Student',
    description: 'Student access to academic information and resources',
    portal: 'tenant',
    isActive: true,
    hierarchy: 4,
    permissionKeys: [
      // Academic Management - View own information
      TENANT_PERMISSIONS.ACADEMICS_VIEW,

      // Grades & Assessment - View own grades
      TENANT_PERMISSIONS.GRADES_VIEW,

      // Attendance - View own attendance
      TENANT_PERMISSIONS.ATTENDANCE_VIEW,

      // Library - Student access
      TENANT_PERMISSIONS.LIBRARY_VIEW,

      // Communication - Limited messaging
      TENANT_PERMISSIONS.MESSAGES_VIEW,
      TENANT_PERMISSIONS.MESSAGES_CREATE, // Limited to teachers/parents

      // Reports - View own reports
      TENANT_PERMISSIONS.REPORTS_VIEW,
    ],
  },

  // Parent - Parent/guardian access
  parent: {
    name: 'Parent/Guardian',
    description: 'Parent access to child academic information and communication',
    portal: 'tenant',
    isActive: true,
    hierarchy: 4,
    permissionKeys: [
      // Student Management - View child information
      TENANT_PERMISSIONS.STUDENTS_VIEW, // Limited to own children

      // Academic Management - View child academic info
      TENANT_PERMISSIONS.ACADEMICS_VIEW,

      // Grades & Assessment - View child grades
      TENANT_PERMISSIONS.GRADES_VIEW,

      // Attendance - View child attendance
      TENANT_PERMISSIONS.ATTENDANCE_VIEW,

      // Communication - Parent-teacher communication
      TENANT_PERMISSIONS.MESSAGES_VIEW,
      TENANT_PERMISSIONS.MESSAGES_CREATE,

      // Reports - View child reports
      TENANT_PERMISSIONS.REPORTS_VIEW,

      // Payments - View and manage child fees
      TENANT_PERMISSIONS.FEES_VIEW,
      TENANT_PERMISSIONS.PAYMENTS_VIEW,
    ],
  },

  // Staff - Administrative and support staff
  staff: {
    name: 'Staff',
    description: 'Administrative and support staff with role-specific permissions',
    portal: 'tenant',
    isActive: true,
    hierarchy: 3,
    permissionKeys: [
      // Base permissions that can be extended based on staff role
      // Student Management - Basic view
      TENANT_PERMISSIONS.STUDENTS_VIEW,

      // Academic Management - View
      TENANT_PERMISSIONS.ACADEMICS_VIEW,

      // Communication - Internal messaging
      TENANT_PERMISSIONS.MESSAGES_VIEW,
      TENANT_PERMISSIONS.MESSAGES_CREATE,

      // Reports - Basic reporting
      TENANT_PERMISSIONS.REPORTS_VIEW,
    ],
  },
};

// Staff Sub-role Permissions - Additional permissions based on staff type
export const STAFF_SUBROLE_PERMISSIONS: Record<StaffSubRole, string[]> = {
  // Registrar - Student enrollment and records
  registrar: [
    TENANT_PERMISSIONS.STUDENTS_CREATE,
    TENANT_PERMISSIONS.STUDENTS_UPDATE,
    TENANT_PERMISSIONS.STUDENTS_IMPORT,
    TENANT_PERMISSIONS.STUDENTS_EXPORT,
    TENANT_PERMISSIONS.ACADEMICS_UPDATE,
  ],

  // Accountant - Financial management
  accountant: [
    TENANT_PERMISSIONS.FEES_VIEW,
    TENANT_PERMISSIONS.FEES_MANAGE,
    TENANT_PERMISSIONS.PAYMENTS_VIEW,
    TENANT_PERMISSIONS.PAYMENTS_MANAGE,
    TENANT_PERMISSIONS.REPORTS_CREATE,
    TENANT_PERMISSIONS.REPORTS_EXPORT,
  ],

  // Librarian - Library management
  librarian: [TENANT_PERMISSIONS.LIBRARY_MANAGE, TENANT_PERMISSIONS.LIBRARY_CIRCULATION],

  // IT Support - Technical support
  it_support: [
    TENANT_PERMISSIONS.USERS_VIEW,
    TENANT_PERMISSIONS.USERS_UPDATE,
    TENANT_PERMISSIONS.SECURITY_VIEW,
  ],

  // Counselor - Student guidance
  counselor: [
    TENANT_PERMISSIONS.STUDENTS_UPDATE,
    TENANT_PERMISSIONS.MESSAGES_MANAGE,
    TENANT_PERMISSIONS.REPORTS_CREATE,
  ],

  // Coordinator - General coordination
  coordinator: [
    TENANT_PERMISSIONS.ACADEMICS_UPDATE,
    TENANT_PERMISSIONS.TRANSPORT_VIEW,
    TENANT_PERMISSIONS.ANNOUNCEMENTS_CREATE,
  ],
};

// Tenant Role Hierarchy
export const TENANT_ROLE_HIERARCHY: Record<TenantRoleType, number> = {
  admin: 1, // Highest
  teacher: 2,
  staff: 3,
  student: 4, // Lowest
  parent: 4, // Same level as student
};

// Role capabilities for UI rendering
export const TENANT_ROLE_CAPABILITIES = {
  admin: {
    canManageSchool: true,
    canManageUsers: true,
    canManageAcademics: true,
    canManageFinances: true,
    canViewAnalytics: true,
    canExportData: true,
    dashboardSections: ['overview', 'users', 'academics', 'finance', 'reports', 'settings'],
    navigationAccess: 'full',
  },
  teacher: {
    canManageSchool: false,
    canManageUsers: false,
    canManageAcademics: false,
    canManageFinances: false,
    canViewAnalytics: true,
    canExportData: true,
    dashboardSections: ['overview', 'classes', 'grades', 'attendance', 'reports'],
    navigationAccess: 'teaching',
  },
  student: {
    canManageSchool: false,
    canManageUsers: false,
    canManageAcademics: false,
    canManageFinances: false,
    canViewAnalytics: false,
    canExportData: false,
    dashboardSections: ['overview', 'grades', 'attendance', 'assignments', 'library'],
    navigationAccess: 'student',
  },
  parent: {
    canManageSchool: false,
    canManageUsers: false,
    canManageAcademics: false,
    canManageFinances: true, // Limited to child fees
    canViewAnalytics: false,
    canExportData: false,
    dashboardSections: ['overview', 'children', 'grades', 'attendance', 'fees', 'communication'],
    navigationAccess: 'parent',
  },
  staff: {
    canManageSchool: false,
    canManageUsers: false,
    canManageAcademics: false,
    canManageFinances: false, // Depends on subrole
    canViewAnalytics: true,
    canExportData: false, // Depends on subrole
    dashboardSections: ['overview', 'tasks', 'reports'],
    navigationAccess: 'staff',
  },
} as const;

// Helper function to get staff permissions including subrole
export const getStaffPermissions = (subrole?: StaffSubRole): string[] => {
  const basePermissions = TENANT_ROLES.staff.permissionKeys;
  const subrolePermissions = subrole ? STAFF_SUBROLE_PERMISSIONS[subrole] || [] : [];

  return [...basePermissions, ...subrolePermissions];
};

// Helper function to check if a role can access a resource
export const canAccessResource = (roleType: TenantRoleType, resource: string): boolean => {
  const role = TENANT_ROLES[roleType];
  return role.permissionKeys.some(permission => permission.startsWith(resource));
};

// Default role assignment for new tenant users
export const DEFAULT_TENANT_ROLE: TenantRoleType = 'student';

// Role color coding for UI
export const TENANT_ROLE_COLORS = {
  admin: '#d32f2f', // Red - Highest privilege
  teacher: '#388e3c', // Green - Teaching staff
  staff: '#1976d2', // Blue - Administrative staff
  student: '#f57c00', // Orange - Students
  parent: '#7b1fa2', // Purple - Parents
} as const;

// Role icons for UI
export const TENANT_ROLE_ICONS = {
  admin: 'SupervisorAccount',
  teacher: 'Person',
  staff: 'AccountBalance',
  student: 'PersonOutline',
  parent: 'Groups',
} as const;
