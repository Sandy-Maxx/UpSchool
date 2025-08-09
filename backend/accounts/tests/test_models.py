"""
Model tests for accounts app.
"""
import pytest
from django.contrib.auth import get_user_model
from accounts.models import Role, Permission, UserRole, RolePermission
from accounts.factories import UserFactory, RoleFactory, PermissionFactory

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    """Tests for User model."""

    def test_user_creation(self):
        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        assert user.username == 'testuser'
        assert user.email == 'testuser@example.com'
        assert user.check_password('testpassword')


    def test_superuser_creation(self):
        user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        assert user.is_staff
        assert user.is_superuser


@pytest.mark.django_db
class TestRoleModel:
    """Tests for Role model."""

    def test_role_creation(self):
        role = Role.objects.create(
            name='test_role',
            display_name='Test Role'
        )
        assert role.name == 'test_role'
        assert role.display_name == 'Test Role'


@pytest.mark.django_db
class TestPermissionModel:
    """Tests for Permission model."""

    def test_permission_creation(self):
        permission = Permission.objects.create(
            name='test_permission',
            display_name='Test Permission'
        )
        assert permission.name == 'test_permission'
        assert permission.display_name == 'Test Permission'


@pytest.mark.django_db
class TestUserRoleModel:
    """Tests for UserRole model."""

    def test_user_role_creation(self, user, role):
        user_role = UserRole.objects.create(
            user=user,
            role=role
        )
        assert user_role.user == user
        assert user_role.role == role


@pytest.mark.django_db
class TestRolePermissionModel:
    """Tests for RolePermission model."""

    def test_role_permission_creation(self, role, permission):
        role_permission = RolePermission.objects.create(
            role=role,
            permission=permission
        )
        assert role_permission.role == role
        assert role_permission.permission == permission
