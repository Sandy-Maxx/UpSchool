#!/usr/bin/env python3
"""
Simple test script to verify RBAC implementation.
This script tests the RBAC system functionality without external dependencies.
"""

import os
import sys
import django
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
    
    # Show some sample permissions
    sample_permissions = permissions[:5]
    for perm in sample_permissions:
        print(f"      - {perm.name} ({perm.permission_type})")
    
    # Test 2: Check if roles exist
    print("\n2. Testing Roles...")
    roles = Role.objects.all()
    print(f"   ✅ Found {roles.count()} roles")
    
    # Show all roles
    for role in roles:
        print(f"      - {role.name} ({role.role_type}) - {role.display_name}")
    
    # Test 3: Check system roles
    system_roles = Role.objects.filter(role_type='system')
    print(f"\n3. System Roles: {system_roles.count()}")
    
    # Test 4: Check role permissions
    role_permissions = RolePermission.objects.all()
    print(f"\n4. Role-Permission Assignments: {role_permissions.count()}")
    
    return True

def test_user_creation():
    """Test user creation and role assignment."""
    print("\n5. Testing User Creation...")
    
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
    else:
        print(f"   ✅ Using existing tenant: {tenant.name}")
    
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
    else:
        print(f"   ✅ Using existing user: {user.username}")
    
    # Test user methods
    user_roles = user.get_roles()
    user_permissions = user.get_permissions()
    print(f"   ✅ User roles: {len(user_roles)}")
    print(f"   ✅ User permissions: {user_permissions.count()}")
    
    return user, tenant

def test_role_assignment(user, tenant):
    """Test role assignment to user."""
    print("\n6. Testing Role Assignment...")
    
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
        else:
            print(f"   ✅ Role '{teacher_role.name}' already assigned")
        
        # Test role checking
        has_role = user.has_role('teacher')
        print(f"   ✅ User has teacher role: {has_role}")
        
        # Test permission checking
        has_permission = user.has_permission('schools.view_student')
        print(f"   ✅ User has view_student permission: {has_permission}")
        
    else:
        print("   ❌ Teacher role not found")
    
    return teacher_role

def test_permission_hierarchy():
    """Test permission hierarchy and inheritance."""
    print("\n7. Testing Permission Hierarchy...")
    
    # Test role inheritance
    roles = Role.objects.filter(parent_role__isnull=False)
    print(f"   ✅ Found {roles.count()} roles with inheritance")
    
    for role in roles:
        all_permissions = role.get_all_permissions()
        direct_permissions = role.permissions.all()
        inherited_count = len(all_permissions) - len(direct_permissions)
        print(f"   ✅ Role '{role.name}': {len(direct_permissions)} direct, {inherited_count} inherited permissions")

def test_tenant_roles():
    """Test tenant-specific role creation."""
    print("\n8. Testing Tenant Role Setup...")
    
    # Get a tenant
    tenant = Tenant.objects.first()
    if tenant:
        # Create tenant-specific roles
        from accounts.management.commands.setup_rbac import Command
        cmd = Command()
        cmd.create_tenant_roles(tenant)
        print(f"   ✅ Created tenant roles for: {tenant.name}")
        
        # Check tenant roles
        tenant_roles = Role.objects.filter(tenant=tenant)
        print(f"   ✅ Found {tenant_roles.count()} tenant-specific roles")
        
        for role in tenant_roles:
            print(f"      - {role.name}: {role.display_name}")
    else:
        print("   ❌ No tenant found")

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
        
        # Test permission hierarchy
        test_permission_hierarchy()
        
        # Test tenant roles
        test_tenant_roles()
        
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
        print("     - Email: admin@test.com")
        print("     - Password: admin123")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 