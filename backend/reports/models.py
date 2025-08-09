"""
Reports and analytics models.
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from core.models import BaseModel


class Report(BaseModel):
    """
    Report model for generating various reports.
    """
    REPORT_TYPE_CHOICES = [
        ('academic', 'Academic'),
        ('financial', 'Financial'),
        ('attendance', 'Attendance'),
        ('transport', 'Transport'),
        ('library', 'Library'),
        ('communication', 'Communication'),
        ('custom', 'Custom'),
    ]

    REPORT_FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
        ('json', 'JSON'),
        ('html', 'HTML'),
    ]

    REPORT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    format = models.CharField(max_length=10, choices=REPORT_FORMAT_CHOICES, default='pdf')
    
    # Report parameters
    parameters = models.JSONField(default=dict)  # Report filters and parameters
    date_range_start = models.DateField(null=True, blank=True)
    date_range_end = models.DateField(null=True, blank=True)
    
    # Report generation
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default='pending')
    generated_at = models.DateTimeField(null=True, blank=True)
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    
    # Report settings
    is_scheduled = models.BooleanField(default=False)
    schedule_frequency = models.CharField(max_length=20, blank=True)  # daily, weekly, monthly
    next_schedule = models.DateTimeField(null=True, blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_report_type_display()})"


class Dashboard(BaseModel):
    """
    Dashboard model for custom dashboards.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    layout = models.JSONField(default=dict)  # Dashboard layout configuration
    widgets = models.JSONField(default=list)  # Dashboard widgets configuration
    
    # Dashboard settings
    is_default = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    refresh_interval = models.PositiveIntegerField(default=300)  # seconds
    
    # Access control
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    shared_with = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='shared_dashboards')
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'dashboards'
        ordering = ['name']

    def __str__(self):
        return self.name


class Widget(BaseModel):
    """
    Widget model for dashboard widgets.
    """
    WIDGET_TYPE_CHOICES = [
        ('chart', 'Chart'),
        ('table', 'Table'),
        ('metric', 'Metric'),
        ('gauge', 'Gauge'),
        ('map', 'Map'),
        ('list', 'List'),
        ('custom', 'Custom'),
    ]

    CHART_TYPE_CHOICES = [
        ('line', 'Line Chart'),
        ('bar', 'Bar Chart'),
        ('pie', 'Pie Chart'),
        ('doughnut', 'Doughnut Chart'),
        ('area', 'Area Chart'),
        ('scatter', 'Scatter Plot'),
        ('heatmap', 'Heatmap'),
    ]

    name = models.CharField(max_length=255)
    widget_type = models.CharField(max_length=20, choices=WIDGET_TYPE_CHOICES)
    chart_type = models.CharField(max_length=20, choices=CHART_TYPE_CHOICES, blank=True)
    
    # Widget configuration
    configuration = models.JSONField(default=dict)  # Widget-specific configuration
    data_source = models.CharField(max_length=255)  # Data source query or API endpoint
    refresh_interval = models.PositiveIntegerField(default=300)  # seconds
    
    # Widget settings
    is_active = models.BooleanField(default=True)
    position_x = models.PositiveIntegerField(default=0)
    position_y = models.PositiveIntegerField(default=0)
    width = models.PositiveIntegerField(default=6)
    height = models.PositiveIntegerField(default=4)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'widgets'
        ordering = ['name']

    def __str__(self):
        return self.name


class AnalyticsEvent(BaseModel):
    """
    Analytics event model for tracking user actions.
    """
    EVENT_TYPE_CHOICES = [
        ('page_view', 'Page View'),
        ('button_click', 'Button Click'),
        ('form_submit', 'Form Submit'),
        ('file_download', 'File Download'),
        ('api_call', 'API Call'),
        ('error', 'Error'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('search', 'Search'),
        ('custom', 'Custom'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    event_name = models.CharField(max_length=255)
    event_data = models.JSONField(default=dict)  # Additional event data
    
    # Event context
    page_url = models.CharField(max_length=500, blank=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    session_id = models.CharField(max_length=255, blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'analytics_events'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event_type}: {self.event_name} by {self.user.get_full_name()}"


class AnalyticsMetric(BaseModel):
    """
    Analytics metric model for storing calculated metrics.
    """
    METRIC_TYPE_CHOICES = [
        ('count', 'Count'),
        ('sum', 'Sum'),
        ('average', 'Average'),
        ('percentage', 'Percentage'),
        ('ratio', 'Ratio'),
        ('custom', 'Custom'),
    ]

    name = models.CharField(max_length=255)
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPE_CHOICES)
    value = models.DecimalField(max_digits=15, decimal_places=4)
    unit = models.CharField(max_length=50, blank=True)
    
    # Metric context
    category = models.CharField(max_length=100, blank=True)
    subcategory = models.CharField(max_length=100, blank=True)
    date = models.DateField()
    
    # Additional data
    metadata = models.JSONField(default=dict)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'analytics_metrics'
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.name}: {self.value} {self.unit}"


class DataExport(BaseModel):
    """
    Data export model for exporting data.
    """
    EXPORT_TYPE_CHOICES = [
        ('students', 'Students'),
        ('teachers', 'Teachers'),
        ('attendance', 'Attendance'),
        ('grades', 'Grades'),
        ('fees', 'Fees'),
        ('transport', 'Transport'),
        ('library', 'Library'),
        ('custom', 'Custom'),
    ]

    EXPORT_FORMAT_CHOICES = [
        ('csv', 'CSV'),
        ('excel', 'Excel'),
        ('json', 'JSON'),
        ('xml', 'XML'),
    ]

    EXPORT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    name = models.CharField(max_length=255)
    export_type = models.CharField(max_length=20, choices=EXPORT_TYPE_CHOICES)
    format = models.CharField(max_length=10, choices=EXPORT_FORMAT_CHOICES, default='csv')
    
    # Export parameters
    filters = models.JSONField(default=dict)  # Export filters
    columns = models.JSONField(default=list)  # Columns to include
    date_range_start = models.DateField(null=True, blank=True)
    date_range_end = models.DateField(null=True, blank=True)
    
    # Export generation
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=EXPORT_STATUS_CHOICES, default='pending')
    generated_at = models.DateTimeField(null=True, blank=True)
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    
    # Export settings
    is_scheduled = models.BooleanField(default=False)
    schedule_frequency = models.CharField(max_length=20, blank=True)
    next_schedule = models.DateTimeField(null=True, blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'data_exports'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_export_type_display()})"


class ReportSchedule(BaseModel):
    """
    Report schedule model for automated report generation.
    """
    SCHEDULE_FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
        ('custom', 'Custom'),
    ]

    SCHEDULE_STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('stopped', 'Stopped'),
    ]

    name = models.CharField(max_length=255)
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    frequency = models.CharField(max_length=20, choices=SCHEDULE_FREQUENCY_CHOICES)
    cron_expression = models.CharField(max_length=255, blank=True)  # Custom cron expression
    
    # Schedule settings
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=SCHEDULE_STATUS_CHOICES, default='active')
    
    # Recipients
    recipients = models.JSONField(default=list)  # List of recipient emails
    send_email = models.BooleanField(default=True)
    send_notification = models.BooleanField(default=False)
    
    # Schedule details
    last_run = models.DateTimeField(null=True, blank=True)
    next_run = models.DateTimeField(null=True, blank=True)
    total_runs = models.PositiveIntegerField(default=0)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'report_schedules'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.get_frequency_display()}"


class ReportTemplate(BaseModel):
    """
    Report template model for reusable report configurations.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    report_type = models.CharField(max_length=20, choices=Report.REPORT_TYPE_CHOICES)
    
    # Template configuration
    configuration = models.JSONField(default=dict)  # Template configuration
    default_parameters = models.JSONField(default=dict)  # Default parameters
    default_format = models.CharField(max_length=10, choices=Report.REPORT_FORMAT_CHOICES, default='pdf')
    
    # Template settings
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    # Access control
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    shared_with = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='shared_report_templates')
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'report_templates'
        ordering = ['name']

    def __str__(self):
        return self.name


class ReportsSettings(BaseModel):
    """
    Reports settings model.
    """
    school = models.OneToOneField('schools.School', on_delete=models.CASCADE)
    
    # Report settings
    enable_automated_reports = models.BooleanField(default=True)
    enable_data_exports = models.BooleanField(default=True)
    enable_analytics = models.BooleanField(default=True)
    
    # Storage settings
    max_report_size_mb = models.PositiveIntegerField(default=50)
    report_retention_days = models.PositiveIntegerField(default=90)
    enable_report_archiving = models.BooleanField(default=True)
    
    # Email settings
    enable_report_emailing = models.BooleanField(default=True)
    max_recipients_per_report = models.PositiveIntegerField(default=10)
    
    # Dashboard settings
    enable_custom_dashboards = models.BooleanField(default=True)
    max_widgets_per_dashboard = models.PositiveIntegerField(default=20)
    default_dashboard_refresh_interval = models.PositiveIntegerField(default=300)

    class Meta:
        db_table = 'reports_settings'
        verbose_name_plural = 'Reports Settings'

    def __str__(self):
        return f"Reports Settings - {self.school.name}" 