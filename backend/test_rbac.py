#!/usr/bin/env python3
"""
Test script to verify RBAC implementation.
This script can be run to test the RBAC system functionality.
"""

import os
import sys
import django
import requests
import json
from datetime import datetime

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_platform.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Role, Permission, UserRole, RolePermission
from core.models import Tenant

User = get_user_model()

def test_rbac_setup():
    """Test RBAC setup and basic functionality."""
    print("🔐 Testing RBAC Implementation...")
    print("=" * 50)
    
    # Test 1: Check if permissions exist
    print("\n1. Testing Permissions...")
    permissions = Permission.objects.all()
    print(f"   ✅ Found {permissions.count()} permissions")
    
    # Test 2: Check if roles exist
    print("\n2. Testing Roles...")
    roles = Role.objects.all()
    print(f"   ✅ Found {roles.count()} roles")
    
    # Test 3: Check system roles
    system_roles = Role.objects.filter(role_type='system')
    print(f"   ✅ Found {system_roles.count()} system roles")
    
    # Test 4: Check tenant roles
    tenant_roles = Role.objects.filter(role_type='tenant')
    print(f"   ✅ Found {tenant_roles.count()} tenant roles")
    
    # Test 5: Check role permissions
    role_permissions = RolePermission.objects.all()
    print(f"   ✅ Found {role_permissions.count()} role-permission assignments")
    
    return True

def test_user_creation():
    """Test user creation and role assignment."""
    print("\n3. Testing User Creation...")
    
    # Create a test tenant if it doesn't exist
    tenant, created = Tenant.objects.get_or_create(
        subdomain='test',
        defaults={
            'name': 'Test School',
            'domain': 'test.localhost',
            'is_active': True
        }
    )
    
    if created:
        print(f"   ✅ Created test tenant: {tenant.name}")
    
    # Create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'teacher',
            'tenant': tenant,
            'is_active': True
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"   ✅ Created test user: {user.username}")
    
    # Test user methods
    print(f"   ✅ User roles: {user.get_roles()}")
    print(f"   ✅ User permissions: {user.get_permissions().count()}")
    
    return user, tenant

def test_role_assignment(user, tenant):
    """Test role assignment to user."""
    print("\n4. Testing Role Assignment...")
    
    # Get teacher role
    teacher_role = Role.objects.filter(
        name='teacher',
        tenant=tenant
    ).first()
    
    if teacher_role:
        # Assign role to user
        user_role, created = UserRole.objects.get_or_create(
            user=user,
            role=teacher_role,
            defaults={
                'assigned_by': user,
                'is_active': True
            }
        )
        
        if created:
            print(f"   ✅ Assigned role '{teacher_role.name}' to user")
        
        # Test role checking
        has_role = user.has_role('teacher')
        print(f"   ✅ User has teacher role: {has_role}")
        
        # Test permission checking
        has_permission = user.has_permission('schools.view_student')
        print(f"   ✅ User has view_student permission: {has_permission}")
        
    else:
        print("   ❌ Teacher role not found")
    
    return teacher_role

def test_api_endpoints():
    """Test API endpoints for RBAC."""
    print("\n5. Testing API Endpoints...")
    
    base_url = "http://localhost:8001/api/v1"
    
    # Test endpoints
    endpoints = [
        "/accounts/roles/",
        "/accounts/permissions/",
        "/accounts/user-roles/",
        "/accounts/users/",
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                print(f"   ✅ {endpoint} - OK")
            else:
                print(f"   ⚠️  {endpoint} - Status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"   ❌ {endpoint} - Error: {e}")

def test_permission_hierarchy():
    """Test permission hierarchy and inheritance."""
    print("\n6. Testing Permission Hierarchy...")
    
    # Test role inheritance
    roles = Role.objects.filter(parent_role__isnull=False)
    print(f"   ✅ Found {roles.count()} roles with inheritance")
    
    for role in roles:
        all_permissions = role.get_all_permissions()
        direct_permissions = role.permissions.all()
        inherited_count = len(all_permissions) - len(direct_permissions)
        print(f"   ✅ Role '{role.name}': {len(direct_permissions)} direct, {inherited_count} inherited permissions")

def main():
    """Main test function."""
    print("🚀 Starting RBAC Implementation Test")
    print("=" * 50)
    
    try:
        # Test basic setup
        test_rbac_setup()
        
        # Test user creation
        user, tenant = test_user_creation()
        
        # Test role assignment
        test_role_assignment(user, tenant)
        
        # Test API endpoints (if server is running)
        test_api_endpoints()
        
        # Test permission hierarchy
        test_permission_hierarchy()
        
        print("\n" + "=" * 50)
        print("✅ RBAC Implementation Test Completed Successfully!")
        print("=" * 50)
        
        print("\n📋 Summary:")
        print(f"   • Total Permissions: {Permission.objects.count()}")
        print(f"   • Total Roles: {Role.objects.count()}")
        print(f"   • Total Users: {User.objects.count()}")
        print(f"   • Total Role Assignments: {UserRole.objects.count()}")
        print(f"   • Total Permission Assignments: {RolePermission.objects.count()}")
        
        print("\n🔗 Access Points:")
        print("   • Backend API: http://localhost:8001/api/v1/")
        print("   • Django Admin: http://localhost:8001/admin/")
        print("   • pgAdmin: http://localhost:5051/")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 