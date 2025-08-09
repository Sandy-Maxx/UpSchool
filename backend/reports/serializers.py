"""
Serializers for reports and analytics models.
"""
from rest_framework import serializers
from .models import (
    Report, Dashboard, Widget, AnalyticsEvent, AnalyticsMetric,
    DataExport, ReportSchedule, ReportTemplate, ReportsSettings
)


class WidgetSerializer(serializers.ModelSerializer):
    """
    Serializer for Widget model.
    """
    widget_type_display = serializers.ReadOnlyField(source='get_widget_type_display')
    data_source_display = serializers.ReadOnlyField(source='get_data_source_display')

    class Meta:
        model = Widget
        fields = [
            'id', 'dashboard', 'name', 'description', 'widget_type',
            'widget_type_display', 'data_source', 'data_source_display',
            'config', 'position', 'size', 'is_active', 'refresh_interval',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DashboardSerializer(serializers.ModelSerializer):
    """
    Serializer for Dashboard model.
    """
    widgets = WidgetSerializer(many=True, read_only=True)
    widget_count = serializers.ReadOnlyField()
    owner_name = serializers.ReadOnlyField(source='owner.get_full_name')

    class Meta:
        model = Dashboard
        fields = [
            'id', 'name', 'description', 'owner', 'owner_name', 'is_public',
            'layout', 'theme', 'widgets', 'widget_count', 'is_active',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'widget_count']


class AnalyticsEventSerializer(serializers.ModelSerializer):
    """
    Serializer for AnalyticsEvent model.
    """
    event_type_display = serializers.ReadOnlyField(source='get_event_type_display')
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'event_type', 'event_type_display', 'user', 'user_name',
            'session_id', 'page_url', 'referrer', 'user_agent', 'ip_address',
            'metadata', 'timestamp', 'school', 'created_at'
        ]
        read_only_fields = ['id', 'timestamp', 'created_at']


class AnalyticsMetricSerializer(serializers.ModelSerializer):
    """
    Serializer for AnalyticsMetric model.
    """
    metric_type_display = serializers.ReadOnlyField(source='get_metric_type_display')

    class Meta:
        model = AnalyticsMetric
        fields = [
            'id', 'name', 'description', 'metric_type', 'metric_type_display',
            'calculation_method', 'data_source', 'filters', 'aggregation_period',
            'target_value', 'alert_threshold', 'is_active', 'school',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DataExportSerializer(serializers.ModelSerializer):
    """
    Serializer for DataExport model.
    """
    export_type_display = serializers.ReadOnlyField(source='get_export_type_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    format_display = serializers.ReadOnlyField(source='get_format_display')
    requested_by_name = serializers.ReadOnlyField(source='requested_by.get_full_name')

    class Meta:
        model = DataExport
        fields = [
            'id', 'name', 'description', 'export_type', 'export_type_display',
            'data_source', 'filters', 'format', 'format_display', 'status',
            'status_display', 'requested_by', 'requested_by_name', 'file_path',
            'file_size', 'download_count', 'expires_at', 'school',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'file_path', 'file_size',
            'download_count'
        ]


class ReportScheduleSerializer(serializers.ModelSerializer):
    """
    Serializer for ReportSchedule model.
    """
    frequency_display = serializers.ReadOnlyField(source='get_frequency_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = ReportSchedule
        fields = [
            'id', 'name', 'description', 'report', 'frequency', 'frequency_display',
            'schedule_config', 'recipients', 'delivery_method', 'status',
            'status_display', 'last_run', 'next_run', 'created_by', 'created_by_name',
            'is_active', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_run', 'next_run']


class ReportTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for ReportTemplate model.
    """
    template_type_display = serializers.ReadOnlyField(source='get_template_type_display')
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = ReportTemplate
        fields = [
            'id', 'name', 'description', 'template_type', 'template_type_display',
            'content', 'variables', 'styles', 'is_default', 'created_by',
            'created_by_name', 'is_active', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer for Report model.
    """
    report_type_display = serializers.ReadOnlyField(source='get_report_type_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')
    template_name = serializers.ReadOnlyField(source='template.name')

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'report_type', 'report_type_display',
            'template', 'template_name', 'data_source', 'filters', 'parameters',
            'output_format', 'status', 'status_display', 'generated_at',
            'file_path', 'file_size', 'download_count', 'created_by',
            'created_by_name', 'is_public', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'generated_at', 'file_path',
            'file_size', 'download_count'
        ]


class ReportsSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for ReportsSettings model.
    """
    school_name = serializers.ReadOnlyField(source='school.name')

    class Meta:
        model = ReportsSettings
        fields = [
            'id', 'school', 'school_name', 'enable_analytics', 'data_retention_days',
            'max_export_size', 'allowed_export_formats', 'enable_scheduled_reports',
            'max_scheduled_reports', 'report_storage_path', 'enable_email_reports',
            'default_report_template', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReportCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating reports.
    """
    class Meta:
        model = Report
        fields = [
            'name', 'description', 'report_type', 'template', 'data_source',
            'filters', 'parameters', 'output_format', 'is_public'
        ]


class DashboardCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating dashboards.
    """
    class Meta:
        model = Dashboard
        fields = ['name', 'description', 'is_public', 'layout', 'theme']


class WidgetCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating widgets.
    """
    class Meta:
        model = Widget
        fields = [
            'name', 'description', 'widget_type', 'data_source', 'config',
            'position', 'size', 'refresh_interval'
        ]


class DataExportCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating data exports.
    """
    class Meta:
        model = DataExport
        fields = [
            'name', 'description', 'export_type', 'data_source', 'filters',
            'format'
        ]


class ReportScheduleCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating report schedules.
    """
    class Meta:
        model = ReportSchedule
        fields = [
            'name', 'description', 'report', 'frequency', 'schedule_config',
            'recipients', 'delivery_method'
        ]


class AnalyticsEventCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating analytics events.
    """
    class Meta:
        model = AnalyticsEvent
        fields = [
            'event_type', 'session_id', 'page_url', 'referrer', 'user_agent',
            'ip_address', 'metadata'
        ]


class DashboardWidgetSerializer(serializers.ModelSerializer):
    """
    Serializer for dashboard with widgets for detailed view.
    """
    widgets = WidgetSerializer(many=True, read_only=True)
    owner_name = serializers.ReadOnlyField(source='owner.get_full_name')

    class Meta:
        model = Dashboard
        fields = [
            'id', 'name', 'description', 'owner', 'owner_name', 'is_public',
            'layout', 'theme', 'widgets', 'is_active', 'school',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 