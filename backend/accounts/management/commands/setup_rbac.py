"""
Management command to set up default roles and permissions for RBAC.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.apps import apps
from accounts.models import Role, Permission, UserRole, RolePermission
from core.models import Tenant

User = get_user_model()


class Command(BaseCommand):
    help = 'Set up default roles and permissions for RBAC system'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tenant',
            type=str,
            help='Tenant subdomain to set up RBAC for (optional)',
        )
        parser.add_argument(
            '--create-permissions',
            action='store_true',
            help='Create permissions for all models',
        )

    def handle(self, *args, **options):
        self.stdout.write('Setting up RBAC system...')

        # Create permissions for all models if requested
        if options['create_permissions']:
            self.create_model_permissions()

        # Create system roles
        self.create_system_roles()

        # Create tenant-specific roles if tenant is specified
        if options['tenant']:
            try:
                tenant = Tenant.objects.get(subdomain=options['tenant'])
                self.create_tenant_roles(tenant)
                self.stdout.write(
                    self.style.SUCCESS(f'RBAC setup completed for tenant: {tenant.name}')
                )
            except Tenant.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Tenant with subdomain {options["tenant"]} not found')
                )
        else:
            self.stdout.write(
                self.style.SUCCESS('System RBAC setup completed')
            )

    def create_model_permissions(self):
        """Create permissions for all models in the project."""
        self.stdout.write('Creating model permissions...')

        # Get all models from all apps
        for app_config in apps.get_app_configs():
            if app_config.name.startswith('django.'):
                continue

            for model in app_config.get_models():
                content_type = ContentType.objects.get_for_model(model)
                
                # Create permissions for each model
                permissions_to_create = [
                    {
                        'name': f'view_{model._meta.model_name}',
                        'display_name': f'Can view {model._meta.verbose_name_plural}',
                        'permission_type': 'view',
                        'app_label': model._meta.app_label,
                        'model_name': model._meta.model_name,
                        'codename': f'view_{model._meta.model_name}',
                    },
                    {
                        'name': f'create_{model._meta.model_name}',
                        'display_name': f'Can create {model._meta.verbose_name_plural}',
                        'permission_type': 'create',
                        'app_label': model._meta.app_label,
                        'model_name': model._meta.model_name,
                        'codename': f'add_{model._meta.model_name}',
                    },
                    {
                        'name': f'update_{model._meta.model_name}',
                        'display_name': f'Can update {model._meta.verbose_name_plural}',
                        'permission_type': 'update',
                        'app_label': model._meta.app_label,
                        'model_name': model._meta.model_name,
                        'codename': f'change_{model._meta.model_name}',
                    },
                    {
                        'name': f'delete_{model._meta.model_name}',
                        'display_name': f'Can delete {model._meta.verbose_name_plural}',
                        'permission_type': 'delete',
                        'app_label': model._meta.app_label,
                        'model_name': model._meta.model_name,
                        'codename': f'delete_{model._meta.model_name}',
                    },
                ]

                for perm_data in permissions_to_create:
                    Permission.objects.get_or_create(
                        name=perm_data['name'],
                        defaults=perm_data
                    )

        self.stdout.write(
            self.style.SUCCESS('Model permissions created successfully')
        )

    def create_system_roles(self):
        """Create system-wide roles."""
        self.stdout.write('Creating system roles...')

        # Super Admin Role
        super_admin_role, created = Role.objects.get_or_create(
            name='super_admin',
            defaults={
                'display_name': 'Super Administrator',
                'description': 'Full system access with all permissions',
                'role_type': 'system',
                'is_system': True,
            }
        )

        # System Admin Role
        system_admin_role, created = Role.objects.get_or_create(
            name='system_admin',
            defaults={
                'display_name': 'System Administrator',
                'description': 'System administration with limited access',
                'role_type': 'system',
                'is_system': True,
            }
        )

        # Assign all permissions to super admin
        all_permissions = Permission.objects.all()
        for permission in all_permissions:
            RolePermission.objects.get_or_create(
                role=super_admin_role,
                permission=permission,
                defaults={'is_active': True}
            )

        # Assign view permissions to system admin
        view_permissions = Permission.objects.filter(permission_type='view')
        for permission in view_permissions:
            RolePermission.objects.get_or_create(
                role=system_admin_role,
                permission=permission,
                defaults={'is_active': True}
            )

        self.stdout.write(
            self.style.SUCCESS('System roles created successfully')
        )

    def create_tenant_roles(self, tenant):
        """Create tenant-specific roles."""
        self.stdout.write(f'Creating roles for tenant: {tenant.name}')

        # Tenant Admin Role
        tenant_admin_role, created = Role.objects.get_or_create(
            name='tenant_admin',
            tenant=tenant,
            defaults={
                'display_name': 'Tenant Administrator',
                'description': 'Full access to tenant data and settings',
                'role_type': 'tenant',
                'is_system': False,
            }
        )

        # School Admin Role
        school_admin_role, created = Role.objects.get_or_create(
            name='school_admin',
            tenant=tenant,
            defaults={
                'display_name': 'School Administrator',
                'description': 'School-level administration and management',
                'role_type': 'tenant',
                'is_system': False,
            }
        )

        # Teacher Role
        teacher_role, created = Role.objects.get_or_create(
            name='teacher',
            tenant=tenant,
            defaults={
                'display_name': 'Teacher',
                'description': 'Teacher with access to academic functions',
                'role_type': 'tenant',
                'is_system': False,
            }
        )

        # Student Role
        student_role, created = Role.objects.get_or_create(
            name='student',
            tenant=tenant,
            defaults={
                'display_name': 'Student',
                'description': 'Student with limited access to their own data',
                'role_type': 'tenant',
                'is_system': False,
            }
        )

        # Parent Role
        parent_role, created = Role.objects.get_or_create(
            name='parent',
            tenant=tenant,
            defaults={
                'display_name': 'Parent',
                'description': 'Parent with access to their children\'s data',
                'role_type': 'tenant',
                'is_system': False,
            }
        )

        # Staff Role
        staff_role, created = Role.objects.get_or_create(
            name='staff',
            tenant=tenant,
            defaults={
                'display_name': 'Staff Member',
                'description': 'General staff member with basic access',
                'role_type': 'tenant',
                'is_system': False,
            }
        )

        # Assign permissions to roles
        self.assign_tenant_permissions(tenant_admin_role, school_admin_role, 
                                     teacher_role, student_role, parent_role, staff_role)

        self.stdout.write(
            self.style.SUCCESS(f'Tenant roles created successfully for {tenant.name}')
        )

    def assign_tenant_permissions(self, tenant_admin_role, school_admin_role, 
                                teacher_role, student_role, parent_role, staff_role):
        """Assign appropriate permissions to tenant roles."""
        
        # Tenant Admin gets all permissions
        all_permissions = Permission.objects.all()
        for permission in all_permissions:
            RolePermission.objects.get_or_create(
                role=tenant_admin_role,
                permission=permission,
                defaults={'is_active': True}
            )

        # School Admin gets most permissions except system-level ones
        school_permissions = Permission.objects.exclude(
            app_label__in=['admin', 'sessions', 'contenttypes']
        )
        for permission in school_permissions:
            RolePermission.objects.get_or_create(
                role=school_admin_role,
                permission=permission,
                defaults={'is_active': True}
            )

        # Teacher permissions
        teacher_permissions = Permission.objects.filter(
            app_label__in=['schools', 'library', 'communication'],
            permission_type__in=['view', 'create', 'update']
        )
        for permission in teacher_permissions:
            RolePermission.objects.get_or_create(
                role=teacher_role,
                permission=permission,
                defaults={'is_active': True}
            )

        # Student permissions (limited)
        student_permissions = Permission.objects.filter(
            app_label__in=['schools'],
            permission_type='view'
        )
        for permission in student_permissions:
            RolePermission.objects.get_or_create(
                role=student_role,
                permission=permission,
                defaults={'is_active': True}
            )

        # Parent permissions (similar to student)
        parent_permissions = Permission.objects.filter(
            app_label__in=['schools'],
            permission_type='view'
        )
        for permission in parent_permissions:
            RolePermission.objects.get_or_create(
                role=parent_role,
                permission=permission,
                defaults={'is_active': True}
            )

        # Staff permissions (basic access)
        staff_permissions = Permission.objects.filter(
            app_label__in=['schools', 'library'],
            permission_type__in=['view', 'create']
        )
        for permission in staff_permissions:
            RolePermission.objects.get_or_create(
                role=staff_role,
                permission=permission,
                defaults={'is_active': True}
            ) 