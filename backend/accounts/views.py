"""
Views for user management and authentication.
"""
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Count
from django.utils import timezone

from .models import (
    User, UserProfile, UserSession, UserActivity, PasswordHistory,
    Role, Permission, UserRole, RolePermission
)
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    UserProfileSerializer, UserSessionSerializer, UserActivitySerializer,
    PasswordHistorySerializer, RoleSerializer, RoleCreateSerializer,
    RolePermissionSerializer, UserRoleSerializer, UserRoleCreateSerializer,
    PermissionSerializer, LoginSerializer, PasswordChangeSerializer,
    PasswordResetSerializer, PasswordResetConfirmSerializer,
    UserRegistrationSerializer
)
from core.permissions import (
    IsTenantUser, IsTenantAdmin, IsSchoolAdmin, IsTeacher, IsStudent,
    IsParent, IsStaff, HasPermission, HasRole, IsOwnerOrReadOnly
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model.
    """
    serializer_class = UserSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'is_active', 'is_verified']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'date_joined', 'last_login']
    ordering = ['username']

    def get_queryset(self):
        """Filter users by tenant."""
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        return User.objects.filter(tenant=user.tenant)

    def get_serializer_class(self):
        """Use different serializer for different actions."""
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def perform_create(self, serializer):
        """Set tenant when creating user."""
        serializer.save(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user account."""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'message': 'User activated successfully'})

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user account."""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'message': 'User deactivated successfully'})

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a user account."""
        user = self.get_object()
        user.is_verified = True
        user.save()
        return Response({'message': 'User verified successfully'})

    @action(detail=False, methods=['get'])
    def teachers(self, request):
        """Get all teachers."""
        teachers = self.get_queryset().filter(user_type='teacher')
        serializer = self.get_serializer(teachers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def students(self, request):
        """Get all students."""
        students = self.get_queryset().filter(user_type='student')
        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def parents(self, request):
        """Get all parents."""
        parents = self.get_queryset().filter(user_type='parent')
        serializer = self.get_serializer(parents, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def staff(self, request):
        """Get all staff members."""
        staff = self.get_queryset().filter(user_type='staff')
        serializer = self.get_serializer(staff, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get user statistics."""
        queryset = self.get_queryset()

        stats = {
            'total_users': queryset.count(),
            'active_users': queryset.filter(is_active=True).count(),
            'verified_users': queryset.filter(is_verified=True).count(),
            'teachers': queryset.filter(user_type='teacher').count(),
            'students': queryset.filter(user_type='student').count(),
            'parents': queryset.filter(user_type='parent').count(),
            'staff': queryset.filter(user_type='staff').count(),
        }

        return Response(stats)


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserProfile model.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter profiles by tenant."""
        user = self.request.user
        if user.is_superuser:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user__tenant=user.tenant)


class UserSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserSession model.
    """
    serializer_class = UserSessionSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user', 'is_active']
    search_fields = ['user__username', 'ip_address']
    ordering_fields = ['login_time', 'logout_time']
    ordering = ['-login_time']

    def get_queryset(self):
        """Filter sessions by tenant."""
        user = self.request.user
        if user.is_superuser:
            return UserSession.objects.all()
        return UserSession.objects.filter(user__tenant=user.tenant)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active sessions."""
        active_sessions = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_sessions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        """Terminate a session."""
        session = self.get_object()
        session.is_active = False
        session.logout_time = timezone.now()
        session.save()
        return Response({'message': 'Session terminated successfully'})


class UserActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserActivity model.
    """
    serializer_class = UserActivitySerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user', 'activity_type']
    search_fields = ['description', 'user__username']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter activities by tenant."""
        user = self.request.user
        if user.is_superuser:
            return UserActivity.objects.all()
        return UserActivity.objects.filter(user__tenant=user.tenant)

    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """Get current user's activities."""
        my_activities = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(my_activities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent activities."""
        recent_activities = self.get_queryset()[:50]
        serializer = self.get_serializer(recent_activities, many=True)
        return Response(serializer.data)


class PasswordHistoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for PasswordHistory model.
    """
    serializer_class = PasswordHistorySerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user']
    search_fields = ['user__username']
    ordering_fields = ['changed_at']
    ordering = ['-changed_at']

    def get_queryset(self):
        """Filter password history by tenant."""
        user = self.request.user
        if user.is_superuser:
            return PasswordHistory.objects.all()
        return PasswordHistory.objects.filter(user__tenant=user.tenant)


# RBAC Views
class RoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Role model.
    """
    serializer_class = RoleSerializer
    permission_classes = [IsTenantAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role_type', 'is_active', 'is_system']
    search_fields = ['name', 'display_name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter roles by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Role.objects.all()
        return Role.objects.filter(
            Q(tenant=user.tenant) | Q(role_type='system')
        )

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return RoleCreateSerializer
        return RoleSerializer

    def perform_create(self, serializer):
        """Set tenant when creating role."""
        serializer.save(tenant=self.request.user.tenant)

    @action(detail=False, methods=['get'])
    def system_roles(self, request):
        """Get system roles."""
        system_roles = self.get_queryset().filter(role_type='system')
        serializer = self.get_serializer(system_roles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def tenant_roles(self, request):
        """Get tenant roles."""
        tenant_roles = self.get_queryset().filter(role_type='tenant')
        serializer = self.get_serializer(tenant_roles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_permissions(self, request, pk=None):
        """Assign permissions to a role."""
        role = self.get_object()
        permission_ids = request.data.get('permission_ids', [])

        # Remove existing permissions
        RolePermission.objects.filter(role=role).delete()

        # Assign new permissions
        for permission_id in permission_ids:
            try:
                permission = Permission.objects.get(id=permission_id)
                RolePermission.objects.create(
                    role=role,
                    permission=permission,
                    granted_by=request.user
                )
            except Permission.DoesNotExist:
                pass

        return Response({'message': 'Permissions assigned successfully'})

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get role statistics."""
        queryset = self.get_queryset()

        stats = {
            'total_roles': queryset.count(),
            'active_roles': queryset.filter(is_active=True).count(),
            'system_roles': queryset.filter(role_type='system').count(),
            'tenant_roles': queryset.filter(role_type='tenant').count(),
            'roles_with_users': queryset.filter(user_roles__isnull=False).distinct().count(),
        }

        return Response(stats)


class PermissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Permission model.
    """
    serializer_class = PermissionSerializer
    permission_classes = [IsTenantAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['permission_type', 'is_active', 'is_global', 'app_label']
    search_fields = ['name', 'display_name', 'description']
    ordering_fields = ['name', 'app_label', 'model_name']
    ordering = ['app_label', 'model_name', 'codename']

    def get_queryset(self):
        """Get all permissions."""
        return Permission.objects.all()

    @action(detail=False, methods=['get'])
    def global_permissions(self, request):
        """Get global permissions."""
        global_permissions = self.get_queryset().filter(is_global=True)
        serializer = self.get_serializer(global_permissions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_app(self, request):
        """Get permissions grouped by app."""
        app_label = request.query_params.get('app_label')
        if app_label:
            permissions = self.get_queryset().filter(app_label=app_label)
        else:
            permissions = self.get_queryset()

        # Group by app_label
        grouped = {}
        for perm in permissions:
            if perm.app_label not in grouped:
                grouped[perm.app_label] = []
            grouped[perm.app_label].append(PermissionSerializer(perm).data)

        return Response(grouped)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get permission statistics."""
        queryset = self.get_queryset()

        stats = {
            'total_permissions': queryset.count(),
            'active_permissions': queryset.filter(is_active=True).count(),
            'global_permissions': queryset.filter(is_global=True).count(),
            'permissions_by_type': queryset.values('permission_type').annotate(
                count=Count('id')
            ),
        }

        return Response(stats)


class RolePermissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for RolePermission model.
    """
    serializer_class = RolePermissionSerializer
    permission_classes = [IsTenantAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'permission', 'is_active']
    search_fields = ['role__name', 'permission__name']
    ordering_fields = ['granted_at', 'expires_at']
    ordering = ['-granted_at']

    def get_queryset(self):
        """Filter role permissions by tenant."""
        user = self.request.user
        if user.is_superuser:
            return RolePermission.objects.all()
        return RolePermission.objects.filter(
            role__tenant=user.tenant
        )

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active role permissions."""
        active_permissions = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_permissions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get expired role permissions."""
        expired_permissions = self.get_queryset().filter(
            expires_at__lt=timezone.now()
        )
        serializer = self.get_serializer(expired_permissions, many=True)
        return Response(serializer.data)


class UserRoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserRole model.
    """
    serializer_class = UserRoleSerializer
    permission_classes = [IsTenantAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user', 'role', 'is_active']
    search_fields = ['user__username', 'role__name']
    ordering_fields = ['assigned_at', 'expires_at']
    ordering = ['-assigned_at']

    def get_queryset(self):
        """Filter user roles by tenant."""
        user = self.request.user
        if user.is_superuser:
            return UserRole.objects.all()
        return UserRole.objects.filter(
            user__tenant=user.tenant
        )

    def get_serializer_class(self):
        """Use different serializer for creation."""
        if self.action == 'create':
            return UserRoleCreateSerializer
        return UserRoleSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active user roles."""
        active_roles = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_roles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get expired user roles."""
        expired_roles = self.get_queryset().filter(
            expires_at__lt=timezone.now()
        )
        serializer = self.get_serializer(expired_roles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def extend(self, request, pk=None):
        """Extend user role assignment."""
        user_role = self.get_object()
        extension_days = request.data.get('extension_days', 30)
        
        if user_role.expires_at:
            user_role.expires_at += timezone.timedelta(days=extension_days)
        else:
            user_role.expires_at = timezone.now() + timezone.timedelta(days=extension_days)
        
        user_role.save()
        return Response({'message': 'Role assignment extended successfully'})

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get user role statistics."""
        queryset = self.get_queryset()

        stats = {
            'total_assignments': queryset.count(),
            'active_assignments': queryset.filter(is_active=True).count(),
            'expired_assignments': queryset.filter(
                expires_at__lt=timezone.now()
            ).count(),
            'assignments_by_role': queryset.values('role__name').annotate(
                count=Count('id')
            ),
        }

        return Response(stats)


# Authentication Views
class LoginView(APIView):
    """
    User login view.
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Create user session
            UserSession.objects.create(
                user=user,
                session_key=request.session.session_key,
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='login',
                description=f'User logged in from {self.get_client_ip(request)}',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LogoutView(APIView):
    """
    User logout view.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            activity_type='logout',
            description=f'User logged out from {self.get_client_ip(request)}',
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Update user session
        UserSession.objects.filter(
            user=request.user,
            session_key=request.session.session_key,
            is_active=True
        ).update(
            is_active=False,
            logout_time=timezone.now()
        )
        
        logout(request)
        return Response({'message': 'Logout successful'})

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class RegisterView(APIView):
    """
    User registration view.
    """
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Registration successful',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """
    Password change view.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Log password change
            PasswordHistory.objects.create(
                user=user,
                password_hash=user.password
            )
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='action',
                description='Password changed successfully',
                ip_address=self.get_client_ip(request)
            )
            
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class PasswordResetView(APIView):
    """
    Password reset request view.
    """
    permission_classes = [AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            # Here you would implement the actual password reset logic
            # For now, just return success message
            return Response({'message': 'Password reset email sent'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """
    Password reset confirmation view.
    """
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            # Here you would implement the actual password reset confirmation logic
            # For now, just return success message
            return Response({'message': 'Password reset successful'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    User profile view.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current user's profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Update current user's profile."""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 