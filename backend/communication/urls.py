"""
URL patterns for the communication app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'messages', views.MessageViewSet, basename='message')
router.register(r'threads', views.MessageThreadViewSet, basename='messagethread')
router.register(r'thread-messages', views.ThreadMessageViewSet, basename='threadmessage')
router.register(r'announcements', views.AnnouncementViewSet, basename='announcement')
router.register(r'announcement-comments', views.AnnouncementCommentViewSet, basename='announcementcomment')
router.register(r'templates', views.CommunicationTemplateViewSet, basename='communicationtemplate')
router.register(r'logs', views.CommunicationLogViewSet, basename='communicationlog')
router.register(r'settings', views.CommunicationSettingsViewSet, basename='communicationsettings')

urlpatterns = [
    path('', include(router.urls)),
] 