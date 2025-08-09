"""
Test endpoints for tenant subdomain testing
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from core.models import Tenant
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny])
def tenant_info(request, subdomain):
    """
    Get tenant information by subdomain for testing
    """
    try:
        tenant = get_object_or_404(Tenant, subdomain=subdomain, is_active=True)
        admin_user = User.objects.filter(tenant=tenant, user_type='admin').first()
        
        tenant_data = {
            'success': True,
            'tenant': {
                'id': str(tenant.id),
                'name': tenant.school_name,
                'subdomain': tenant.subdomain,
                'type': tenant.school_type,
                'address': tenant.school_address,
                'city': tenant.school_city,
                'state': tenant.school_state,
                'country': tenant.school_country,
                'phone': tenant.school_phone,
                'email': tenant.school_email,
                'website': tenant.school_website,
                'student_count': tenant.student_count_range,
                'staff_count': tenant.staff_count_range,
                'subscription_plan': tenant.subscription_plan,
                'trial_ends_at': tenant.trial_ends_at,
                'marketing_consent': tenant.marketing_emails_consent,
                'created_at': tenant.created_at,
                'is_active': tenant.is_active,
                'url': f"https://{tenant.subdomain}.schoolerp.com"
            },
            'admin': {
                'name': f"{admin_user.first_name} {admin_user.last_name}" if admin_user else None,
                'job_title': admin_user.job_title if admin_user else None,
                'email': admin_user.email if admin_user else None,
            } if admin_user else None
        }
        
        return Response(tenant_data, status=status.HTTP_200_OK)
        
    except Tenant.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Tenant not found',
            'message': f'No active tenant found with subdomain: {subdomain}'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': 'Server error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
