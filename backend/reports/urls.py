"""
URL patterns for the reports app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'reports', views.ReportViewSet, basename='report')
router.register(r'dashboards', views.DashboardViewSet, basename='dashboard')
router.register(r'widgets', views.WidgetViewSet, basename='widget')
router.register(r'analytics-events', views.AnalyticsEventViewSet, basename='analyticsevent')
router.register(r'analytics-metrics', views.AnalyticsMetricViewSet, basename='analyticsmetric')
router.register(r'data-exports', views.DataExportViewSet, basename='dataexport')
router.register(r'report-schedules', views.ReportScheduleViewSet, basename='reportschedule')
router.register(r'report-templates', views.ReportTemplateViewSet, basename='reporttemplate')
router.register(r'settings', views.ReportsSettingsViewSet, basename='reportssettings')

urlpatterns = [
    path('', include(router.urls)),
] 