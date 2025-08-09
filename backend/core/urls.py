"""
Core URL patterns for the school platform.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tenants', views.TenantViewSet)
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'settings', views.SystemSettingsViewSet)

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health-check'),
    path('', include(router.urls)),
] 