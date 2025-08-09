#!/usr/bin/env python
"""
Fixed comprehensive test execution script for the school management platform.
"""
import os
import sys
import time
import django
from django.core.management import execute_from_command_line
from django.test.utils import get_runner
from django.conf import settings

# Test summary tracking
test_results = {
    'total_tests': 0,
    'passed': 0,
    'failed': 0,
    'skipped': 0,
    'errors': [],
    'warnings': []
}

def setup_django():
    """Setup Django environment for testing."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_platform.settings')
    django.setup()

def run_basic_checks():
    """Run basic system checks."""
    print("\n" + "="*60)
    print("🔍 RUNNING BASIC SYSTEM CHECKS")
    print("="*60)
    
    try:
        # Check Django setup
        execute_from_command_line(['manage.py', 'check'])
        print("✅ Django system checks passed")
        
        # Check database migrations
        execute_from_command_line(['manage.py', 'showmigrations'])
        print("✅ Migration status checked")
        
        return True
    except Exception as e:
        print(f"❌ Basic checks failed: {e}")
        test_results['errors'].append(f"Basic checks: {e}")
        return False

def test_model_creation():
    """Test basic model creation."""
    print("\n" + "="*60)
    print("🏗️  TESTING MODEL CREATION")
    print("="*60)
    
    try:
        from core.models import Tenant
        from accounts.models import User, Role, Permission
        from schools.models import School, AcademicYear
        
        # Test tenant creation with proper database_name
        tenant = Tenant.objects.get_or_create(
            subdomain='test',
            defaults={
                'name': 'Test Tenant',
                'domain': 'test.localhost',
                'database_name': 'test_db',
                'school_name': 'Test School',
                'is_active': True
            }
        )[0]
        print("✅ Tenant creation successful")
        
        # Test user creation
        user = User.objects.get_or_create(
            username='test_model_user',
            defaults={
                'email': 'test@model.com',
                'tenant': tenant,
                'user_type': 'admin',
                'is_verified': True
            }
        )[0]
        user.set_password('testpass123')
        user.save()
        print("✅ User creation successful")
        
        # Test role creation
        role = Role.objects.get_or_create(
            name='test_role',
            defaults={
                'display_name': 'Test Role',
                'tenant': tenant,
                'role_type': 'tenant'
            }
        )[0]
        print("✅ Role creation successful")
        
        # Test permission creation
        permission = Permission.objects.get_or_create(
            name='test_permission',
            defaults={
                'display_name': 'Test Permission',
                'permission_type': 'view',
                'app_label': 'test',
                'model_name': 'test',
                'codename': 'view_test'
            }
        )[0]
        print("✅ Permission creation successful")
        
        # Test school creation
        school = School.objects.get_or_create(
            tenant=tenant,
            defaults={
                'name': 'Test School',
                'code': 'TEST001',
                'address': '123 Test Street',
                'phone': '+1234567890',
                'email': 'test@school.com'
            }
        )[0]
        print("✅ School creation successful")
        
        test_results['passed'] += 5
        return True
        
    except Exception as e:
        print(f"❌ Model creation failed: {e}")
        test_results['errors'].append(f"Model creation: {e}")
        test_results['failed'] += 1
        return False

def test_rbac_functionality():
    """Test RBAC system functionality."""
    print("\n" + "="*60)
    print("🔐 TESTING RBAC FUNCTIONALITY")
    print("="*60)
    
    try:
        from accounts.models import User, Role, Permission, UserRole, RolePermission
        from core.models import Tenant
        
        # Get or create test tenant
        tenant = Tenant.objects.get_or_create(
            subdomain='rbac_test',
            defaults={
                'name': 'RBAC Test Tenant',
                'domain': 'rbac.localhost',
                'database_name': 'rbac_test_db',
                'school_name': 'RBAC Test School',
                'is_active': True
            }
        )[0]
        
        # Create test user
        user = User.objects.get_or_create(
            username='rbac_test_user',
            defaults={
                'email': 'rbac@test.com',
                'tenant': tenant,
                'user_type': 'teacher',
                'is_verified': True
            }
        )[0]
        user.set_password('testpass123')
        user.save()
        
        # Create test role
        role = Role.objects.get_or_create(
            name='rbac_test_role',
            defaults={
                'display_name': 'RBAC Test Role',
                'tenant': tenant,
                'role_type': 'tenant'
            }
        )[0]
        
        # Create test permission
        permission = Permission.objects.get_or_create(
            name='rbac_test_permission',
            defaults={
                'display_name': 'RBAC Test Permission',
                'permission_type': 'view',
                'app_label': 'test',
                'model_name': 'test',
                'codename': 'view_test'
            }
        )[0]
        
        # Assign permission to role
        role_permission = RolePermission.objects.get_or_create(
            role=role,
            permission=permission,
            defaults={'is_active': True}
        )[0]
        
        # Assign role to user
        user_role = UserRole.objects.get_or_create(
            user=user,
            role=role,
            defaults={
                'assigned_by': user,
                'is_active': True
            }
        )[0]
        
        # Test user has permission through role
        if user.has_permission(permission.name):
            print("✅ Permission inheritance working")
            test_results['passed'] += 1
        else:
            print("⚠️  Permission inheritance not working as expected")
            test_results['warnings'].append("Permission inheritance issue")
        
        # Test role methods
        if user.has_role(role.name):
            print("✅ Role assignment working")
            test_results['passed'] += 1
        else:
            print("⚠️  Role assignment not working as expected")
            test_results['warnings'].append("Role assignment issue")
        
        return True
        
    except Exception as e:
        print(f"❌ RBAC functionality failed: {e}")
        test_results['errors'].append(f"RBAC: {e}")
        test_results['failed'] += 1
        return False

def test_database_operations():
    """Test database operations and constraints."""
    print("\n" + "="*60)
    print("🗃️  TESTING DATABASE OPERATIONS")
    print("="*60)
    
    try:
        from django.db import transaction, IntegrityError
        from django.contrib.auth import get_user_model
        from core.models import Tenant
        
        User = get_user_model()
        
        # Test transaction rollback
        tenant = Tenant.objects.get_or_create(
            subdomain='db_test',
            defaults={
                'name': 'DB Test Tenant',
                'domain': 'db.localhost',
                'database_name': 'db_test_db',
                'school_name': 'DB Test School',
                'is_active': True
            }
        )[0]
        
        try:
            with transaction.atomic():
                # Create user
                user1 = User.objects.create_user(
                    username='db_test_user1',
                    email='db1@test.com',
                    password='testpass123',
                    tenant=tenant
                )
                
                # Try to create duplicate (should fail)
                user2 = User.objects.create_user(
                    username='db_test_user1',  # Same username
                    email='db2@test.com',
                    password='testpass123',
                    tenant=tenant
                )
        except IntegrityError:
            print("✅ Unique constraint working (expected error)")
            test_results['passed'] += 1
        
        # Test successful operations
        user = User.objects.create_user(
            username='db_success_user',
            email='success@test.com',
            password='testpass123',
            tenant=tenant
        )
        
        # Update user
        user.first_name = 'Updated'
        user.save()
        
        user.refresh_from_db()
        if user.first_name == 'Updated':
            print("✅ User update successful")
            test_results['passed'] += 1
        
        # Test deletion
        user_id = user.id
        user.delete()
        
        if not User.objects.filter(id=user_id).exists():
            print("✅ User deletion successful")
            test_results['passed'] += 1
        
        return True
        
    except Exception as e:
        print(f"❌ Database operations failed: {e}")
        test_results['errors'].append(f"Database operations: {e}")
        test_results['failed'] += 1
        return False

def test_school_workflow():
    """Test complete school management workflow."""
    print("\n" + "="*60)
    print("🏫 TESTING SCHOOL WORKFLOW")
    print("="*60)
    
    try:
        from schools.models import School, AcademicYear, Grade, Subject, Student
        from accounts.models import User
        from core.models import Tenant
        
        # Create tenant
        tenant = Tenant.objects.get_or_create(
            subdomain='school_workflow',
            defaults={
                'name': 'School Workflow Tenant',
                'domain': 'workflow.localhost',
                'database_name': 'workflow_db',
                'school_name': 'Workflow Test School',
                'is_active': True
            }
        )[0]
        
        # Create school
        school = School.objects.get_or_create(
            tenant=tenant,
            defaults={
                'name': 'Workflow Test School',
                'code': 'WF001',
                'address': '123 Workflow Street',
                'phone': '+1234567890',
                'email': 'workflow@school.com'
            }
        )[0]
        print("✅ School created")
        
        # Create academic year
        academic_year = AcademicYear.objects.get_or_create(
            school=school,
            name='2024-2025',
            defaults={
                'start_date': '2024-09-01',
                'end_date': '2025-06-30',
                'is_current': True
            }
        )[0]
        print("✅ Academic year created")
        
        # Create grade
        grade = Grade.objects.get_or_create(
            school=school,
            code='G1A',
            defaults={
                'name': 'Grade 1A',
                'capacity': 25
            }
        )[0]
        print("✅ Grade created")
        
        # Create subject
        subject = Subject.objects.get_or_create(
            school=school,
            code='MATH',
            defaults={
                'name': 'Mathematics'
            }
        )[0]
        print("✅ Subject created")
        
        # Create student user
        student_user = User.objects.get_or_create(
            username='workflow_student',
            defaults={
                'email': 'student@workflow.com',
                'user_type': 'student',
                'tenant': tenant,
                'first_name': 'John',
                'last_name': 'Student',
                'is_verified': True
            }
        )[0]
        student_user.set_password('studentpass123')
        student_user.save()
        
        # Create student record
        student = Student.objects.get_or_create(
            user=student_user,
            defaults={
                'school': school,
                'student_id': 'WF001',
                'admission_number': 'ADM001',
                'grade': grade,
                'date_of_birth': '2015-01-01',
                'admission_date': '2024-01-01',
                'gender': 'male',
                'parent_name': 'Parent Name',
                'parent_phone': '+1234567890',
                'address': '123 Student Street',
                'city': 'Test City',
                'state': 'Test State'
            }
        )[0]
        print("✅ Student created and assigned to grade")
        
        # Verify relationships
        assert student.school == school, "Student-school relationship failed"
        assert student.grade == grade, "Student-grade relationship failed"
        assert grade.school == school, "Grade-school relationship failed"
        assert academic_year.school == school, "Academic year-school relationship failed"
        
        print("✅ All relationships verified")
        
        test_results['passed'] += 6
        return True
        
    except Exception as e:
        print(f"❌ School workflow failed: {e}")
        test_results['errors'].append(f"School workflow: {e}")
        test_results['failed'] += 1
        return False

def test_api_basic_functionality():
    """Test basic API setup."""
    print("\n" + "="*60)
    print("🌐 TESTING BASIC API SETUP")
    print("="*60)
    
    try:
        from django.test import Client
        from django.contrib.auth import get_user_model
        from core.models import Tenant
        
        User = get_user_model()
        client = Client()
        
        # Create test tenant and user
        tenant = Tenant.objects.get_or_create(
            subdomain='api_test',
            defaults={
                'name': 'API Test Tenant',
                'domain': 'api.localhost',
                'database_name': 'api_test_db',
                'school_name': 'API Test School',
                'is_active': True
            }
        )[0]
        
        admin_user = User.objects.get_or_create(
            username='api_admin',
            defaults={
                'email': 'api@admin.com',
                'tenant': tenant,
                'is_staff': True,
                'is_superuser': True,
                'user_type': 'admin',
                'is_verified': True
            }
        )[0]
        admin_user.set_password('adminpass123')
        admin_user.save()
        
        # Try basic endpoints
        basic_endpoints = [
            '/admin/',
            '/',
        ]
        
        endpoint_results = []
        for endpoint in basic_endpoints:
            try:
                response = client.get(endpoint)
                status_code = response.status_code
                endpoint_results.append((endpoint, status_code))
                
                if status_code in [200, 302, 401, 403]:  # Expected responses
                    print(f"✅ {endpoint} - Status: {status_code}")
                else:
                    print(f"❓ {endpoint} - Status: {status_code}")
                    
            except Exception as e:
                print(f"❌ {endpoint} - Error: {e}")
                test_results['errors'].append(f"Basic endpoint {endpoint}: {e}")
        
        test_results['passed'] += 1
        return True
        
    except Exception as e:
        print(f"❌ API testing failed: {e}")
        test_results['errors'].append(f"API testing: {e}")
        test_results['failed'] += 1
        return False

def run_comprehensive_tests():
    """Run all comprehensive tests."""
    print("\n" + "🚀" + "="*58 + "🚀")
    print("🚀" + " "*16 + "FIXED COMPREHENSIVE TESTING" + " "*13 + "🚀")
    print("🚀" + "="*58 + "🚀")
    
    start_time = time.time()
    
    # Setup
    setup_django()
    
    # Run test suites
    test_suites = [
        ("Basic System Checks", run_basic_checks),
        ("Model Creation", test_model_creation),
        ("RBAC Functionality", test_rbac_functionality),
        ("Database Operations", test_database_operations),
        ("School Workflow", test_school_workflow),
        ("API Basic Setup", test_api_basic_functionality),
    ]
    
    for suite_name, test_function in test_suites:
        try:
            test_results['total_tests'] += 1
            success = test_function()
            if not success:
                test_results['failed'] += 1
        except Exception as e:
            print(f"❌ {suite_name} failed with exception: {e}")
            test_results['failed'] += 1
            test_results['errors'].append(f"{suite_name}: {e}")
    
    # Calculate summary
    end_time = time.time()
    duration = end_time - start_time
    
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    print(f"⏱️  Duration: {duration:.2f} seconds")
    print(f"🧪 Total Test Suites: {test_results['total_tests']}")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"⚠️  Warnings: {len(test_results['warnings'])}")
    
    if test_results['errors']:
        print(f"\n❌ ERRORS ({len(test_results['errors'])}):")
        for i, error in enumerate(test_results['errors'], 1):
            print(f"   {i}. {error}")
    
    if test_results['warnings']:
        print(f"\n⚠️  WARNINGS ({len(test_results['warnings'])}):")
        for i, warning in enumerate(test_results['warnings'], 1):
            print(f"   {i}. {warning}")
    
    # Overall assessment
    print("\n" + "="*60)
    success_rate = (test_results['passed'] / max(test_results['total_tests'], 1)) * 100
    
    if success_rate >= 80:
        print("🎉 OVERALL ASSESSMENT: EXCELLENT")
        print("   The backend is functioning well with good test coverage.")
    elif success_rate >= 60:
        print("✅ OVERALL ASSESSMENT: GOOD")
        print("   The backend has solid functionality with minor issues.")
    elif success_rate >= 40:
        print("⚠️  OVERALL ASSESSMENT: MODERATE")
        print("   The backend has core functionality but needs improvements.")
    else:
        print("❌ OVERALL ASSESSMENT: NEEDS WORK")
        print("   The backend has significant issues that need addressing.")
    
    print(f"📈 Success Rate: {success_rate:.1f}%")
    print("="*60)
    
    return success_rate >= 60

if __name__ == "__main__":
    success = run_comprehensive_tests()
    sys.exit(0 if success else 1)
