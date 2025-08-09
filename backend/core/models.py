"""
Core models for the school platform.
"""
from django.conf import settings
from django.db import models
from django.utils import timezone
import uuid


class BaseModel(models.Model):
    """
    Abstract base model with common fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Tenant(BaseModel):
    """
    Tenant model for multi-tenancy.
    """
    name = models.CharField(max_length=255)
    subdomain = models.CharField(max_length=255, unique=True)
    domain = models.CharField(max_length=255, blank=True)
    database_name = models.CharField(max_length=255, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='created_tenants'
    )
    
    # School specific fields
    school_name = models.CharField(max_length=255)
    school_type = models.CharField(max_length=100, blank=True, help_text="Type of educational institution")
    school_address = models.TextField(blank=True)
    school_city = models.CharField(max_length=100, blank=True)
    school_state = models.CharField(max_length=100, blank=True, help_text="State/Province")
    school_postal_code = models.CharField(max_length=20, blank=True)
    school_country = models.CharField(max_length=100, blank=True)
    school_phone = models.CharField(max_length=20, blank=True)
    school_email = models.EmailField(blank=True)
    school_website = models.URLField(blank=True)
    
    # Capacity and demographics
    student_count_range = models.CharField(max_length=50, blank=True, help_text="Expected number of students")
    staff_count_range = models.CharField(max_length=50, blank=True, help_text="Expected number of staff")
    
    # Academic details
    academic_year_start = models.CharField(max_length=20, blank=True, default='September', help_text="Month when academic year starts")
    grade_system = models.CharField(max_length=50, blank=True, default='K-12', help_text="Grade system used")
    
    # Subscription details
    subscription_plan = models.CharField(max_length=50, default='basic')
    subscription_status = models.CharField(max_length=20, default='active')
    subscription_expires = models.DateTimeField(null=True, blank=True)
    trial_ends_at = models.DateTimeField(null=True, blank=True, help_text="When free trial expires")
    
    # Marketing and communication preferences
    marketing_emails_consent = models.BooleanField(default=False, help_text="Consent to receive marketing emails")
    newsletter_subscription = models.BooleanField(default=False)
    
    # Onboarding and setup tracking
    onboarding_completed = models.BooleanField(default=False)
    setup_wizard_completed = models.BooleanField(default=False)
    first_login_at = models.DateTimeField(null=True, blank=True)
    
    # Settings
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    currency = models.CharField(max_length=3, default='USD')

    class Meta:
        db_table = 'tenants'

    def __str__(self):
        return f"{self.name} ({self.subdomain})"

    @property
    def full_domain(self):
        """Get the full domain for the tenant."""
        if self.domain:
            return f"{self.subdomain}.{self.domain}"
        return f"{self.subdomain}.schoolplatform.com"


class AuditLog(BaseModel):
    """
    Audit log for tracking changes across the platform.
    """
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    action = models.CharField(max_length=50)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=255)
    object_repr = models.CharField(max_length=255)
    changes = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} on {self.model_name} by {self.user}"


class SystemSettings(BaseModel):
    """
    System-wide settings.
    """
    key = models.CharField(max_length=255, unique=True)
    value = models.JSONField()
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)

    class Meta:
        db_table = 'system_settings'

    def __str__(self):
        return self.key


class Notification(BaseModel):
    """
    System notifications.
    """
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='info')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    data = models.JSONField(default=dict)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user}"

    def mark_as_read(self):
        """Mark notification as read."""
        self.is_read = True
        self.read_at = timezone.now()
        self.save() 