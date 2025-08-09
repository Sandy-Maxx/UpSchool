"""
Pytest configuration and fixtures for testing.
"""
import pytest
import factory
from django.contrib.auth import get_user_model
from django.test import TransactionTestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter
from django.urls import path

from core.models import Tenant
from accounts.models import Role, Permission, UserRole, RolePermission
from schools.models import School, AcademicYear, Semester, Class, Subject
from accounts.factories import UserFactory, RoleFactory, PermissionFactory
from schools.factories import SchoolFactory, AcademicYearFactory, ClassFactory
from core.consumers import NotificationConsumer

User = get_user_model()


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    """Setup test database with initial data."""
    with django_db_blocker.unblock():
        # Create test tenant
        tenant = Tenant.objects.create(
            name='Test School District',
            subdomain='test',
            domain='test.localhost',
            is_active=True
        )
        
        # Create basic permissions
        Permission.objects.get_or_create(
            name='view_student',
            defaults={
                'display_name': 'Can view students',
                'permission_type': 'view',
                'app_label': 'schools',
                'model_name': 'student'
            }
        )


@pytest.fixture
def api_client():
    """Return API client for testing."""
    return APIClient()


@pytest.fixture
def tenant():
    """Create a test tenant."""
    return Tenant.objects.create(
        name='Test Tenant',
        subdomain='test-tenant',
        domain='test-tenant.localhost',
        is_active=True
    )


@pytest.fixture
def school(tenant):
    """Create a test school."""
    return SchoolFactory(tenant=tenant)


@pytest.fixture
def academic_year(school):
    """Create a test academic year."""
    return AcademicYearFactory(school=school)


@pytest.fixture
def admin_user(tenant):
    """Create an admin user."""
    return UserFactory(
        username='admin',
        email='admin@test.com',
        user_type='admin',
        tenant=tenant,
        is_staff=True,
        is_superuser=True
    )


@pytest.fixture
def teacher_user(tenant):
    """Create a teacher user."""
    return UserFactory(
        username='teacher',
        email='teacher@test.com',
        user_type='teacher',
        tenant=tenant
    )


@pytest.fixture
def student_user(tenant):
    """Create a student user."""
    return UserFactory(
        username='student',
        email='student@test.com',
        user_type='student',
        tenant=tenant
    )


@pytest.fixture
def parent_user(tenant):
    """Create a parent user."""
    return UserFactory(
        username='parent',
        email='parent@test.com',
        user_type='parent',
        tenant=tenant
    )


@pytest.fixture
def teacher_role(tenant):
    """Create a teacher role."""
    return RoleFactory(
        name='teacher',
        display_name='Teacher',
        tenant=tenant,
        role_type='tenant'
    )


@pytest.fixture
def student_role(tenant):
    """Create a student role."""
    return RoleFactory(
        name='student',
        display_name='Student',
        tenant=tenant,
        role_type='tenant'
    )


@pytest.fixture
def view_permission():
    """Create a view permission."""
    return PermissionFactory(
        name='view_test',
        permission_type='view'
    )


@pytest.fixture
def authenticated_client(api_client, admin_user):
    """Return authenticated API client."""
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def teacher_client(api_client, teacher_user):
    """Return teacher authenticated API client."""
    api_client.force_authenticate(user=teacher_user)
    return api_client


@pytest.fixture
def student_client(api_client, student_user):
    """Return student authenticated API client."""
    api_client.force_authenticate(user=student_user)
    return api_client


@pytest.fixture
def websocket_communicator():
    """Create websocket communicator for testing."""
    application = URLRouter([
        path("ws/notifications/", NotificationConsumer.as_asgi()),
    ])
    return WebsocketCommunicator(application, "ws/notifications/")


@pytest.fixture
def sample_data(school, academic_year):
    """Create sample data for testing."""
    # Create classes
    class_1 = ClassFactory(name='Class 1A', school=school, academic_year=academic_year)
    class_2 = ClassFactory(name='Class 2A', school=school, academic_year=academic_year)
    
    # Create subjects
    from schools.models import Subject
    subject_1 = Subject.objects.create(
        name='Mathematics',
        code='MATH',
        school=school
    )
    subject_2 = Subject.objects.create(
        name='English',
        code='ENG',
        school=school
    )
    
    return {
        'classes': [class_1, class_2],
        'subjects': [subject_1, subject_2]
    }


class BaseTestCase(TransactionTestCase):
    """Base test case with common setup."""
    
    def setUp(self):
        super().setUp()
        self.tenant = Tenant.objects.create(
            name='Test Tenant',
            subdomain='test',
            domain='test.localhost',
            is_active=True
        )
        self.school = SchoolFactory(tenant=self.tenant)
        self.admin_user = UserFactory(
            tenant=self.tenant,
            user_type='admin',
            is_staff=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)


@pytest.fixture
def base_test_case():
    """Return base test case instance."""
    return BaseTestCase()


# Mark all database tests
pytestmark = pytest.mark.django_db
