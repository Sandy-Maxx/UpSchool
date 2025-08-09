"""
Advanced API Documentation Configuration for Production SaaS Platform
Implements OpenAPI/Swagger documentation with comprehensive API specs.
"""

from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator

# API Documentation Examples and Schemas

# Authentication Examples
LOGIN_EXAMPLES = [
    OpenApiExample(
        'Login Success',
        summary='Successful login',
        description='User successfully authenticated',
        value={
            'username': 'admin@school.edu',
            'password': 'securepassword123'
        },
        request_only=True
    )
]

LOGIN_RESPONSE_EXAMPLES = [
    OpenApiExample(
        'Login Success Response',
        summary='Successful authentication response',
        value={
            'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
            'refresh_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
            'user': {
                'id': 1,
                'username': 'admin@school.edu',
                'first_name': 'John',
                'last_name': 'Doe',
                'roles': ['admin', 'teacher']
            },
            'tenant': {
                'id': 1,
                'name': 'Springfield Elementary',
                'subdomain': 'springfield'
            }
        },
        response_only=True,
        status_codes=['200']
    )
]

# Student Management Examples
STUDENT_CREATE_EXAMPLES = [
    OpenApiExample(
        'Create Student',
        summary='Create new student',
        description='Example for creating a new student record',
        value={
            'user': {
                'username': 'john.student@school.edu',
                'first_name': 'John',
                'last_name': 'Smith',
                'email': 'john.student@school.edu'
            },
            'student_id': 'STU2024001',
            'admission_number': 'ADM2024001',
            'admission_date': '2024-01-15',
            'date_of_birth': '2010-05-20',
            'gender': 'male',
            'grade': 1,
            'parent_name': 'Robert Smith',
            'parent_phone': '+1-555-0123',
            'parent_email': 'robert.smith@email.com',
            'address': '123 Main St, Springfield, IL 62701'
        },
        request_only=True
    )
]

# Library Management Examples
BOOK_EXAMPLES = [
    OpenApiExample(
        'Create Book',
        summary='Add new book to library',
        value={
            'title': 'To Kill a Mockingbird',
            'author': 'Harper Lee',
            'isbn': '978-0-06-112008-4',
            'publisher': 'J. B. Lippincott & Co.',
            'publication_year': 1960,
            'category': 'Fiction',
            'language': 'English',
            'total_copies': 5,
            'available_copies': 5,
            'location': 'A-101'
        },
        request_only=True
    )
]

# Transport Management Examples
VEHICLE_EXAMPLES = [
    OpenApiExample(
        'Create Vehicle',
        summary='Add new vehicle to fleet',
        value={
            'vehicle_number': 'BUS-001',
            'model': 'Blue Bird Vision',
            'capacity': 72,
            'year': 2020,
            'fuel_type': 'diesel',
            'status': 'active',
            'insurance_expiry': '2025-06-30',
            'registration_expiry': '2025-12-31'
        },
        request_only=True
    )
]

# API Schema Decorators for ViewSets
def document_authentication_viewset():
    """Documentation for Authentication ViewSet"""
    return [
        extend_schema(
            operation_id='login',
            summary='User Login',
            description='Authenticate user and return access tokens',
            examples=LOGIN_EXAMPLES,
            responses={
                200: OpenApiExample(
                    'Success',
                    value=LOGIN_RESPONSE_EXAMPLES[0].value
                ),
                401: OpenApiExample(
                    'Invalid Credentials',
                    value={'error': 'Invalid username or password'}
                )
            }
        )
    ]

def document_student_viewset():
    """Documentation for Student ViewSet"""
    return [
        extend_schema(
            operation_id='list_students',
            summary='List Students',
            description='Retrieve paginated list of students',
            parameters=[
                OpenApiParameter(
                    name='grade',
                    type=OpenApiTypes.INT,
                    location=OpenApiParameter.QUERY,
                    description='Filter by grade level'
                ),
                OpenApiParameter(
                    name='search',
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    description='Search by name, student ID, or admission number'
                ),
                OpenApiParameter(
                    name='status',
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    description='Filter by academic status',
                    enum=['active', 'suspended', 'graduated', 'transferred']
                )
            ]
        ),
        extend_schema(
            operation_id='create_student',
            summary='Create Student',
            description='Create new student record',
            examples=STUDENT_CREATE_EXAMPLES
        )
    ]

def document_library_viewset():
    """Documentation for Library ViewSet"""
    return [
        extend_schema(
            operation_id='list_books',
            summary='List Books',
            description='Retrieve library catalog with advanced filtering',
            parameters=[
                OpenApiParameter(
                    name='category',
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    description='Filter by book category'
                ),
                OpenApiParameter(
                    name='author',
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    description='Filter by author name'
                ),
                OpenApiParameter(
                    name='available',
                    type=OpenApiTypes.BOOL,
                    location=OpenApiParameter.QUERY,
                    description='Show only available books'
                )
            ]
        ),
        extend_schema(
            operation_id='create_book',
            summary='Add Book',
            description='Add new book to library catalog',
            examples=BOOK_EXAMPLES
        )
    ]

def document_transport_viewset():
    """Documentation for Transport ViewSet"""
    return [
        extend_schema(
            operation_id='list_vehicles',
            summary='List Vehicles',
            description='Retrieve fleet vehicles with status filtering',
            parameters=[
                OpenApiParameter(
                    name='status',
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    description='Filter by vehicle status',
                    enum=['active', 'maintenance', 'retired']
                ),
                OpenApiParameter(
                    name='route',
                    type=OpenApiTypes.INT,
                    location=OpenApiParameter.QUERY,
                    description='Filter by assigned route ID'
                )
            ]
        ),
        extend_schema(
            operation_id='create_vehicle',
            summary='Add Vehicle',
            description='Add new vehicle to fleet',
            examples=VEHICLE_EXAMPLES
        )
    ]

# API Health Check Endpoint
@extend_schema(
    operation_id='health_check',
    summary='Health Check',
    description='Check API health status and system information',
    responses={
        200: OpenApiExample(
            'Healthy',
            value={
                'status': 'healthy',
                'version': '1.0.0',
                'timestamp': '2024-08-06T03:00:00Z',
                'database': 'connected',
                'redis': 'connected',
                'services': {
                    'authentication': 'operational',
                    'multi_tenant': 'operational',
                    'background_tasks': 'operational'
                }
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """API Health Check endpoint for production monitoring."""
    from django.db import connections
    from django.core.cache import cache
    import datetime
    
    health_status = {
        'status': 'healthy',
        'version': '1.0.0',
        'timestamp': datetime.datetime.now().isoformat(),
        'database': 'connected',
        'redis': 'connected',
        'services': {
            'authentication': 'operational',
            'multi_tenant': 'operational',
            'background_tasks': 'operational'
        }
    }
    
    try:
        # Test database connection
        connections['default'].cursor()
        health_status['database'] = 'connected'
        
        # Test Redis connection
        cache.set('health_check', 'ok', 10)
        if cache.get('health_check') == 'ok':
            health_status['redis'] = 'connected'
        else:
            health_status['redis'] = 'disconnected'
            health_status['status'] = 'degraded'
            
    except Exception as e:
        health_status['status'] = 'unhealthy'
        health_status['error'] = str(e)
        return Response(health_status, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    return Response(health_status, status=status.HTTP_200_OK)

# API Configuration for Spectacular (Swagger)
SPECTACULAR_SETTINGS = {
    'TITLE': 'Multi-Tenant School ERP Platform API',
    'DESCRIPTION': '''
    # Multi-Tenant School ERP Platform API

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

    ```json
    {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
    ```

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
