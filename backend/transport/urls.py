"""
URL patterns for the transport app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'vehicles', views.VehicleViewSet, basename='vehicle')
router.register(r'drivers', views.DriverViewSet, basename='driver')
router.register(r'routes', views.RouteViewSet, basename='route')
router.register(r'route-stops', views.RouteStopViewSet, basename='routestop')
router.register(r'assignments', views.TransportAssignmentViewSet, basename='transportassignment')
router.register(r'student-transport', views.StudentTransportViewSet, basename='studenttransport')
router.register(r'tracking', views.TransportTrackingViewSet, basename='transporttracking')
router.register(r'incidents', views.TransportIncidentViewSet, basename='transportincident')
router.register(r'settings', views.TransportSettingsViewSet, basename='transportsettings')

urlpatterns = [
    path('', include(router.urls)),
] 