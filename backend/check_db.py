#!/usr/bin/env python
"""
Database inspection script.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_platform.settings')
django.setup()

from django.db import connection

def check_database():
    print("🔍 Checking Database Tables...")
    
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"📊 Found {len(tables)} tables:")
    for table in sorted(tables):
        print(f"  ✅ {table}")
    
    # Check specific tables we need
    required_tables = [
        'accounts_user',
        'accounts_role', 
        'accounts_permission',
        'accounts_userrole',
        'accounts_rolepermission',
        'core_tenant',
        'schools_school',
        'schools_academicyear',
        'schools_class',
        'schools_student'
    ]
    
    print(f"\n🎯 Checking Required Tables:")
    missing_tables = []
    for table in required_tables:
        if table in tables:
            print(f"  ✅ {table}")
        else:
            print(f"  ❌ {table} - MISSING")
            missing_tables.append(table)
    
    if missing_tables:
        print(f"\n⚠️  Missing {len(missing_tables)} required tables!")
        return False
    else:
        print(f"\n🎉 All required tables present!")
        return True

if __name__ == "__main__":
    check_database()
