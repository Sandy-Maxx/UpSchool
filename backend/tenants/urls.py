"""
Public tenant registration URLs.
"""
from django.urls import path
from . import views
from .test_endpoints import tenant_info

app_name = 'tenants'

urlpatterns = [
    # Public registration endpoints (no authentication required)
    path('register/', views.register_tenant, name='register'),
    path('check-subdomain/', views.check_subdomain, name='check_subdomain'),
    path('pricing/', views.pricing_plans, name='pricing'),
    path('contact/', views.contact_form, name='contact'),
    
    # Test endpoint for subdomain testing
    path('tenant-info/<str:subdomain>/', tenant_info, name='tenant_info'),
]
