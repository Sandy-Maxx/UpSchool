"""
URL configuration for accounts app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'profiles', views.UserProfileViewSet, basename='userprofile')
router.register(r'sessions', views.UserSessionViewSet, basename='usersession')
router.register(r'activities', views.UserActivityViewSet, basename='useractivity')
router.register(r'password-history', views.PasswordHistoryViewSet, basename='passwordhistory')

# RBAC URLs
router.register(r'roles', views.RoleViewSet, basename='role')
router.register(r'permissions', views.PermissionViewSet, basename='permission')
router.register(r'role-permissions', views.RolePermissionViewSet, basename='rolepermission')
router.register(r'user-roles', views.UserRoleViewSet, basename='userrole')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Authentication URLs
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('password/change/', views.PasswordChangeView.as_view(), name='password-change'),
    path('password/reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
] 