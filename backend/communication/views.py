"""
Views for communication management.
"""
from django.utils import timezone
from django.db.models import Q, Count, Max
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    Message, MessageThread, MessageThreadParticipant, ThreadMessage,
    Announcement, AnnouncementConfirmation, AnnouncementComment,
    CommunicationTemplate, CommunicationLog, CommunicationSettings
)
from .serializers import (
    MessageSerializer, MessageThreadSerializer, MessageThreadParticipantSerializer,
    ThreadMessageSerializer, AnnouncementSerializer, AnnouncementCommentSerializer,
    AnnouncementConfirmationSerializer, CommunicationTemplateSerializer,
    CommunicationLogSerializer, CommunicationSettingsSerializer,
    MessageCreateSerializer, ThreadMessageCreateSerializer, AnnouncementCreateSerializer,
    AnnouncementCommentCreateSerializer, MessageThreadCreateSerializer
)
from core.permissions import IsTenantUser


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Message model.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'message_type', 'priority', 'sender', 'recipient']
    search_fields = ['subject', 'content', 'sender__first_name', 'recipient__first_name']
    ordering_fields = ['created_at', 'read_at', 'priority']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter messages by tenant and user."""
        user = self.request.user
        if user.is_superuser:
            return Message.objects.all()
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user),
            school__tenant=user.tenant
        )

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return MessageCreateSerializer
        return MessageSerializer

    def perform_create(self, serializer):
        """Set sender and school when creating message."""
        serializer.save(sender=self.request.user, school=self.request.user.school)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark message as read."""
        message = self.get_object()
        if message.recipient == request.user:
            message.status = 'read'
            message.read_at = timezone.now()
            message.save()
            return Response({'message': 'Message marked as read'})
        return Response(
            {'error': 'You can only mark messages sent to you as read'},
            status=status.HTTP_403_FORBIDDEN
        )

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Archive/unarchive message."""
        message = self.get_object()
        message.archived = not message.archived
        message.save()
        return Response({'message': f'Message {"archived" if message.archived else "unarchived"}'})

    @action(detail=False, methods=['get'])
    def inbox(self, request):
        """Get user's inbox messages."""
        inbox_messages = self.get_queryset().filter(
            recipient=request.user,
            archived=False
        ).order_by('-created_at')
        serializer = self.get_serializer(inbox_messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sent(self, request):
        """Get user's sent messages."""
        sent_messages = self.get_queryset().filter(
            sender=request.user
        ).order_by('-created_at')
        serializer = self.get_serializer(sent_messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get user's unread messages."""
        unread_messages = self.get_queryset().filter(
            recipient=request.user,
            status='unread',
            archived=False
        ).order_by('-created_at')
        serializer = self.get_serializer(unread_messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def archived(self, request):
        """Get user's archived messages."""
        archived_messages = self.get_queryset().filter(
            Q(sender=request.user) | Q(recipient=request.user),
            archived=True
        ).order_by('-created_at')
        serializer = self.get_serializer(archived_messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get message statistics for user."""
        user = request.user
        queryset = self.get_queryset()
        
        stats = {
            'total_messages': queryset.count(),
            'inbox_count': queryset.filter(recipient=user, archived=False).count(),
            'sent_count': queryset.filter(sender=user).count(),
            'unread_count': queryset.filter(recipient=user, status='unread', archived=False).count(),
            'archived_count': queryset.filter(
                Q(sender=user) | Q(recipient=user),
                archived=True
            ).count(),
        }
        
        return Response(stats)


class MessageThreadViewSet(viewsets.ModelViewSet):
    """
    ViewSet for MessageThread model.
    """
    serializer_class = MessageThreadSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['thread_type', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-updated_at']

    def get_queryset(self):
        """Filter threads by tenant and user participation."""
        user = self.request.user
        if user.is_superuser:
            return MessageThread.objects.all()
        return MessageThread.objects.filter(
            participant__participant=user,
            school__tenant=user.tenant
        ).distinct()

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return MessageThreadCreateSerializer
        return MessageThreadSerializer

    def perform_create(self, serializer):
        """Set school when creating thread."""
        thread = serializer.save(school=self.request.user.school)
        
        # Add creator as participant
        MessageThreadParticipant.objects.create(
            thread=thread,
            participant=self.request.user,
            role='admin'
        )

    @action(detail=True, methods=['post'])
    def add_participant(self, request, pk=None):
        """Add participant to thread."""
        thread = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'member')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user is already a participant
        existing = MessageThreadParticipant.objects.filter(
            thread=thread,
            participant_id=user_id
        ).first()
        
        if existing:
            return Response(
                {'error': 'User is already a participant'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        MessageThreadParticipant.objects.create(
            thread=thread,
            participant_id=user_id,
            role=role
        )
        
        return Response({'message': 'Participant added successfully'})

    @action(detail=True, methods=['post'])
    def remove_participant(self, request, pk=None):
        """Remove participant from thread."""
        thread = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        participant = MessageThreadParticipant.objects.filter(
            thread=thread,
            participant_id=user_id
        ).first()
        
        if not participant:
            return Response(
                {'error': 'User is not a participant'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        participant.left_at = timezone.now()
        participant.save()
        
        return Response({'message': 'Participant removed successfully'})


class ThreadMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ThreadMessage model.
    """
    serializer_class = ThreadMessageSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['thread', 'sender', 'message_type']
    search_fields = ['content']
    ordering_fields = ['created_at']
    ordering = ['created_at']

    def get_queryset(self):
        """Filter thread messages by tenant and user participation."""
        user = self.request.user
        if user.is_superuser:
            return ThreadMessage.objects.all()
        return ThreadMessage.objects.filter(
            thread__participant__participant=user,
            thread__school__tenant=user.tenant
        ).distinct()

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return ThreadMessageCreateSerializer
        return ThreadMessageSerializer

    def perform_create(self, serializer):
        """Set sender when creating thread message."""
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'])
    def edit(self, request, pk=None):
        """Edit a thread message."""
        message = self.get_object()
        
        if message.sender != request.user:
            return Response(
                {'error': 'You can only edit your own messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        content = request.data.get('content')
        if not content:
            return Response(
                {'error': 'content is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        message.content = content
        message.edited_at = timezone.now()
        message.save()
        
        return Response({'message': 'Message edited successfully'})


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Announcement model.
    """
    serializer_class = AnnouncementSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['priority', 'status', 'author', 'target_audience']
    search_fields = ['title', 'content']
    ordering_fields = ['publish_date', 'created_at', 'priority']
    ordering = ['-publish_date']

    def get_queryset(self):
        """Filter announcements by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Announcement.objects.all()
        return Announcement.objects.filter(school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return AnnouncementCreateSerializer
        return AnnouncementSerializer

    def perform_create(self, serializer):
        """Set author and school when creating announcement."""
        serializer.save(author=self.request.user, school=self.request.user.school)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an announcement."""
        announcement = self.get_object()
        
        if not announcement.requires_confirmation:
            return Response(
                {'error': 'This announcement does not require confirmation'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already confirmed
        existing = AnnouncementConfirmation.objects.filter(
            announcement=announcement,
            user=request.user
        ).first()
        
        if existing:
            return Response(
                {'error': 'You have already confirmed this announcement'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        AnnouncementConfirmation.objects.create(
            announcement=announcement,
            user=request.user,
            confirmed_at=timezone.now()
        )
        
        return Response({'message': 'Announcement confirmed successfully'})

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active announcements."""
        queryset = self.get_queryset()
        active_announcements = queryset.filter(
            status='published',
            publish_date__lte=timezone.now()
        ).filter(
            Q(expiry_date__isnull=True) | Q(expiry_date__gt=timezone.now())
        ).order_by('-priority', '-publish_date')
        serializer = self.get_serializer(active_announcements, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def urgent(self, request):
        """Get urgent announcements."""
        queryset = self.get_queryset()
        urgent_announcements = queryset.filter(
            priority='urgent',
            status='published',
            publish_date__lte=timezone.now()
        ).filter(
            Q(expiry_date__isnull=True) | Q(expiry_date__gt=timezone.now())
        ).order_by('-publish_date')
        serializer = self.get_serializer(urgent_announcements, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get announcement statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_announcements': queryset.count(),
            'published_announcements': queryset.filter(status='published').count(),
            'draft_announcements': queryset.filter(status='draft').count(),
            'urgent_announcements': queryset.filter(priority='urgent').count(),
            'active_announcements': queryset.filter(
                status='published',
                publish_date__lte=timezone.now()
            ).filter(
                Q(expiry_date__isnull=True) | Q(expiry_date__gt=timezone.now())
            ).count(),
        }
        
        return Response(stats)


class AnnouncementCommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AnnouncementComment model.
    """
    serializer_class = AnnouncementCommentSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['announcement', 'author']
    search_fields = ['content']
    ordering_fields = ['created_at']
    ordering = ['created_at']

    def get_queryset(self):
        """Filter comments by tenant."""
        user = self.request.user
        if user.is_superuser:
            return AnnouncementComment.objects.all()
        return AnnouncementComment.objects.filter(announcement__school__tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return AnnouncementCommentCreateSerializer
        return AnnouncementCommentSerializer

    def perform_create(self, serializer):
        """Set author when creating comment."""
        serializer.save(author=self.request.user)


class AnnouncementConfirmationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AnnouncementConfirmation model.
    """
    serializer_class = AnnouncementConfirmationSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['announcement', 'user']
    ordering_fields = ['confirmed_at', 'created_at']
    ordering = ['-confirmed_at']

    def get_queryset(self):
        """Filter confirmations by tenant."""
        user = self.request.user
        if user.is_superuser:
            return AnnouncementConfirmation.objects.all()
        return AnnouncementConfirmation.objects.filter(announcement__school__tenant=user.tenant)


class CommunicationTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CommunicationTemplate model.
    """
    serializer_class = CommunicationTemplateSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['template_type', 'is_active']
    search_fields = ['name', 'subject', 'content']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter templates by tenant."""
        user = self.request.user
        if user.is_superuser:
            return CommunicationTemplate.objects.all()
        return CommunicationTemplate.objects.filter(school__tenant=user.tenant)

    def perform_create(self, serializer):
        """Set school when creating template."""
        serializer.save(school=self.request.user.school)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active templates."""
        active_templates = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_templates, many=True)
        return Response(serializer.data)


class CommunicationLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CommunicationLog model.
    """
    serializer_class = CommunicationLogSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['communication_type', 'status', 'sender', 'recipient']
    search_fields = ['subject', 'content']
    ordering_fields = ['sent_at', 'created_at']
    ordering = ['-sent_at']

    def get_queryset(self):
        """Filter logs by tenant."""
        user = self.request.user
        if user.is_superuser:
            return CommunicationLog.objects.all()
        return CommunicationLog.objects.filter(school__tenant=user.tenant)

    @action(detail=False, methods=['get'])
    def failed(self, request):
        """Get failed communications."""
        failed_logs = self.get_queryset().filter(status='failed')
        serializer = self.get_serializer(failed_logs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get communication statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_communications': queryset.count(),
            'successful_communications': queryset.filter(status='delivered').count(),
            'failed_communications': queryset.filter(status='failed').count(),
            'pending_communications': queryset.filter(status='pending').count(),
            'email_communications': queryset.filter(communication_type='email').count(),
            'sms_communications': queryset.filter(communication_type='sms').count(),
        }
        
        return Response(stats)


class CommunicationSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CommunicationSettings model.
    """
    serializer_class = CommunicationSettingsSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['school__name']

    def get_queryset(self):
        """Filter settings by tenant."""
        user = self.request.user
        if user.is_superuser:
            return CommunicationSettings.objects.all()
        return CommunicationSettings.objects.filter(school__tenant=user.tenant) 