"""
Public tenant registration views.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from celery import shared_task

from core.models import Tenant
from .serializers import (
    TenantRegistrationSerializer, 
    SubdomainCheckSerializer,
    ContactSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_tenant(request):
    """
    Public endpoint for tenant registration.
    """
    serializer = TenantRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        tenant = serializer.save()
        
        # Send welcome email synchronously (fallback when Celery is not available)
        try:
            send_welcome_email.delay(tenant.id)
        except Exception:
            # Fallback to synchronous execution if Celery is not available
            send_welcome_email_sync(tenant.id)
        
        # Setup RBAC for new tenant
        try:
            setup_tenant_rbac.delay(tenant.id)
        except Exception:
            # Fallback to synchronous execution if Celery is not available
            setup_tenant_rbac_sync(tenant.id)
        
        response_data = {
            'success': True,
            'message': 'School registration successful!',
            'tenant': {
                'id': str(tenant.id),
                'name': tenant.name,
                'subdomain': tenant.subdomain,
                'url': f"https://{tenant.subdomain}.{settings.MAIN_DOMAIN}",
                'subscription_plan': tenant.subscription_plan,
            },
            'next_steps': [
                'Check your email for login credentials',
                f'Access your school portal at {tenant.subdomain}.{settings.MAIN_DOMAIN}',
                'Complete your school setup',
                'Add teachers and students'
            ]
        }
        
        return Response(
            response_data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        {
            'success': False,
            'errors': serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def check_subdomain(request):
    """
    Check if subdomain is available.
    """
    serializer = SubdomainCheckSerializer(data=request.data)
    
    if serializer.is_valid():
        subdomain = serializer.validated_data['subdomain']
        
        # Check availability
        is_available = not Tenant.objects.filter(subdomain=subdomain).exists()
        
        # Check if reserved
        reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'test', 'staging', 'demo']
        is_reserved = subdomain.lower() in reserved
        
        return Response({
            'subdomain': subdomain,
            'available': is_available and not is_reserved,
            'reserved': is_reserved,
            'url_preview': f"https://{subdomain}.{getattr(settings, 'MAIN_DOMAIN', 'schoolerp.com')}"
        })
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
    """
    Handle contact form submissions.
    """
    serializer = ContactSerializer(data=request.data)
    
    if serializer.is_valid():
        # Send contact email asynchronously
        send_contact_email.delay(serializer.validated_data)
        
        return Response({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!'
        })
    
    return Response(
        {
            'success': False,
            'errors': serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def pricing_plans(request):
    """
    Get available pricing plans.
    """
    plans = [
        {
            'id': 'basic',
            'name': 'Basic',
            'description': 'Perfect for small schools',
            'price': 49,
            'currency': 'USD',
            'billing': 'monthly',
            'student_limit': 100,
            'features': [
                'Student Information System',
                'Basic Reporting',
                'Email Support',
                'Mobile Access',
                '5GB Storage'
            ],
            'popular': False
        },
        {
            'id': 'standard',
            'name': 'Standard',
            'description': 'Most popular for medium schools',
            'price': 99,
            'currency': 'USD',
            'billing': 'monthly',
            'student_limit': 500,
            'features': [
                'All Basic features',
                'Library Management',
                'Transport Management',
                'Advanced Reporting',
                'Phone Support',
                '25GB Storage',
                'Custom Branding'
            ],
            'popular': True
        },
        {
            'id': 'premium',
            'name': 'Premium',
            'description': 'For large educational institutions',
            'price': 199,
            'currency': 'USD',
            'billing': 'monthly',
            'student_limit': 2000,
            'features': [
                'All Standard features',
                'Communication System',
                'Advanced Analytics',
                'API Access',
                'Priority Support',
                '100GB Storage',
                'Custom Integrations',
                'Advanced Security'
            ],
            'popular': False
        },
        {
            'id': 'enterprise',
            'name': 'Enterprise',
            'description': 'Custom solution for large organizations',
            'price': 'Custom',
            'currency': 'USD',
            'billing': 'custom',
            'student_limit': 'Unlimited',
            'features': [
                'All Premium features',
                'Unlimited Students',
                'Dedicated Support',
                'Custom Development',
                'On-premise Deployment',
                'SLA Guarantee',
                'Training & Onboarding',
                'Unlimited Storage'
            ],
            'popular': False
        }
    ]
    
    return Response({
        'plans': plans,
        'currency': 'USD',
        'tax_info': 'Prices exclude applicable taxes'
    })


# Celery Tasks
@shared_task
def send_welcome_email(tenant_id):
    """
    Send welcome email to new tenant admin.
    """
    try:
        tenant = Tenant.objects.get(id=tenant_id)
        admin_user = tenant.users.filter(user_type='admin').first()
        
        if admin_user:
            subject = f'Welcome to {settings.PLATFORM_NAME}!'
            
            # Render email template
            html_message = render_to_string('emails/welcome.html', {
                'user': admin_user,
                'tenant': tenant,
                'login_url': f"https://{tenant.subdomain}.{settings.MAIN_DOMAIN}/login",
                'support_email': settings.SUPPORT_EMAIL,
                'platform_name': settings.PLATFORM_NAME
            })
            
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin_user.email],
                html_message=html_message,
                fail_silently=False
            )
            
    except Exception as e:
        # Log error
        print(f"Failed to send welcome email: {e}")


@shared_task
def setup_tenant_rbac(tenant_id):
    """
    Setup RBAC for new tenant.
    """
    try:
        from django.core.management import call_command
        tenant = Tenant.objects.get(id=tenant_id)
        
        # Run RBAC setup command for this tenant
        call_command('setup_rbac', tenant=tenant.subdomain)
        
    except Exception as e:
        # Log error
        print(f"Failed to setup RBAC for tenant: {e}")


@shared_task
def send_contact_email(contact_data):
    """
    Send contact form email to support team.
    """
    try:
        subject = f"Contact Form: {contact_data['subject']} - {contact_data['name']}"
        
        html_message = render_to_string('emails/contact.html', {
            'contact': contact_data,
            'platform_name': settings.PLATFORM_NAME
        })
        
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.SUPPORT_EMAIL],
            html_message=html_message,
            fail_silently=False
        )
        
    except Exception as e:
        # Log error
        print(f"Failed to send contact email: {e}")


# Synchronous fallback functions (when Celery is not available)
def send_welcome_email_sync(tenant_id):
    """
    Send welcome email to new tenant admin (synchronous version).
    """
    try:
        tenant = Tenant.objects.get(id=tenant_id)
        from accounts.models import User
        admin_user = User.objects.filter(tenant=tenant, user_type='admin').first()
        
        if admin_user:
            subject = f'Welcome to {getattr(settings, "PLATFORM_NAME", "SchoolERP")}!'
            
            # Simple email message (no template needed)
            message = f"""
            Welcome to {getattr(settings, 'PLATFORM_NAME', 'SchoolERP')}!
            
            Your school platform has been successfully created.
            
            School Details:
            - Name: {tenant.name}
            - Subdomain: {tenant.subdomain}
            - URL: https://{tenant.subdomain}.{getattr(settings, 'MAIN_DOMAIN', 'schoolerp.com')}
            
            Admin Account:
            - Name: {admin_user.get_full_name()}
            - Email: {admin_user.email}
            
            Next Steps:
            1. Access your platform at: https://{tenant.subdomain}.{getattr(settings, 'MAIN_DOMAIN', 'schoolerp.com')}
            2. Complete your school setup
            3. Add teachers and students
            4. Configure your school settings
            
            If you need help, contact us at: {getattr(settings, 'SUPPORT_EMAIL', 'support@schoolerp.com')}
            
            Best regards,
            The {getattr(settings, 'PLATFORM_NAME', 'SchoolERP')} Team
            """
            
            # Only send email if email backend is configured (not console)
            if not settings.EMAIL_BACKEND.endswith('ConsoleEmailBackend'):
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@schoolerp.com'),
                    recipient_list=[admin_user.email],
                    fail_silently=True
                )
            else:
                print(f"Welcome email would be sent to: {admin_user.email}")
                print(f"Subject: {subject}")
            
    except Exception as e:
        print(f"Failed to send welcome email (sync): {e}")


def setup_tenant_rbac_sync(tenant_id):
    """
    Setup RBAC for new tenant (synchronous version).
    """
    try:
        tenant = Tenant.objects.get(id=tenant_id)
        from accounts.models import Role, Permission, UserRole, User
        
        # Create basic tenant roles
        admin_role, created = Role.objects.get_or_create(
            name=f'tenant_admin_{tenant.subdomain}',
            defaults={
                'display_name': 'Tenant Administrator',
                'description': f'Full access to {tenant.name} data and settings',
                'role_type': 'tenant',
                'tenant': tenant,
            }
        )
        
        # Assign admin role to the tenant admin user
        admin_user = User.objects.filter(tenant=tenant, user_type='admin').first()
        if admin_user:
            UserRole.objects.get_or_create(
                user=admin_user,
                role=admin_role,
                defaults={
                    'assigned_by': admin_user,
                    'is_active': True
                }
            )
        
        print(f"RBAC setup completed for tenant: {tenant.name}")
        
    except Exception as e:
        print(f"Failed to setup RBAC for tenant (sync): {e}")
