"""
Background tasks for the school platform.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import Tenant, Notification
from accounts.models import User


@shared_task
def send_welcome_email(tenant_id):
    """
    Send welcome email to new tenant.
    """
    try:
        tenant = Tenant.objects.get(id=tenant_id)
        subject = f'Welcome to {tenant.school_name}'
        message = f"""
        Welcome to your new school platform!
        
        Your school: {tenant.school_name}
        Subdomain: {tenant.subdomain}
        
        You can now start setting up your school management system.
        
        Best regards,
        School Platform Team
        """
        
        # In production, you would send this to the tenant's admin email
        print(f"Welcome email for {tenant.school_name}: {message}")
        
    except Tenant.DoesNotExist:
        print(f"Tenant {tenant_id} not found")


@shared_task
def send_notification_email(user_id, notification_id):
    """
    Send notification email to user.
    """
    try:
        user = User.objects.get(id=user_id)
        notification = Notification.objects.get(id=notification_id)
        
        subject = notification.title
        message = f"""
        {notification.message}
        
        Best regards,
        School Platform Team
        """
        
        # In production, you would send this email
        print(f"Notification email to {user.email}: {subject}")
        
    except (User.DoesNotExist, Notification.DoesNotExist):
        print(f"User {user_id} or notification {notification_id} not found")


@shared_task
def cleanup_expired_sessions():
    """
    Clean up expired user sessions.
    """
    from accounts.models import UserSession
    from django.utils import timezone
    
    # Delete sessions older than 30 days
    cutoff_date = timezone.now() - timedelta(days=30)
    deleted_count = UserSession.objects.filter(
        login_time__lt=cutoff_date,
        is_active=False
    ).delete()[0]
    
    print(f"Cleaned up {deleted_count} expired sessions")


@shared_task
def send_daily_reports():
    """
    Send daily reports to school administrators.
    """
    from schools.models import School, Student, Teacher, Attendance
    
    for school in School.objects.all():
        # Get daily statistics
        total_students = Student.objects.filter(school=school).count()
        total_teachers = Teacher.objects.filter(school=school).count()
        
        # Get today's attendance
        today = timezone.now().date()
        attendance_count = Attendance.objects.filter(
            student__school=school,
            date=today
        ).count()
        
        # Create report
        report = f"""
        Daily Report for {school.name} - {today}
        
        Total Students: {total_students}
        Total Teachers: {total_teachers}
        Today's Attendance Records: {attendance_count}
        
        Best regards,
        School Platform
        """
        
        # In production, you would send this to school administrators
        print(f"Daily report for {school.name}: {report}")


@shared_task
def check_subscription_expiry():
    """
    Check for expiring subscriptions and send notifications.
    """
    from django.utils import timezone
    
    # Find tenants with expiring subscriptions (within 30 days)
    expiry_date = timezone.now() + timedelta(days=30)
    expiring_tenants = Tenant.objects.filter(
        subscription_expires__lte=expiry_date,
        subscription_status='active'
    )
    
    for tenant in expiring_tenants:
        # Create notification for tenant admin
        days_until_expiry = (tenant.subscription_expires - timezone.now()).days
        
        notification = Notification.objects.create(
            tenant=tenant,
            title=f"Subscription Expiring Soon",
            message=f"Your subscription will expire in {days_until_expiry} days. Please renew to continue using the platform.",
            notification_type='warning'
        )
        
        print(f"Created expiry notification for {tenant.name}")


@shared_task
def backup_tenant_data(tenant_id):
    """
    Backup tenant data (placeholder for production).
    """
    try:
        tenant = Tenant.objects.get(id=tenant_id)
        print(f"Backing up data for tenant: {tenant.name}")
        
        # In production, you would implement actual backup logic
        # This could involve database dumps, file backups, etc.
        
    except Tenant.DoesNotExist:
        print(f"Tenant {tenant_id} not found")


@shared_task
def sync_tenant_settings(tenant_id):
    """
    Sync tenant settings across the platform.
    """
    try:
        tenant = Tenant.objects.get(id=tenant_id)
        print(f"Syncing settings for tenant: {tenant.name}")
        
        # In production, you would sync settings like:
        # - Timezone settings
        # - Language preferences
        # - Feature flags
        # - Custom configurations
        
    except Tenant.DoesNotExist:
        print(f"Tenant {tenant_id} not found") 