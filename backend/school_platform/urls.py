"""
URL configuration for school_platform project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView, 
    SpectacularRedocView, 
    SpectacularSwaggerView
)
from core.views import HealthCheckView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Root Health Check (for Docker healthcheck)
    path('api/health/', HealthCheckView.as_view(), name='root-health-check'),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Routes
    path('api/v1/', include('core.urls')),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/schools/', include('schools.urls')),
    path('api/v1/library/', include('library.urls')),
    path('api/v1/transport/', include('transport.urls')),
    path('api/v1/communication/', include('communication.urls')),
    path('api/v1/reports/', include('reports.urls')),
    # Public tenant registration (no authentication required)
    path('api/v1/public/', include('tenants.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 