import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { usePermissions } from '../../hooks/usePermissions';
import { tenantPermissionService } from '../services/tenantPermissionService';
import { TenantRoleType, StaffSubRole } from '../../types/tenantRoles';
import { PermissionAction } from '../../types/permissions';

/**
 * useTenantPermissions - Tenant portal-specific permission hooks
 *
 * This hook provides convenient methods for checking tenant-specific permissions
 * including school management, student access, teacher permissions, etc.
 */

export const useTenantPermissions = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentPortal } = usePermissions();

  const userRoles = useMemo(() => {
    return isAuthenticated && user?.roles ? user.roles : [];
  }, [isAuthenticated, user?.roles]);

  const primaryRole = useMemo(() => {
    return userRoles[0] as TenantRoleType;
  }, [userRoles]);

  const staffSubrole = useMemo(() => {
    return user?.metadata?.staffSubrole as StaffSubRole;
  }, [user?.metadata?.staffSubrole]);

  // Ensure we're in the tenant portal
  const isValidPortal = currentPortal === 'tenant';

  // School management permissions
  const canManageSchool = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canManageSchool(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canUpdateSchoolSettings = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canUpdateSchoolSettings(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // User management permissions
  const canManageUsers = useCallback(
    (action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' | 'VIEW' = 'VIEW') => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canManageUsers(userRoles, action);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Student management permissions
  const canManageStudents = useCallback(
    (action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' | 'VIEW' = 'VIEW') => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canManageStudents(userRoles, action);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  const canAccessStudentData = useCallback(
    (studentId: string, action: 'VIEW' | 'UPDATE' = 'VIEW', context?: Record<string, any>) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canAccessStudentData(userRoles, studentId, action, context);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Grade management permissions
  const canManageGrades = useCallback(
    (action: 'CREATE' | 'UPDATE' | 'APPROVE' | 'EXPORT' | 'VIEW' = 'VIEW') => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canManageGrades(userRoles, action);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  const canAccessGradeData = useCallback(
    (studentId: string, classId?: string, subjectId?: string) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canAccessGradeData(userRoles, studentId, classId, subjectId);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Attendance permissions
  const canManageAttendance = useCallback(
    (action: 'CREATE' | 'UPDATE' | 'EXPORT' | 'VIEW' = 'VIEW') => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canManageAttendance(userRoles, action);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  const canAccessAttendanceData = useCallback(
    (studentId: string, classId?: string) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canAccessAttendanceData(userRoles, studentId, classId);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Library permissions
  const canManageLibrary = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canManageLibrary(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canAccessLibraryCirculation = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canAccessLibraryCirculation(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Transport permissions
  const canManageTransport = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canManageTransport(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Communication permissions
  const canCreateMessages = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canCreateMessages(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canManageMessages = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canManageMessages(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canCreateAnnouncements = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canCreateAnnouncements(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canManageAnnouncements = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canManageAnnouncements(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Financial permissions
  const canManageFees = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canManageFees(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canViewPayments = useCallback(
    (studentId?: string) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canViewPayments(userRoles, studentId);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  const canManagePayments = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canManagePayments(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Reporting permissions
  const canViewReports = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canViewReports(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canCreateReports = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canCreateReports(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canExportReports = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canExportReports(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Security permissions
  const canViewSecuritySettings = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canViewSecuritySettings(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canViewAuditLogs = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canViewAuditLogs(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  const canExportAuditLogs = useCallback(() => {
    if (!isValidPortal || !isAuthenticated) return false;
    return tenantPermissionService.canExportAuditLogs(userRoles);
  }, [isValidPortal, isAuthenticated, userRoles]);

  // Role management
  const canAssignRole = useCallback(
    (targetRole: TenantRoleType) => {
      if (!isValidPortal || !isAuthenticated) return false;
      return tenantPermissionService.canAssignRole(userRoles, targetRole);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Dashboard sections
  const availableDashboardSections = useMemo(() => {
    if (!isValidPortal || !isAuthenticated || !primaryRole) return [];
    return tenantPermissionService.getAvailableDashboardSections(userRoles, primaryRole);
  }, [isValidPortal, isAuthenticated, userRoles, primaryRole]);

  // Role-specific permission sets
  const teacherPermissions = useMemo(() => {
    if (!isValidPortal || !isAuthenticated || primaryRole !== 'teacher') return null;
    const assignedClasses = user?.metadata?.assignedClasses;
    return tenantPermissionService.getTeacherPermissions(userRoles, assignedClasses);
  }, [isValidPortal, isAuthenticated, primaryRole, userRoles, user?.metadata?.assignedClasses]);

  const studentPermissions = useMemo(() => {
    if (!isValidPortal || !isAuthenticated || primaryRole !== 'student' || !user?.id) return null;
    return tenantPermissionService.getStudentPermissions(userRoles, user.id);
  }, [isValidPortal, isAuthenticated, primaryRole, userRoles, user?.id]);

  const parentPermissions = useMemo(() => {
    if (!isValidPortal || !isAuthenticated || primaryRole !== 'parent') return null;
    const childrenIds = user?.metadata?.childrenIds || [];
    return tenantPermissionService.getParentPermissions(userRoles, childrenIds);
  }, [isValidPortal, isAuthenticated, primaryRole, userRoles, user?.metadata?.childrenIds]);

  const staffPermissions = useMemo(() => {
    if (!isValidPortal || !isAuthenticated || primaryRole !== 'staff' || !staffSubrole) return null;
    return tenantPermissionService.getStaffPermissionsWithSubrole(staffSubrole);
  }, [isValidPortal, isAuthenticated, primaryRole, staffSubrole]);

  // Permission summary
  const getPermissionSummary = useCallback(() => {
    if (!isValidPortal || !isAuthenticated || !primaryRole) return null;
    return tenantPermissionService.getPermissionSummary(userRoles, primaryRole, staffSubrole);
  }, [isValidPortal, isAuthenticated, userRoles, primaryRole, staffSubrole]);

  // Data access helpers
  const getAccessibleStudents = useCallback(
    (allStudents: any[], userContext?: Record<string, any>) => {
      if (!isValidPortal || !isAuthenticated) return [];
      return tenantPermissionService.getAccessibleStudents(userRoles, allStudents, userContext);
    },
    [isValidPortal, isAuthenticated, userRoles]
  );

  // Quick role checks
  const isAdmin = useMemo(() => primaryRole === 'admin', [primaryRole]);
  const isTeacher = useMemo(() => primaryRole === 'teacher', [primaryRole]);
  const isStudent = useMemo(() => primaryRole === 'student', [primaryRole]);
  const isParent = useMemo(() => primaryRole === 'parent', [primaryRole]);
  const isStaff = useMemo(() => primaryRole === 'staff', [primaryRole]);

  return {
    // Core state
    isValidPortal,
    isAuthenticated,
    userRoles,
    primaryRole,
    staffSubrole,

    // School management
    canManageSchool,
    canUpdateSchoolSettings,

    // User management
    canManageUsers,

    // Student management
    canManageStudents,
    canAccessStudentData,

    // Grade management
    canManageGrades,
    canAccessGradeData,

    // Attendance management
    canManageAttendance,
    canAccessAttendanceData,

    // Library management
    canManageLibrary,
    canAccessLibraryCirculation,

    // Transport management
    canManageTransport,

    // Communication
    canCreateMessages,
    canManageMessages,
    canCreateAnnouncements,
    canManageAnnouncements,

    // Financial management
    canManageFees,
    canViewPayments,
    canManagePayments,

    // Reporting
    canViewReports,
    canCreateReports,
    canExportReports,

    // Security
    canViewSecuritySettings,
    canViewAuditLogs,
    canExportAuditLogs,

    // Role management
    canAssignRole,

    // Navigation and UI
    availableDashboardSections,

    // Role-specific permissions
    teacherPermissions,
    studentPermissions,
    parentPermissions,
    staffPermissions,

    // Utilities
    getPermissionSummary,
    getAccessibleStudents,

    // Quick role checks
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    isStaff,

    // Combined checks
    canTeach: isTeacher || isAdmin,
    canAccessStudentInfo: isAdmin || isTeacher || isParent,
    hasLimitedAccess: isStudent || isParent,
    hasManagementAccess: isAdmin || isStaff,
  };
};

// Hook for tenant role checks
export const useTenantRoleCheck = () => {
  const { userRoles, primaryRole, isValidPortal, isAuthenticated } = useTenantPermissions();

  const hasRole = useCallback(
    (role: TenantRoleType) => {
      return isValidPortal && isAuthenticated && primaryRole === role;
    },
    [primaryRole, isValidPortal, isAuthenticated]
  );

  const hasAnyRole = useCallback(
    (roles: TenantRoleType[]) => {
      return isValidPortal && isAuthenticated && roles.includes(primaryRole);
    },
    [primaryRole, isValidPortal, isAuthenticated]
  );

  const isStaffWithSubrole = useCallback(
    (subrole: StaffSubRole) => {
      return hasRole('staff') && userRoles.includes(subrole);
    },
    [hasRole, userRoles]
  );

  return {
    hasRole,
    hasAnyRole,
    isStaffWithSubrole,
    primaryRole,
    userRoles,
    isValidPortal,
    isAuthenticated,
  };
};

// Hook for tenant navigation
export const useTenantNavigation = () => {
  const {
    availableDashboardSections,
    primaryRole,
    canManageSchool,
    canManageUsers,
    canManageStudents,
    canManageGrades,
    canViewReports,
    canManageLibrary,
    canManageTransport,
    isValidPortal,
    isAuthenticated,
  } = useTenantPermissions();

  const navigationItems = useMemo(() => {
    if (!isValidPortal || !isAuthenticated) return [];

    const items = [];

    // Always include dashboard
    items.push({
      key: 'dashboard',
      label: 'Dashboard',
      path: '/tenant/dashboard',
      icon: 'Dashboard',
    });

    // Role-specific navigation
    switch (primaryRole) {
      case 'admin':
        if (canManageUsers('VIEW')) {
          items.push({
            key: 'users',
            label: 'User Management',
            path: '/tenant/users',
            icon: 'People',
          });
        }
        if (canManageStudents('VIEW')) {
          items.push({
            key: 'students',
            label: 'Students',
            path: '/tenant/students',
            icon: 'PersonOutline',
          });
        }
        if (canManageGrades('VIEW')) {
          items.push({
            key: 'academics',
            label: 'Academics',
            path: '/tenant/academics',
            icon: 'School',
          });
        }
        if (canViewReports()) {
          items.push({
            key: 'reports',
            label: 'Reports',
            path: '/tenant/reports',
            icon: 'Assessment',
          });
        }
        if (canManageSchool()) {
          items.push({
            key: 'settings',
            label: 'School Settings',
            path: '/tenant/settings',
            icon: 'Settings',
          });
        }
        break;

      case 'teacher':
        items.push({
          key: 'classes',
          label: 'My Classes',
          path: '/tenant/classes',
          icon: 'Class',
        });
        if (canManageGrades('VIEW')) {
          items.push({
            key: 'grades',
            label: 'Grades',
            path: '/tenant/grades',
            icon: 'Grade',
          });
        }
        if (canManageAttendance('VIEW')) {
          items.push({
            key: 'attendance',
            label: 'Attendance',
            path: '/tenant/attendance',
            icon: 'EventAvailable',
          });
        }
        break;

      case 'student':
        items.push({
          key: 'grades',
          label: 'My Grades',
          path: '/tenant/grades',
          icon: 'Grade',
        });
        items.push({
          key: 'attendance',
          label: 'My Attendance',
          path: '/tenant/attendance',
          icon: 'EventAvailable',
        });
        items.push({
          key: 'assignments',
          label: 'Assignments',
          path: '/tenant/assignments',
          icon: 'Assignment',
        });
        if (canManageLibrary()) {
          items.push({
            key: 'library',
            label: 'Library',
            path: '/tenant/library',
            icon: 'LocalLibrary',
          });
        }
        break;

      case 'parent':
        items.push({
          key: 'children',
          label: 'My Children',
          path: '/tenant/children',
          icon: 'FamilyRestroom',
        });
        items.push({
          key: 'grades',
          label: 'Grades',
          path: '/tenant/grades',
          icon: 'Grade',
        });
        items.push({
          key: 'attendance',
          label: 'Attendance',
          path: '/tenant/attendance',
          icon: 'EventAvailable',
        });
        if (canViewPayments()) {
          items.push({
            key: 'fees',
            label: 'Fees & Payments',
            path: '/tenant/fees',
            icon: 'Payment',
          });
        }
        break;

      case 'staff':
        items.push({
          key: 'tasks',
          label: 'My Tasks',
          path: '/tenant/tasks',
          icon: 'Task',
        });
        if (canViewReports()) {
          items.push({
            key: 'reports',
            label: 'Reports',
            path: '/tenant/reports',
            icon: 'Assessment',
          });
        }
        break;
    }

    // Common sections for eligible roles
    if (['admin', 'teacher', 'staff'].includes(primaryRole) && canViewReports()) {
      if (!items.find(item => item.key === 'reports')) {
        items.push({
          key: 'reports',
          label: 'Reports',
          path: '/tenant/reports',
          icon: 'Assessment',
        });
      }
    }

    return items;
  }, [
    isValidPortal,
    isAuthenticated,
    primaryRole,
    availableDashboardSections,
    canManageSchool,
    canManageUsers,
    canManageStudents,
    canManageGrades,
    canViewReports,
    canManageLibrary,
    canViewPayments,
  ]);

  return {
    navigationItems,
    availableSections: availableDashboardSections,
    primaryRole,
    isValidPortal,
    isAuthenticated,
  };
};

// Hook for tenant data access patterns
export const useTenantDataAccess = () => {
  const {
    canAccessStudentData,
    canAccessGradeData,
    canAccessAttendanceData,
    getAccessibleStudents,
    primaryRole,
    isValidPortal,
    isAuthenticated,
  } = useTenantPermissions();

  const { user } = useSelector((state: RootState) => state.auth);

  const canAccessStudent = useCallback(
    (studentId: string, action: 'VIEW' | 'UPDATE' = 'VIEW') => {
      return canAccessStudentData(studentId, action);
    },
    [canAccessStudentData]
  );

  const canAccessGrades = useCallback(
    (studentId: string, classId?: string, subjectId?: string) => {
      return canAccessGradeData(studentId, classId, subjectId);
    },
    [canAccessGradeData]
  );

  const canAccessAttendance = useCallback(
    (studentId: string, classId?: string) => {
      return canAccessAttendanceData(studentId, classId);
    },
    [canAccessAttendanceData]
  );

  const filterAccessibleStudents = useCallback(
    (students: any[]) => {
      const userContext = {
        userId: user?.id,
        assignedClasses: user?.metadata?.assignedClasses,
        childrenIds: user?.metadata?.childrenIds,
      };
      return getAccessibleStudents(students, userContext);
    },
    [getAccessibleStudents, user]
  );

  const getUserContext = useCallback(() => {
    return {
      userId: user?.id,
      userRole: primaryRole,
      assignedClasses: user?.metadata?.assignedClasses,
      childrenIds: user?.metadata?.childrenIds,
      staffSubrole: user?.metadata?.staffSubrole,
    };
  }, [user, primaryRole]);

  return {
    canAccessStudent,
    canAccessGrades,
    canAccessAttendance,
    filterAccessibleStudents,
    getUserContext,
    primaryRole,
    isValidPortal,
    isAuthenticated,
  };
};
