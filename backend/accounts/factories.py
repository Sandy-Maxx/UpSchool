"""
Factory classes for accounts models.
"""
import factory
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory
from factory import fuzzy

from core.models import Tenant
from .models import Role, Permission, UserRole, RolePermission

User = get_user_model()


class TenantFactory(DjangoModelFactory):
    """Factory for Tenant model."""
    
    class Meta:
        model = Tenant
    
    name = factory.Sequence(lambda n: f"Test Tenant {n}")
    subdomain = factory.Sequence(lambda n: f"tenant{n}")
    domain = factory.LazyAttribute(lambda obj: f"{obj.subdomain}.localhost")
    is_active = True


class UserFactory(DjangoModelFactory):
    """Factory for User model."""
    
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    user_type = fuzzy.FuzzyChoice(['admin', 'teacher', 'student', 'parent', 'staff'])
    tenant = factory.SubFactory(TenantFactory)
    is_active = True
    is_verified = True
    
    @factory.post_generation
    def set_password(self, create, extracted, **kwargs):
        if not create:
            return
        password = extracted or 'testpass123'
        self.set_password(password)
        self.save()


class PermissionFactory(DjangoModelFactory):
    """Factory for Permission model."""
    
    class Meta:
        model = Permission
    
    name = factory.Sequence(lambda n: f"permission_{n}")
    display_name = factory.LazyAttribute(lambda obj: f"Can {obj.name}")
    description = factory.Faker('sentence')
    permission_type = fuzzy.FuzzyChoice(['view', 'create', 'update', 'delete'])
    app_label = 'test_app'
    model_name = 'test_model'
    codename = factory.LazyAttribute(lambda obj: f"{obj.permission_type}_{obj.model_name}")


class RoleFactory(DjangoModelFactory):
    """Factory for Role model."""
    
    class Meta:
        model = Role
    
    name = factory.Sequence(lambda n: f"role_{n}")
    display_name = factory.LazyAttribute(lambda obj: obj.name.title())
    description = factory.Faker('sentence')
    role_type = fuzzy.FuzzyChoice(['system', 'tenant'])
    tenant = factory.SubFactory(TenantFactory)
    is_active = True
    is_system = False


class UserRoleFactory(DjangoModelFactory):
    """Factory for UserRole model."""
    
    class Meta:
        model = UserRole
    
    user = factory.SubFactory(UserFactory)
    role = factory.SubFactory(RoleFactory)
    assigned_by = factory.SubFactory(UserFactory)
    is_active = True


class RolePermissionFactory(DjangoModelFactory):
    """Factory for RolePermission model."""
    
    class Meta:
        model = RolePermission
    
    role = factory.SubFactory(RoleFactory)
    permission = factory.SubFactory(PermissionFactory)
    is_active = True
