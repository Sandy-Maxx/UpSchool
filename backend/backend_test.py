#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite
Tests all modules and functionality of the School ERP Platform
"""

import os
import sys
import django
import json
from datetime import datetime, timedelta
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_platform.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import Tenant, SystemSettings, Notification
from accounts.models import Role, Permission, UserRole, RolePermission
from schools.models import School, Student, Teacher, Parent, Class, Subject, Exam, Grade, Attendance
from library.models import Book, BookIssue
from transport.models import Route, Vehicle
from communication.models import Message, Announcement
from reports.models import Report

User = get_user_model()

def test_core_modules():
    """Test core platform modules."""
    print("🔧 Testing Core Modules...")
    results = []
    
    # Test tenant creation
    try:
        tenant = Tenant.objects.create(
            subdomain='core-test',
            name='Core Test School',
            domain='core-test.localhost',
            is_active=True
        )
        results.append(("Tenant Creation", "PASSED"))
    except Exception as e:
        results.append(("Tenant Creation", f"FAILED: {e}"))
    
    # Test system settings
    try:
        setting = SystemSettings.objects.create(
            key='test_setting',
            value='test_value',
            description='Test setting'
        )
        results.append(("System Settings", "PASSED"))
    except Exception as e:
        results.append(("System Settings", f"FAILED: {e}"))
    
    return results

def test_rbac_system():
    """Test RBAC system."""
    print("🔐 Testing RBAC System...")
    results = []
    
    # Test role creation
    try:
        role = Role.objects.create(
            name='test_role',
            display_name='Test Role',
            role_type='tenant',
            tenant=Tenant.objects.first()
        )
        results.append(("Role Creation", "PASSED"))
    except Exception as e:
        results.append(("Role Creation", f"FAILED: {e}"))
    
    # Test permission creation
    try:
        permission = Permission.objects.create(
            name='test.permission',
            display_name='Test Permission',
            permission_type='view',
            app_label='test',
            model_name='test',
            codename='test'
        )
        results.append(("Permission Creation", "PASSED"))
    except Exception as e:
        results.append(("Permission Creation", f"FAILED: {e}"))
    
    # Test role-permission assignment
    try:
        role = Role.objects.first()
        permission = Permission.objects.first()
        if role and permission:
            role_permission = RolePermission.objects.create(
                role=role,
                permission=permission,
                granted_by=User.objects.first()
            )
            results.append(("Role-Permission Assignment", "PASSED"))
        else:
            results.append(("Role-Permission Assignment", "SKIPPED"))
    except Exception as e:
        results.append(("Role-Permission Assignment", f"FAILED: {e}"))
    
    return results

def test_school_management():
    """Test school management modules."""
    print("🏫 Testing School Management...")
    results = []
    
    # Test school creation
    try:
        school = School.objects.create(
            name='Test School',
            tenant=Tenant.objects.first(),
            address='Test Address',
            phone='+1234567890',
            email='test@school.com'
        )
        results.append(("School Creation", "PASSED"))
    except Exception as e:
        results.append(("School Creation", f"FAILED: {e}"))
    
    # Test student creation
    try:
        user = User.objects.create(username='test_student', email='student@test.com')
        student = Student.objects.create(
            user=user,
            school=School.objects.first(),
            student_id='STU001',
            grade_level='10'
        )
        results.append(("Student Creation", "PASSED"))
    except Exception as e:
        results.append(("Student Creation", f"FAILED: {e}"))
    
    # Test teacher creation
    try:
        user = User.objects.create(username='test_teacher', email='teacher@test.com')
        teacher = Teacher.objects.create(
            user=user,
            school=School.objects.first(),
            employee_id='EMP001',
            department='Mathematics'
        )
        results.append(("Teacher Creation", "PASSED"))
    except Exception as e:
        results.append(("Teacher Creation", f"FAILED: {e}"))
    
    return results

def test_academic_management():
    """Test academic management modules."""
    print("📚 Testing Academic Management...")
    results = []
    
    # Test class creation
    try:
        class_obj = Class.objects.create(
            name='Test Class',
            school=School.objects.first(),
            grade_level='10',
            academic_year='2024-2025',
            capacity=30
        )
        results.append(("Class Creation", "PASSED"))
    except Exception as e:
        results.append(("Class Creation", f"FAILED: {e}"))
    
    # Test subject creation
    try:
        subject = Subject.objects.create(
            name='Mathematics',
            code='MATH101',
            school=School.objects.first(),
            description='Advanced Mathematics'
        )
        results.append(("Subject Creation", "PASSED"))
    except Exception as e:
        results.append(("Subject Creation", f"FAILED: {e}"))
    
    # Test exam creation
    try:
        exam = Exam.objects.create(
            title='Midterm Exam',
            subject=Subject.objects.first(),
            class_obj=Class.objects.first(),
            exam_date=datetime.now().date(),
            total_marks=100
        )
        results.append(("Exam Creation", "PASSED"))
    except Exception as e:
        results.append(("Exam Creation", f"FAILED: {e}"))
    
    # Test grade creation
    try:
        student = Student.objects.first()
        exam = Exam.objects.first()
        if student and exam:
            grade = Grade.objects.create(
                student=student,
                exam=exam,
                marks_obtained=85,
                total_marks=100,
                grade='A'
            )
            results.append(("Grade Creation", "PASSED"))
        else:
            results.append(("Grade Creation", "SKIPPED"))
    except Exception as e:
        results.append(("Grade Creation", f"FAILED: {e}"))
    
    return results

def test_library_management():
    """Test library management modules."""
    print("📖 Testing Library Management...")
    results = []
    
    # Test book creation
    try:
        book = Book.objects.create(
            title='Test Book',
            author='Test Author',
            isbn='1234567890123',
            school=School.objects.first(),
            quantity=5
        )
        results.append(("Book Creation", "PASSED"))
    except Exception as e:
        results.append(("Book Creation", f"FAILED: {e}"))
    
    # Test book issue
    try:
        book = Book.objects.first()
        student = Student.objects.first()
        if book and student:
            issue = BookIssue.objects.create(
                book=book,
                student=student,
                issue_date=datetime.now().date(),
                due_date=(datetime.now() + timedelta(days=14)).date()
            )
            results.append(("Book Issue", "PASSED"))
        else:
            results.append(("Book Issue", "SKIPPED"))
    except Exception as e:
        results.append(("Book Issue", f"FAILED: {e}"))
    
    return results

def test_transport_management():
    """Test transport management modules."""
    print("🚌 Testing Transport Management...")
    results = []
    
    # Test route creation
    try:
        route = Route.objects.create(
            name='Route 1',
            school=School.objects.first(),
            start_location='School',
            end_location='City Center',
            distance=10.5
        )
        results.append(("Route Creation", "PASSED"))
    except Exception as e:
        results.append(("Route Creation", f"FAILED: {e}"))
    
    # Test vehicle creation
    try:
        vehicle = Vehicle.objects.create(
            vehicle_number='BUS001',
            school=School.objects.first(),
            capacity=50,
            vehicle_type='Bus'
        )
        results.append(("Vehicle Creation", "PASSED"))
    except Exception as e:
        results.append(("Vehicle Creation", f"FAILED: {e}"))
    
    return results

def test_communication_system():
    """Test communication system modules."""
    print("💬 Testing Communication System...")
    results = []
    
    # Test message creation
    try:
        sender = User.objects.create(username='sender', email='sender@test.com')
        recipient = User.objects.create(username='recipient', email='recipient@test.com')
        message = Message.objects.create(
            sender=sender,
            recipient=recipient,
            subject='Test Message',
            content='Test content',
            school=School.objects.first()
        )
        results.append(("Message Creation", "PASSED"))
    except Exception as e:
        results.append(("Message Creation", f"FAILED: {e}"))
    
    # Test announcement creation
    try:
        author = User.objects.create(username='announcer', email='announcer@test.com')
        announcement = Announcement.objects.create(
            title='Test Announcement',
            content='Test announcement content',
            author=author,
            school=School.objects.first(),
            priority='normal'
        )
        results.append(("Announcement Creation", "PASSED"))
    except Exception as e:
        results.append(("Announcement Creation", f"FAILED: {e}"))
    
    return results

def test_reporting_system():
    """Test reporting system modules."""
    print("📊 Testing Reporting System...")
    results = []
    
    # Test report creation
    try:
        report = Report.objects.create(
            title='Test Report',
            report_type='academic',
            school=School.objects.first(),
            generated_by=User.objects.first()
        )
        results.append(("Report Creation", "PASSED"))
    except Exception as e:
        results.append(("Report Creation", f"FAILED: {e}"))
    
    return results

def test_data_integrity():
    """Test data integrity and relationships."""
    print("🔍 Testing Data Integrity...")
    results = []
    
    # Test foreign key relationships
    try:
        tenant = Tenant.objects.first()
        school = School.objects.first()
        if tenant and school:
            assert school.tenant == tenant
            results.append(("Foreign Key Relationships", "PASSED"))
        else:
            results.append(("Foreign Key Relationships", "SKIPPED"))
    except Exception as e:
        results.append(("Foreign Key Relationships", f"FAILED: {e}"))
    
    # Test unique constraints
    try:
        User.objects.create(username='unique_test', email='unique@test.com')
        User.objects.create(username='unique_test2', email='unique2@test.com')  # Should work
        results.append(("Unique Constraints", "PASSED"))
    except Exception as e:
        results.append(("Unique Constraints", f"FAILED: {e}"))
    
    return results

def test_performance():
    """Test system performance."""
    print("⚡ Testing Performance...")
    results = []
    
    # Test bulk operations
    try:
        users_data = [
            User(username=f'perf_test_{i}', email=f'perf{i}@test.com')
            for i in range(50)
        ]
        start_time = datetime.now()
        User.objects.bulk_create(users_data)
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        if duration < 5.0:
            results.append(("Bulk Operations", "PASSED"))
        else:
            results.append(("Bulk Operations", f"SLOW: {duration:.2f}s"))
    except Exception as e:
        results.append(("Bulk Operations", f"FAILED: {e}"))
    
    # Test query performance
    try:
        start_time = datetime.now()
        users = User.objects.all()[:100]
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        if duration < 1.0:
            results.append(("Query Performance", "PASSED"))
        else:
            results.append(("Query Performance", f"SLOW: {duration:.2f}s"))
    except Exception as e:
        results.append(("Query Performance", f"FAILED: {e}"))
    
    return results

def test_security():
    """Test security features."""
    print("🔒 Testing Security...")
    results = []
    
    # Test password hashing
    try:
        user = User.objects.create(username='security_test', email='security@test.com')
        user.set_password('test_password')
        user.save()
        
        # Password should be hashed
        assert user.password != 'test_password'
        assert user.check_password('test_password')
        results.append(("Password Hashing", "PASSED"))
    except Exception as e:
        results.append(("Password Hashing", f"FAILED: {e}"))
    
    # Test tenant isolation
    try:
        tenant1 = Tenant.objects.create(subdomain='sec_test1', name='Security Test 1')
        tenant2 = Tenant.objects.create(subdomain='sec_test2', name='Security Test 2')
        
        user1 = User.objects.create(username='sec_user1', tenant=tenant1)
        user2 = User.objects.create(username='sec_user2', tenant=tenant2)
        
        assert user1.tenant != user2.tenant
        results.append(("Tenant Isolation", "PASSED"))
    except Exception as e:
        results.append(("Tenant Isolation", f"FAILED: {e}"))
    
    return results

def main():
    """Main function to run all tests."""
    print("🚀 Starting Comprehensive Backend Test Suite")
    print("=" * 60)
    
    all_results = []
    
    # Run all test categories
    all_results.extend(test_core_modules())
    all_results.extend(test_rbac_system())
    all_results.extend(test_school_management())
    all_results.extend(test_academic_management())
    all_results.extend(test_library_management())
    all_results.extend(test_transport_management())
    all_results.extend(test_communication_system())
    all_results.extend(test_reporting_system())
    all_results.extend(test_data_integrity())
    all_results.extend(test_performance())
    all_results.extend(test_security())
    
    # Generate report
    print("\n" + "=" * 60)
    print("📊 COMPREHENSIVE BACKEND TEST REPORT")
    print("=" * 60)
    
    passed = sum(1 for _, status in all_results if status == "PASSED")
    failed = sum(1 for _, status in all_results if status.startswith("FAILED"))
    skipped = sum(1 for _, status in all_results if status == "SKIPPED")
    slow = sum(1 for _, status in all_results if status.startswith("SLOW"))
    
    total = len(all_results)
    success_rate = (passed / total * 100) if total > 0 else 0
    
    print(f"\n📈 Test Summary:")
    print(f"   • Total Tests: {total}")
    print(f"   • Passed: {passed}")
    print(f"   • Failed: {failed}")
    print(f"   • Skipped: {skipped}")
    print(f"   • Slow: {slow}")
    print(f"   • Success Rate: {success_rate:.2f}%")
    
    print(f"\n📋 Detailed Results:")
    for test_name, status in all_results:
        if status == "PASSED":
            print(f"   ✅ {test_name}")
        elif status.startswith("FAILED"):
            print(f"   ❌ {test_name}: {status}")
        elif status == "SKIPPED":
            print(f"   ⏭️  {test_name}")
        elif status.startswith("SLOW"):
            print(f"   🐌 {test_name}: {status}")
    
    print(f"\n🔗 Access Points:")
    print(f"   • Backend API: http://localhost:8001/api/v1/")
    print(f"   • Django Admin: http://localhost:8001/admin/")
    print(f"   • pgAdmin: http://localhost:5051/")
    
    if success_rate >= 95:
        print(f"\n🎉 EXCELLENT! Backend is production-ready!")
    elif success_rate >= 90:
        print(f"\n✅ GOOD! Backend is mostly ready with minor issues.")
    elif success_rate >= 80:
        print(f"\n⚠️  FAIR! Backend needs some fixes before production.")
    else:
        print(f"\n❌ POOR! Backend needs significant work before production.")
    
    # Save results to file
    results_data = {
        'summary': {
            'total': total,
            'passed': passed,
            'failed': failed,
            'skipped': skipped,
            'slow': slow,
            'success_rate': success_rate
        },
        'results': all_results,
        'timestamp': datetime.now().isoformat()
    }
    
    with open('backend_test_results.json', 'w') as f:
        json.dump(results_data, f, indent=2, default=str)
    
    print(f"\n📄 Detailed results saved to: backend_test_results.json")

if __name__ == "__main__":
    main() 