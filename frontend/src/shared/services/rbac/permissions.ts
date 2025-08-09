// Minimal RBAC permissions service for Stage 2 tests
export type Role = 'superadmin' | 'admin' | 'teacher' | 'student' | 'parent' | 'staff'

export const roles: Role[] = ['superadmin', 'admin', 'teacher', 'student', 'parent', 'staff']

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'export' | 'import' | 'manage'

type ResourceAction = `${string}:${'view'|'create'|'update'|'delete'|'approve'|'reject'|'export'|'import'|'manage'}`

const rolePermissions: Record<Role, ResourceAction[]> = {
  superadmin: ['*:manage'],
  admin: ['school:manage', 'users:view', 'users:create', 'users:update'],
  teacher: ['students:view', 'grades:update'],
  student: ['self:view'],
  parent: ['child:view'],
  staff: ['tasks:view'],
}

export function hasPermission(role: Role, permission: string, action: 'view'|'create'|'update'|'delete'|'approve'|'reject'|'export'|'import'|'manage' = 'view', resource?: string): boolean {
  const perms = rolePermissions[role] || []
  if (perms.includes('*:manage' as ResourceAction)) return true
  const target: ResourceAction | null = resource ? `${resource}:${action}` as ResourceAction : (permission as ResourceAction)
  return target ? perms.includes(target) || perms.includes(`${permission}:${action}` as ResourceAction) : false
}

export function can(role: Role, resource: string, action: 'view'|'create'|'update'|'delete'|'approve'|'reject'|'export'|'import'|'manage' = 'view'): boolean {
  return hasPermission(role, resource, action, resource)
}

