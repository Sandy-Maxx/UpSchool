"""
Serializers for user management.
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, UserProfile, UserSession, UserActivity, PasswordHistory,
    Role, Permission, UserRole, RolePermission
)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    """
    full_name = serializers.ReadOnlyField()
    user_type_display = serializers.ReadOnlyField(source='get_user_type_display')
    roles = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'user_type_display', 'phone', 'address', 'date_of_birth',
            'profile_picture', 'is_verified', 'timezone', 'language', 'is_active',
            'date_joined', 'last_login', 'roles', 'permissions', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'created_at', 'updated_at']

    def get_roles(self, obj):
        """Get user's roles."""
        return [{'id': role.id, 'name': role.name, 'display_name': role.display_name} 
                for role in obj.get_roles()]

    def get_permissions(self, obj):
        """Get user's permissions."""
        return [{'id': perm.id, 'name': perm.name, 'display_name': perm.display_name} 
                for perm in obj.get_permissions()]


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating users.
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'user_type',
            'phone', 'address', 'date_of_birth', 'password', 'password_confirm'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating users.
    """
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone', 'address',
            'date_of_birth', 'timezone', 'language'
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    """
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'user_name', 'student_id', 'teacher_id', 'employee_id',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
            'notification_preferences', 'privacy_settings', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for UserSession model.
    """
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'user_name', 'session_key', 'ip_address', 'user_agent',
            'login_time', 'logout_time', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for UserActivity model.
    """
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    activity_type_display = serializers.ReadOnlyField(source='get_activity_type_display')

    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'user_name', 'activity_type', 'activity_type_display',
            'description', 'ip_address', 'user_agent', 'data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PasswordHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for PasswordHistory model.
    """
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = PasswordHistory
        fields = [
            'id', 'user', 'user_name', 'changed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'changed_at', 'created_at', 'updated_at']


# RBAC Serializers
class PermissionSerializer(serializers.ModelSerializer):
    """
    Serializer for Permission model.
    """
    permission_type_display = serializers.ReadOnlyField(source='get_permission_type_display')
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Permission
        fields = [
            'id', 'name', 'display_name', 'description', 'permission_type',
            'permission_type_display', 'app_label', 'model_name', 'codename',
            'full_name', 'is_active', 'is_global', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RoleSerializer(serializers.ModelSerializer):
    """
    Serializer for Role model.
    """
    role_type_display = serializers.ReadOnlyField(source='get_role_type_display')
    parent_role_name = serializers.ReadOnlyField(source='parent_role.display_name')
    permissions = PermissionSerializer(many=True, read_only=True)
    user_count = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = [
            'id', 'name', 'display_name', 'description', 'role_type',
            'role_type_display', 'is_active', 'is_system', 'parent_role',
            'parent_role_name', 'permissions', 'user_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user_count']

    def get_user_count(self, obj):
        """Get number of users with this role."""
        return obj.user_roles.filter(is_active=True).count()


class RoleCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating roles.
    """
    permission_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="List of permission IDs to assign to this role"
    )

    class Meta:
        model = Role
        fields = [
            'name', 'display_name', 'description', 'role_type', 'is_active',
            'parent_role', 'permission_ids'
        ]

    def create(self, validated_data):
        permission_ids = validated_data.pop('permission_ids', [])
        role = Role.objects.create(**validated_data)
        
        # Assign permissions
        for permission_id in permission_ids:
            try:
                permission = Permission.objects.get(id=permission_id)
                RolePermission.objects.create(
                    role=role,
                    permission=permission,
                    granted_by=self.context['request'].user
                )
            except Permission.DoesNotExist:
                pass
        
        return role


class RolePermissionSerializer(serializers.ModelSerializer):
    """
    Serializer for RolePermission model.
    """
    role_name = serializers.ReadOnlyField(source='role.display_name')
    permission_name = serializers.ReadOnlyField(source='permission.display_name')
    granted_by_name = serializers.ReadOnlyField(source='granted_by.get_full_name')

    class Meta:
        model = RolePermission
        fields = [
            'id', 'role', 'role_name', 'permission', 'permission_name',
            'granted_by', 'granted_by_name', 'granted_at', 'expires_at',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'granted_at', 'created_at', 'updated_at']


class UserRoleSerializer(serializers.ModelSerializer):
    """
    Serializer for UserRole model.
    """
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    role_name = serializers.ReadOnlyField(source='role.display_name')
    assigned_by_name = serializers.ReadOnlyField(source='assigned_by.get_full_name')

    class Meta:
        model = UserRole
        fields = [
            'id', 'user', 'user_name', 'role', 'role_name', 'assigned_by',
            'assigned_by_name', 'assigned_at', 'expires_at', 'is_active',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'assigned_at', 'created_at', 'updated_at']


class UserRoleCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating user roles.
    """
    class Meta:
        model = UserRole
        fields = ['user', 'role', 'expires_at', 'notes']

    def create(self, validated_data):
        validated_data['assigned_by'] = self.context['request'].user
        return super().create(validated_data)


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')

        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Invalid old password')
        return value


class PasswordResetSerializer(serializers.Serializer):
    """
    Serializer for password reset request.
    """
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email address')
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation.
    """
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password', 'password_confirm'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user 