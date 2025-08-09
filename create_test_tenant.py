#!/usr/bin/env python
"""
Script to create a test tenant for API testing
"""

print("Creating test tenant for API testing...")

# Sample Django shell commands
commands = '''
from core.models import Tenant
from django.contrib.auth.models import User

try:
    tenant, created = Tenant.objects.get_or_create(
        subdomain="testschool",
        defaults={
            "name": "Test School",
            "is_active": True,
            "max_users": 100
        }
    )
    
    if created:
        print("✅ Test tenant created successfully")
    else:
        print("✅ Test tenant already exists")
    
    print(f"   Tenant: {tenant.name} ({tenant.subdomain})")
    print(f"   Status: {'Active' if tenant.is_active else 'Inactive'}")
    
    # Create a test user
    user, user_created = User.objects.get_or_create(
        username="testuser",
        defaults={
            "email": "test@testschool.com",
            "first_name": "Test",
            "last_name": "User"
        }
    )
    
    if user_created:
        user.set_password("testpass123")
        user.save()
        print("✅ Test user created")
    else:
        print("✅ Test user already exists")
        
    print(f"   User: {user.username} ({user.email})")
    
except Exception as e:
    print(f"❌ Error: {e}")
'''

print("Django shell commands:")
print(commands)
