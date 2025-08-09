# School ERP SaaS Platform - Setup Guide

## Overview

Your SaaS platform is already well-implemented! This guide will help you complete the integration and get it running.

## What's Already Implemented ✅

### Backend (Django)
- ✅ Multi-tenant architecture with subdomain routing
- ✅ Comprehensive tenant registration API (`/api/v1/public/register/`)
- ✅ Subdomain validation API (`/api/v1/public/check-subdomain/`)
- ✅ Complete RBAC (Role-Based Access Control) system
- ✅ User management with tenant isolation
- ✅ Email notifications and welcome emails
- ✅ Pricing plans system
- ✅ Celery async task processing
- ✅ Audit logging and activity tracking

### Frontend (React + TypeScript)
- ✅ Professional landing page
- ✅ Multi-step tenant registration form
- ✅ Material-UI responsive design
- ✅ Form validation with Yup
- ✅ Registration success workflow
- ✅ Login modal and authentication

## Setup Instructions

### 1. Install Dependencies

#### Backend
```bash
cd D:\SAP\backend
pip install -r requirements.txt
```

#### Frontend
```bash
cd D:\SAP\frontend
npm install
```

### 2. Configure Environment

Copy the environment template:
```bash
cd D:\SAP\backend
copy .env.example .env
```

Edit `.env` with your actual values:
- Set `SECRET_KEY` to a secure random string
- Configure your PostgreSQL database credentials
- Set up email SMTP settings
- Configure Redis URL if not localhost

### 3. Database Setup

```bash
cd D:\SAP\backend
python manage.py makemigrations
python manage.py migrate
python manage.py setup_rbac  # Sets up initial roles and permissions
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

### 5. Start Development Servers

#### Backend
```bash
cd D:\SAP\backend
python manage.py runserver 8000
```

#### Frontend
```bash
cd D:\SAP\frontend
npm start
```

#### Celery (for background tasks)
```bash
cd D:\SAP\backend
celery -A school_platform worker --loglevel=info
```

### 6. Access the Platform

- **Landing Page**: http://localhost:3000
- **API Documentation**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/

## Key Features

### 1. Tenant Registration Flow
1. Users visit the landing page
2. Click "Start Free Trial" or "Get Started"
3. Fill out the multi-step registration form:
   - School Information (name, subdomain, address)
   - Administrator Account (admin user details)
   - Business Details (student count, plan selection)
   - Terms & Confirmation
4. System automatically:
   - Creates tenant record
   - Creates admin user with proper roles
   - Creates school record
   - Sets up RBAC permissions
   - Sends welcome email
   - Provides subdomain access URL

### 2. API Endpoints

#### Public Endpoints (No Auth Required)
- `POST /api/v1/public/register/` - Tenant registration
- `POST /api/v1/public/check-subdomain/` - Check subdomain availability
- `GET /api/v1/public/pricing/` - Get pricing plans
- `POST /api/v1/public/contact/` - Contact form

#### Authenticated Endpoints
- `GET /api/v1/accounts/users/` - User management
- `GET /api/v1/accounts/roles/` - Role management
- `GET /api/v1/schools/` - School data
- And many more...

### 3. Multi-Tenant Architecture
- Each tenant has isolated data
- Subdomain-based routing (tenant1.yoursite.com)
- Tenant-specific user roles and permissions
- Secure tenant data isolation

## Production Deployment

### 1. Environment Setup
```bash
# Set production environment variables
export DJANGO_SETTINGS_MODULE=school_platform.settings.production
export DEBUG=False
export SECRET_KEY=your-production-secret-key
# ... other production vars
```

### 2. Static Files
```bash
python manage.py collectstatic --noinput
```

### 3. Database Migration
```bash
python manage.py migrate
python manage.py setup_rbac
```

### 4. Frontend Build
```bash
cd frontend
npm run build
```

### 5. Server Configuration
- Use Nginx as reverse proxy
- Set up SSL certificates
- Configure subdomain wildcards (*.yourdomain.com)
- Use Gunicorn for Django app server
- Set up Redis for caching and Celery
- Configure email delivery service

## Subdomain Configuration

For local development, add these to your hosts file:
```
127.0.0.1 tenant1.localhost
127.0.0.1 tenant2.localhost
127.0.0.1 demo.localhost
```

For production, configure DNS wildcards:
```
*.yourdomain.com -> Your server IP
```

## Email Templates

Welcome emails and notifications are automatically sent using Django templates in:
- `backend/templates/emails/welcome.html`
- `backend/templates/emails/contact.html`

## Monitoring and Logging

The platform includes:
- Comprehensive audit logging
- User activity tracking
- Error monitoring with Sentry (optional)
- Performance monitoring
- Health checks

## Security Features

- CSRF protection
- SQL injection prevention
- XSS protection
- Secure password policies
- Rate limiting
- Tenant data isolation
- Role-based permissions

## Next Steps

1. **Install missing dependencies**: `pip install -r requirements.txt`
2. **Set up environment variables**: Copy and configure `.env`
3. **Run database migrations**: `python manage.py migrate`
4. **Test the registration flow**: Visit the landing page and register a tenant
5. **Customize branding**: Update logos, colors, and content to match your brand
6. **Configure email delivery**: Set up production SMTP service
7. **Set up domain and SSL**: Configure your domain with wildcard subdomain support

## Common Issues & Solutions

### Issue: Missing Dependencies
**Solution**: Run `pip install -r requirements.txt` to install all backend dependencies

### Issue: Database Connection Error
**Solution**: Ensure PostgreSQL is running and credentials in `.env` are correct

### Issue: Frontend API Calls Fail
**Solution**: Ensure backend server is running on port 8000 and CORS is configured

### Issue: Subdomain Not Working
**Solution**: Configure DNS wildcards or add entries to hosts file for local development

## Support

Your platform is professionally built with industry-standard architecture. The codebase follows Django and React best practices with comprehensive error handling and security measures.

For technical questions:
1. Check the API documentation at `/api/docs/`
2. Review the admin interface at `/admin/`
3. Check application logs for detailed error information
