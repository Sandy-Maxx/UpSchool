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
    Serializer for Vehicle model aligned with current fields.
    """
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = Vehicle
        fields = [
            'id', 'vehicle_number', 'registration_number', 'make', 'model', 'year',
            'vehicle_type', 'capacity', 'color', 'fuel_type', 'status', 'status_display',
            'insurance_expiry', 'permit_expiry', 'fitness_expiry', 'school',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DriverSerializer(serializers.ModelSerializer):
    """
    Serializer for Driver model. Exposes basic user info via related user.
    """
    full_name = serializers.ReadOnlyField(source='user.get_full_name')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Driver
        fields = [
            'id', 'user', 'full_name', 'email', 'driver_id', 'license_number',
            'license_type', 'license_expiry', 'experience_years', 'status',
            'emergency_contact', 'emergency_contact_name', 'school',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'full_name', 'email']


class RouteStopSerializer(serializers.ModelSerializer):
    """
    Serializer for RouteStop model aligned with current fields.
    """
    class Meta:
        model = RouteStop
        fields = [
            'id', 'route', 'stop_name', 'stop_address', 'sequence_order',
            'arrival_time', 'departure_time', 'latitude', 'longitude',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RouteSerializer(serializers.ModelSerializer):
    """
    Serializer for Route model aligned with current fields.
    """
    stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = [
            'id', 'route_number', 'route_name', 'description', 'start_location',
            'end_location', 'distance_km', 'estimated_duration_minutes',
            'departure_time', 'arrival_time', 'status', 'stops', 'school',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransportAssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportAssignment model.
    """
    vehicle_registration = serializers.ReadOnlyField(source='vehicle.registration_number')
    driver_name = serializers.ReadOnlyField(source='driver.user.get_full_name')
    route_number = serializers.ReadOnlyField(source='route.route_number')

    class Meta:
        model = TransportAssignment
        fields = [
            'id', 'vehicle', 'vehicle_registration', 'driver', 'driver_name',
            'route', 'route_number', 'assignment_date', 'status', 'notes',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentTransportSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentTransport model aligned with current fields.
    """
    student_name = serializers.ReadOnlyField(source='student.user.get_full_name')
    route_number = serializers.ReadOnlyField(source='route.route_number')
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = StudentTransport
        fields = [
            'id', 'student', 'student_name', 'route', 'route_number',
            'pickup_stop', 'dropoff_stop', 'status', 'status_display',
            'transport_fee', 'fee_frequency', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransportTrackingSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportTracking model aligned with current fields.
    """
    route_number = serializers.ReadOnlyField(source='assignment.route.route_number')
    vehicle_registration = serializers.ReadOnlyField(source='assignment.vehicle.registration_number')
    driver_name = serializers.ReadOnlyField(source='assignment.driver.user.get_full_name')

    class Meta:
        model = TransportTracking
        fields = [
            'id', 'assignment', 'tracking_date', 'status',
            'actual_departure_time', 'actual_arrival_time',
            'current_latitude', 'current_longitude', 'current_location',
            'delay_minutes', 'notes', 'route_number', 'vehicle_registration',
            'driver_name', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'route_number', 'vehicle_registration', 'driver_name']


class TransportIncidentSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportIncident model aligned with current fields.
    """
    route_number = serializers.ReadOnlyField(source='assignment.route.route_number')
    vehicle_registration = serializers.ReadOnlyField(source='assignment.vehicle.registration_number')
    driver_name = serializers.ReadOnlyField(source='assignment.driver.user.get_full_name')

    class Meta:
        model = TransportIncident
        fields = [
            'id', 'assignment', 'incident_type', 'severity', 'title', 'description',
            'incident_date', 'incident_time', 'location', 'latitude', 'longitude',
            'resolved', 'resolution_notes', 'resolved_by', 'resolved_at',
            'route_number', 'vehicle_registration', 'driver_name',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'route_number', 'vehicle_registration', 'driver_name']


class TransportSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for TransportSettings model aligned with current fields.
    """
    school_name = serializers.ReadOnlyField(source='school.name')

    class Meta:
        model = TransportSettings
        fields = [
            'id', 'school', 'school_name',
            'enable_gps_tracking', 'tracking_interval_minutes',
            'enable_notifications',
            'max_speed_limit', 'enable_speed_alerts', 'enable_route_deviation_alerts',
            'send_delay_notifications', 'send_arrival_notifications', 'send_incident_notifications',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'school_name']
