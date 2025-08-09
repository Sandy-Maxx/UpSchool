"""
User models for the school platform.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from core.models import BaseModel
import uuid


class User(AbstractUser, BaseModel):
    """
    Custom user model for the school platform.
    """
    USER_TYPES = [
        ('admin', 'Administrator'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('parent', 'Parent'),
        ('staff', 'Staff'),
    ]
    
    # Override id field to use UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # User type and tenant
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='staff')
    tenant = models.ForeignKey('core.Tenant', on_delete=models.CASCADE, null=True, blank=True)
    
    # Profile fields
    phone = models.CharField(max_length=20, blank=True)
    job_title = models.CharField(max_length=100, blank=True, help_text="Professional job title or position")
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True)
    
    # Additional fields
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, blank=True)
    password_reset_token = models.CharField(max_length=255, blank=True)
    password_reset_expires = models.DateTimeField(null=True, blank=True)
    
    # Settings
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    @property
    def full_name(self):
        """Get user's full name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username

    def get_display_name(self):
        """Get display name for the user."""
        if self.first_name:
            return self.first_name
        return self.username

    def get_roles(self):
        """Get all roles assigned to the user."""
        return [user_role.role for user_role in self.user_roles.all()]

    def has_role(self, role_name):
        """Check if user has a specific role."""
        return self.user_roles.filter(role__name=role_name).exists()

    def has_permission(self, permission_name):
        """Check if user has a specific permission."""
        return self.user_roles.filter(
            role__role_permissions__permission__name=permission_name
        ).exists()

    def get_permissions(self):
        """Get all permissions for the user."""
        from django.db.models import Q
        return Permission.objects.filter(
            Q(role_permissions__role__user_roles__user=self) |
            Q(is_global=True)
        ).distinct()


class Role(BaseModel):
    """
    Role model for RBAC implementation.
    """
    ROLE_TYPES = [
        ('system', 'System Role'),
        ('tenant', 'Tenant Role'),
        ('school', 'School Role'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    role_type = models.CharField(max_length=20, choices=ROLE_TYPES, default='tenant')
    is_active = models.BooleanField(default=True)
    is_system = models.BooleanField(default=False)
    tenant = models.ForeignKey('core.Tenant', on_delete=models.CASCADE, null=True, blank=True)
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, null=True, blank=True)
    
    # Hierarchy
    parent_role = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='child_roles')
    
    class Meta:
        db_table = 'roles'
        ordering = ['name']

    def __str__(self):
        return self.display_name

    def get_all_permissions(self):
        """Get all permissions for this role including inherited ones."""
        permissions = set(self.permissions.all())
        
        # Add permissions from parent roles
        parent = self.parent_role
        while parent:
            permissions.update(parent.permissions.all())
            parent = parent.parent_role
            
        return list(permissions)

    def has_permission(self, permission_name):
        """Check if role has a specific permission."""
        return self.get_all_permissions().filter(name=permission_name).exists()


class Permission(BaseModel):
    """
    Permission model for granular access control.
    """
    PERMISSION_TYPES = [
        ('view', 'View'),
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('export', 'Export'),
        ('import', 'Import'),
        ('manage', 'Manage'),
    ]
    
    name = models.CharField(max_length=200, unique=True)
    display_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    permission_type = models.CharField(max_length=20, choices=PERMISSION_TYPES)
    app_label = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    codename = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_global = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'permissions'
        ordering = ['app_label', 'model_name', 'codename']
        unique_together = ['app_label', 'model_name', 'codename']

    def __str__(self):
        return f"{self.app_label}.{self.codename}"

    @property
    def full_name(self):
        """Get full permission name."""
        return f"{self.app_label}.{self.codename}"


class RolePermission(BaseModel):
    """
    Many-to-many relationship between roles and permissions.
    """
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='role_permissions')
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'role_permissions'
        unique_together = ['role', 'permission']

    def __str__(self):
        return f"{self.role.name} - {self.permission.name}"

    def is_valid(self):
        """Check if permission is still valid."""
        if not self.is_active:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True


class UserRole(BaseModel):
    """
    Many-to-many relationship between users and roles.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_roles')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='role_assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'user_roles'
        unique_together = ['user', 'role']

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

    def is_valid(self):
        """Check if role assignment is still valid."""
        if not self.is_active:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True


class UserProfile(BaseModel):
    """
    Extended user profile information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Academic information
    student_id = models.CharField(max_length=50, blank=True)
    teacher_id = models.CharField(max_length=50, blank=True)
    employee_id = models.CharField(max_length=50, blank=True)
    
    # Emergency contact
    emergency_contact_name = models.CharField(max_length=255, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    
    # Preferences
    notification_preferences = models.JSONField(default=dict)
    privacy_settings = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"Profile for {self.user.username}"


class UserSession(BaseModel):
    """
    Track user sessions for security and analytics.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'user_sessions'

    def __str__(self):
        return f"Session for {self.user.username} at {self.login_time}"


class UserActivity(BaseModel):
    """
    Track user activities for analytics and security.
    """
    ACTIVITY_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('page_view', 'Page View'),
        ('action', 'Action'),
        ('error', 'Error'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    data = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'user_activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.activity_type} by {self.user.username}"


class PasswordHistory(BaseModel):
    """
    Track password history for security compliance.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    password_hash = models.CharField(max_length=255)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'password_history'
        ordering = ['-changed_at']

    def __str__(self):
        return f"Password change for {self.user.username} at {self.changed_at}" 