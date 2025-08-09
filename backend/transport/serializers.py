"""
Serializers for transport models.
"""
from rest_framework import serializers
from .models import (
    Vehicle, Driver, Route, RouteStop, TransportAssignment,
    StudentTransport, TransportTracking, TransportIncident, TransportSettings
)


class VehicleSerializer(serializers.ModelSerializer):
    """
    Serializer for Vehicle model.
    """
    driver_name = serializers.ReadOnlyField(source='driver.get_full_name')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    fuel_type_display = serializers.ReadOnlyField(source='get_fuel_type_display')

    class Meta:
        model = Vehicle
        fields = [
            'id', 'registration_number', 'model', 'make', 'year', 'capacity',
            'fuel_type', 'fuel_type_display', 'status', 'status_display',
            'driver', 'driver_name', 'insurance_expiry', 'fitness_expiry',
            'permit_expiry', 'last_service_date', 'next_service_date',
            'mileage', 'fuel_efficiency', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DriverSerializer(serializers.ModelSerializer):
    """
    Serializer for Driver model.
    """
    vehicle_count = serializers.ReadOnlyField()
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = Driver
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'address',
            'license_number', 'license_type', 'license_expiry', 'status',
            'status_display', 'experience_years', 'emergency_contact',
            'emergency_phone', 'medical_certificate_expiry', 'background_check_date',
            'school', 'vehicle_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'vehicle_count']


class RouteStopSerializer(serializers.ModelSerializer):
    """
    Serializer for RouteStop model.
    """
    class Meta:
        model = RouteStop
        fields = [
            'id', 'route', 'name', 'address', 'latitude', 'longitude',
            'stop_order', 'pickup_time', 'drop_time', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RouteSerializer(serializers.ModelSerializer):
    """
    Serializer for Route model.
    """
    stops = RouteStopSerializer(many=True, read_only=True)
    vehicle_count = serializers.ReadOnlyField()
    student_count = serializers.ReadOnlyField()

    class Meta:
        model = Route
        fields = [
            'id', 'name', 'description', 'start_location', 'end_location',
            'distance_km', 'estimated_duration', 'vehicle', 'driver',
            'status', 'stops', 'vehicle_count', 'student_count',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'vehicle_count', 'student_count']


class TransportAssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportAssignment model.
    """
    vehicle_registration = serializers.ReadOnlyField(source='vehicle.registration_number')
    driver_name = serializers.ReadOnlyField(source='driver.get_full_name')
    route_name = serializers.ReadOnlyField(source='route.name')

    class Meta:
        model = TransportAssignment
        fields = [
            'id', 'vehicle', 'vehicle_registration', 'driver', 'driver_name',
            'route', 'route_name', 'assignment_date', 'status', 'notes',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentTransportSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentTransport model.
    """
    student_name = serializers.ReadOnlyField(source='student.get_full_name')
    route_name = serializers.ReadOnlyField(source='route.name')
    vehicle_registration = serializers.ReadOnlyField(source='vehicle.registration_number')
    driver_name = serializers.ReadOnlyField(source='driver.get_full_name')
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = StudentTransport
        fields = [
            'id', 'student', 'student_name', 'route', 'route_name',
            'vehicle', 'vehicle_registration', 'driver', 'driver_name',
            'pickup_stop', 'drop_stop', 'pickup_time', 'drop_time',
            'status', 'status_display', 'start_date', 'end_date',
            'fee_amount', 'payment_status', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransportTrackingSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportTracking model.
    """
    vehicle_registration = serializers.ReadOnlyField(source='vehicle.registration_number')
    driver_name = serializers.ReadOnlyField(source='driver.get_full_name')

    class Meta:
        model = TransportTracking
        fields = [
            'id', 'vehicle', 'vehicle_registration', 'driver', 'driver_name',
            'route', 'latitude', 'longitude', 'speed', 'heading', 'timestamp',
            'status', 'school', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TransportIncidentSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportIncident model.
    """
    vehicle_registration = serializers.ReadOnlyField(source='vehicle.registration_number')
    driver_name = serializers.ReadOnlyField(source='driver.get_full_name')
    severity_display = serializers.ReadOnlyField(source='get_severity_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = TransportIncident
        fields = [
            'id', 'vehicle', 'vehicle_registration', 'driver', 'driver_name',
            'route', 'incident_type', 'description', 'location', 'latitude',
            'longitude', 'severity', 'severity_display', 'status', 'status_display',
            'incident_date', 'reported_date', 'resolved_date', 'resolution_notes',
            'involved_students', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransportSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportSettings model.
    """
    school_name = serializers.ReadOnlyField(source='school.name')

    class Meta:
        model = TransportSettings
        fields = [
            'id', 'school', 'school_name', 'enable_tracking', 'tracking_interval',
            'max_route_distance', 'max_students_per_vehicle', 'safety_check_interval',
            'maintenance_reminder_days', 'insurance_reminder_days', 'license_reminder_days',
            'enable_notifications', 'notification_recipients', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RouteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating routes with stops.
    """
    stops = RouteStopSerializer(many=True)

    class Meta:
        model = Route
        fields = [
            'name', 'description', 'start_location', 'end_location',
            'distance_km', 'estimated_duration', 'vehicle', 'driver', 'stops'
        ]

    def create(self, validated_data):
        stops_data = validated_data.pop('stops')
        route = Route.objects.create(**validated_data)
        
        for stop_data in stops_data:
            RouteStop.objects.create(route=route, **stop_data)
        
        return route


class StudentTransportCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating student transport assignments.
    """
    class Meta:
        model = StudentTransport
        fields = [
            'student', 'route', 'pickup_stop', 'drop_stop',
            'pickup_time', 'drop_time', 'start_date', 'end_date', 'fee_amount'
        ]

    def create(self, validated_data):
        # Auto-assign vehicle and driver from route
        route = validated_data['route']
        validated_data['vehicle'] = route.vehicle
        validated_data['driver'] = route.driver
        return super().create(validated_data) 