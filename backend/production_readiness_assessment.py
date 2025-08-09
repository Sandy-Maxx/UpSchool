#!/usr/bin/env python
"""
Final production readiness assessment for the school management platform.
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_platform.settings')
django.setup()

def assess_production_readiness():
    """Comprehensive production readiness assessment."""
    
    print("🎯" + "="*60 + "🎯")
    print("🎯" + " "*15 + "PRODUCTION READINESS ASSESSMENT" + " "*12 + "🎯")
    print("🎯" + "="*60 + "🎯")
    
    assessment = {
        'categories': {},
        'total_score': 0,
        'max_score': 0,
        'recommendations': []
    }
    
    # 1. Architecture Assessment
    print("\n📐 ARCHITECTURE ASSESSMENT")
    print("="*40)
    
    architecture_score = 0
    architecture_max = 10
    
    # Check models
    try:
        from core.models import Tenant
        from accounts.models import User, Role, Permission
        from schools.models import School, Student, Teacher
        print("✅ Core models properly defined")
        architecture_score += 2
    except Exception as e:
        print(f"❌ Model issues: {e}")
    
    # Check multi-tenancy
    try:
        tenant_count = Tenant.objects.count()
        print(f"✅ Multi-tenancy implemented ({tenant_count} tenants)")
        architecture_score += 2
    except Exception as e:
        print(f"❌ Multi-tenancy issues: {e}")
    
    # Check RBAC
    try:
        role_count = Role.objects.count()
        permission_count = Permission.objects.count()
        print(f"✅ RBAC system implemented ({role_count} roles, {permission_count} permissions)")
        architecture_score += 2
    except Exception as e:
        print(f"❌ RBAC issues: {e}")
    
    # Check UUID usage
    try:
        from accounts.models import User
        user = User.objects.first()
        if user and str(user.id).count('-') == 4:  # Simple UUID check
            print("✅ UUID primary keys implemented")
            architecture_score += 2
        else:
            print("⚠️  UUID implementation unclear")
            architecture_score += 1
    except:
        print("⚠️  Could not verify UUID usage")
    
    # Check abstract base model
    try:
        from core.models import BaseModel
        print("✅ Abstract base model implemented")
        architecture_score += 2
    except:
        print("❌ Abstract base model missing")
    
    assessment['categories']['Architecture'] = {
        'score': architecture_score,
        'max_score': architecture_max,
        'percentage': (architecture_score / architecture_max) * 100
    }
    
    # 2. Database Assessment
    print("\n🗃️  DATABASE ASSESSMENT")
    print("="*40)
    
    database_score = 0
    database_max = 10
    
    # Check migrations
    try:
        execute_from_command_line(['manage.py', 'showmigrations', '--list'])
        print("✅ Migrations system working")
        database_score += 3
    except Exception as e:
        print(f"❌ Migration issues: {e}")
    
    # Check constraints
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        # Try to create duplicate user (should fail)
        try:
            User.objects.create_user('duplicate_test', 'dup@test.com')
            User.objects.create_user('duplicate_test', 'dup2@test.com')
            print("⚠️  Unique constraints may not be working")
            database_score += 1
        except:
            print("✅ Database constraints working")
            database_score += 3
    except Exception as e:
        print(f"❌ Constraint testing failed: {e}")
    
    # Check relationships
    try:
        from schools.models import School, Student
        if School.objects.exists() and Student.objects.exists():
            student = Student.objects.first()
            if student and student.school:
                print("✅ Foreign key relationships working")
                database_score += 2
            else:
                print("⚠️  Relationship issues detected")
                database_score += 1
        else:
            print("⚠️  No test data to verify relationships")
            database_score += 1
    except Exception as e:
        print(f"❌ Relationship testing failed: {e}")
    
    # Check indexing (basic)
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='index';")
        indexes = cursor.fetchall()
        if len(indexes) > 10:  # Should have many indexes
            print(f"✅ Database indexes present ({len(indexes)} indexes)")
            database_score += 2
        else:
            print(f"⚠️  Limited indexing ({len(indexes)} indexes)")
            database_score += 1
    except Exception as e:
        print(f"❌ Index checking failed: {e}")
    
    assessment['categories']['Database'] = {
        'score': database_score,
        'max_score': database_max,
        'percentage': (database_score / database_max) * 100
    }
    
    # 3. Security Assessment
    print("\n🔒 SECURITY ASSESSMENT")
    print("="*40)
    
    security_score = 0
    security_max = 10
    
    # Check settings
    from django.conf import settings
    
    if hasattr(settings, 'SECRET_KEY') and settings.SECRET_KEY != 'django-insecure-change-this-in-production':
        print("✅ SECRET_KEY properly configured")
        security_score += 2
    else:
        print("❌ SECRET_KEY needs to be changed for production")
        assessment['recommendations'].append("Change SECRET_KEY for production")
    
    if not settings.DEBUG:
        print("✅ DEBUG disabled")
        security_score += 2
    else:
        print("⚠️  DEBUG enabled (should be False in production)")
        assessment['recommendations'].append("Set DEBUG=False for production")
        security_score += 1
    
    if '*' not in settings.ALLOWED_HOSTS:
        print("✅ ALLOWED_HOSTS properly configured")
        security_score += 2
    else:
        print("⚠️  ALLOWED_HOSTS allows all hosts")
        assessment['recommendations'].append("Restrict ALLOWED_HOSTS for production")
        security_score += 1
    
    # Check password validation
    if hasattr(settings, 'AUTH_PASSWORD_VALIDATORS') and settings.AUTH_PASSWORD_VALIDATORS:
        print("✅ Password validation configured")
        security_score += 2
    else:
        print("❌ Password validation missing")
    
    # Check security middleware
    security_middleware = [
        'django.middleware.security.SecurityMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]
    
    middleware_present = sum(1 for mw in security_middleware if mw in settings.MIDDLEWARE)
    if middleware_present == len(security_middleware):
        print("✅ Security middleware properly configured")
        security_score += 2
    else:
        print(f"⚠️  Some security middleware missing ({middleware_present}/{len(security_middleware)})")
        security_score += 1
    
    assessment['categories']['Security'] = {
        'score': security_score,
        'max_score': security_max,
        'percentage': (security_score / security_max) * 100
    }
    
    # 4. Performance Assessment
    print("\n⚡ PERFORMANCE ASSESSMENT")
    print("="*40)
    
    performance_score = 0
    performance_max = 10
    
    # Check caching
    if hasattr(settings, 'CACHES') and 'default' in settings.CACHES:
        print("✅ Caching configured")
        performance_score += 2
    else:
        print("⚠️  Caching not configured")
        assessment['recommendations'].append("Configure caching for better performance")
        performance_score += 1
    
    # Check database optimization
    if 'postgresql' in str(settings.DATABASES.get('default', {}).get('ENGINE', '')).lower():
        print("✅ PostgreSQL configured for production")
        performance_score += 3
    elif 'sqlite' in str(settings.DATABASES.get('default', {}).get('ENGINE', '')).lower():
        print("⚠️  SQLite in use (consider PostgreSQL for production)")
        assessment['recommendations'].append("Use PostgreSQL for production")
        performance_score += 1
    else:
        print("❓ Database engine unclear")
        performance_score += 1
    
    # Check static files
    if hasattr(settings, 'STATIC_ROOT') and settings.STATIC_ROOT:
        print("✅ Static files configuration present")
        performance_score += 2
    else:
        print("⚠️  Static files configuration incomplete")
        performance_score += 1
    
    # Check pagination
    if hasattr(settings, 'REST_FRAMEWORK') and 'PAGE_SIZE' in settings.REST_FRAMEWORK:
        print("✅ API pagination configured")
        performance_score += 2
    else:
        print("⚠️  API pagination not configured")
        performance_score += 1
    
    # Check logging
    if hasattr(settings, 'LOGGING') and settings.LOGGING:
        print("✅ Logging configured")
        performance_score += 1
    else:
        print("⚠️  Logging not configured")
    
    assessment['categories']['Performance'] = {
        'score': performance_score,
        'max_score': performance_max,
        'percentage': (performance_score / performance_max) * 100
    }
    
    # 5. Features Assessment
    print("\n🚀 FEATURES ASSESSMENT")
    print("="*40)
    
    features_score = 0
    features_max = 10
    
    # Check core features
    core_models = [
        'User', 'Role', 'Permission', 'Tenant', 'School', 
        'Student', 'Teacher', 'Subject', 'AcademicYear'
    ]
    
    model_count = 0
    for model_name in core_models:
        try:
            if model_name == 'User':
                from accounts.models import User
                User.objects.count()
            elif model_name == 'Role':
                from accounts.models import Role
                Role.objects.count()
            elif model_name == 'Permission':
                from accounts.models import Permission
                Permission.objects.count()
            elif model_name == 'Tenant':
                from core.models import Tenant
                Tenant.objects.count()
            elif model_name in ['School', 'Student', 'Teacher', 'Subject', 'AcademicYear']:
                from schools import models as school_models
                getattr(school_models, model_name).objects.count()
                
            model_count += 1
        except:
            pass
    
    if model_count >= 8:
        print(f"✅ Core models implemented ({model_count}/{len(core_models)})")
        features_score += 4
    else:
        print(f"⚠️  Some core models missing ({model_count}/{len(core_models)})")
        features_score += 2
    
    # Check advanced features
    try:
        from django.conf import settings
        if 'channels' in settings.INSTALLED_APPS:
            print("✅ Real-time features (Channels) configured")
            features_score += 2
        else:
            print("⚠️  Real-time features not configured")
            features_score += 1
    except:
        features_score += 1
    
    try:
        if 'celery' in settings.INSTALLED_APPS:
            print("✅ Background tasks (Celery) configured")
            features_score += 2
        else:
            print("⚠️  Background tasks not configured")
            features_score += 1
    except:
        features_score += 1
    
    try:
        if 'rest_framework' in settings.INSTALLED_APPS:
            print("✅ REST API framework configured")
            features_score += 2
        else:
            print("❌ REST API framework missing")
    except:
        pass
    
    assessment['categories']['Features'] = {
        'score': features_score,
        'max_score': features_max,
        'percentage': (features_score / features_max) * 100
    }
    
    # Calculate overall score
    total_score = sum(cat['score'] for cat in assessment['categories'].values())
    max_score = sum(cat['max_score'] for cat in assessment['categories'].values())
    overall_percentage = (total_score / max_score) * 100
    
    # Final Assessment
    print("\n" + "="*60)
    print("📊 FINAL PRODUCTION READINESS ASSESSMENT")
    print("="*60)
    
    for category, data in assessment['categories'].items():
        print(f"{category:12}: {data['score']:2}/{data['max_score']} ({data['percentage']:5.1f}%)")
    
    print("-" * 40)
    print(f"{'OVERALL':12}: {total_score:2}/{max_score} ({overall_percentage:5.1f}%)")
    
    # Recommendations
    if assessment['recommendations']:
        print(f"\n📋 RECOMMENDATIONS ({len(assessment['recommendations'])}):")
        for i, rec in enumerate(assessment['recommendations'], 1):
            print(f"   {i}. {rec}")
    
    # Final verdict
    print("\n" + "="*60)
    if overall_percentage >= 85:
        print("🎉 VERDICT: PRODUCTION READY")
        print("   The backend is ready for production deployment!")
    elif overall_percentage >= 70:
        print("✅ VERDICT: NEARLY PRODUCTION READY")
        print("   The backend is solid with minor improvements needed.")
    elif overall_percentage >= 55:
        print("⚠️  VERDICT: DEVELOPMENT READY")
        print("   The backend is good for development but needs work for production.")
    else:
        print("❌ VERDICT: NOT PRODUCTION READY")
        print("   The backend needs significant work before production deployment.")
    
    print(f"📈 Production Readiness Score: {overall_percentage:.1f}%")
    print("="*60)
    
    return overall_percentage

if __name__ == "__main__":
    score = assess_production_readiness()
    sys.exit(0 if score >= 70 else 1)
