"""
Serializers for communication models.
"""
from rest_framework import serializers
from .models import (
    Message, MessageThread, MessageThreadParticipant, ThreadMessage,
    Announcement, AnnouncementConfirmation, AnnouncementComment,
    CommunicationTemplate, CommunicationLog, CommunicationSettings
)


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for Message model.
    """
    sender_name = serializers.ReadOnlyField(source='sender.get_full_name')
    recipient_name = serializers.ReadOnlyField(source='recipient.get_full_name')
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'subject', 'content', 'message_type', 'priority', 'status',
            'status_display', 'read_at', 'archived', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'read_at']


class MessageThreadParticipantSerializer(serializers.ModelSerializer):
    """
    Serializer for MessageThreadParticipant model.
    """
    participant_name = serializers.ReadOnlyField(source='participant.get_full_name')
    role_display = serializers.ReadOnlyField(source='get_role_display')

    class Meta:
        model = MessageThreadParticipant
        fields = [
            'id', 'thread', 'participant', 'participant_name', 'role',
            'role_display', 'joined_at', 'left_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'joined_at', 'created_at', 'updated_at']


class ThreadMessageSerializer(serializers.ModelSerializer):
    """
    Serializer for ThreadMessage model.
    """
    sender_name = serializers.ReadOnlyField(source='sender.get_full_name')
    is_edited = serializers.ReadOnlyField()

    class Meta:
        model = ThreadMessage
        fields = [
            'id', 'thread', 'sender', 'sender_name', 'content', 'message_type',
            'is_edited', 'edited_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_edited', 'edited_at']


class MessageThreadSerializer(serializers.ModelSerializer):
    """
    Serializer for MessageThread model.
    """
    participants = MessageThreadParticipantSerializer(many=True, read_only=True)
    last_message = ThreadMessageSerializer(read_only=True)
    participant_count = serializers.ReadOnlyField()
    unread_count = serializers.ReadOnlyField()

    class Meta:
        model = MessageThread
        fields = [
            'id', 'title', 'description', 'thread_type', 'participants',
            'last_message', 'participant_count', 'unread_count', 'is_active',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'participant_count', 'unread_count']


class AnnouncementCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for AnnouncementComment model.
    """
    author_name = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = AnnouncementComment
        fields = [
            'id', 'announcement', 'author', 'author_name', 'content',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AnnouncementConfirmationSerializer(serializers.ModelSerializer):
    """
    Serializer for AnnouncementConfirmation model.
    """
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = AnnouncementConfirmation
        fields = [
            'id', 'announcement', 'user', 'user_name', 'confirmed_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'confirmed_at', 'created_at', 'updated_at']


class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer for Announcement model.
    """
    author_name = serializers.ReadOnlyField(source='author.get_full_name')
    priority_display = serializers.ReadOnlyField(source='get_priority_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    comments = AnnouncementCommentSerializer(many=True, read_only=True)
    confirmations = AnnouncementConfirmationSerializer(many=True, read_only=True)
    comment_count = serializers.ReadOnlyField()
    confirmation_count = serializers.ReadOnlyField()
    is_confirmed_by_user = serializers.ReadOnlyField()

    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'author', 'author_name', 'priority',
            'priority_display', 'status', 'status_display', 'target_audience',
            'publish_date', 'expiry_date', 'requires_confirmation',
            'comments', 'confirmations', 'comment_count', 'confirmation_count',
            'is_confirmed_by_user', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'comment_count', 'confirmation_count',
            'is_confirmed_by_user'
        ]


class CommunicationTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for CommunicationTemplate model.
    """
    template_type_display = serializers.ReadOnlyField(source='get_template_type_display')

    class Meta:
        model = CommunicationTemplate
        fields = [
            'id', 'name', 'template_type', 'template_type_display', 'subject',
            'content', 'variables', 'is_active', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CommunicationLogSerializer(serializers.ModelSerializer):
    """
    Serializer for CommunicationLog model.
    """
    sender_name = serializers.ReadOnlyField(source='sender.get_full_name')
    recipient_name = serializers.ReadOnlyField(source='recipient.get_full_name')
    communication_type_display = serializers.ReadOnlyField(source='get_communication_type_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = CommunicationLog
        fields = [
            'id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'communication_type', 'communication_type_display', 'subject',
            'content', 'status', 'status_display', 'sent_at', 'delivered_at',
            'read_at', 'error_message', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'sent_at', 'delivered_at', 'read_at']


class CommunicationSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for CommunicationSettings model.
    """
    school_name = serializers.ReadOnlyField(source='school.name')

    class Meta:
        model = CommunicationSettings
        fields = [
            'id', 'school', 'school_name', 'enable_email_notifications',
            'enable_sms_notifications', 'enable_push_notifications',
            'email_sender_name', 'email_sender_address', 'smtp_host',
            'smtp_port', 'smtp_username', 'smtp_password', 'smtp_use_tls',
            'sms_provider', 'sms_api_key', 'sms_api_secret',
            'notification_retention_days', 'max_attachment_size',
            'allowed_file_types', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MessageCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating messages.
    """
    class Meta:
        model = Message
        fields = ['recipient', 'subject', 'content', 'message_type', 'priority']


class ThreadMessageCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating thread messages.
    """
    class Meta:
        model = ThreadMessage
        fields = ['content', 'message_type']


class AnnouncementCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating announcements.
    """
    class Meta:
        model = Announcement
        fields = [
            'title', 'content', 'priority', 'target_audience',
            'publish_date', 'expiry_date', 'requires_confirmation'
        ]


class AnnouncementCommentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating announcement comments.
    """
    class Meta:
        model = AnnouncementComment
        fields = ['content']


class MessageThreadCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating message threads.
    """
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        help_text="List of user IDs to add as participants"
    )

    class Meta:
        model = MessageThread
        fields = ['title', 'description', 'thread_type', 'participant_ids']

    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids')
        thread = MessageThread.objects.create(**validated_data)
        
        # Add participants
        for user_id in participant_ids:
            MessageThreadParticipant.objects.create(
                thread=thread,
                participant_id=user_id
            )
        
        return thread 