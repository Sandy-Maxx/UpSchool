"""
Django settings for school_platform project.
"""

import os
from pathlib import Path
from decouple import config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-this-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*').split(',')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'drf_spectacular',  # OpenAPI/Swagger documentation
]

LOCAL_APPS = [
    'core',
    'tenants',
    'accounts',
    'schools',
    'library',
    'transport',
    'communication',
    'reports',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'school_platform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'school_platform.wsgi.application'
ASGI_APPLICATION = 'school_platform.asgi.application'

# Database
import dj_database_url
import os

# Determine environment
ENVIRONMENT = config('ENVIRONMENT', default='development')

if ENVIRONMENT in ['development', 'staging']:
    # Use SQLite for development and staging
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    # Use PostgreSQL for production
    DATABASE_URL = config('DATABASE_URL', default='postgresql://postgres:postgres123@localhost:5432/school_platform')
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# CORS settings
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')
CORS_ALLOW_CREDENTIALS = True

# Redis configuration
REDIS_URL = config('REDIS_URL', default='redis://localhost:6379/0')

# Celery configuration
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Channels configuration
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [REDIS_URL],
        },
    },
}

# Authentication backends
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

# Custom user model
AUTH_USER_MODEL = 'accounts.User'

# Email configuration (using console backend for testing)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = 'noreply@schoolerp.com'
SUPPORT_EMAIL = 'support@schoolerp.com'
MAIN_DOMAIN = 'schoolerp.com'
PLATFORM_NAME = 'SchoolERP'

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}

# Create logs directory
os.makedirs(BASE_DIR / 'logs', exist_ok=True)

# Spectacular settings for API documentation
SPECTACULAR_SETTINGS = {
    'TITLE': 'Multi-Tenant School ERP Platform API',
    'DESCRIPTION': '''
    A comprehensive, production-ready School ERP system supporting multiple educational institutions
    through a sophisticated multi-tenant architecture.

    ## Key Features

    ### 🏫 Multi-Tenancy
    - Complete data isolation between schools
    - Subdomain-based tenant routing
    - Scalable architecture supporting hundreds of schools

    ### 🔐 Security & RBAC
    - JWT-based authentication with refresh tokens
    - Granular Role-Based Access Control (RBAC)
    - 9 permission types: view, create, update, delete, approve, reject, export, import, manage
    - Object-level permissions using Django Guardian
    - Complete audit trails

    ### 📚 Core Modules
    - **Student Information System**: Complete student lifecycle management
    - **Academic Management**: Grades, subjects, exams, and scheduling
    - **Library Management**: Comprehensive catalog and circulation system
    - **Transport Management**: Fleet, routes, and student transport assignments
    - **Communication System**: Internal messaging and announcements
    - **Reports & Analytics**: Custom reports with 30+ templates

    ### ⚡ Performance & Scalability
    - Redis caching for optimal performance
    - Database query optimization
    - Background task processing with Celery
    - Real-time updates with WebSockets
    - Paginated API responses

    ## Authentication

    All API endpoints require authentication except for the health check endpoint.
    Use the `/api/v1/accounts/login/` endpoint to obtain access tokens.

    Include the access token in the Authorization header:
    ```
    Authorization: Bearer <access_token>
    ```

    ## Multi-Tenant Access

    The API automatically detects the tenant from the subdomain or can be specified
    in the `X-Tenant` header for API clients.

    ## Rate Limiting

    API endpoints are rate-limited to ensure fair usage:
    - Authenticated users: 1000 requests/hour
    - Anonymous users: 100 requests/hour

    ## Support

    For technical support or API questions, contact: support@schoolerp.com
    ''',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
        'filter': True,
        'tryItOutEnabled': True,
    },
    'COMPONENT_SPLIT_REQUEST': True,
    'SORT_OPERATIONS': False,
    'SERVE_PERMISSIONS': ['rest_framework.permissions.AllowAny'],
    'SERVERS': [
        {
            'url': 'http://localhost:8000',
            'description': 'Development Server'
        },
        {
            'url': 'https://api.schoolerp.com',
            'description': 'Production Server'
        },
        {
            'url': 'https://staging-api.schoolerp.com', 
            'description': 'Staging Server'
        }
    ],
    'EXTERNAL_DOCS': {
        'description': 'Full Documentation',
        'url': 'https://docs.schoolerp.com'
    },
    'TAGS': [
        {'name': 'Authentication', 'description': 'User authentication and authorization'},
        {'name': 'Users', 'description': 'User management operations'},
        {'name': 'Schools', 'description': 'School and academic management'},
        {'name': 'Students', 'description': 'Student information and records'},
        {'name': 'Teachers', 'description': 'Teacher management and assignments'},
        {'name': 'Library', 'description': 'Library catalog and circulation'},
        {'name': 'Transport', 'description': 'Fleet and route management'},
        {'name': 'Communication', 'description': 'Messaging and notifications'},
        {'name': 'Reports', 'description': 'Analytics and custom reports'},
        {'name': 'System', 'description': 'System health and monitoring'},
    ]
}
