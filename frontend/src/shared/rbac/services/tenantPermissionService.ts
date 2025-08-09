import {
  Permission,
  PermissionCheckRequest,
  PermissionCheckResponse,
  PermissionContext,
  TENANT_PERMISSIONS,
} from '../../types/permissions';
import {
  TENANT_ROLES,
  TenantRoleType,
  StaffSubRole,
  getStaffPermissions,
  canAccessResource,
} from '../../types/tenantRoles';
import { getUserPermissions, hasPermission, checkPermission } from '../../utils/permissionUtils';

/**
 * TenantPermissionService - School-level permission management
 *
 * This service handles all tenant portal permission operations including:
 * - School administration permissions
 * - Student and teacher access controls
 * - Parent access to children's data
 * - Staff role-specific permissions
 * - Academic and operational permissions
 */

export class TenantPermissionService {
  private static instance: TenantPermissionService;

  private constructor() {}

  public static getInstance(): TenantPermissionService {
    if (!TenantPermissionService.instance) {
      TenantPermissionService.instance = new TenantPermissionService();
    }
    return TenantPermissionService.instance;
  }

  /**
   * Check school management permissions
   */
  canManageSchool(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'school', 'MANAGE');
  }

  canUpdateSchoolSettings(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'school', 'UPDATE');
  }

  /**
   * Check user management permissions
   */
  canManageUsers(
    userRoles: string[],
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' = 'VIEW'
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'users', action);
  }

  /**
   * Check student management permissions
   */
  canManageStudents(
    userRoles: string[],
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' = 'VIEW'
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'students', action);
  }

  canAccessStudentData(
    userRoles: string[],
    studentId: string,
    action: 'VIEW' | 'UPDATE' = 'VIEW',
    context?: Record<string, any>
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    return hasPermission(userPermissions, 'students', action, {
      studentId,
      userRoles,
      ...context,
    });
  }

  /**
   * Check grade and assessment permissions
   */
  canManageGrades(
    userRoles: string[],
    action: 'CREATE' | 'UPDATE' | 'APPROVE' | 'EXPORT' = 'VIEW'
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'grades', action);
  }

  canAccessGradeData(
    userRoles: string[],
    studentId: string,
    classId?: string,
    subjectId?: string
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    return hasPermission(userPermissions, 'grades', 'VIEW', {
      studentId,
      classId,
      subjectId,
      userRoles,
    });
  }

  /**
   * Check attendance permissions
   */
  canManageAttendance(
    userRoles: string[],
    action: 'CREATE' | 'UPDATE' | 'EXPORT' = 'VIEW'
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'attendance', action);
  }

  canAccessAttendanceData(userRoles: string[], studentId: string, classId?: string): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    return hasPermission(userPermissions, 'attendance', 'VIEW', {
      studentId,
      classId,
      userRoles,
    });
  }

  /**
   * Check library permissions
   */
  canManageLibrary(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'library', 'MANAGE');
  }

  canAccessLibraryCirculation(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'library', 'CIRCULATION');
  }

  /**
   * Check transport permissions
   */
  canManageTransport(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'transport', 'MANAGE');
  }

  /**
   * Check communication permissions
   */
  canCreateMessages(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'messages', 'CREATE');
  }

  canManageMessages(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'messages', 'MANAGE');
  }

  canCreateAnnouncements(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'announcements', 'CREATE');
  }

  canManageAnnouncements(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'announcements', 'MANAGE');
  }

  /**
   * Check financial permissions
   */
  canManageFees(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'fees', 'MANAGE');
  }

  canViewPayments(userRoles: string[], studentId?: string): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    return hasPermission(userPermissions, 'payments', 'VIEW', {
      studentId,
      userRoles,
    });
  }

  canManagePayments(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'payments', 'MANAGE');
  }

  /**
   * Check reporting permissions
   */
  canViewReports(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'reports', 'VIEW');
  }

  canCreateReports(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'reports', 'CREATE');
  }

  canExportReports(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'reports', 'EXPORT');
  }

  /**
   * Check security and audit permissions
   */
  canViewSecuritySettings(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'security', 'VIEW');
  }

  canViewAuditLogs(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'audit_logs', 'VIEW');
  }

  canExportAuditLogs(userRoles: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    return hasPermission(userPermissions, 'audit_logs', 'EXPORT');
  }

  /**
   * Role-specific permission checks
   */
  getTeacherPermissions(
    userRoles: string[],
    assignedClasses?: string[]
  ): {
    canViewStudents: boolean;
    canUpdateGrades: boolean;
    canTakeAttendance: boolean;
    canCreateReports: boolean;
    canMessage: boolean;
  } {
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    return {
      canViewStudents: hasPermission(userPermissions, 'students', 'VIEW'),
      canUpdateGrades: hasPermission(userPermissions, 'grades', 'UPDATE'),
      canTakeAttendance: hasPermission(userPermissions, 'attendance', 'CREATE'),
      canCreateReports: hasPermission(userPermissions, 'reports', 'CREATE'),
      canMessage: hasPermission(userPermissions, 'messages', 'CREATE'),
    };
  }

  getStudentPermissions(
    userRoles: string[],
    studentId: string
  ): {
    canViewGrades: boolean;
    canViewAttendance: boolean;
    canAccessLibrary: boolean;
    canMessage: boolean;
  } {
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    return {
      canViewGrades: hasPermission(userPermissions, 'grades', 'VIEW', { studentId }),
      canViewAttendance: hasPermission(userPermissions, 'attendance', 'VIEW', { studentId }),
      canAccessLibrary: hasPermission(userPermissions, 'library', 'VIEW'),
      canMessage: hasPermission(userPermissions, 'messages', 'CREATE'),
    };
  }

  getParentPermissions(
    userRoles: string[],
    childrenIds: string[]
  ): {
    canViewChildrenData: boolean;
    canViewGrades: boolean;
    canViewAttendance: boolean;
    canViewFees: boolean;
    canMessage: boolean;
  } {
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    return {
      canViewChildrenData: hasPermission(userPermissions, 'students', 'VIEW', { childrenIds }),
      canViewGrades: hasPermission(userPermissions, 'grades', 'VIEW', { childrenIds }),
      canViewAttendance: hasPermission(userPermissions, 'attendance', 'VIEW', { childrenIds }),
      canViewFees: hasPermission(userPermissions, 'fees', 'VIEW', { childrenIds }),
      canMessage: hasPermission(userPermissions, 'messages', 'CREATE'),
    };
  }

  /**
   * Staff role permissions with subrole support
   */
  getStaffPermissionsWithSubrole(subrole: StaffSubRole): {
    permissions: string[];
    capabilities: Record<string, boolean>;
  } {
    const permissions = getStaffPermissions(subrole);

    const capabilities = {
      canManageStudents: permissions.includes(TENANT_PERMISSIONS.STUDENTS_CREATE),
      canManageFinances: permissions.includes(TENANT_PERMISSIONS.FEES_MANAGE),
      canManageLibrary: permissions.includes(TENANT_PERMISSIONS.LIBRARY_MANAGE),
      canViewSecurity: permissions.includes(TENANT_PERMISSIONS.SECURITY_VIEW),
      canCreateReports: permissions.includes(TENANT_PERMISSIONS.REPORTS_CREATE),
    };

    return { permissions, capabilities };
  }

  /**
   * Get dashboard sections available to user
   */
  getAvailableDashboardSections(userRoles: string[], userRole: TenantRoleType): string[] {
    const sections: string[] = [];
    const userPermissions = getUserPermissions(userRoles, 'tenant');

    // Always include overview for authenticated users
    sections.push('overview');

    // Role-specific sections
    switch (userRole) {
      case 'admin':
        sections.push('users', 'academics', 'finance', 'reports', 'settings');
        break;
      case 'teacher':
        sections.push('classes', 'grades', 'attendance', 'reports');
        if (hasPermission(userPermissions, 'messages', 'CREATE')) {
          sections.push('communication');
        }
        break;
      case 'student':
        sections.push('grades', 'attendance', 'assignments', 'library');
        if (hasPermission(userPermissions, 'messages', 'CREATE')) {
          sections.push('messages');
        }
        break;
      case 'parent':
        sections.push('children', 'grades', 'attendance', 'fees', 'communication');
        break;
      case 'staff':
        sections.push('tasks', 'reports');
        if (hasPermission(userPermissions, 'students', 'VIEW')) {
          sections.push('students');
        }
        if (hasPermission(userPermissions, 'fees', 'VIEW')) {
          sections.push('finance');
        }
        break;
    }

    return sections;
  }

  /**
   * Check comprehensive permission with context
   */
  checkPermission(
    request: PermissionCheckRequest,
    context: PermissionContext
  ): PermissionCheckResponse {
    // Ensure we're in tenant portal context
    const tenantContext = {
      ...context,
      portal: 'tenant' as const,
    };

    return checkPermission(request, tenantContext);
  }

  /**
   * Validate contextual access (e.g., teacher accessing student from assigned class)
   */
  validateContextualAccess(
    userRoles: string[],
    userContext: Record<string, any>,
    resource: string,
    resourceId: string
  ): boolean {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    const primaryRole = userRoles[0] as TenantRoleType;

    switch (primaryRole) {
      case 'teacher':
        // Teachers can only access students from their assigned classes
        if (resource === 'students') {
          const { assignedClasses } = userContext;
          const { studentClassId } = userContext;
          return assignedClasses && assignedClasses.includes(studentClassId);
        }
        break;

      case 'parent':
        // Parents can only access their children's data
        if (['students', 'grades', 'attendance'].includes(resource)) {
          const { childrenIds } = userContext;
          return childrenIds && childrenIds.includes(resourceId);
        }
        break;

      case 'student':
        // Students can only access their own data
        const { userId } = userContext;
        return userId === resourceId;
    }

    // Admin and staff with proper permissions can access any resource
    return hasPermission(userPermissions, resource, 'VIEW');
  }

  /**
   * Get permission summary for debugging
   */
  getPermissionSummary(userRoles: string[], userRole: TenantRoleType, staffSubrole?: StaffSubRole) {
    const userPermissions = getUserPermissions(userRoles, 'tenant', staffSubrole);

    return {
      roles: userRoles,
      primaryRole: userRole,
      staffSubrole,
      permissions: userPermissions,
      dashboardSections: this.getAvailableDashboardSections(userRoles, userRole),
      summary: {
        totalPermissions: userPermissions.length,
        canManageSchool: this.canManageSchool(userRoles),
        canManageUsers: this.canManageUsers(userRoles, 'CREATE'),
        canManageStudents: this.canManageStudents(userRoles, 'CREATE'),
        canManageGrades: this.canManageGrades(userRoles, 'UPDATE'),
        canViewReports: this.canViewReports(userRoles),
        canCreateReports: this.canCreateReports(userRoles),
      },
    };
  }

  /**
   * Check if user can assign roles (admin only)
   */
  canAssignRole(assignerRoles: string[], targetRole: TenantRoleType): boolean {
    return this.canManageSchool(assignerRoles);
  }

  /**
   * Get filtered data based on role permissions
   */
  getAccessibleStudents(
    userRoles: string[],
    allStudents: any[],
    userContext?: Record<string, any>
  ): any[] {
    const userPermissions = getUserPermissions(userRoles, 'tenant');
    const primaryRole = userRoles[0] as TenantRoleType;

    // Admin can see all students
    if (hasPermission(userPermissions, 'students', 'MANAGE')) {
      return allStudents;
    }

    // Filter based on role-specific access
    return allStudents.filter(student => {
      return this.validateContextualAccess(userRoles, userContext || {}, 'students', student.id);
    });
  }
}

// Export singleton instance
export const tenantPermissionService = TenantPermissionService.getInstance();
