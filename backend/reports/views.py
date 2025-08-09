"""
Views for reports and analytics management.
"""
from django.utils import timezone
from django.db.models import Q, Count, Avg, Sum, Max, Min
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    Report, Dashboard, Widget, AnalyticsEvent, AnalyticsMetric,
    DataExport, ReportSchedule, ReportTemplate, ReportsSettings
)
from .serializers import (
    ReportSerializer, DashboardSerializer, WidgetSerializer,
    AnalyticsEventSerializer, AnalyticsMetricSerializer, DataExportSerializer,
    ReportScheduleSerializer, ReportTemplateSerializer, ReportsSettingsSerializer,
    ReportCreateSerializer, DashboardCreateSerializer, WidgetCreateSerializer,
    DataExportCreateSerializer, ReportScheduleCreateSerializer,
    AnalyticsEventCreateSerializer, DashboardWidgetSerializer
)
from core.permissions import IsTenantUser


class ReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Report model.
    """
    serializer_class = ReportSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['report_type', 'status', 'created_by', 'is_public']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'generated_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter reports by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Report.objects.all()
        return Report.objects.filter(school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer

    def perform_create(self, serializer):
        """Set creator and school when creating report."""
        serializer.save(created_by=self.request.user, school=self.request.user.school)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """Generate a report."""
        report = self.get_object()
        # Here you would implement the actual report generation logic
        # For now, we'll just update the status
        report.status = 'generated'
        report.generated_at = timezone.now()
        report.save()
        return Response({'message': 'Report generated successfully'})

    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """Download a report."""
        report = self.get_object()
        # Here you would implement the actual download logic
        # For now, we'll just increment the download count
        report.download_count += 1
        report.save()
        return Response({'message': 'Report download initiated'})

    @action(detail=False, methods=['get'])
    def public(self, request):
        """Get public reports."""
        public_reports = self.get_queryset().filter(is_public=True)
        serializer = self.get_serializer(public_reports, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_reports(self, request):
        """Get user's own reports."""
        my_reports = self.get_queryset().filter(created_by=request.user)
        serializer = self.get_serializer(my_reports, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get report statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_reports': queryset.count(),
            'generated_reports': queryset.filter(status='generated').count(),
            'pending_reports': queryset.filter(status='pending').count(),
            'failed_reports': queryset.filter(status='failed').count(),
            'public_reports': queryset.filter(is_public=True).count(),
            'my_reports': queryset.filter(created_by=request.user).count(),
            'total_downloads': queryset.aggregate(total=Sum('download_count'))['total'] or 0,
        }
        
        return Response(stats)


class DashboardViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Dashboard model.
    """
    serializer_class = DashboardSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_public', 'is_active', 'owner']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']

    def get_queryset(self):
        """Filter dashboards by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Dashboard.objects.all()
        return Dashboard.objects.filter(school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return DashboardCreateSerializer
        elif self.action == 'retrieve':
            return DashboardWidgetSerializer
        return DashboardSerializer

    def perform_create(self, serializer):
        """Set owner and school when creating dashboard."""
        serializer.save(owner=self.request.user, school=self.request.user.school)

    @action(detail=False, methods=['get'])
    def public(self, request):
        """Get public dashboards."""
        public_dashboards = self.get_queryset().filter(is_public=True, is_active=True)
        serializer = self.get_serializer(public_dashboards, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_dashboards(self, request):
        """Get user's own dashboards."""
        my_dashboards = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(my_dashboards, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a dashboard."""
        dashboard = self.get_object()
        new_dashboard = Dashboard.objects.create(
            name=f"{dashboard.name} (Copy)",
            description=dashboard.description,
            owner=request.user,
            school=request.user.school,
            is_public=False,
            layout=dashboard.layout,
            theme=dashboard.theme
        )
        
        # Duplicate widgets
        for widget in dashboard.widget_set.all():
            Widget.objects.create(
                dashboard=new_dashboard,
                name=widget.name,
                description=widget.description,
                widget_type=widget.widget_type,
                data_source=widget.data_source,
                config=widget.config,
                position=widget.position,
                size=widget.size,
                refresh_interval=widget.refresh_interval
            )
        
        return Response({
            'message': 'Dashboard duplicated successfully',
            'dashboard_id': new_dashboard.id
        })

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get dashboard statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_dashboards': queryset.count(),
            'public_dashboards': queryset.filter(is_public=True).count(),
            'active_dashboards': queryset.filter(is_active=True).count(),
            'my_dashboards': queryset.filter(owner=request.user).count(),
            'total_widgets': queryset.aggregate(total=Count('widget'))['total'] or 0,
        }
        
        return Response(stats)


class WidgetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Widget model.
    """
    serializer_class = WidgetSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['widget_type', 'data_source', 'is_active', 'dashboard']
    search_fields = ['name', 'description']
    ordering_fields = ['position', 'created_at', 'name']
    ordering = ['position']

    def get_queryset(self):
        """Filter widgets by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Widget.objects.all()
        return Widget.objects.filter(dashboard__school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return WidgetCreateSerializer
        return WidgetSerializer

    @action(detail=True, methods=['post'])
    def refresh(self, request, pk=None):
        """Refresh widget data."""
        widget = self.get_object()
        # Here you would implement the actual data refresh logic
        return Response({'message': 'Widget data refreshed successfully'})

    @action(detail=True, methods=['post'])
    def resize(self, request, pk=None):
        """Resize a widget."""
        widget = self.get_object()
        size = request.data.get('size')
        
        if not size:
            return Response(
                {'error': 'size is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        widget.size = size
        widget.save()
        return Response({'message': 'Widget resized successfully'})

    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        """Move a widget."""
        widget = self.get_object()
        position = request.data.get('position')
        
        if not position:
            return Response(
                {'error': 'position is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        widget.position = position
        widget.save()
        return Response({'message': 'Widget moved successfully'})


class AnalyticsEventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AnalyticsEvent model.
    """
    serializer_class = AnalyticsEventSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['event_type', 'user']
    search_fields = ['page_url', 'session_id']
    ordering_fields = ['timestamp', 'created_at']
    ordering = ['-timestamp']

    def get_queryset(self):
        """Filter events by tenant."""
        user = self.request.user
        if user.is_superuser:
            return AnalyticsEvent.objects.all()
        return AnalyticsEvent.objects.filter(school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return AnalyticsEventCreateSerializer
        return AnalyticsEventSerializer

    def perform_create(self, serializer):
        """Set user and school when creating event."""
        serializer.save(user=self.request.user, school=self.request.user.school)

    @action(detail=False, methods=['get'])
    def page_views(self, request):
        """Get page view analytics."""
        page_views = self.get_queryset().filter(event_type='page_view')
        serializer = self.get_serializer(page_views, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def user_activity(self, request):
        """Get user activity analytics."""
        user_activity = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(user_activity, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get analytics statistics."""
        queryset = self.get_queryset()
        
        # Get date range from query params
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timezone.timedelta(days=days)
        
        recent_events = queryset.filter(timestamp__gte=start_date)
        
        stats = {
            'total_events': queryset.count(),
            'recent_events': recent_events.count(),
            'unique_users': queryset.values('user').distinct().count(),
            'page_views': queryset.filter(event_type='page_view').count(),
            'user_logins': queryset.filter(event_type='user_login').count(),
            'user_logouts': queryset.filter(event_type='user_logout').count(),
        }
        
        return Response(stats)


class AnalyticsMetricViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AnalyticsMetric model.
    """
    serializer_class = AnalyticsMetricSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['metric_type', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter metrics by tenant."""
        user = self.request.user
        if user.is_superuser:
            return AnalyticsMetric.objects.all()
        return AnalyticsMetric.objects.filter(school__tenant=user.tenant)

    def perform_create(self, serializer):
        """Set school when creating metric."""
        serializer.save(school=self.request.user.school)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active metrics."""
        active_metrics = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_metrics, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def calculate(self, request, pk=None):
        """Calculate metric value."""
        metric = self.get_object()
        # Here you would implement the actual metric calculation logic
        return Response({'message': 'Metric calculated successfully'})


class DataExportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for DataExport model.
    """
    serializer_class = DataExportSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['export_type', 'status', 'format', 'requested_by']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'expires_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter exports by tenant."""
        user = self.request.user
        if user.is_superuser:
            return DataExport.objects.all()
        return DataExport.objects.filter(school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return DataExportCreateSerializer
        return DataExportSerializer

    def perform_create(self, serializer):
        """Set requester and school when creating export."""
        serializer.save(requested_by=self.request.user, school=self.request.user.school)

    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """Download an export."""
        export = self.get_object()
        # Here you would implement the actual download logic
        export.download_count += 1
        export.save()
        return Response({'message': 'Export download initiated'})

    @action(detail=False, methods=['get'])
    def my_exports(self, request):
        """Get user's own exports."""
        my_exports = self.get_queryset().filter(requested_by=request.user)
        serializer = self.get_serializer(my_exports, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get expired exports."""
        expired_exports = self.get_queryset().filter(
            expires_at__lt=timezone.now()
        )
        serializer = self.get_serializer(expired_exports, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get export statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_exports': queryset.count(),
            'completed_exports': queryset.filter(status='completed').count(),
            'pending_exports': queryset.filter(status='pending').count(),
            'failed_exports': queryset.filter(status='failed').count(),
            'my_exports': queryset.filter(requested_by=request.user).count(),
            'total_downloads': queryset.aggregate(total=Sum('download_count'))['total'] or 0,
        }
        
        return Response(stats)


class ReportScheduleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ReportSchedule model.
    """
    serializer_class = ReportScheduleSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['frequency', 'status', 'is_active', 'created_by']
    search_fields = ['name', 'description']
    ordering_fields = ['next_run', 'created_at', 'name']
    ordering = ['next_run']

    def get_queryset(self):
        """Filter schedules by tenant."""
        user = self.request.user
        if user.is_superuser:
            return ReportSchedule.objects.all()
        return ReportSchedule.objects.filter(school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return ReportScheduleCreateSerializer
        return ReportScheduleSerializer

    def perform_create(self, serializer):
        """Set creator and school when creating schedule."""
        serializer.save(created_by=self.request.user, school=self.request.user.school)

    @action(detail=True, methods=['post'])
    def run_now(self, request, pk=None):
        """Run a scheduled report immediately."""
        schedule = self.get_object()
        # Here you would implement the actual report execution logic
        return Response({'message': 'Report executed successfully'})

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active schedules."""
        active_schedules = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_schedules, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def due_soon(self, request):
        """Get schedules due to run soon."""
        due_soon = self.get_queryset().filter(
            is_active=True,
            next_run__lte=timezone.now() + timezone.timedelta(hours=24)
        )
        serializer = self.get_serializer(due_soon, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get schedule statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_schedules': queryset.count(),
            'active_schedules': queryset.filter(is_active=True).count(),
            'inactive_schedules': queryset.filter(is_active=False).count(),
            'daily_schedules': queryset.filter(frequency='daily').count(),
            'weekly_schedules': queryset.filter(frequency='weekly').count(),
            'monthly_schedules': queryset.filter(frequency='monthly').count(),
        }
        
        return Response(stats)


class ReportTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ReportTemplate model.
    """
    serializer_class = ReportTemplateSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['template_type', 'is_active', 'is_default']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter templates by tenant."""
        user = self.request.user
        if user.is_superuser:
            return ReportTemplate.objects.all()
        return ReportTemplate.objects.filter(school__tenant=user.tenant)

    def perform_create(self, serializer):
        """Set creator and school when creating template."""
        serializer.save(created_by=self.request.user, school=self.request.user.school)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active templates."""
        active_templates = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_templates, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def default(self, request):
        """Get default templates."""
        default_templates = self.get_queryset().filter(is_default=True)
        serializer = self.get_serializer(default_templates, many=True)
        return Response(serializer.data)


class ReportsSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ReportsSettings model.
    """
    serializer_class = ReportsSettingsSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['school__name']

    def get_queryset(self):
        """Filter settings by tenant."""
        user = self.request.user
        if user.is_superuser:
            return ReportsSettings.objects.all()
        return ReportsSettings.objects.filter(school__tenant=user.tenant) 