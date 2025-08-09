"""
Serializers for core models.
"""
from rest_framework import serializers
from .models import Tenant, Notification, SystemSettings


class TenantSerializer(serializers.ModelSerializer):
    """
    Serializer for Tenant model.
    """
    full_domain = serializers.ReadOnlyField()
    
    class Meta:
        model = Tenant
        fields = [
            'id', 'name', 'subdomain', 'domain', 'database_name',
            'is_active', 'created_by', 'school_name', 'school_address',
            'school_phone', 'school_email', 'school_website',
            'subscription_plan', 'subscription_status', 'subscription_expires',
            'timezone', 'language', 'currency', 'full_domain',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'full_domain']


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model.
    """
    class Meta:
        model = Notification
        fields = [
            'id', 'tenant', 'user', 'title', 'message',
            'notification_type', 'is_read', 'read_at', 'data',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SystemSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for SystemSettings model.
    """
    class Meta:
        model = SystemSettings
        fields = [
            'id', 'key', 'value', 'description', 'is_public',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 