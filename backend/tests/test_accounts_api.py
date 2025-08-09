"""
API tests for accounts app.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

from accounts.models import Role, Permission, UserRole, RolePermission
from accounts.factories import UserFactory, RoleFactory, PermissionFactory

User = get_user_model()


@pytest.mark.django_db
class TestUserAPI:
    """Tests for User API endpoints."""
    
    def test_list_users(self, authenticated_client, admin_user):
        """Test listing users."""
        # Create additional users
        UserFactory.create_batch(3, tenant=admin_user.tenant)
        
        url = reverse('user-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert len(response.data['results']) >= 1  # At least admin user
    
    def test_create_user(self, authenticated_client, admin_user):
        """Test creating a new user."""
        url = reverse('user-list')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'user_type': 'teacher',
            'password': 'newpassword123'
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newuser').exists()
    
    def test_get_user_detail(self, authenticated_client, admin_user):
        """Test getting user details."""
        user = UserFactory(tenant=admin_user.tenant)
        url = reverse('user-detail', kwargs={'pk': user.pk})
        
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == user.username
    
    def test_update_user(self, authenticated_client, admin_user):
        """Test updating user."""
        user = UserFactory(tenant=admin_user.tenant)
        url = reverse('user-detail', kwargs={'pk': user.pk})
        data = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.first_name == 'Updated'
        assert user.last_name == 'Name'
    
    def test_delete_user(self, authenticated_client, admin_user):
        """Test deleting user."""
        user = UserFactory(tenant=admin_user.tenant)
        url = reverse('user-detail', kwargs={'pk': user.pk})
        
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not User.objects.filter(pk=user.pk).exists()
    
    def test_unauthorized_access(self, api_client):
        """Test unauthorized access to user endpoints."""
        url = reverse('user-list')
        response = api_client.get(url)
        
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]


@pytest.mark.django_db
class TestRoleAPI:
    """Tests for Role API endpoints."""
    
    def test_list_roles(self, authenticated_client, admin_user):
        """Test listing roles."""
        RoleFactory.create_batch(3, tenant=admin_user.tenant)
        
        url = reverse('role-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
    
    def test_create_role(self, authenticated_client, admin_user):
        """Test creating a new role."""
        url = reverse('role-list')
        data = {
            'name': 'new_role',
            'display_name': 'New Role',
            'description': 'A new test role',
            'role_type': 'tenant'
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Role.objects.filter(name='new_role').exists()
    
    def test_get_role_detail(self, authenticated_client, admin_user):
        """Test getting role details."""
        role = RoleFactory(tenant=admin_user.tenant)
        url = reverse('role-detail', kwargs={'pk': role.pk})
        
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == role.name


@pytest.mark.django_db
class TestPermissionAPI:
    """Tests for Permission API endpoints."""
    
    def test_list_permissions(self, authenticated_client):
        """Test listing permissions."""
        PermissionFactory.create_batch(3)
        
        url = reverse('permission-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
    
    def test_create_permission(self, authenticated_client):
        """Test creating a new permission."""
        url = reverse('permission-list')
        data = {
            'name': 'new_permission',
            'display_name': 'New Permission',
            'permission_type': 'view',
            'app_label': 'test',
            'model_name': 'testmodel'
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Permission.objects.filter(name='new_permission').exists()


@pytest.mark.django_db
class TestUserRoleAPI:
    """Tests for UserRole API endpoints."""
    
    def test_assign_role_to_user(self, authenticated_client, admin_user):
        """Test assigning role to user."""
        user = UserFactory(tenant=admin_user.tenant)
        role = RoleFactory(tenant=admin_user.tenant)
        
        url = reverse('userrole-list')
        data = {
            'user': user.pk,
            'role': role.pk,
            'assigned_by': admin_user.pk
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert UserRole.objects.filter(user=user, role=role).exists()
    
    def test_list_user_roles(self, authenticated_client, admin_user):
        """Test listing user roles."""
        user = UserFactory(tenant=admin_user.tenant)
        role = RoleFactory(tenant=admin_user.tenant)
        UserRole.objects.create(user=user, role=role, assigned_by=admin_user)
        
        url = reverse('userrole-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data


@pytest.mark.django_db
class TestRBACIntegration:
    """Integration tests for RBAC system."""
    
    def test_user_permissions_through_roles(self, authenticated_client, admin_user):
        """Test that users get permissions through roles."""
        # Create user, role, and permission
        user = UserFactory(tenant=admin_user.tenant)
        role = RoleFactory(tenant=admin_user.tenant)
        permission = PermissionFactory()
        
        # Assign permission to role
        RolePermission.objects.create(role=role, permission=permission)
        
        # Assign role to user
        UserRole.objects.create(user=user, role=role, assigned_by=admin_user)
        
        # Test that user has the permission
        assert user.has_permission(permission.name)
    
    def test_role_hierarchy(self, authenticated_client, admin_user):
        """Test role hierarchy and permission inheritance."""
        # Create parent and child roles
        parent_role = RoleFactory(tenant=admin_user.tenant, name='parent_role')
        child_role = RoleFactory(
            tenant=admin_user.tenant, 
            name='child_role',
            parent_role=parent_role
        )
        
        # Create permission and assign to parent
        permission = PermissionFactory()
        RolePermission.objects.create(role=parent_role, permission=permission)
        
        # Get all permissions for child role (should include parent's permissions)
        all_permissions = child_role.get_all_permissions()
        
        assert permission in all_permissions
    
    def test_user_role_status(self, authenticated_client, admin_user):
        """Test user role active/inactive status."""
        user = UserFactory(tenant=admin_user.tenant)
        role = RoleFactory(tenant=admin_user.tenant)
        
        # Create active user role
        user_role = UserRole.objects.create(
            user=user, 
            role=role, 
            assigned_by=admin_user,
            is_active=True
        )
        
        assert user.has_role(role.name)
        
        # Deactivate user role
        user_role.is_active = False
        user_role.save()
        
        assert not user.has_role(role.name)
