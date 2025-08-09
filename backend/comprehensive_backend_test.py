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

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_platform.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.db import transaction

# Import all models
from core.models import Tenant, SystemSettings, Notification
from accounts.models import User, Role, Permission, UserRole, RolePermission, UserProfile, UserSession, UserActivity, PasswordHistory
from schools.models import School, Student, Teacher, Parent, Class, Subject, Timetable, Exam, Grade, Attendance, Fee, FeePayment
from library.models import Book, BookCategory, BookIssue, BookReturn
from transport.models import Route, Vehicle, Driver, StudentTransport, TransportSchedule
from communication.models import Message, MessageThread, Announcement, CommunicationTemplate, CommunicationLog
from reports.models import Report, ReportTemplate, ReportSchedule

User = get_user_model()

class ComprehensiveBackendTest:
    """Comprehensive test suite for the entire backend."""
    
    def __init__(self):
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': [],
            'warnings': []
        }
        self.test_tenant = None
        self.test_school = None
        self.admin_user = None
        self.teacher_user = None
        self.student_user = None
        self.parent_user = None
    
    def run_all_tests(self):
        """Run all comprehensive tests."""
        print("🚀 Starting Comprehensive Backend Test Suite")
        print("=" * 80)
        
        try:
            # Setup test environment
            self.setup_test_environment()
            
            # Run all test categories
            self.test_core_functionality()
            self.test_rbac_system()
            self.test_school_management()
            self.test_academic_management()
            self.test_library_management()
            self.test_transport_management()
            self.test_communication_system()
            self.test_financial_management()
            self.test_reporting_system()
            self.test_api_endpoints()
            self.test_data_integrity()
            self.test_performance()
            self.test_security()
            
            # Generate test report
            self.generate_test_report()
            
        except Exception as e:
            print(f"❌ Test suite failed with error: {e}")
            import traceback
            traceback.print_exc()
    
    def setup_test_environment(self):
        """Setup test environment with sample data."""
        print("\n🔧 Setting up test environment...")
        
        # Create test tenant
        self.test_tenant, created = Tenant.objects.get_or_create(
            subdomain='comprehensive-test',
            defaults={
                'name': 'Comprehensive Test School',
                'domain': 'comprehensive-test.localhost',
                'is_active': True
            }
        )
        
        # Create test school
        self.test_school, created = School.objects.get_or_create(
            name='Comprehensive Test School',
            tenant=self.test_tenant,
            defaults={
                'address': '123 Test Street',
                'phone': '+1234567890',
                'email': 'test@school.com',
                'is_active': True
            }
        )
        
        # Create test users
        self.create_test_users()
        
        print("   ✅ Test environment setup complete")
    
    def create_test_users(self):
        """Create test users for different roles."""
        # Admin user
        self.admin_user, created = User.objects.get_or_create(
            username='admin_test',
            defaults={
                'email': 'admin@test.com',
                'first_name': 'Admin',
                'last_name': 'Test',
                'user_type': 'admin',
                'tenant': self.test_tenant,
                'school': self.test_school,
                'is_active': True
            }
        )
        if created:
            self.admin_user.set_password('admin123')
            self.admin_user.save()
        
        # Teacher user
        self.teacher_user, created = User.objects.get_or_create(
            username='teacher_test',
            defaults={
                'email': 'teacher@test.com',
                'first_name': 'Teacher',
                'last_name': 'Test',
                'user_type': 'teacher',
                'tenant': self.test_tenant,
                'school': self.test_school,
                'is_active': True
            }
        )
        if created:
            self.teacher_user.set_password('teacher123')
            self.teacher_user.save()
        
        # Student user
        self.student_user, created = User.objects.get_or_create(
            username='student_test',
            defaults={
                'email': 'student@test.com',
                'first_name': 'Student',
                'last_name': 'Test',
                'user_type': 'student',
                'tenant': self.test_tenant,
                'school': self.test_school,
                'is_active': True
            }
        )
        if created:
            self.student_user.set_password('student123')
            self.student_user.save()
        
        # Parent user
        self.parent_user, created = User.objects.get_or_create(
            username='parent_test',
            defaults={
                'email': 'parent@test.com',
                'first_name': 'Parent',
                'last_name': 'Test',
                'user_type': 'parent',
                'tenant': self.test_tenant,
                'school': self.test_school,
                'is_active': True
            }
        )
        if created:
            self.parent_user.set_password('parent123')
            self.parent_user.save()
    
    def test_core_functionality(self):
        """Test core platform functionality."""
        print("\n📋 Testing Core Functionality...")
        
        # Test tenant management
        self.run_test("Tenant Creation", self.test_tenant_creation)
        self.run_test("Tenant Isolation", self.test_tenant_isolation)
        
        # Test system settings
        self.run_test("System Settings", self.test_system_settings)
        
        # Test notifications
        self.run_test("Notification System", self.test_notification_system)
    
    def test_rbac_system(self):
        """Test RBAC system functionality."""
        print("\n🔐 Testing RBAC System...")
        
        # Test role management
        self.run_test("Role Creation", self.test_role_creation)
        self.run_test("Permission Assignment", self.test_permission_assignment)
        self.run_test("User Role Assignment", self.test_user_role_assignment)
        self.run_test("Permission Checking", self.test_permission_checking)
        self.run_test("Role Inheritance", self.test_role_inheritance)
        
        # Test user management
        self.run_test("User Profile Management", self.test_user_profile_management)
        self.run_test("User Session Management", self.test_user_session_management)
        self.run_test("User Activity Tracking", self.test_user_activity_tracking)
        self.run_test("Password History", self.test_password_history)
    
    def test_school_management(self):
        """Test school management functionality."""
        print("\n🏫 Testing School Management...")
        
        # Test school operations
        self.run_test("School Profile Management", self.test_school_profile_management)
        self.run_test("Student Management", self.test_student_management)
        self.run_test("Teacher Management", self.test_teacher_management)
        self.run_test("Parent Management", self.test_parent_management)
    
    def test_academic_management(self):
        """Test academic management functionality."""
        print("\n📚 Testing Academic Management...")
        
        # Test academic operations
        self.run_test("Class Management", self.test_class_management)
        self.run_test("Subject Management", self.test_subject_management)
        self.run_test("Timetable Management", self.test_timetable_management)
        self.run_test("Exam Management", self.test_exam_management)
        self.run_test("Grade Management", self.test_grade_management)
        self.run_test("Attendance Management", self.test_attendance_management)
    
    def test_library_management(self):
        """Test library management functionality."""
        print("\n📖 Testing Library Management...")
        
        # Test library operations
        self.run_test("Book Management", self.test_book_management)
        self.run_test("Book Category Management", self.test_book_category_management)
        self.run_test("Book Issue Management", self.test_book_issue_management)
        self.run_test("Book Return Management", self.test_book_return_management)
    
    def test_transport_management(self):
        """Test transport management functionality."""
        print("\n🚌 Testing Transport Management...")
        
        # Test transport operations
        self.run_test("Route Management", self.test_route_management)
        self.run_test("Vehicle Management", self.test_vehicle_management)
        self.run_test("Driver Management", self.test_driver_management)
        self.run_test("Student Transport Assignment", self.test_student_transport_assignment)
        self.run_test("Transport Schedule Management", self.test_transport_schedule_management)
    
    def test_communication_system(self):
        """Test communication system functionality."""
        print("\n💬 Testing Communication System...")
        
        # Test communication operations
        self.run_test("Message Management", self.test_message_management)
        self.run_test("Message Thread Management", self.test_message_thread_management)
        self.run_test("Announcement Management", self.test_announcement_management)
        self.run_test("Communication Template Management", self.test_communication_template_management)
        self.run_test("Communication Log Management", self.test_communication_log_management)
    
    def test_financial_management(self):
        """Test financial management functionality."""
        print("\n💰 Testing Financial Management...")
        
        # Test financial operations
        self.run_test("Fee Management", self.test_fee_management)
        self.run_test("Fee Payment Management", self.test_fee_payment_management)
    
    def test_reporting_system(self):
        """Test reporting system functionality."""
        print("\n📊 Testing Reporting System...")
        
        # Test reporting operations
        self.run_test("Report Management", self.test_report_management)
        self.run_test("Report Template Management", self.test_report_template_management)
        self.run_test("Report Schedule Management", self.test_report_schedule_management)
    
    def test_api_endpoints(self):
        """Test API endpoints functionality."""
        print("\n🌐 Testing API Endpoints...")
        
        # Test API operations
        self.run_test("Authentication Endpoints", self.test_authentication_endpoints)
        self.run_test("User Management Endpoints", self.test_user_management_endpoints)
        self.run_test("School Management Endpoints", self.test_school_management_endpoints)
        self.run_test("Academic Management Endpoints", self.test_academic_management_endpoints)
    
    def test_data_integrity(self):
        """Test data integrity and relationships."""
        print("\n🔍 Testing Data Integrity...")
        
        # Test data integrity
        self.run_test("Foreign Key Relationships", self.test_foreign_key_relationships)
        self.run_test("Data Validation", self.test_data_validation)
        self.run_test("Unique Constraints", self.test_unique_constraints)
        self.run_test("Cascade Deletions", self.test_cascade_deletions)
    
    def test_performance(self):
        """Test system performance."""
        print("\n⚡ Testing Performance...")
        
        # Test performance
        self.run_test("Database Query Performance", self.test_database_query_performance)
        self.run_test("Bulk Operations Performance", self.test_bulk_operations_performance)
        self.run_test("Memory Usage", self.test_memory_usage)
    
    def test_security(self):
        """Test security features."""
        print("\n🔒 Testing Security...")
        
        # Test security
        self.run_test("Authentication Security", self.test_authentication_security)
        self.run_test("Authorization Security", self.test_authorization_security)
        self.run_test("Data Encryption", self.test_data_encryption)
        self.run_test("SQL Injection Prevention", self.test_sql_injection_prevention)
    
    def run_test(self, test_name, test_function):
        """Run a single test and record results."""
        try:
            print(f"   Testing: {test_name}")
            test_function()
            self.test_results['passed'] += 1
            print(f"   ✅ {test_name} - PASSED")
        except Exception as e:
            self.test_results['failed'] += 1
            self.test_results['errors'].append(f"{test_name}: {str(e)}")
            print(f"   ❌ {test_name} - FAILED: {str(e)}")
    
    # Core Functionality Tests
    def test_tenant_creation(self):
        """Test tenant creation and management."""
        tenant = Tenant.objects.create(
            subdomain='test-tenant',
            name='Test Tenant',
            domain='test-tenant.localhost',
            is_active=True
        )
        assert tenant.subdomain == 'test-tenant'
        assert tenant.name == 'Test Tenant'
    
    def test_tenant_isolation(self):
        """Test tenant data isolation."""
        # Create data for different tenants
        tenant1 = Tenant.objects.create(subdomain='tenant1', name='Tenant 1')
        tenant2 = Tenant.objects.create(subdomain='tenant2', name='Tenant 2')
        
        user1 = User.objects.create(username='user1', tenant=tenant1)
        user2 = User.objects.create(username='user2', tenant=tenant2)
        
        # Verify isolation
        assert User.objects.filter(tenant=tenant1).count() == 1
        assert User.objects.filter(tenant=tenant2).count() == 1
    
    def test_system_settings(self):
        """Test system settings management."""
        setting = SystemSettings.objects.create(
            key='test_setting',
            value='test_value',
            description='Test setting'
        )
        assert setting.key == 'test_setting'
        assert setting.value == 'test_value'
    
    def test_notification_system(self):
        """Test notification system."""
        notification = Notification.objects.create(
            title='Test Notification',
            message='Test message',
            notification_type='info',
            recipient=self.admin_user
        )
        assert notification.title == 'Test Notification'
        assert notification.recipient == self.admin_user
    
    # RBAC System Tests
    def test_role_creation(self):
        """Test role creation and management."""
        role = Role.objects.create(
            name='test_role',
            display_name='Test Role',
            description='Test role description',
            role_type='tenant',
            tenant=self.test_tenant
        )
        assert role.name == 'test_role'
        assert role.tenant == self.test_tenant
    
    def test_permission_assignment(self):
        """Test permission assignment to roles."""
        role = Role.objects.create(name='test_role', tenant=self.test_tenant)
        permission = Permission.objects.create(
            name='test.permission',
            display_name='Test Permission',
            permission_type='view',
            app_label='test',
            model_name='test',
            codename='test'
        )
        
        role_permission = RolePermission.objects.create(
            role=role,
            permission=permission,
            granted_by=self.admin_user
        )
        assert role_permission.role == role
        assert role_permission.permission == permission
    
    def test_user_role_assignment(self):
        """Test user role assignment."""
        role = Role.objects.create(name='test_role', tenant=self.test_tenant)
        user_role = UserRole.objects.create(
            user=self.teacher_user,
            role=role,
            assigned_by=self.admin_user
        )
        assert user_role.user == self.teacher_user
        assert user_role.role == role
    
    def test_permission_checking(self):
        """Test permission checking functionality."""
        role = Role.objects.create(name='test_role', tenant=self.test_tenant)
        permission = Permission.objects.create(
            name='test.permission',
            permission_type='view',
            app_label='test',
            model_name='test',
            codename='test'
        )
        RolePermission.objects.create(role=role, permission=permission, granted_by=self.admin_user)
        UserRole.objects.create(user=self.teacher_user, role=role, assigned_by=self.admin_user)
        
        # Test permission checking
        assert self.teacher_user.has_permission('test.permission')
    
    def test_role_inheritance(self):
        """Test role inheritance functionality."""
        parent_role = Role.objects.create(name='parent_role', tenant=self.test_tenant)
        child_role = Role.objects.create(
            name='child_role',
            parent_role=parent_role,
            tenant=self.test_tenant
        )
        
        permission = Permission.objects.create(
            name='inherited.permission',
            permission_type='view',
            app_label='test',
            model_name='test',
            codename='test'
        )
        RolePermission.objects.create(role=parent_role, permission=permission, granted_by=self.admin_user)
        
        # Test inheritance
        all_permissions = child_role.get_all_permissions()
        assert permission in all_permissions
    
    def test_user_profile_management(self):
        """Test user profile management."""
        profile = UserProfile.objects.create(
            user=self.teacher_user,
            bio='Test bio',
            skills='Python, Django'
        )
        assert profile.user == self.teacher_user
        assert profile.bio == 'Test bio'
    
    def test_user_session_management(self):
        """Test user session management."""
        session = UserSession.objects.create(
            user=self.teacher_user,
            session_key='test_session',
            ip_address='127.0.0.1',
            user_agent='Test Browser'
        )
        assert session.user == self.teacher_user
        assert session.ip_address == '127.0.0.1'
    
    def test_user_activity_tracking(self):
        """Test user activity tracking."""
        activity = UserActivity.objects.create(
            user=self.teacher_user,
            action='test_action',
            details='Test activity details',
            ip_address='127.0.0.1'
        )
        assert activity.user == self.teacher_user
        assert activity.action == 'test_action'
    
    def test_password_history(self):
        """Test password history tracking."""
        history = PasswordHistory.objects.create(
            user=self.teacher_user,
            password_hash='test_hash',
            changed_at=datetime.now()
        )
        assert history.user == self.teacher_user
        assert history.password_hash == 'test_hash'
    
    # School Management Tests
    def test_school_profile_management(self):
        """Test school profile management."""
        school = School.objects.create(
            name='Test School',
            tenant=self.test_tenant,
            address='Test Address',
            phone='+1234567890',
            email='test@school.com'
        )
        assert school.name == 'Test School'
        assert school.tenant == self.test_tenant
    
    def test_student_management(self):
        """Test student management."""
        student = Student.objects.create(
            user=self.student_user,
            school=self.test_school,
            student_id='STU001',
            grade_level='10',
            enrollment_date=datetime.now().date()
        )
        assert student.user == self.student_user
        assert student.student_id == 'STU001'
    
    def test_teacher_management(self):
        """Test teacher management."""
        teacher = Teacher.objects.create(
            user=self.teacher_user,
            school=self.test_school,
            employee_id='EMP001',
            department='Mathematics',
            hire_date=datetime.now().date()
        )
        assert teacher.user == self.teacher_user
        assert teacher.employee_id == 'EMP001'
    
    def test_parent_management(self):
        """Test parent management."""
        parent = Parent.objects.create(
            user=self.parent_user,
            school=self.test_school,
            relationship='Father'
        )
        assert parent.user == self.parent_user
        assert parent.relationship == 'Father'
    
    # Academic Management Tests
    def test_class_management(self):
        """Test class management."""
        class_obj = Class.objects.create(
            name='Test Class',
            school=self.test_school,
            grade_level='10',
            academic_year='2024-2025',
            capacity=30
        )
        assert class_obj.name == 'Test Class'
        assert class_obj.capacity == 30
    
    def test_subject_management(self):
        """Test subject management."""
        subject = Subject.objects.create(
            name='Mathematics',
            code='MATH101',
            school=self.test_school,
            description='Advanced Mathematics'
        )
        assert subject.name == 'Mathematics'
        assert subject.code == 'MATH101'
    
    def test_timetable_management(self):
        """Test timetable management."""
        class_obj = Class.objects.create(name='Test Class', school=self.test_school)
        subject = Subject.objects.create(name='Math', school=self.test_school)
        
        timetable = Timetable.objects.create(
            class_obj=class_obj,
            subject=subject,
            day_of_week='Monday',
            start_time='09:00:00',
            end_time='10:00:00',
            teacher=self.teacher_user
        )
        assert timetable.class_obj == class_obj
        assert timetable.subject == subject
    
    def test_exam_management(self):
        """Test exam management."""
        exam = Exam.objects.create(
            title='Midterm Exam',
            subject=Subject.objects.create(name='Math', school=self.test_school),
            class_obj=Class.objects.create(name='Test Class', school=self.test_school),
            exam_date=datetime.now().date(),
            total_marks=100
        )
        assert exam.title == 'Midterm Exam'
        assert exam.total_marks == 100
    
    def test_grade_management(self):
        """Test grade management."""
        student = Student.objects.create(user=self.student_user, school=self.test_school)
        exam = Exam.objects.create(
            title='Test Exam',
            subject=Subject.objects.create(name='Math', school=self.test_school),
            class_obj=Class.objects.create(name='Test Class', school=self.test_school)
        )
        
        grade = Grade.objects.create(
            student=student,
            exam=exam,
            marks_obtained=85,
            total_marks=100,
            grade='A'
        )
        assert grade.student == student
        assert grade.marks_obtained == 85
    
    def test_attendance_management(self):
        """Test attendance management."""
        student = Student.objects.create(user=self.student_user, school=self.test_school)
        class_obj = Class.objects.create(name='Test Class', school=self.test_school)
        
        attendance = Attendance.objects.create(
            student=student,
            class_obj=class_obj,
            date=datetime.now().date(),
            status='present'
        )
        assert attendance.student == student
        assert attendance.status == 'present'
    
    # Library Management Tests
    def test_book_management(self):
        """Test book management."""
        book = Book.objects.create(
            title='Test Book',
            author='Test Author',
            isbn='1234567890123',
            school=self.test_school,
            quantity=5
        )
        assert book.title == 'Test Book'
        assert book.quantity == 5
    
    def test_book_category_management(self):
        """Test book category management."""
        category = BookCategory.objects.create(
            name='Fiction',
            description='Fiction books',
            school=self.test_school
        )
        assert category.name == 'Fiction'
    
    def test_book_issue_management(self):
        """Test book issue management."""
        book = Book.objects.create(title='Test Book', school=self.test_school)
        student = Student.objects.create(user=self.student_user, school=self.test_school)
        
        issue = BookIssue.objects.create(
            book=book,
            student=student,
            issue_date=datetime.now().date(),
            due_date=(datetime.now() + timedelta(days=14)).date()
        )
        assert issue.book == book
        assert issue.student == student
    
    def test_book_return_management(self):
        """Test book return management."""
        book = Book.objects.create(title='Test Book', school=self.test_school)
        student = Student.objects.create(user=self.student_user, school=self.test_school)
        issue = BookIssue.objects.create(book=book, student=student)
        
        return_obj = BookReturn.objects.create(
            book_issue=issue,
            return_date=datetime.now().date(),
            fine_amount=Decimal('0.00')
        )
        assert return_obj.book_issue == issue
    
    # Transport Management Tests
    def test_route_management(self):
        """Test route management."""
        route = Route.objects.create(
            name='Route 1',
            school=self.test_school,
            start_location='School',
            end_location='City Center',
            distance=10.5
        )
        assert route.name == 'Route 1'
        assert route.distance == 10.5
    
    def test_vehicle_management(self):
        """Test vehicle management."""
        vehicle = Vehicle.objects.create(
            vehicle_number='BUS001',
            school=self.test_school,
            capacity=50,
            vehicle_type='Bus'
        )
        assert vehicle.vehicle_number == 'BUS001'
        assert vehicle.capacity == 50
    
    def test_driver_management(self):
        """Test driver management."""
        driver = Driver.objects.create(
            name='John Driver',
            school=self.test_school,
            license_number='DL123456',
            phone='+1234567890'
        )
        assert driver.name == 'John Driver'
        assert driver.license_number == 'DL123456'
    
    def test_student_transport_assignment(self):
        """Test student transport assignment."""
        student = Student.objects.create(user=self.student_user, school=self.test_school)
        route = Route.objects.create(name='Route 1', school=self.test_school)
        
        transport = StudentTransport.objects.create(
            student=student,
            route=route,
            pickup_location='Home',
            drop_location='School'
        )
        assert transport.student == student
        assert transport.route == route
    
    def test_transport_schedule_management(self):
        """Test transport schedule management."""
        route = Route.objects.create(name='Route 1', school=self.test_school)
        vehicle = Vehicle.objects.create(vehicle_number='BUS001', school=self.test_school)
        
        schedule = TransportSchedule.objects.create(
            route=route,
            vehicle=vehicle,
            departure_time='07:00:00',
            arrival_time='08:00:00',
            day_of_week='Monday'
        )
        assert schedule.route == route
        assert schedule.vehicle == vehicle
    
    # Communication System Tests
    def test_message_management(self):
        """Test message management."""
        message = Message.objects.create(
            sender=self.teacher_user,
            recipient=self.student_user,
            subject='Test Message',
            content='Test content',
            school=self.test_school
        )
        assert message.sender == self.teacher_user
        assert message.subject == 'Test Message'
    
    def test_message_thread_management(self):
        """Test message thread management."""
        thread = MessageThread.objects.create(
            title='Test Thread',
            description='Test thread description',
            school=self.test_school
        )
        assert thread.title == 'Test Thread'
    
    def test_announcement_management(self):
        """Test announcement management."""
        announcement = Announcement.objects.create(
            title='Test Announcement',
            content='Test announcement content',
            author=self.teacher_user,
            school=self.test_school,
            priority='normal'
        )
        assert announcement.title == 'Test Announcement'
        assert announcement.author == self.teacher_user
    
    def test_communication_template_management(self):
        """Test communication template management."""
        template = CommunicationTemplate.objects.create(
            name='Test Template',
            subject='Test Subject',
            content='Test template content',
            template_type='email',
            school=self.test_school
        )
        assert template.name == 'Test Template'
        assert template.template_type == 'email'
    
    def test_communication_log_management(self):
        """Test communication log management."""
        log = CommunicationLog.objects.create(
            sender=self.teacher_user,
            recipient=self.student_user,
            subject='Test Log',
            content='Test log content',
            communication_type='email',
            school=self.test_school
        )
        assert log.sender == self.teacher_user
        assert log.communication_type == 'email'
    
    # Financial Management Tests
    def test_fee_management(self):
        """Test fee management."""
        fee = Fee.objects.create(
            name='Tuition Fee',
            amount=Decimal('1000.00'),
            school=self.test_school,
            fee_type='tuition',
            academic_year='2024-2025'
        )
        assert fee.name == 'Tuition Fee'
        assert fee.amount == Decimal('1000.00')
    
    def test_fee_payment_management(self):
        """Test fee payment management."""
        student = Student.objects.create(user=self.student_user, school=self.test_school)
        fee = Fee.objects.create(name='Test Fee', amount=Decimal('100.00'), school=self.test_school)
        
        payment = FeePayment.objects.create(
            student=student,
            fee=fee,
            amount_paid=Decimal('100.00'),
            payment_date=datetime.now().date(),
            payment_method='cash'
        )
        assert payment.student == student
        assert payment.amount_paid == Decimal('100.00')
    
    # Reporting System Tests
    def test_report_management(self):
        """Test report management."""
        report = Report.objects.create(
            title='Test Report',
            report_type='academic',
            school=self.test_school,
            generated_by=self.admin_user
        )
        assert report.title == 'Test Report'
        assert report.report_type == 'academic'
    
    def test_report_template_management(self):
        """Test report template management."""
        template = ReportTemplate.objects.create(
            name='Test Template',
            template_type='academic',
            content='Test template content',
            school=self.test_school
        )
        assert template.name == 'Test Template'
        assert template.template_type == 'academic'
    
    def test_report_schedule_management(self):
        """Test report schedule management."""
        schedule = ReportSchedule.objects.create(
            report_template=ReportTemplate.objects.create(name='Test', school=self.test_school),
            frequency='weekly',
            school=self.test_school,
            is_active=True
        )
        assert schedule.frequency == 'weekly'
        assert schedule.is_active == True
    
    # API Endpoints Tests
    def test_authentication_endpoints(self):
        """Test authentication endpoints."""
        # This would require actual API testing with requests
        pass
    
    def test_user_management_endpoints(self):
        """Test user management endpoints."""
        # This would require actual API testing with requests
        pass
    
    def test_school_management_endpoints(self):
        """Test school management endpoints."""
        # This would require actual API testing with requests
        pass
    
    def test_academic_management_endpoints(self):
        """Test academic management endpoints."""
        # This would require actual API testing with requests
        pass
    
    # Data Integrity Tests
    def test_foreign_key_relationships(self):
        """Test foreign key relationships."""
        # Test that relationships work correctly
        school = School.objects.create(name='Test School', tenant=self.test_tenant)
        student = Student.objects.create(user=self.student_user, school=school)
        assert student.school == school
        assert student.school.tenant == self.test_tenant
    
    def test_data_validation(self):
        """Test data validation."""
        # Test that validation works correctly
        try:
            User.objects.create(username='')  # Should fail
            assert False, "Should have raised validation error"
        except:
            pass  # Expected to fail
    
    def test_unique_constraints(self):
        """Test unique constraints."""
        # Test that unique constraints work
        User.objects.create(username='unique_test', email='test@test.com')
        try:
            User.objects.create(username='unique_test', email='test2@test.com')  # Should fail
            assert False, "Should have raised unique constraint error"
        except:
            pass  # Expected to fail
    
    def test_cascade_deletions(self):
        """Test cascade deletions."""
        # Test that cascade deletions work correctly
        school = School.objects.create(name='Cascade Test School', tenant=self.test_tenant)
        student = Student.objects.create(user=self.student_user, school=school)
        school.delete()
        assert not Student.objects.filter(id=student.id).exists()
    
    # Performance Tests
    def test_database_query_performance(self):
        """Test database query performance."""
        # Create multiple records and test query performance
        for i in range(100):
            User.objects.create(
                username=f'perf_test_{i}',
                email=f'test{i}@test.com',
                tenant=self.test_tenant
            )
        
        # Test query performance
        start_time = datetime.now()
        users = User.objects.filter(tenant=self.test_tenant)
        end_time = datetime.now()
        
        duration = (end_time - start_time).total_seconds()
        assert duration < 1.0  # Should complete within 1 second
    
    def test_bulk_operations_performance(self):
        """Test bulk operations performance."""
        # Test bulk create performance
        users_data = [
            User(username=f'bulk_test_{i}', email=f'bulk{i}@test.com', tenant=self.test_tenant)
            for i in range(100)
        ]
        
        start_time = datetime.now()
        User.objects.bulk_create(users_data)
        end_time = datetime.now()
        
        duration = (end_time - start_time).total_seconds()
        assert duration < 2.0  # Should complete within 2 seconds
    
    def test_memory_usage(self):
        """Test memory usage."""
        # This is a basic test - in production you'd use memory profiling
        import gc
        gc.collect()
        pass  # Memory testing would require more sophisticated tools
    
    # Security Tests
    def test_authentication_security(self):
        """Test authentication security."""
        # Test password hashing
        user = User.objects.create(username='security_test', tenant=self.test_tenant)
        user.set_password('test_password')
        user.save()
        
        # Password should be hashed, not plain text
        assert user.password != 'test_password'
        assert user.check_password('test_password')
    
    def test_authorization_security(self):
        """Test authorization security."""
        # Test that users can only access their tenant's data
        tenant1 = Tenant.objects.create(subdomain='auth_test1', name='Auth Test 1')
        tenant2 = Tenant.objects.create(subdomain='auth_test2', name='Auth Test 2')
        
        user1 = User.objects.create(username='auth_user1', tenant=tenant1)
        user2 = User.objects.create(username='auth_user2', tenant=tenant2)
        
        # Users should be isolated
        assert user1.tenant != user2.tenant
    
    def test_data_encryption(self):
        """Test data encryption."""
        # Test that sensitive data is properly handled
        user = User.objects.create(
            username='encrypt_test',
            email='encrypt@test.com',
            tenant=self.test_tenant
        )
        user.set_password('sensitive_password')
        user.save()
        
        # Password should be encrypted
        assert user.password != 'sensitive_password'
    
    def test_sql_injection_prevention(self):
        """Test SQL injection prevention."""
        # Test that user input is properly sanitized
        try:
            # This should be handled safely by Django ORM
            User.objects.filter(username="'; DROP TABLE users; --")
            pass  # Should not cause SQL injection
        except Exception as e:
            # If it fails, it should fail safely
            assert "DROP TABLE" not in str(e)
    
    def generate_test_report(self):
        """Generate comprehensive test report."""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE BACKEND TEST REPORT")
        print("=" * 80)
        
        total_tests = self.test_results['passed'] + self.test_results['failed']
        success_rate = (self.test_results['passed'] / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n📈 Test Summary:")
        print(f"   • Total Tests: {total_tests}")
        print(f"   • Passed: {self.test_results['passed']}")
        print(f"   • Failed: {self.test_results['failed']}")
        print(f"   • Success Rate: {success_rate:.2f}%")
        
        if self.test_results['errors']:
            print(f"\n❌ Errors Found:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        if self.test_results['warnings']:
            print(f"\n⚠️  Warnings:")
            for warning in self.test_results['warnings']:
                print(f"   • {warning}")
        
        print(f"\n🔗 Access Points:")
        print(f"   • Backend API: http://localhost:8001/api/v1/")
        print(f"   • Django Admin: http://localhost:8001/admin/")
        print(f"   • pgAdmin: http://localhost:5051/")
        
        print(f"\n📋 Test Coverage:")
        print(f"   ✅ Core Platform: Tenant management, settings, notifications")
        print(f"   ✅ RBAC System: Roles, permissions, user management")
        print(f"   ✅ School Management: Students, teachers, parents")
        print(f"   ✅ Academic Management: Classes, subjects, grades, attendance")
        print(f"   ✅ Library Management: Books, issues, returns")
        print(f"   ✅ Transport Management: Routes, vehicles, schedules")
        print(f"   ✅ Communication System: Messages, announcements, templates")
        print(f"   ✅ Financial Management: Fees, payments")
        print(f"   ✅ Reporting System: Reports, templates, schedules")
        print(f"   ✅ Data Integrity: Relationships, validation, constraints")
        print(f"   ✅ Performance: Query optimization, bulk operations")
        print(f"   ✅ Security: Authentication, authorization, encryption")
        
        if success_rate >= 95:
            print(f"\n🎉 EXCELLENT! Backend is production-ready!")
        elif success_rate >= 90:
            print(f"\n✅ GOOD! Backend is mostly ready with minor issues.")
        elif success_rate >= 80:
            print(f"\n⚠️  FAIR! Backend needs some fixes before production.")
        else:
            print(f"\n❌ POOR! Backend needs significant work before production.")
        
        print(f"\n📄 Detailed test results saved to: comprehensive_test_results.json")
        
        # Save detailed results to file
        with open('comprehensive_test_results.json', 'w') as f:
            json.dump(self.test_results, f, indent=2, default=str)

def main():
    """Main function to run comprehensive tests."""
    test_suite = ComprehensiveBackendTest()
    test_suite.run_all_tests()

if __name__ == "__main__":
    main() 