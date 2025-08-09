"""
Views for transport management.
"""
from django.utils import timezone
from django.db.models import Q, Count, Avg
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    Vehicle, Driver, Route, RouteStop, TransportAssignment,
    StudentTransport, TransportTracking, TransportIncident, TransportSettings
)
from .serializers import (
    VehicleSerializer, DriverSerializer, RouteSerializer, RouteStopSerializer,
    TransportAssignmentSerializer, StudentTransportSerializer, TransportTrackingSerializer,
    TransportIncidentSerializer, TransportSettingsSerializer
)
from core.permissions import IsTenantUser


class VehicleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Vehicle model.
    """
    serializer_class = VehicleSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'fuel_type', 'vehicle_type']
    search_fields = ['registration_number', 'vehicle_number', 'model', 'make']
    ordering_fields = ['registration_number', 'vehicle_number', 'year', 'created_at']
    ordering = ['registration_number']

    def get_queryset(self):
        """Filter vehicles by tenant. Avoid DB access during schema generation."""
        if getattr(self, 'swagger_fake_view', False):
            return Vehicle.objects.none()
        user = self.request.user
        if getattr(user, 'is_superuser', False):
            return Vehicle.objects.all()
        return Vehicle.objects.filter(school__tenant=getattr(user, 'tenant', None))

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active vehicles."""
        active_vehicles = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_vehicles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def maintenance_due(self, request):
        """Get vehicles due for maintenance."""
        maintenance_due = self.get_queryset().filter(
            next_service_date__lte=timezone.now() + timezone.timedelta(days=30)
        )
        serializer = self.get_serializer(maintenance_due, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get vehicle statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_vehicles': queryset.count(),
            'available_vehicles': queryset.filter(status='available').count(),
            'in_use_vehicles': queryset.filter(status='in_use').count(),
            'maintenance_vehicles': queryset.filter(status='maintenance').count(),
            'average_mileage': queryset.aggregate(avg=Avg('mileage'))['avg'] or 0,
            'fuel_efficiency_avg': queryset.aggregate(avg=Avg('fuel_efficiency'))['avg'] or 0,
        }
        
        return Response(stats)


class DriverViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Driver model.
    """
    serializer_class = DriverSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'license_type']
    search_fields = ['driver_id', 'license_number', 'user__first_name', 'user__last_name', 'user__email']
    ordering_fields = ['driver_id', 'experience_years', 'created_at']
    ordering = ['driver_id']

    def get_queryset(self):
        """Filter drivers by tenant. Avoid DB access during schema generation."""
        if getattr(self, 'swagger_fake_view', False):
            return Driver.objects.none()
        user = self.request.user
        if getattr(user, 'is_superuser', False):
            return Driver.objects.all()
        return Driver.objects.filter(school__tenant=getattr(user, 'tenant', None))

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available drivers."""
        available_drivers = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(available_drivers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def license_expiring(self, request):
        """Get drivers with expiring licenses."""
        expiring_licenses = self.get_queryset().filter(
            license_expiry__lte=timezone.now() + timezone.timedelta(days=90)
        )
        serializer = self.get_serializer(expiring_licenses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get driver statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_drivers': queryset.count(),
            'active_drivers': queryset.filter(status='active').count(),
            'inactive_drivers': queryset.filter(status='inactive').count(),
            'average_experience': queryset.aggregate(avg=Avg('experience_years'))['avg'] or 0,
            'license_expiring_soon': queryset.filter(
                license_expiry__lte=timezone.now() + timezone.timedelta(days=90)
            ).count(),
        }
        
        return Response(stats)


class RouteStopViewSet(viewsets.ModelViewSet):
    """
    ViewSet for RouteStop model.
    """
    serializer_class = RouteStopSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['route']
    search_fields = ['stop_name', 'stop_address']
    ordering_fields = ['sequence_order', 'stop_name']
    ordering = ['sequence_order']

    def get_queryset(self):
        """Filter route stops by tenant. Avoid DB access during schema generation."""
        if getattr(self, 'swagger_fake_view', False):
            return RouteStop.objects.none()
        user = self.request.user
        if getattr(user, 'is_superuser', False):
            return RouteStop.objects.all()
        return RouteStop.objects.filter(route__school__tenant=getattr(user, 'tenant', None))


class RouteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Route model.
    """
    serializer_class = RouteSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['route_number', 'route_name', 'description', 'start_location', 'end_location']
    ordering_fields = ['route_number', 'route_name', 'distance_km', 'created_at']
    ordering = ['route_number']

    def get_queryset(self):
        """Filter routes by tenant. Avoid DB access during schema generation."""
        if getattr(self, 'swagger_fake_view', False):
            return Route.objects.none()
        user = self.request.user
        if getattr(user, 'is_superuser', False):
            return Route.objects.all()
        return Route.objects.filter(school__tenant=getattr(user, 'tenant', None))

    def get_serializer_class(self):
        """Use different serializer for creation."""
        return RouteSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active routes."""
        active_routes = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_routes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def stops(self, request, pk=None):
        """Get stops for a specific route."""
        route = self.get_object()
        stops = route.routestop_set.all().order_by('stop_order')
        serializer = RouteStopSerializer(stops, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get route statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_routes': queryset.count(),
            'active_routes': queryset.filter(status='active').count(),
            'inactive_routes': queryset.filter(status='inactive').count(),
            'average_distance': queryset.aggregate(avg=Avg('distance_km'))['avg'] or 0,
        }
        
        return Response(stats)


class TransportAssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TransportAssignment model.
    """
    serializer_class = TransportAssignmentSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'vehicle', 'driver', 'route']
    search_fields = ['vehicle__registration_number', 'driver__first_name', 'route__name']
    ordering_fields = ['assignment_date', 'created_at']
    ordering = ['-assignment_date']

    def get_queryset(self):
        """Filter assignments by tenant."""
        user = self.request.user
        if user.is_superuser:
            return TransportAssignment.objects.all()
        return TransportAssignment.objects.filter(school__tenant=user.tenant)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active assignments."""
        active_assignments = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_assignments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get assignment statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_assignments': queryset.count(),
            'active_assignments': queryset.filter(status='active').count(),
            'completed_assignments': queryset.filter(status='completed').count(),
            'cancelled_assignments': queryset.filter(status='cancelled').count(),
        }
        
        return Response(stats)


class StudentTransportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for StudentTransport model.
    """
    serializer_class = StudentTransportSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'route', 'vehicle', 'driver', 'payment_status']
    search_fields = ['student__first_name', 'student__last_name', 'route__name']
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-start_date']

    def get_queryset(self):
        """Filter student transport by tenant."""
        user = self.request.user
        if user.is_superuser:
            return StudentTransport.objects.all()
        return StudentTransport.objects.filter(school__tenant=user.tenant)

    def get_serializer_class(self):
        """Return the default serializer class."""
        return StudentTransportSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active student transport assignments."""
        active_assignments = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_assignments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue_payments(self, request):
        """Get student transport with overdue payments."""
        overdue_payments = self.get_queryset().filter(
            payment_status='unpaid',
            start_date__lte=timezone.now()
        )
        serializer = self.get_serializer(overdue_payments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get student transport statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_assignments': queryset.count(),
            'active_assignments': queryset.filter(status='active').count(),
            'completed_assignments': queryset.filter(status='completed').count(),
            'cancelled_assignments': queryset.filter(status='cancelled').count(),
            'paid_assignments': queryset.filter(payment_status='paid').count(),
            'unpaid_assignments': queryset.filter(payment_status='unpaid').count(),
            'total_fees': queryset.aggregate(total=Avg('fee_amount'))['total'] or 0,
        }
        
        return Response(stats)


class TransportTrackingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TransportTracking model.
    """
    serializer_class = TransportTrackingSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['vehicle', 'driver', 'route', 'status']
    ordering_fields = ['timestamp', 'created_at']
    ordering = ['-timestamp']

    def get_queryset(self):
        """Filter tracking data by tenant."""
        user = self.request.user
        if user.is_superuser:
            return TransportTracking.objects.all()
        return TransportTracking.objects.filter(school__tenant=user.tenant)

    @action(detail=False, methods=['get'])
    def current_locations(self, request):
        """Get current locations of all vehicles."""
        # Get latest tracking data for each vehicle
        from django.db.models import Max
        latest_tracking = self.get_queryset().values('vehicle').annotate(
            latest_timestamp=Max('timestamp')
        )
        
        current_locations = []
        for tracking in latest_tracking:
            latest = self.get_queryset().filter(
                vehicle=tracking['vehicle'],
                timestamp=tracking['latest_timestamp']
            ).first()
            if latest:
                current_locations.append(latest)
        
        serializer = self.get_serializer(current_locations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def vehicle_history(self, request, pk=None):
        """Get tracking history for a specific vehicle."""
        vehicle_id = pk
        history = self.get_queryset().filter(vehicle_id=vehicle_id).order_by('-timestamp')
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)


class TransportIncidentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TransportIncident model.
    """
    serializer_class = TransportIncidentSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['severity', 'status', 'vehicle', 'driver', 'route']
    search_fields = ['incident_type', 'description', 'location']
    ordering_fields = ['incident_date', 'severity', 'created_at']
    ordering = ['-incident_date']

    def get_queryset(self):
        """Filter incidents by tenant."""
        user = self.request.user
        if user.is_superuser:
            return TransportIncident.objects.all()
        return TransportIncident.objects.filter(school__tenant=user.tenant)

    @action(detail=False, methods=['get'])
    def open(self, request):
        """Get open incidents."""
        open_incidents = self.get_queryset().filter(status='open')
        serializer = self.get_serializer(open_incidents, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def critical(self, request):
        """Get critical incidents."""
        critical_incidents = self.get_queryset().filter(severity='critical')
        serializer = self.get_serializer(critical_incidents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve an incident."""
        incident = self.get_object()
        incident.status = 'resolved'
        incident.resolved_date = timezone.now()
        incident.resolution_notes = request.data.get('resolution_notes', '')
        incident.save()
        return Response({'message': 'Incident resolved successfully'})

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get incident statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_incidents': queryset.count(),
            'open_incidents': queryset.filter(status='open').count(),
            'resolved_incidents': queryset.filter(status='resolved').count(),
            'critical_incidents': queryset.filter(severity='critical').count(),
            'major_incidents': queryset.filter(severity='major').count(),
            'minor_incidents': queryset.filter(severity='minor').count(),
        }
        
        return Response(stats)


class TransportSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TransportSettings model.
    """
    serializer_class = TransportSettingsSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['school__name']

    def get_queryset(self):
        """Filter settings by tenant."""
        user = self.request.user
        if user.is_superuser:
            return TransportSettings.objects.all()
        return TransportSettings.objects.filter(school__tenant=user.tenant) 