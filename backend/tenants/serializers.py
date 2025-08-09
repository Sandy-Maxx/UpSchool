"""
Tenant serializers for public registration.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.models import Tenant
from schools.models import School
import re
import uuid


User = get_user_model()


class TenantRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for public tenant registration.
    """
    # Admin user fields
    admin_first_name = serializers.CharField(max_length=150)
    admin_last_name = serializers.CharField(max_length=150)
    admin_email = serializers.EmailField()
    admin_phone = serializers.CharField(max_length=20)
    admin_password = serializers.CharField(write_only=True, min_length=8)
    admin_job_title = serializers.CharField(max_length=100, required=False)
    
    # School details
    school_name = serializers.CharField(max_length=255)
    school_type = serializers.CharField(max_length=100, required=False)
    school_address = serializers.CharField()
    school_city = serializers.CharField(max_length=100, required=False)
    school_state = serializers.CharField(max_length=100, required=False)
    school_postal_code = serializers.CharField(max_length=20, required=False)
    school_country = serializers.CharField(max_length=100, required=False)
    school_phone = serializers.CharField(max_length=20)
    school_email = serializers.EmailField()
    school_website = serializers.URLField(required=False)
    
    # Capacity and demographics
    student_count_range = serializers.CharField(max_length=50, required=False)
    staff_count_range = serializers.CharField(max_length=50, required=False)
    
    # Academic details (optional)
    academic_year_start = serializers.CharField(max_length=20, required=False, default='September')
    grade_system = serializers.CharField(max_length=50, required=False, default='K-12')
    
    # Subscription details
    subscription_plan = serializers.ChoiceField(
        choices=[
            ('basic', 'Basic - Up to 100 students'),
            ('standard', 'Standard - Up to 500 students'),
            ('premium', 'Premium - Up to 2000 students'),
            ('enterprise', 'Enterprise - Unlimited')
        ],
        default='basic'
    )
    
    # Marketing and communication preferences
    marketing_emails_consent = serializers.BooleanField(default=False)
    newsletter_subscription = serializers.BooleanField(default=False)
    
    # Terms acceptance
    terms_accepted = serializers.BooleanField(write_only=True)
    
    class Meta:
        model = Tenant
        fields = [
            # School Info
            'school_name', 'subdomain', 'school_type', 'school_address',
            'school_city', 'school_state', 'school_postal_code', 'school_country',
            'school_phone', 'school_email', 'school_website',
            
            # Admin User Info
            'admin_first_name', 'admin_last_name', 'admin_email', 'admin_phone',
            'admin_password', 'admin_job_title',
            
            # Business Info
            'student_count_range', 'staff_count_range', 'subscription_plan',
            'academic_year_start', 'grade_system',
            
            # Marketing & Terms
            'marketing_emails_consent', 'newsletter_subscription', 'terms_accepted'
        ]
        extra_kwargs = {
            'subdomain': {'required': True}
        }
    
    def validate_subdomain(self, value):
        """Validate subdomain format and availability."""
        # Check format
        if not re.match(r'^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$', value):
            raise serializers.ValidationError(
                "Subdomain must contain only lowercase letters, numbers, and hyphens. "
                "Must start and end with alphanumeric character."
            )
        
        # Reserved subdomains
        reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'test', 'staging', 'demo']
        if value.lower() in reserved:
            raise serializers.ValidationError("This subdomain is reserved.")
        
        # Check availability
        if Tenant.objects.filter(subdomain=value).exists():
            raise serializers.ValidationError("This subdomain is already taken.")
        
        return value.lower()
    
    def validate_admin_email(self, value):
        """Validate admin email is unique."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value
    
    def validate_terms_accepted(self, value):
        """Ensure terms are accepted."""
        if not value:
            raise serializers.ValidationError(
                "You must accept the terms and conditions to register."
            )
        return value
    
    def create(self, validated_data):
        """Create tenant, school, and admin user."""
        from django.utils import timezone
        from datetime import timedelta
        
        # Extract admin user data
        admin_data = {
            'first_name': validated_data.pop('admin_first_name'),
            'last_name': validated_data.pop('admin_last_name'),
            'email': validated_data.pop('admin_email'),
            'phone': validated_data.pop('admin_phone'),
            'password': validated_data.pop('admin_password'),
            'job_title': validated_data.pop('admin_job_title', ''),
        }
        
        # Extract school data
        school_data = {
            'name': validated_data.pop('school_name'),
            'type': validated_data.pop('school_type', ''),
            'address': validated_data.pop('school_address'),
            'city': validated_data.pop('school_city', ''),
            'state': validated_data.pop('school_state', ''),
            'postal_code': validated_data.pop('school_postal_code', ''),
            'country': validated_data.pop('school_country', ''),
            'phone': validated_data.pop('school_phone'),
            'email': validated_data.pop('school_email'),
            'website': validated_data.pop('school_website', ''),
        }
        
        # Extract capacity and academic data
        capacity_data = {
            'student_count_range': validated_data.pop('student_count_range', ''),
            'staff_count_range': validated_data.pop('staff_count_range', ''),
            'academic_year_start': validated_data.pop('academic_year_start', 'September'),
            'grade_system': validated_data.pop('grade_system', 'K-12'),
        }
        
        # Extract marketing preferences
        marketing_data = {
            'marketing_emails_consent': validated_data.pop('marketing_emails_consent', False),
            'newsletter_subscription': validated_data.pop('newsletter_subscription', False),
        }
        
        # Remove terms acceptance (not stored)
        validated_data.pop('terms_accepted')
        
        # Create tenant with unique database name
        subdomain = validated_data['subdomain']
        database_name = f"tenant_{subdomain}_{uuid.uuid4().hex[:8]}"
        
        # Set trial period (14 days from now)
        trial_end = timezone.now() + timedelta(days=14)
        
        # Create complete address
        full_address = school_data['address']
        if school_data['city']:
            full_address += f", {school_data['city']}"
        if school_data['state']:
            full_address += f", {school_data['state']}"
        if school_data['postal_code']:
            full_address += f" {school_data['postal_code']}"
        if school_data['country']:
            full_address += f", {school_data['country']}"
        
        # Create tenant with all production-grade fields
        tenant = Tenant.objects.create(
            name=school_data['name'],
            subdomain=subdomain,
            database_name=database_name,
            
            # School information
            school_name=school_data['name'],
            school_type=school_data['type'],
            school_address=full_address,
            school_city=school_data['city'],
            school_state=school_data['state'],
            school_postal_code=school_data['postal_code'],
            school_country=school_data['country'],
            school_phone=school_data['phone'],
            school_email=school_data['email'],
            school_website=school_data['website'],
            
            # Capacity and demographics
            student_count_range=capacity_data['student_count_range'],
            staff_count_range=capacity_data['staff_count_range'],
            
            # Academic details
            academic_year_start=capacity_data['academic_year_start'],
            grade_system=capacity_data['grade_system'],
            
            # Subscription
            subscription_plan=validated_data.get('subscription_plan', 'basic'),
            trial_ends_at=trial_end,
            
            # Marketing preferences
            marketing_emails_consent=marketing_data['marketing_emails_consent'],
            newsletter_subscription=marketing_data['newsletter_subscription'],
            
            # Status
            is_active=True,
        )
        
        # Create admin user with job title
        admin_user = User.objects.create_user(
            username=admin_data['email'],
            email=admin_data['email'],
            first_name=admin_data['first_name'],
            last_name=admin_data['last_name'],
            phone=admin_data['phone'],
            job_title=admin_data['job_title'],
            password=admin_data['password'],
            user_type='admin',
            tenant=tenant,
            is_verified=True  # Auto-verify for now
        )
        
        # Create school record
        School.objects.create(
            tenant=tenant,
            name=school_data['name'],
            code=tenant.subdomain.upper(),
            address=full_address,
            phone=school_data['phone'],
            email=school_data['email'],
            website=school_data['website'],
        )
        
        return tenant


class SubdomainCheckSerializer(serializers.Serializer):
    """
    Serializer for checking subdomain availability.
    """
    subdomain = serializers.CharField(max_length=255)
    
    def validate_subdomain(self, value):
        """Validate subdomain format."""
        if not re.match(r'^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$', value):
            raise serializers.ValidationError(
                "Invalid format. Use only lowercase letters, numbers, and hyphens."
            )
        return value.lower()


class ContactSerializer(serializers.Serializer):
    """
    Serializer for contact form submissions.
    """
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False)
    organization = serializers.CharField(max_length=255, required=False)
    message = serializers.CharField()
    subject = serializers.ChoiceField(
        choices=[
            ('demo', 'Request Demo'),
            ('pricing', 'Pricing Inquiry'),
            ('support', 'Technical Support'),
            ('sales', 'Sales Inquiry'),
            ('other', 'Other')
        ],
        default='other'
    )
