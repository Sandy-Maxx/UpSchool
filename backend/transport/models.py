"""
Transport models for school transport management.
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from core.models import BaseModel


class Vehicle(BaseModel):
    """
    Vehicle model for transport management.
    """
    VEHICLE_TYPE_CHOICES = [
        ('bus', 'Bus'),
        ('van', 'Van'),
        ('car', 'Car'),
        ('minibus', 'Minibus'),
    ]

    VEHICLE_STATUS_CHOICES = [
        ('active', 'Active'),
        ('maintenance', 'Under Maintenance'),
        ('inactive', 'Inactive'),
        ('retired', 'Retired'),
    ]

    vehicle_number = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    registration_number = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=VEHICLE_STATUS_CHOICES, default='active')
    
    # Vehicle details
    color = models.CharField(max_length=50, blank=True)
    fuel_type = models.CharField(max_length=20, default='Diesel')  # Diesel, Petrol, Electric, Hybrid
    insurance_expiry = models.DateField()
    permit_expiry = models.DateField()
    fitness_expiry = models.DateField()
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'vehicles'
        ordering = ['vehicle_number']

    def __str__(self):
        return f"{self.vehicle_number} - {self.make} {self.model}"


class Driver(BaseModel):
    """
    Driver model for transport management.
    """
    DRIVER_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
        ('retired', 'Retired'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    driver_id = models.CharField(max_length=20, unique=True)
    license_number = models.CharField(max_length=20)
    license_type = models.CharField(max_length=20)  # Light, Heavy, Commercial
    license_expiry = models.DateField()
    experience_years = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=DRIVER_STATUS_CHOICES, default='active')
    
    # Contact details
    emergency_contact = models.CharField(max_length=20, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'drivers'
        ordering = ['driver_id']

    def __str__(self):
        return f"{self.driver_id} - {self.user.get_full_name()}"


class Route(BaseModel):
    """
    Route model for transport management.
    """
    ROUTE_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]

    route_number = models.CharField(max_length=20, unique=True)
    route_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=ROUTE_STATUS_CHOICES, default='active')
    
    # Route details
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    distance_km = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    estimated_duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    
    # Schedule
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'routes'
        ordering = ['route_number']

    def __str__(self):
        return f"{self.route_number} - {self.route_name}"


class RouteStop(BaseModel):
    """
    Route stop model for transport management.
    """
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='stops')
    stop_name = models.CharField(max_length=255)
    stop_address = models.TextField()
    sequence_order = models.PositiveIntegerField()
    arrival_time = models.TimeField()
    departure_time = models.TimeField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        db_table = 'route_stops'
        ordering = ['route', 'sequence_order']
        unique_together = ['route', 'sequence_order']

    def __str__(self):
        return f"{self.route.route_number} - {self.stop_name}"


class TransportAssignment(BaseModel):
    """
    Transport assignment model.
    """
    ASSIGNMENT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='transport_assignments_created'
    )
    
    # Assignment details
    assignment_date = models.DateField()
    status = models.CharField(max_length=20, choices=ASSIGNMENT_STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'transport_assignments'
        ordering = ['-assignment_date']

    def __str__(self):
        return f"{self.route.route_number} - {self.vehicle.vehicle_number} - {self.driver.driver_id}"


class StudentTransport(BaseModel):
    """
    Student transport assignment model.
    """
    TRANSPORT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]

    student = models.ForeignKey('schools.Student', on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    pickup_stop = models.ForeignKey(RouteStop, on_delete=models.CASCADE, related_name='pickup_students')
    dropoff_stop = models.ForeignKey(RouteStop, on_delete=models.CASCADE, related_name='dropoff_students')
    status = models.CharField(max_length=20, choices=TRANSPORT_STATUS_CHOICES, default='active')
    
    # Fee details
    transport_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fee_frequency = models.CharField(max_length=20, default='monthly')  # monthly, quarterly, yearly
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'student_transport'
        unique_together = ['student', 'route']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.route.route_number}"


class TransportTracking(BaseModel):
    """
    Transport tracking model for real-time tracking.
    """
    TRACKING_STATUS_CHOICES = [
        ('started', 'Started'),
        ('in_transit', 'In Transit'),
        ('completed', 'Completed'),
        ('delayed', 'Delayed'),
        ('cancelled', 'Cancelled'),
    ]

    assignment = models.ForeignKey(TransportAssignment, on_delete=models.CASCADE)
    tracking_date = models.DateField()
    status = models.CharField(max_length=20, choices=TRACKING_STATUS_CHOICES, default='started')
    
    # Timing
    actual_departure_time = models.TimeField(null=True, blank=True)
    actual_arrival_time = models.TimeField(null=True, blank=True)
    
    # Location tracking
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_location = models.CharField(max_length=255, blank=True)
    
    # Additional details
    delay_minutes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'transport_tracking'
        ordering = ['-tracking_date', '-created_at']

    def __str__(self):
        return f"{self.assignment.route.route_number} - {self.tracking_date}"


class TransportIncident(BaseModel):
    """
    Transport incident model.
    """
    INCIDENT_TYPE_CHOICES = [
        ('accident', 'Accident'),
        ('breakdown', 'Vehicle Breakdown'),
        ('delay', 'Delay'),
        ('weather', 'Weather Related'),
        ('traffic', 'Traffic Jam'),
        ('other', 'Other'),
    ]

    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    assignment = models.ForeignKey(TransportAssignment, on_delete=models.CASCADE)
    incident_type = models.CharField(max_length=20, choices=INCIDENT_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Incident details
    incident_date = models.DateField()
    incident_time = models.TimeField()
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Resolution
    resolved = models.BooleanField(default=False)
    resolution_notes = models.TextField(blank=True)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='incidents_resolved'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'transport_incidents'
        ordering = ['-incident_date', '-incident_time']

    def __str__(self):
        return f"{self.title} - {self.assignment.route.route_number}"


class TransportSettings(BaseModel):
    """
    Transport settings model.
    """
    school = models.OneToOneField('schools.School', on_delete=models.CASCADE)
    
    # Tracking settings
    enable_gps_tracking = models.BooleanField(default=True)
    tracking_interval_minutes = models.PositiveIntegerField(default=5)
    enable_notifications = models.BooleanField(default=True)
    
    # Safety settings
    max_speed_limit = models.PositiveIntegerField(default=60)  # km/h
    enable_speed_alerts = models.BooleanField(default=True)
    enable_route_deviation_alerts = models.BooleanField(default=True)
    
    # Communication settings
    send_delay_notifications = models.BooleanField(default=True)
    send_arrival_notifications = models.BooleanField(default=True)
    send_incident_notifications = models.BooleanField(default=True)

    class Meta:
        db_table = 'transport_settings'
        verbose_name_plural = 'Transport Settings'

    def __str__(self):
        return f"Transport Settings - {self.school.name}" 