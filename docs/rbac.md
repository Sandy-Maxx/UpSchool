# Multi-Tenant School ERP - RBAC & Tenant Management

## 🏢 Tenant Registration & Management Flow

### **Production-Ready Tenant Registration System**

The platform features a comprehensive, enterprise-grade tenant registration system that handles complete school onboarding from initial signup to operational readiness.

#### **🌟 Phase 1: Public Registration (5-10 minutes)**

**Multi-Step Frontend Form (localhost:3000)**
1. **School Information**
   - School name, type, and academic focus
   - Complete address breakdown (street, city, state, postal code, country)
   - Contact information (phone, email, website)

2. **Administrator Setup**
   - Personal information (name, job title)
   - Contact details and authentication credentials
   - Professional role assignment

3. **Business Intelligence**
   - Student capacity planning (ranges from 1-50 to 2500+)
   - Staff size estimation (1-10 to 250+ staff)
   - Academic calendar preferences (year start, grade system)
   - Subscription plan selection (Basic/Standard/Premium)

4. **Legal & Marketing Compliance**
   - GDPR-compliant marketing consent
   - Terms of service acceptance
   - Newsletter subscription preferences

#### **🔧 Phase 2: Automatic System Setup (Instant)**

**Backend Processing (`/api/v1/public/register/`)**
- **Tenant Creation**: Unique database naming with UUID (`tenant_subdomain_12345678`)
- **Trial Activation**: 14-day trial with automatic expiration tracking
- **Admin User Setup**: Elevated permissions with RBAC role assignment
- **School Record**: Complete academic institution profile
- **Security**: Multi-tenant isolation with data protection

#### **🚀 Phase 3: Operational Readiness (Immediate)**

**System Access**
- Tenant portal access via subdomain (`https://schoolname.schoolerp.com`)
- Admin dashboard with full management capabilities
- User management foundation ready
- Role-based permission system active

### **Tenant Lifecycle Management**

- **🆕 TRIAL** (14 days): Full access with limited data capacity
- **💳 ACTIVE**: Paid subscription with complete feature set
- **⚠️ SUSPENDED**: Payment issues, read-only access maintained
- **❌ INACTIVE**: Cancelled/expired tenants, no system access

---

## 👥 Comprehensive Role-Based Access Control (RBAC)

### **Enterprise-Grade Permission System**

The platform implements a sophisticated RBAC system designed for multi-tenant educational platforms, supporting complex organizational hierarchies and workflow requirements across two distinct portals: the **SaaS Portal** (for system management) and the **Tenant Portal** (for school management).

### **🎯 User Types & Primary Roles**

#### **1. 👑 SYSTEM SUPERADMIN (SaaS Portal)**

**Scope**: Full platform management and system configuration

**Core Responsibilities:**
- Complete tenant lifecycle management (creation, suspension, activation)
- System-wide user and permission management
- Platform health and performance monitoring
- Global analytics and financial reporting
- Billing and subscription plan management
- System security, compliance, and global settings

**Key Permissions:**
```
- platform.manage        # Full platform administration
- tenants.manage         # Complete tenant management
- system.users.manage    # System admin user management
- platform.analytics.view # Platform-wide analytics
- billing.manage         # Subscription and plan management
- system.configure       # Global system settings
- security.audit         # Platform security logs
```

### **🎯 User Types & Primary Roles**

#### **2. 🔑 ADMINISTRATOR (Tenant Admin)**

**Scope**: Full tenant management and configuration

**Core Responsibilities:**
- Complete school configuration and system settings
- User lifecycle management (creation, modification, deactivation)
- Academic structure setup (grades, subjects, calendar)
- Billing and subscription management
- System integrations and data exports
- Compliance and audit management

**Key Permissions:**
```
- tenant.manage         # Full tenant administration
- users.manage         # Complete user management
- school.configure     # Academic structure setup
- billing.access       # Subscription and payments
- reports.export       # Data exports and analytics
- system.integrate     # Third-party integrations
- audit.access         # Security and compliance logs
```

#### **3. 👨‍🏫 TEACHER (Faculty Member)**

**Scope**: Classroom and student academic management

**Core Responsibilities:**
- Class and subject management for assigned courses
- Student attendance tracking and grade management
- Assignment creation, distribution, and grading
- Parent communication and progress reporting
- Classroom resource and material management

**Sub-Roles & Specializations:**
- **Head Teacher/Department Head**: Cross-departmental administrative rights
- **Subject Coordinator**: Multi-class subject management
- **Class Teacher**: Primary responsibility for specific classes
- **Substitute Teacher**: Temporary assignment access

**Key Permissions:**
```
- classes.manage       # Assigned class management
- students.view        # Student information (assigned classes)
- grades.manage        # Grade entry and modification
- attendance.track     # Attendance management
- assignments.create   # Assignment and assessment tools
- communication.send   # Parent and student messaging
- resources.access     # Teaching materials and library
```

#### **4. 🎓 STUDENT (Learner)**

**Scope**: Personal academic data and learning resources

**Core Responsibilities:**
- Academic schedule and assignment access
- Homework submission and project management
- Grade and progress monitoring
- Learning resource utilization
- Limited communication with faculty

**Sub-Roles:**
- **Class Representative**: Enhanced communication privileges
- **Club/Society Leader**: Activity management permissions
- **Student Council Member**: Limited administrative access

**Key Permissions:**
```
- profile.view         # Personal academic records
- assignments.submit   # Homework and project submission
- schedule.access      # Timetables and calendar
- grades.view         # Personal academic progress
- resources.use       # Library and learning materials
- communication.limited # Teacher messaging (supervised)
```

#### **5. 👨‍👩‍👧‍👦 PARENT/GUARDIAN (Student Guardian)**

**Scope**: Child(ren)'s academic monitoring and engagement

**Core Responsibilities:**
- Academic progress monitoring for assigned children
- Teacher and school communication
- Event participation and meeting attendance
- Fee payment and billing management
- Educational support and involvement

**Key Permissions:**
```
- children.monitor     # Child's academic records and progress
- grades.view         # Academic performance and reports
- attendance.view     # School attendance records
- communication.parent # Teacher and staff messaging
- events.participate  # School events and meetings
- billing.view        # Fee structure and payment history
```

#### **6. 🏢 STAFF (Non-Teaching Support)**

**Scope**: Administrative and operational support functions

**Core Responsibilities:**
- Administrative task execution and data management
- Student record maintenance and enrollment support
- Facility and resource management
- Reception and communication coordination

**Specialized Sub-Roles:**
- **Registrar**: Student enrollment and academic record management
- **Accountant**: Financial management and fee processing
- **Librarian**: Library resource and circulation management
- **IT Support**: Technical assistance and system maintenance
- **Receptionist**: Front desk operations and visitor management
- **Counselor**: Student guidance and psychological support

**Key Permissions:**
```
- records.manage       # Student enrollment and academic records
- communication.staff  # Internal and external communication
- events.coordinate    # School activities and event management
- resources.maintain   # Facility and equipment management
- reports.generate     # Operational and administrative reports
```

### **🏗️ Hierarchical Permission Structure**

#### **4-Tier Role Architecture**

```
👑 PLATFORM LEVEL (System-wide Authority)
└── 👑 System Superadmin (Complete Platform Control)

🏢 TENANT LEVEL (School-wide Authority)
├── 🔑 Tenant Administrator (Complete Control)
├── 📊 Academic Director (Academic Operations)
└── 💼 Operations Manager (Administrative Functions)

🎓 DEPARTMENT LEVEL (Subject/Grade Authority)  
├── 👨‍🏫 Department Head (Subject Leadership)
├── 👨‍🏫 Senior Faculty (Experienced Teachers)
├── 🏢 Department Coordinator (Administrative Support)
└── 👨‍🏫 Faculty Members (Teaching Staff)

🏫 CLASSROOM LEVEL (Direct Teaching Authority)
├── 👨‍🏫 Class Teacher (Primary Class Responsibility)
├── 👨‍🏫 Subject Teachers (Specific Subject Authority)
├── 🎓 Student Leaders (Limited Student Authority)
└── 👨‍👩‍👧‍👦 Parent Representatives (Community Liaison)
```

#### **Permission Inheritance Model**

**Cascading Permissions**: Higher-level roles automatically inherit lower-level permissions
**Role Specialization**: Specific permissions can be added or restricted based on function
**Temporal Access**: Time-limited permissions for substitute roles or temporary assignments
**Context-Sensitive**: Permissions adapt based on academic calendar and school events

### **⚡ Advanced Permission Types**

The system supports 9 granular permission types for precise access control:

- **VIEW**: Read-only access to data and resources
- **CREATE**: Add new records, assignments, or content
- **UPDATE**: Modify existing information and settings
- **DELETE**: Remove records with appropriate safeguards
- **APPROVE**: Workflow approval authority (grades, requests)
- **REJECT**: Workflow rejection with feedback capability
- **EXPORT**: Data extraction and report generation
- **IMPORT**: Bulk data upload and system integration
- **MANAGE**: Complete administrative control over specific areas

### **🔐 Security & Compliance Features**

#### **Enterprise Security**
- **Multi-Factor Authentication**: Enhanced login security
- **Session Management**: Active session tracking and timeout
- **IP-based Access**: Location-restricted access controls
- **Audit Logging**: Complete permission and action history
- **Data Encryption**: Sensitive information protection

#### **Educational Compliance**
- **FERPA Compliance**: Student privacy protection standards
- **GDPR Alignment**: European data protection requirements
- **COPPA Compliance**: Children's online privacy protection
- **Accessibility Standards**: WCAG 2.1 compliance for inclusive access

### **🎛️ Role Management Interface**

#### **Dynamic Assignment Features**
- **Flexible Permissions**: Granular permission customization
- **Temporal Roles**: Academic year or semester-based assignments
- **Conditional Access**: Grade-level or subject-specific permissions
- **Bulk Operations**: Mass role assignments for efficiency
- **Role Templates**: Pre-configured role sets for common positions

#### **Workflow Integration**
- **Approval Workflows**: Multi-level approval processes
- **Notification System**: Role-based alert and communication routing
- **Escalation Procedures**: Automatic permission escalation for urgent matters
- **Delegation Support**: Temporary permission delegation during absences

---

## 🔧 Technical Implementation

### **Core Models & Relationships**

```python
# User Types Available
USER_TYPES = [
    ('admin', 'Administrator'),
    ('teacher', 'Teacher'), 
    ('student', 'Student'),
    ('parent', 'Parent'),
    ('staff', 'Staff'),
]

# Role Hierarchy Levels
ROLE_TYPES = [
    ('system', 'System Role'),     # Platform-wide
    ('tenant', 'Tenant Role'),     # School-wide 
    ('school', 'School Role'),     # Department/class
]

# Granular Permissions
PERMISSION_TYPES = [
    ('view', 'View'), ('create', 'Create'), ('update', 'Update'),
    ('delete', 'Delete'), ('approve', 'Approve'), ('reject', 'Reject'), 
    ('export', 'Export'), ('import', 'Import'), ('manage', 'Manage')
]
```

### **API Integration**

**User Management Methods:**
```python
# Role checking
user.get_roles()              # Retrieve all assigned roles
user.has_role('teacher')      # Check specific role
user.has_permission('grades.manage')  # Check permission

# Permission inheritance
role.get_all_permissions()    # Include inherited permissions
role.has_permission('view')   # Permission validation
```

**Tenant-Specific Endpoints:**
```
# Registration & Management
POST /api/v1/public/register/          # Tenant registration
POST /api/v1/public/check-subdomain/   # Subdomain availability
GET  /api/v1/public/tenant-info/{subdomain}/  # Tenant details

# Role Management
GET  /api/v1/accounts/roles/           # List available roles
POST /api/v1/accounts/user-roles/      # Assign roles to users
GET  /api/v1/accounts/permissions/     # Permission management
```

---

## 📊 Current Implementation Status

### **✅ Completed Features (Stage 2.3: Dual RBAC Permission System)**
- **Complete RBAC Infrastructure**: Dual portal support (SaaS/Tenant)
- **Permission Gate Components**: Component-level access control with multiple variants
- **Role-Based Route Protection**: Authentication and authorization guards
- **Access Denied Components**: Detailed permission feedback and navigation
- **Conditional Rendering System**: Flexible permission-based rendering
- **SaaS Permission Service**: Platform-level permission management
- **Tenant Permission Service**: School-level permission management
- **Specialized Permission Hooks**: Portal-specific hooks (useSaasPermissions, useTenantPermissions)
- **Portal-aware Navigation**: Role-based menu generation
- **Contextual Access Control**: Teacher, parent, and student data isolation
- **Multi-tenant Architecture**: Complete isolation and security
- **User Registration**: Full registration flow with validation
- **Role Framework**: 5 user types with hierarchical structure
- **Permission System**: 9 permission types with inheritance
- **Security Implementation**: Enterprise-grade authentication

### **🛠️ Frontend RBAC Implementation Guide**

#### **Component Architecture**

The RBAC system is implemented with a modular architecture in the frontend:

```
src/shared/rbac/
├── components/           # React components
│   ├── PermissionGate.tsx       # Component-level access control
│   ├── RoleBasedRoute.tsx       # Route protection
│   ├── AccessDenied.tsx         # Access denied pages
│   └── ConditionalRender.tsx    # Conditional rendering
├── hooks/               # Permission hooks
│   ├── useSaasPermissions.ts    # SaaS portal permissions
│   └── useTenantPermissions.ts  # Tenant portal permissions
├── services/            # Business logic
│   ├── saasPermissionService.ts # SaaS service layer
│   └── tenantPermissionService.ts # Tenant service layer
└── types/              # TypeScript definitions
    ├── permissions.ts           # Core types
    ├── saasRoles.ts            # SaaS roles
    └── tenantRoles.ts          # Tenant roles
```

#### **Usage Examples**

**Component-Level Permission Control:**
```tsx
import { PermissionGate, CanCreate, CanUpdate } from '@/shared/rbac';

// Basic usage
<PermissionGate resource="students" action="VIEW">
  <StudentList />
</PermissionGate>

// Quick helpers
<CanCreate resource="grades">
  <AddGradeButton />
</CanCreate>

<CanUpdate resource="attendance">
  <EditAttendanceForm />
</CanUpdate>
```

**Route Protection:**
```tsx
import { RoleBasedRoute, AdminRoute, TeacherRoute } from '@/shared/rbac';

// Admin-only routes
<AdminRoute component={SchoolManagement} />

// Teacher-specific routes
<TeacherRoute component={GradeBook} />

// Multiple permission requirements
<RoleBasedRoute
  component={FinancialReports}
  permissions={[
    { resource: 'fees', action: 'VIEW' },
    { resource: 'reports', action: 'CREATE' }
  ]}
/>
```

**Permission Hooks:**
```tsx
import { useTenantPermissions, useSaasPermissions } from '@/shared/rbac';

// Tenant portal permissions
function SchoolDashboard() {
  const {
    canManageSchool,
    canManageStudents,
    isAdmin,
    isTeacher
  } = useTenantPermissions();

  return (
    <div>
      {canManageSchool() && <SchoolSettings />}
      {isTeacher && <MyClasses />}
      {canManageStudents('CREATE') && <AddStudentButton />}
    </div>
  );
}

// SaaS portal permissions
function PlatformDashboard() {
  const {
    canManagePlatform,
    canManageTenants,
    isSuperAdmin
  } = useSaasPermissions();

  return (
    <div>
      {canManagePlatform() && <SystemControls />}
      {canManageTenants('VIEW') && <TenantList />}
    </div>
  );
}
```

**Conditional Rendering:**
```tsx
import { IfCan, IfRole, IfAdmin, Unless } from '@/shared/rbac';

// Permission-based rendering
<IfCan resource="students" action="CREATE">
  <Button>Add Student</Button>
</IfCan>

// Role-based rendering
<IfRole role="teacher">
  <TeacherToolbar />
</IfRole>

// Admin-only content
<IfAdmin>
  <SystemSettings />
</IfAdmin>

// Inverted logic
<Unless role="student">
  <AdminControls />
</Unless>
```

#### **Contextual Access Control**

The system implements sophisticated contextual access patterns:

```tsx
// Teachers can only access their assigned classes
const { canAccessStudent } = useTenantDataAccess();
const canView = canAccessStudent(studentId, 'VIEW', {
  assignedClasses: teacher.assignedClasses,
  studentClassId: student.classId
});

// Parents can only access their children's data
const canViewGrades = canAccessGrades(studentId, {
  childrenIds: parent.childrenIds
});
```

#### **Type Safety**

The system is fully type-safe with comprehensive TypeScript definitions:

```tsx
type PermissionAction = 
  | 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE'
  | 'APPROVE' | 'REJECT' | 'EXPORT' | 'IMPORT' | 'MANAGE';

type SaasRoleType = 
  | 'system_superadmin' | 'platform_admin'
  | 'support_admin' | 'billing_admin' | 'readonly_admin';

type TenantRoleType = 
  | 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
```

### ✅ **Dashboard Framework Integration**

The RBAC system is fully integrated with the comprehensive dashboard framework:

**📋 Permission-Aware Dashboards:**
- **Role-Based Layouts**: Different dashboard configurations per user role
- **Widget-Level Permissions**: Granular access control for individual widgets
- **Dynamic Menu Generation**: Navigation based on user permissions
- **Contextual Data Access**: Teachers see only assigned classes, parents see only their children

**🎨 Implementation Examples:**
```tsx
// Permission-protected widget
<PermissionGate resource="students" action="VIEW">
  <StudentStatsWidget />
</PermissionGate>

// Role-based dashboard layout
<DashboardLayout
  title={isAdmin ? "School Management" : "My Classes"}
  permissions={['dashboard.view']}
  layoutId={user.role === 'admin' ? 'admin-dashboard' : 'teacher-dashboard'}
>
  {/* Dashboard content */}
</DashboardLayout>
```

**📄 Related Documentation:**
- **[Dashboard Framework Guide](./dashboard-framework.md)**: Complete dashboard system documentation
- **Widget Security**: Permission integration patterns and examples
- **Role-Based Navigation**: Dynamic menu and routing examples

### 🙇 **Development Phase**
- **Role-Specific Dashboards**: Customized interfaces by user type
- **Permission-Based UI**: Dynamic component rendering
- **Advanced User Management**: Invitation workflows and bulk operations
- **Workflow Automation**: Approval processes and notifications
- **Analytics Integration**: Role-based usage and performance metrics

### **🎯 Next Development Milestones**
1. **Dashboard Personalization**: Role-specific landing pages and navigation
2. **Advanced Permissions**: Object-level and field-level access controls  
3. **User Invitation System**: Email-based user onboarding workflows
4. **Role Management UI**: Administrative interface for role assignment
5. **Audit & Compliance**: Enhanced logging and compliance reporting
6. **Mobile Support**: Role-based mobile application access

The RBAC system provides enterprise-grade security and flexibility, designed to scale from small elementary schools to large university systems while maintaining educational workflow optimization and compliance requirements.

