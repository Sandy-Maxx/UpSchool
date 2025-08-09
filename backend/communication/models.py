"""
Communication models for messaging and announcements.
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from core.models import BaseModel


class Message(BaseModel):
    """
    Message model for internal communication.
    """
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
        ('voice', 'Voice'),
        ('video', 'Video'),
    ]

    MESSAGE_STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('read', 'Read'),
        ('failed', 'Failed'),
    ]

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_messages'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='received_messages'
    )
    
    # Message content
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='text')
    subject = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    attachment = models.FileField(upload_to='message_attachments/', blank=True)
    
    # Message status
    status = models.CharField(max_length=20, choices=MESSAGE_STATUS_CHOICES, default='sent')
    sent_at = models.DateTimeField(default=timezone.now)
    delivered_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Message flags
    is_important = models.BooleanField(default=False)
    is_urgent = models.BooleanField(default=False)
    requires_confirmation = models.BooleanField(default=False)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'messages'
        ordering = ['-sent_at']

    def __str__(self):
        return f"{self.sender.get_full_name()} to {self.recipient.get_full_name()}"


class MessageThread(BaseModel):
    """
    Message thread model for group conversations.
    """
    THREAD_TYPE_CHOICES = [
        ('direct', 'Direct'),
        ('group', 'Group'),
        ('class', 'Class'),
        ('grade', 'Grade'),
        ('school', 'School'),
    ]

    thread_type = models.CharField(max_length=20, choices=THREAD_TYPE_CHOICES)
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, through='MessageThreadParticipant')
    
    # Thread settings
    is_active = models.BooleanField(default=True)
    is_archived = models.BooleanField(default=False)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'message_threads'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_thread_type_display()} - {self.name}"


class MessageThreadParticipant(BaseModel):
    """
    Message thread participant model.
    """
    thread = models.ForeignKey(MessageThread, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(default=timezone.now)
    is_admin = models.BooleanField(default=False)
    is_muted = models.BooleanField(default=False)

    class Meta:
        db_table = 'message_thread_participants'
        unique_together = ['thread', 'user']

    def __str__(self):
        return f"{self.user.get_full_name()} in {self.thread.name}"


class ThreadMessage(BaseModel):
    """
    Thread message model for group conversations.
    """
    thread = models.ForeignKey(MessageThread, on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Message content
    content = models.TextField()
    attachment = models.FileField(upload_to='thread_attachments/', blank=True)
    message_type = models.CharField(max_length=20, choices=Message.MESSAGE_TYPE_CHOICES, default='text')
    
    # Message status
    sent_at = models.DateTimeField(default=timezone.now)
    edited_at = models.DateTimeField(null=True, blank=True)
    is_edited = models.BooleanField(default=False)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'thread_messages'
        ordering = ['sent_at']

    def __str__(self):
        return f"{self.sender.get_full_name()} in {self.thread.name}"


class Announcement(BaseModel):
    """
    Announcement model for school-wide communications.
    """
    ANNOUNCEMENT_TYPE_CHOICES = [
        ('general', 'General'),
        ('academic', 'Academic'),
        ('event', 'Event'),
        ('emergency', 'Emergency'),
        ('holiday', 'Holiday'),
        ('exam', 'Exam'),
        ('sports', 'Sports'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    announcement_type = models.CharField(max_length=20, choices=ANNOUNCEMENT_TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    
    # Publishing details
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    published_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Target audience
    target_grades = models.ManyToManyField('schools.Grade', blank=True)
    target_classes = models.ManyToManyField('schools.Class', blank=True)
    target_users = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='targeted_announcements')
    
    # Announcement settings
    is_published = models.BooleanField(default=True)
    requires_confirmation = models.BooleanField(default=False)
    allow_comments = models.BooleanField(default=False)
    
    # Attachments
    attachment = models.FileField(upload_to='announcement_attachments/', blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'announcements'
        ordering = ['-published_at']

    def __str__(self):
        return self.title

    @property
    def is_expired(self):
        """Check if announcement has expired."""
        if self.expires_at and timezone.now() > self.expires_at:
            return True
        return False


class AnnouncementConfirmation(BaseModel):
    """
    Announcement confirmation model.
    """
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    confirmed_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        db_table = 'announcement_confirmations'
        unique_together = ['announcement', 'user']

    def __str__(self):
        return f"{self.user.get_full_name()} confirmed {self.announcement.title}"


class AnnouncementComment(BaseModel):
    """
    Announcement comment model.
    """
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    
    # Comment status
    is_approved = models.BooleanField(default=True)
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'announcement_comments'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.author.get_full_name()} on {self.announcement.title}"


class CommunicationTemplate(BaseModel):
    """
    Communication template model.
    """
    TEMPLATE_TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('notification', 'Notification'),
        ('announcement', 'Announcement'),
    ]

    name = models.CharField(max_length=255)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPE_CHOICES)
    subject = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    variables = models.JSONField(default=dict)  # Template variables
    
    # Template settings
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'communication_templates'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"


class CommunicationLog(BaseModel):
    """
    Communication log model for tracking all communications.
    """
    COMMUNICATION_TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('notification', 'Notification'),
        ('message', 'Message'),
        ('announcement', 'Announcement'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]

    communication_type = models.CharField(max_length=20, choices=COMMUNICATION_TYPE_CHOICES)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_communications'
    )
    
    # Communication details
    subject = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    template = models.ForeignKey(CommunicationTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    # Error tracking
    error_message = models.TextField(blank=True)
    retry_count = models.PositiveIntegerField(default=0)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'communication_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_communication_type_display()} to {self.recipient.get_full_name()}"


class CommunicationSettings(BaseModel):
    """
    Communication settings model.
    """
    school = models.OneToOneField('schools.School', on_delete=models.CASCADE)
    
    # Email settings
    enable_email_notifications = models.BooleanField(default=True)
    email_sender_name = models.CharField(max_length=255, default='School Platform')
    email_sender_address = models.EmailField(blank=True)
    
    # SMS settings
    enable_sms_notifications = models.BooleanField(default=False)
    sms_provider = models.CharField(max_length=50, blank=True)
    sms_api_key = models.CharField(max_length=255, blank=True)
    
    # Notification settings
    enable_push_notifications = models.BooleanField(default=True)
    enable_in_app_notifications = models.BooleanField(default=True)
    
    # Message settings
    enable_direct_messaging = models.BooleanField(default=True)
    enable_group_messaging = models.BooleanField(default=True)
    max_message_length = models.PositiveIntegerField(default=1000)
    
    # Announcement settings
    enable_announcements = models.BooleanField(default=True)
    require_announcement_approval = models.BooleanField(default=False)
    enable_announcement_comments = models.BooleanField(default=True)

    class Meta:
        db_table = 'communication_settings'
        verbose_name_plural = 'Communication Settings'

    def __str__(self):
        return f"Communication Settings - {self.school.name}" 