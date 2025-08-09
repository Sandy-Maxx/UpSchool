// ============================================================================
// API TYPE DEFINITIONS
// Complete type definitions for all API endpoints and models
// ============================================================================

import {
  BaseEntity,
  User,
  Tenant,
  Subscription,
  PaginatedResponse,
  Permission,
  Role,
} from './index';

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
  permissions: string[];
}

export interface AuthUser extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  isStaff: boolean;
  lastLogin?: string;
  tenant?: {
    id: string;
    name: string;
    subdomain: string;
    status: string;
  };
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// TENANT REGISTRATION TYPES
// ============================================================================

export interface TenantRegistrationData {
  // School Information
  schoolName: string;
  schoolType: 'public' | 'private' | 'charter' | 'international' | 'other';
  academicFocus?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };

  // Administrator Information
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    password: string;
    confirmPassword: string;
  };

  // Business Intelligence
  studentCapacity: '1-50' | '51-200' | '201-500' | '501-1000' | '1001-2500' | '2500+';
  staffSize: '1-10' | '11-25' | '26-50' | '51-100' | '101-250' | '250+';
  academicYearStart: string;
  gradeSystem: 'k12' | 'primary_secondary' | 'international' | 'other';
  subscriptionPlan: 'basic' | 'standard' | 'premium' | 'enterprise';

  // Legal & Marketing
  gdprConsent: boolean;
  termsAccepted: boolean;
  marketingEmails: boolean;
}

export interface TenantRegistrationResponse {
  tenant: Tenant;
  user: AuthUser;
  trialEndsAt: string;
  setupComplete: boolean;
  accessUrl: string;
}

export interface SubdomainCheckRequest {
  subdomain: string;
}

export interface SubdomainCheckResponse {
  available: boolean;
  suggested?: string[];
}

// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: string;
  sendInvite?: boolean;
  permissions?: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  role?: string;
  permissions?: string[];
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkUserOperation {
  userIds: string[];
  operation: 'activate' | 'deactivate' | 'delete' | 'change_role';
  data?: {
    role?: string;
    permissions?: string[];
  };
}

// ============================================================================
// STUDENT MANAGEMENT TYPES
// ============================================================================

export interface Student extends BaseEntity {
  studentId: string;
  user: User;
  grade: {
    id: string;
    name: string;
    level: number;
  };
  class?: {
    id: string;
    name: string;
    section: string;
  };
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  parentGuardians: ParentGuardian[];
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  academicRecord: {
    gpa?: number;
    totalCredits?: number;
    attendance?: {
      present: number;
      absent: number;
      late: number;
    };
  };
}

export interface ParentGuardian extends BaseEntity {
  user: User;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  isPrimary: boolean;
  emergencyContact: boolean;
}

export interface CreateStudentRequest {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  gradeId: string;
  classId?: string;
  enrollmentDate: string;
  parentGuardians?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
    emergencyContact: boolean;
  }>;
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    emergencyContact?: string;
    emergencyPhone?: string;
  };
}

// ============================================================================
// ACADEMIC MANAGEMENT TYPES
// ============================================================================

export interface Grade extends BaseEntity {
  name: string;
  level: number;
  description?: string;
  ageRange: {
    min: number;
    max: number;
  };
  capacity: number;
  currentEnrollment: number;
}

export interface Class extends BaseEntity {
  name: string;
  section: string;
  grade: Grade;
  teacher?: User;
  subjects: Subject[];
  capacity: number;
  currentEnrollment: number;
  academicYear: string;
  schedule?: ClassSchedule[];
}

export interface Subject extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  credits: number;
  department?: string;
  prerequisites?: Subject[];
}

export interface ClassSchedule extends BaseEntity {
  class: Class;
  subject: Subject;
  teacher: User;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  room?: string;
}

// ============================================================================
// LIBRARY MANAGEMENT TYPES
// ============================================================================

export interface Book extends BaseEntity {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  category: BookCategory;
  language: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
  description?: string;
  coverImage?: string;
}

export interface BookCategory extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  parentCategory?: BookCategory;
}

export interface BookBorrowing extends BaseEntity {
  book: Book;
  borrower: User;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: 'borrowed' | 'returned' | 'overdue' | 'lost';
  fine?: number;
  renewalCount: number;
  notes?: string;
}

// ============================================================================
// TRANSPORT MANAGEMENT TYPES
// ============================================================================

export interface Vehicle extends BaseEntity {
  registrationNumber: string;
  type: 'bus' | 'van' | 'car';
  capacity: number;
  driver?: Driver;
  route?: Route;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
}

export interface Driver extends BaseEntity {
  user: User;
  licenseNumber: string;
  licenseExpiryDate: string;
  experience: number;
  status: 'active' | 'inactive' | 'suspended';
  emergencyContact: string;
}

export interface Route extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  stops: RouteStop[];
  estimatedDuration: number; // in minutes
  distance: number; // in kilometers
  status: 'active' | 'inactive';
}

export interface RouteStop extends BaseEntity {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  estimatedTime: string;
  order: number;
}

// ============================================================================
// COMMUNICATION TYPES
// ============================================================================

export interface Message extends BaseEntity {
  sender: User;
  recipients: User[];
  subject: string;
  content: string;
  messageType: 'direct' | 'group' | 'announcement' | 'system';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  parentMessage?: string; // For threading
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
}

export interface MessageAttachment extends BaseEntity {
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  author: User;
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'staff' | 'grade_specific';
  targetGrades?: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  publishDate: string;
  expiryDate?: string;
  status: 'draft' | 'published' | 'archived';
  attachments?: MessageAttachment[];
}

// ============================================================================
// REPORTS & ANALYTICS TYPES
// ============================================================================

export interface Report extends BaseEntity {
  name: string;
  type:
    | 'student_performance'
    | 'attendance'
    | 'financial'
    | 'library_usage'
    | 'transport'
    | 'custom';
  description?: string;
  parameters: ReportParameter[];
  template: string;
  generatedBy: User;
  generatedAt: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  fileUrl?: string;
  status: 'generating' | 'completed' | 'failed';
}

export interface ReportParameter {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  value?: unknown;
  options?: Array<{ value: unknown; label: string }>;
}

export interface AnalyticsData {
  metric: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
  period: string;
  trend: 'up' | 'down' | 'stable';
  data?: Array<{
    label: string;
    value: number;
    date?: string;
  }>;
}

// ============================================================================
// SYSTEM & TENANT TYPES
// ============================================================================

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  databaseStatus: 'connected' | 'disconnected';
  redisStatus: 'connected' | 'disconnected';
  services: Array<{
    name: string;
    status: 'healthy' | 'unhealthy';
    responseTime?: number;
    lastChecked: string;
  }>;
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
}

export interface TenantMetrics {
  tenantId: string;
  activeUsers: number;
  totalUsers: number;
  storageUsed: number; // in MB
  apiCalls: number;
  lastActivity: string;
  subscriptionStatus: 'trial' | 'active' | 'suspended' | 'cancelled';
  billingStatus: 'current' | 'past_due' | 'unpaid';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ApiEndpoints {
  // Authentication
  LOGIN: '/auth/login/';
  LOGOUT: '/auth/logout/';
  REFRESH: '/auth/refresh/';
  PASSWORD_RESET: '/auth/password/reset/';
  PASSWORD_RESET_CONFIRM: '/auth/password/reset/confirm/';
  CHANGE_PASSWORD: '/auth/password/change/';

  // User Management
  USERS: '/users/';
  USER_PROFILE: '/users/profile/';
  USER_ROLES: '/users/roles/';

  // Student Management
  STUDENTS: '/students/';
  STUDENT_ENROLLMENT: '/students/enrollment/';
  PARENT_GUARDIANS: '/students/parents/';

  // Academic Management
  GRADES: '/academic/grades/';
  CLASSES: '/academic/classes/';
  SUBJECTS: '/academic/subjects/';
  SCHEDULES: '/academic/schedules/';

  // Library Management
  BOOKS: '/library/books/';
  BOOK_CATEGORIES: '/library/categories/';
  BORROWINGS: '/library/borrowings/';

  // Transport Management
  VEHICLES: '/transport/vehicles/';
  DRIVERS: '/transport/drivers/';
  ROUTES: '/transport/routes/';

  // Communication
  MESSAGES: '/communication/messages/';
  ANNOUNCEMENTS: '/communication/announcements/';

  // Reports
  REPORTS: '/reports/';
  ANALYTICS: '/reports/analytics/';

  // System (SaaS Portal)
  TENANTS: '/tenants/';
  SYSTEM_HEALTH: '/system/health/';
  TENANT_REGISTRATION: '/public/register/';
  SUBDOMAIN_CHECK: '/public/check-subdomain/';
}

// Export all API-related types
export type {
  // Re-export from index
  ApiResponse,
  ApiError,
  PaginatedResponse,
  User,
  Role,
  Permission,
  Tenant,
  Subscription,
};
