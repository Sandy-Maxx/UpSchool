# RBAC Architecture (Stage 2)

This document summarizes the RBAC strategy implemented across portals.

Core concepts
- Roles: superadmin, admin, teacher, student, parent, staff
- Permissions: resource:action strings (e.g., users:view, school:manage)
- Gates: guard components check permissions before rendering

Frontend implementation
- Service: src/shared/services/rbac/permissions.ts supports resource/action checks and a can(role, resource, action) helper
- UI: PermissionMatrix and RoleManagement stubs for tenant admin
- ProtectedRoute: path-level guard with optional role/permission hints

Next steps
- Expand permission definitions aligned with backend
- Connect RoleManagement to backend APIs
- Add specialized hooks for SaaS vs Tenant contexts

