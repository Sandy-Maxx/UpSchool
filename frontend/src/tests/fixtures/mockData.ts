/**
 * Mock Data Fixtures for Testing
 * Multi-Tenant School ERP Platform - Production Test Data
 */

// Platform Metrics Mock Data
export const mockPlatformMetrics = {
  totalTenants: 1247,
  activeTenants: 1156,
  totalUsers: 45623,
  activeUsers: 32451,
  totalRevenue: 2847365.5,
  monthlyRevenue: 234557.75,
  systemUptime: 99.97,
  apiCallsToday: 1234567,
  storageUsed: 847.2, // GB
  dataTransferred: 1234.5, // GB
  trends: {
    tenants: { value: 12.5, direction: 'up' as const },
    users: { value: 8.3, direction: 'up' as const },
    revenue: { value: 15.7, direction: 'up' as const },
    uptime: { value: -0.03, direction: 'down' as const },
  },
};

// Tenant Overview Mock Data
export const mockTenants = [
  {
    id: 'tenant-001',
    name: 'Greenwood Elementary School',
    domain: 'greenwood.schoolerp.com',
    status: 'ACTIVE' as const,
    plan: 'PREMIUM' as const,
    users: 245,
    students: 580,
    teachers: 32,
    createdAt: '2024-01-15T09:00:00Z',
    lastActivity: '2024-08-07T00:15:30Z',
    monthlyRevenue: 2450.0,
    storageUsed: 15.7, // GB
    location: 'New York, NY',
    contactEmail: 'admin@greenwood.edu',
    subscriptionEnd: '2024-12-31T23:59:59Z',
  },
  {
    id: 'tenant-002',
    name: 'Oak Hill High School',
    domain: 'oakhill.schoolerp.com',
    status: 'SUSPENDED' as const,
    plan: 'STANDARD' as const,
    users: 156,
    students: 890,
    teachers: 45,
    createdAt: '2024-02-10T14:30:00Z',
    lastActivity: '2024-08-05T16:22:15Z',
    monthlyRevenue: 1560.0,
    storageUsed: 23.4, // GB
    location: 'California, CA',
    contactEmail: 'admin@oakhill.edu',
    subscriptionEnd: '2024-11-30T23:59:59Z',
  },
  {
    id: 'tenant-003',
    name: 'Riverside International Academy',
    domain: 'riverside.schoolerp.com',
    status: 'ACTIVE' as const,
    plan: 'ENTERPRISE' as const,
    users: 432,
    students: 1250,
    teachers: 78,
    createdAt: '2023-09-20T11:45:00Z',
    lastActivity: '2024-08-06T23:45:12Z',
    monthlyRevenue: 4320.0,
    storageUsed: 45.8, // GB
    location: 'London, UK',
    contactEmail: 'admin@riverside.edu',
    subscriptionEnd: '2025-09-19T23:59:59Z',
  },
];

// System Health Mock Data
export const mockSystemHealth = {
  overall: 98.5,
  components: [
    {
      name: 'API Gateway',
      status: 'HEALTHY' as const,
      uptime: 99.8,
      responseTime: 45, // ms
      lastCheck: '2024-08-07T00:19:30Z',
      endpoint: '/api/health',
    },
    {
      name: 'Database Primary',
      status: 'HEALTHY' as const,
      uptime: 99.9,
      responseTime: 12, // ms
      lastCheck: '2024-08-07T00:19:28Z',
      endpoint: '/db/health',
    },
    {
      name: 'Redis Cache',
      status: 'WARNING' as const,
      uptime: 97.2,
      responseTime: 8, // ms
      lastCheck: '2024-08-07T00:19:25Z',
      endpoint: '/cache/health',
    },
    {
      name: 'File Storage',
      status: 'HEALTHY' as const,
      uptime: 99.7,
      responseTime: 65, // ms
      lastCheck: '2024-08-07T00:19:20Z',
      endpoint: '/storage/health',
    },
    {
      name: 'Email Service',
      status: 'CRITICAL' as const,
      uptime: 85.4,
      responseTime: 1200, // ms
      lastCheck: '2024-08-07T00:18:45Z',
      endpoint: '/email/health',
    },
  ],
  alerts: [
    {
      id: 'alert-001',
      type: 'WARNING' as const,
      component: 'Redis Cache',
      message: 'High memory usage detected (85% capacity)',
      timestamp: '2024-08-07T00:15:30Z',
      acknowledged: false,
    },
    {
      id: 'alert-002',
      type: 'CRITICAL' as const,
      component: 'Email Service',
      message: 'Service unavailable - Connection timeout',
      timestamp: '2024-08-07T00:10:15Z',
      acknowledged: false,
    },
  ],
  metrics: {
    cpuUsage: 67.3,
    memoryUsage: 78.9,
    diskUsage: 45.2,
    networkIn: 234.5, // MB/s
    networkOut: 189.3, // MB/s
    activeConnections: 15432,
  },
};

// Revenue Analytics Mock Data
export const mockRevenueAnalytics = {
  totalRevenue: 2847365.5,
  monthlyRevenue: 234557.75,
  annualGrowth: 23.5,
  monthlyGrowth: 8.2,
  revenueByMonth: [
    { month: 'Jan', revenue: 198750.25, subscriptions: 45, churn: 2.1 },
    { month: 'Feb', revenue: 205430.8, subscriptions: 52, churn: 1.8 },
    { month: 'Mar', revenue: 189320.15, subscriptions: 38, churn: 3.2 },
    { month: 'Apr', revenue: 234890.4, subscriptions: 67, churn: 1.5 },
    { month: 'May', revenue: 256780.9, subscriptions: 78, churn: 1.9 },
    { month: 'Jun', revenue: 278450.35, subscriptions: 82, churn: 1.2 },
    { month: 'Jul', revenue: 234557.75, subscriptions: 59, churn: 2.4 },
  ],
  paymentMethods: [
    { method: 'Credit Card', percentage: 68.5, amount: 1950475.23 },
    { method: 'Bank Transfer', percentage: 22.3, amount: 635002.91 },
    { method: 'PayPal', percentage: 6.8, damage: 193740.84 },
    { method: 'Invoice', percentage: 2.4, amount: 68346.52 },
  ],
  subscriptionPlans: [
    { plan: 'BASIC', count: 145, revenue: 87000.0, churnRate: 3.2 },
    { plan: 'STANDARD', count: 578, revenue: 867000.0, churnRate: 2.1 },
    { plan: 'PREMIUM', count: 342, revenue: 1368000.0, churnRate: 1.5 },
    { plan: 'ENTERPRISE', count: 89, revenue: 712000.0, churnRate: 0.8 },
  ],
  churnAnalysis: {
    overallChurnRate: 2.1,
    churnByPlan: {
      BASIC: 3.2,
      STANDARD: 2.1,
      PREMIUM: 1.5,
      ENTERPRISE: 0.8,
    },
    topChurnReasons: [
      { reason: 'Price', percentage: 28.5 },
      { reason: 'Feature Limitations', percentage: 24.3 },
      { reason: 'Support Issues', percentage: 18.7 },
      { reason: 'Migration', percentage: 15.2 },
      { reason: 'Other', percentage: 13.3 },
    ],
  },
};

// Security Center Mock Data
export const mockSecurityData = {
  securityScore: 87.5,
  threatsBlocked: 1247,
  vulnerabilities: {
    critical: 0,
    high: 2,
    medium: 8,
    low: 15,
  },
  lastScan: '2024-08-06T22:30:00Z',
  recentIncidents: [
    {
      id: 'incident-001',
      type: 'FAILED_LOGIN' as const,
      severity: 'MEDIUM' as const,
      description: 'Multiple failed login attempts from IP: 192.168.1.100',
      timestamp: '2024-08-07T00:05:30Z',
      status: 'INVESTIGATING' as const,
      affectedTenant: 'tenant-002',
      actionsTaken: ['IP_BLOCKED', 'ACCOUNT_LOCKED'],
    },
    {
      id: 'incident-002',
      type: 'SUSPICIOUS_ACTIVITY' as const,
      severity: 'HIGH' as const,
      description: 'Unusual data access pattern detected',
      timestamp: '2024-08-06T23:45:15Z',
      status: 'RESOLVED' as const,
      affectedTenant: 'tenant-001',
      actionsTaken: ['SESSION_TERMINATED', 'ADMIN_NOTIFIED'],
    },
    {
      id: 'incident-003',
      type: 'UNAUTHORIZED_ACCESS' as const,
      severity: 'CRITICAL' as const,
      description: 'Attempted access to restricted API endpoint',
      timestamp: '2024-08-06T18:22:45Z',
      status: 'RESOLVED' as const,
      affectedTenant: null,
      actionsTaken: ['ACCESS_DENIED', 'SECURITY_AUDIT', 'IP_BLOCKED'],
    },
  ],
  securityMetrics: {
    activeUsers: 32451,
    authenticatedSessions: 28934,
    failedLogins: 156,
    blockedIPs: 23,
    twoFactorEnabled: 89.3, // percentage
    passwordCompliance: 94.7, // percentage
    encryptionCoverage: 100, // percentage
  },
  complianceStatus: {
    gdpr: 'COMPLIANT' as const,
    ferpa: 'COMPLIANT' as const,
    coppa: 'COMPLIANT' as const,
    sox: 'PENDING' as const,
    lastAudit: '2024-06-15T00:00:00Z',
    nextAudit: '2024-12-15T00:00:00Z',
  },
};

// Quick Actions Mock Data
export const mockQuickActions = {
  urgentActions: [
    {
      id: 'action-001',
      type: 'SECURITY_ALERT' as const,
      title: 'Resolve Critical Security Incident',
      description: 'Email service vulnerability requires immediate attention',
      priority: 'CRITICAL' as const,
      estimatedTime: '15 min',
      assignedTo: 'Security Team',
      dueDate: '2024-08-07T01:00:00Z',
    },
    {
      id: 'action-002',
      type: 'SYSTEM_MAINTENANCE' as const,
      title: 'Redis Cache Optimization',
      description: 'High memory usage needs configuration adjustment',
      priority: 'HIGH' as const,
      estimatedTime: '30 min',
      assignedTo: 'DevOps Team',
      dueDate: '2024-08-07T06:00:00Z',
    },
    {
      id: 'action-003',
      type: 'TENANT_ISSUE' as const,
      title: 'Oak Hill Suspension Review',
      description: 'Review tenant suspension and payment status',
      priority: 'MEDIUM' as const,
      estimatedTime: '45 min',
      assignedTo: 'Customer Success',
      dueDate: '2024-08-07T12:00:00Z',
    },
  ],
  commonActions: [
    {
      id: 'common-001',
      title: 'Create New Tenant',
      icon: 'AddBusiness',
      url: '/saas/tenants/create',
      permissions: ['TENANT_CREATE'],
    },
    {
      id: 'common-002',
      title: 'System Health Check',
      icon: 'HealthAndSafety',
      url: '/saas/system/health',
      permissions: ['SYSTEM_MONITORING'],
    },
    {
      id: 'common-003',
      title: 'Revenue Report',
      icon: 'Analytics',
      url: '/saas/analytics/revenue',
      permissions: ['REVENUE_ANALYTICS'],
    },
    {
      id: 'common-004',
      title: 'Security Dashboard',
      icon: 'Security',
      url: '/saas/security',
      permissions: ['SECURITY_MANAGEMENT'],
    },
    {
      id: 'common-005',
      title: 'User Management',
      icon: 'People',
      url: '/saas/users',
      permissions: ['USER_MANAGEMENT'],
    },
    {
      id: 'common-006',
      title: 'Backup Status',
      icon: 'Backup',
      url: '/saas/system/backups',
      permissions: ['SYSTEM_MONITORING'],
    },
  ],
  recentActivities: [
    {
      id: 'activity-001',
      type: 'TENANT_CREATED',
      description: 'New tenant "Riverside International Academy" created',
      user: 'System Admin',
      timestamp: '2024-08-06T15:30:00Z',
    },
    {
      id: 'activity-002',
      type: 'SECURITY_SCAN',
      description: 'Automated security scan completed',
      user: 'Security System',
      timestamp: '2024-08-06T14:00:00Z',
    },
    {
      id: 'activity-003',
      type: 'BACKUP_COMPLETED',
      description: 'Daily system backup completed successfully',
      user: 'Backup System',
      timestamp: '2024-08-06T02:00:00Z',
    },
  ],
};

// Dashboard Widget Configuration Mock Data
export const mockWidgetConfig = {
  superAdminWidgets: [
    {
      id: 'platform-metrics',
      title: 'Platform Metrics',
      type: 'metrics',
      position: { x: 0, y: 0, w: 6, h: 3 },
      refreshInterval: 30000, // 30 seconds
      permissions: ['PLATFORM_METRICS'],
    },
    {
      id: 'tenant-overview',
      title: 'Tenant Overview',
      type: 'table',
      position: { x: 6, y: 0, w: 6, h: 4 },
      refreshInterval: 60000, // 1 minute
      permissions: ['TENANT_READ'],
    },
    {
      id: 'system-health',
      title: 'System Health',
      type: 'health',
      position: { x: 0, y: 3, w: 4, h: 3 },
      refreshInterval: 15000, // 15 seconds
      permissions: ['SYSTEM_MONITORING'],
    },
    {
      id: 'revenue-analytics',
      title: 'Revenue Analytics',
      type: 'chart',
      position: { x: 4, y: 3, w: 4, h: 3 },
      refreshInterval: 300000, // 5 minutes
      permissions: ['REVENUE_ANALYTICS'],
    },
    {
      id: 'security-center',
      title: 'Security Center',
      type: 'security',
      position: { x: 8, y: 3, w: 4, h: 3 },
      refreshInterval: 30000, // 30 seconds
      permissions: ['SECURITY_MANAGEMENT'],
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      type: 'actions',
      position: { x: 0, y: 6, w: 12, h: 2 },
      refreshInterval: 120000, // 2 minutes
      permissions: ['PLATFORM_ADMIN'],
    },
  ],
};

// Authentication Mock Data
export const mockAuthTokens = {
  validJWT:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXN1cGVyLWFkbWluLWlkIiwiZW1haWwiOiJzdXBlcmFkbWluQHNjaG9vbGVycC5jb20iLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJwZXJtaXNzaW9ucyI6WyJQTEFURk9STV9BRE1JTiIsIlRFTkFOVF9NQU5BR0VNRU5UIl0sImlhdCI6MTY5MTM2NjQwMCwiZXhwIjoxNjkxMzcwMDAwfQ.mock-signature-for-testing',
  expiredJWT:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXN1cGVyLWFkbWluLWlkIiwiZW1haWwiOiJzdXBlcmFkbWluQHNjaG9vbGVycC5jb20iLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJwZXJtaXNzaW9ucyI6WyJQTEFURk9STV9BRE1JTiIsIlRFTkFOVF9NQU5BR0VNRU5UIl0sImlhdCI6MTY5MTM2NjQwMCwiZXhwIjoxNjkxMzY2NDAwfQ.expired-signature',
  refreshToken: 'refresh-token-mock-value-for-testing',
  malformedJWT: 'invalid.jwt.token',
};

// Error Mock Data
export const mockErrors = {
  networkError: {
    code: 'NETWORK_ERROR',
    message: 'Network request failed',
    status: 0,
  },
  authenticationError: {
    code: 'AUTHENTICATION_FAILED',
    message: 'Invalid credentials provided',
    status: 401,
  },
  authorizationError: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'User lacks required permissions',
    status: 403,
  },
  validationError: {
    code: 'VALIDATION_ERROR',
    message: 'Input validation failed',
    status: 400,
    details: [
      { field: 'email', message: 'Invalid email format' },
      { field: 'password', message: 'Password too weak' },
    ],
  },
  serverError: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    status: 500,
  },
};

// Export all mock data
export const mockData = {
  platformMetrics: mockPlatformMetrics,
  tenants: mockTenants,
  systemHealth: mockSystemHealth,
  revenueAnalytics: mockRevenueAnalytics,
  securityData: mockSecurityData,
  quickActions: mockQuickActions,
  widgetConfig: mockWidgetConfig,
  authTokens: mockAuthTokens,
  errors: mockErrors,
};
