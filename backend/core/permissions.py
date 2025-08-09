"""
Custom permissions for the school platform with comprehensive RBAC.
"""
from rest_framework import permissions
from django.contrib.auth.models import Permission as DjangoPermission
from django.contrib.contenttypes.models import ContentType
from accounts.models import Role, Permission, UserRole, RolePermission


class BaseRBACPermission(permissions.BasePermission):
    """
    Base RBAC permission class with common functionality.
    """
    
    def get_required_permission(self, action):
        """Get required permission for the action."""
        permission_map = {
            'list': 'view',
            'retrieve': 'view',
            'create': 'create',
            'update': 'update',
            'partial_update': 'update',
            'destroy': 'delete',
        }
        return permission_map.get(action, 'view')
    
    def get_model_name(self, view):
        """Get model name from view."""
        if hasattr(view, 'model'):
            return view.model._meta.model_name
        elif hasattr(view, 'queryset'):
            return view.queryset.model._meta.model_name
        return None
    
    def get_app_label(self, view):
        """Get app label from view."""
        if hasattr(view, 'model'):
            return view.model._meta.app_label
        elif hasattr(view, 'queryset'):
            return view.queryset.model._meta.app_label
        return None


class IsTenantAdmin(BaseRBACPermission):
    """
    Permission to only allow tenant administrators.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user has tenant admin role
        return request.user.has_role('tenant_admin')
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user has tenant admin role
        return request.user.has_role('tenant_admin')


class IsTenantUser(BaseRBACPermission):
    """
    Permission to only allow users belonging to the same tenant.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user has any role in the tenant
        return request.user.user_roles.filter(is_active=True).exists()
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if object belongs to user's tenant
        if hasattr(obj, 'tenant'):
            return obj.tenant == request.user.tenant
        elif hasattr(obj, 'school') and hasattr(obj.school, 'tenant'):
            return obj.school.tenant == request.user.tenant
        
        return True


class HasPermission(BaseRBACPermission):
    """
    Permission to check if user has specific permission.
    """
    
    def __init__(self, permission_name=None):
        self.permission_name = permission_name
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Get required permission
        action = getattr(view, 'action', 'list')
        required_permission = self.get_required_permission(action)
        
        # Build permission name
        if self.permission_name:
            permission_name = self.permission_name
        else:
            app_label = self.get_app_label(view)
            model_name = self.get_model_name(view)
            if app_label and model_name:
                permission_name = f"{app_label}.{required_permission}_{model_name}"
            else:
                permission_name = required_permission
        
        # Check if user has permission
        return request.user.has_permission(permission_name)
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Get required permission
        action = getattr(view, 'action', 'retrieve')
        required_permission = self.get_required_permission(action)
        
        # Build permission name
        if self.permission_name:
            permission_name = self.permission_name
        else:
            app_label = self.get_app_label(view)
            model_name = self.get_model_name(view)
            if app_label and model_name:
                permission_name = f"{app_label}.{required_permission}_{model_name}"
            else:
                permission_name = required_permission
        
        # Check if user has permission
        return request.user.has_permission(permission_name)


class HasRole(BaseRBACPermission):
    """
    Permission to check if user has specific role.
    """
    
    def __init__(self, role_name):
        self.role_name = role_name
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user has role
        return request.user.has_role(self.role_name)
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user has role
        return request.user.has_role(self.role_name)


class IsOwnerOrReadOnly(BaseRBACPermission):
    """
    Permission to only allow owners of an object to edit it.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        elif hasattr(obj, 'owner'):
            return obj.owner == request.user
        
        return False


class IsOwnerOrHasPermission(BaseRBACPermission):
    """
    Permission to allow owners or users with specific permission.
    """
    
    def __init__(self, permission_name):
        self.permission_name = permission_name
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is owner
        is_owner = False
        if hasattr(obj, 'user'):
            is_owner = obj.user == request.user
        elif hasattr(obj, 'created_by'):
            is_owner = obj.created_by == request.user
        elif hasattr(obj, 'owner'):
            is_owner = obj.owner == request.user
        
        if is_owner:
            return True
        
        # Check if user has specific permission
        return request.user.has_permission(self.permission_name)


class IsSchoolAdmin(BaseRBACPermission):
    """
    Permission to only allow school administrators.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user has school admin role
        return request.user.has_role('school_admin')
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user has school admin role
        return request.user.has_role('school_admin')


class IsTeacher(BaseRBACPermission):
    """
    Permission to only allow teachers.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is a teacher
        return request.user.user_type == 'teacher' or request.user.has_role('teacher')
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is a teacher
        return request.user.user_type == 'teacher' or request.user.has_role('teacher')


class IsStudent(BaseRBACPermission):
    """
    Permission to only allow students.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is a student
        return request.user.user_type == 'student' or request.user.has_role('student')
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is a student
        return request.user.user_type == 'student' or request.user.has_role('student')


class IsParent(BaseRBACPermission):
    """
    Permission to only allow parents.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is a parent
        return request.user.user_type == 'parent' or request.user.has_role('parent')
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is a parent
        return request.user.user_type == 'parent' or request.user.has_role('parent')


class IsStaff(BaseRBACPermission):
    """
    Permission to only allow staff members.
    """
    
    def has_permission(self, request, view):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is staff
        return request.user.user_type == 'staff' or request.user.has_role('staff')
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is staff
        return request.user.user_type == 'staff' or request.user.has_role('staff')


# Permission mixins for common use cases
class ReadOnlyPermission(BaseRBACPermission):
    """Permission for read-only access."""
    
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if not request.user.is_authenticated:
            return False
        return request.method in permissions.SAFE_METHODS


class CreatePermission(BaseRBACPermission):
    """Permission for create access."""
    
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if not request.user.is_authenticated:
            return False
        return request.method == 'POST'


class UpdatePermission(BaseRBACPermission):
    """Permission for update access."""
    
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if not request.user.is_authenticated:
            return False
        return request.method in ['PUT', 'PATCH']


class DeletePermission(BaseRBACPermission):
    """Permission for delete access."""
    
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if not request.user.is_authenticated:
            return False
        return request.method == 'DELETE' 