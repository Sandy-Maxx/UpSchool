"""
Core views for the school platform.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Tenant, Notification, SystemSettings
from .serializers import (
    TenantSerializer, 
    NotificationSerializer, 
    SystemSettingsSerializer
)
from .permissions import IsTenantAdmin
from django.utils import timezone


class HealthCheckView(APIView):
    """
    Health check endpoint for monitoring.
    """
    permission_classes = []

    def get(self, request):
        return Response({
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'version': '1.0.0'
        })


class TenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tenants.
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated, IsTenantAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'subscription_plan', 'subscription_status']
    search_fields = ['name', 'subdomain', 'school_name']
    ordering_fields = ['created_at', 'name', 'school_name']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a tenant."""
        tenant = self.get_object()
        tenant.is_active = True
        tenant.save()
        return Response({'status': 'activated'})

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a tenant."""
        tenant = self.get_object()
        tenant.is_active = False
        tenant.save()
        return Response({'status': 'deactivated'})

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get tenant statistics."""
        tenant = self.get_object()
        # This would include stats like user count, student count, etc.
        stats = {
            'total_users': 0,  # Would be calculated
            'total_students': 0,  # Would be calculated
            'subscription_status': tenant.subscription_status,
            'created_at': tenant.created_at,
        }
        return Response(stats)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['notification_type', 'is_read', 'tenant']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter notifications by current user and tenant."""
        user = self.request.user
        if user.is_superuser:
            return Notification.objects.all()
        return Notification.objects.filter(user=user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read."""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read."""
        queryset = self.get_queryset().filter(is_read=False)
        queryset.update(is_read=True, read_at=timezone.now())
        return Response({'status': 'all marked as read'})


class SystemSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing system settings.
    """
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['is_public']
    search_fields = ['key', 'description']

    def get_queryset(self):
        """Filter settings based on user permissions."""
        user = self.request.user
        if user.is_superuser:
            return SystemSettings.objects.all()
        return SystemSettings.objects.filter(is_public=True) 