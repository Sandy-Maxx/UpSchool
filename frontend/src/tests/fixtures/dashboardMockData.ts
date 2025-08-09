/**
 * Dashboard Mock Data - Comprehensive Test Fixtures
 * Multi-Tenant School ERP Platform
 *
 * Production-realistic mock data for dashboard component testing,
 * covering all scenarios including edge cases and error states.
 */

// Platform Metrics Mock Data
export const platformMetrics = {
  totalTenants: 1247,
  activeTenants: 1156,
  suspendedTenants: 91,
  totalUsers: 45678,
  activeUsers: 42341,
  totalRevenue: 2847365.5,
  monthlyRevenue: 234558.75,
  systemUptime: 99.97,
  apiCallsToday: 2847365,
  storageUsed: 845.2, // GB
  trends: {
    tenants: { value: 12.5, direction: 'up' as const },
    users: { value: 8.3, direction: 'up' as const },
    revenue: { value: 15.7, direction: 'up' as const },
    uptime: { value: -0.03, direction: 'down' as const },
  },
  charts: {
    userGrowth: [
      { month: 'Jan', users: 38000, tenants: 1100 },
      { month: 'Feb', users: 39200, tenants: 1125 },
      { month: 'Mar', users: 41500, tenants: 1180 },
      { month: 'Apr', users: 43200, tenants: 1220 },
      { month: 'May', users: 44800, tenants: 1240 },
      { month: 'Jun', users: 45678, tenants: 1247 },
    ],
    revenueBreakdown: [
      { plan: 'Basic', revenue: 458000, color: '#3b82f6' },
      { plan: 'Standard', revenue: 892000, color: '#10b981' },
      { plan: 'Premium', revenue: 1247000, color: '#f59e0b' },
      { plan: 'Enterprise', revenue: 250365, color: '#8b5cf6' },
    ],
  },
};

// Tenant Data Mock
export const tenants = [
  {
    id: 'tenant-001',
    name: 'Greenwood Elementary School',
    domain: 'greenwood.schoolerp.com',
    status: 'ACTIVE' as const,
    plan: 'PREMIUM' as const,
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-08-07T02:45:00Z',
    users: 245,
    students: 580,
    teachers: 32,
    monthlyRevenue: 2450.0,
    storageUsed: 15.7, // GB
    apiCalls: 45678,
    location: {
      city: 'Springfield',
      state: 'NY',
      country: 'USA',
    },
    contact: {
      name: 'Dr. Sarah Johnson',
      email: 'admin@greenwood.edu',
      phone: '+1-555-0123',
    },
  },
  {
    id: 'tenant-002',
    name: 'Oak Hill High School',
    domain: 'oakhill.schoolerp.com',
    status: 'SUSPENDED' as const,
    plan: 'STANDARD' as const,
    createdAt: '2024-02-20T14:15:00Z',
    lastActivity: '2024-08-05T18:20:00Z',
    users: 156,
    students: 420,
    teachers: 28,
    monthlyRevenue: 1750.0,
    storageUsed: 23.4, // GB
    apiCalls: 32145,
    location: {
      city: 'Madison',
      state: 'WI',
      country: 'USA',
    },
    contact: {
      name: 'Mr. David Chen',
      email: 'principal@oakhill.edu',
      phone: '+1-555-0234',
    },
  },
  {
    id: 'tenant-003',
    name: 'Riverside International Academy',
    domain: 'riverside.schoolerp.com',
    status: 'ACTIVE' as const,
    plan: 'ENTERPRISE' as const,
    createdAt: '2023-09-10T09:00:00Z',
    lastActivity: '2024-08-07T01:30:00Z',
    users: 487,
    students: 1250,
    teachers: 78,
    monthlyRevenue: 5500.0,
    storageUsed: 45.8, // GB
    apiCalls: 98765,
    location: {
      city: 'Portland',
      state: 'OR',
      country: 'USA',
    },
    contact: {
      name: 'Ms. Emily Rodriguez',
      email: 'director@riverside.edu',
      phone: '+1-555-0345',
    },
  },
];

// System Health Mock Data
export const systemHealth = {
  status: 'healthy' as const,
  uptime: 99.97,
  responseTime: 145, // ms
  databaseStatus: 'connected' as const,
  redisStatus: 'connected' as const,
  services: [
    {
      name: 'Authentication Service',
      status: 'healthy' as const,
      responseTime: 89,
      lastChecked: '2024-08-07T02:59:00Z',
    },
    {
      name: 'API Gateway',
      status: 'healthy' as const,
      responseTime: 156,
      lastChecked: '2024-08-07T02:59:00Z',
    },
    {
      name: 'Database',
      status: 'healthy' as const,
      responseTime: 45,
      lastChecked: '2024-08-07T02:59:00Z',
    },
    {
      name: 'File Storage',
      status: 'healthy' as const,
      responseTime: 234,
      lastChecked: '2024-08-07T02:59:00Z',
    },
    {
      name: 'Email Service',
      status: 'healthy' as const,
      responseTime: 567,
      lastChecked: '2024-08-07T02:59:00Z',
    },
  ],
  metrics: {
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    diskUsage: 23.5,
    networkLatency: 12.3,
  },
  alerts: [
    {
      id: 'alert-001',
      severity: 'warning' as const,
      message: 'High memory usage detected on server-3',
      timestamp: '2024-08-07T01:45:00Z',
      resolved: false,
    },
  ],
};

// Revenue Analytics Mock Data
export const revenueAnalytics = {
  totalRevenue: 2847365.5,
  monthlyRevenue: 234558.75,
  yearOverYear: 18.5, // percentage growth
  monthOverMonth: 7.2,
  breakdown: {
    byPlan: [
      { plan: 'Basic', revenue: 458000, percentage: 16.1, tenants: 456 },
      { plan: 'Standard', revenue: 892000, percentage: 31.3, tenants: 387 },
      { plan: 'Premium', revenue: 1247000, percentage: 43.8, tenants: 298 },
      { plan: 'Enterprise', revenue: 250365, percentage: 8.8, tenants: 106 },
    ],
    byRegion: [
      { region: 'North America', revenue: 1698219, percentage: 59.6 },
      { region: 'Europe', revenue: 569455, percentage: 20.0 },
      { region: 'Asia Pacific', revenue: 398273, percentage: 14.0 },
      { region: 'Latin America', revenue: 181418, percentage: 6.4 },
    ],
  },
  projections: {
    nextMonth: 251750,
    nextQuarter: 765200,
    annualForecast: 3420000,
  },
  charts: {
    monthlyRevenue: [
      { month: 'Jan', revenue: 198450, target: 190000 },
      { month: 'Feb', revenue: 205670, target: 200000 },
      { month: 'Mar', revenue: 223890, target: 215000 },
      { month: 'Apr', revenue: 218750, target: 220000 },
      { month: 'May', revenue: 231200, target: 225000 },
      { month: 'Jun', revenue: 234558, target: 230000 },
    ],
  },
};

// Security Center Mock Data
export const securityCenter = {
  overallScore: 87,
  threatLevel: 'low' as const,
  activeIncidents: 2,
  resolvedIncidents: 45,
  securityEvents: [
    {
      id: 'event-001',
      type: 'failed_login' as const,
      severity: 'medium' as const,
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-08-07T02:30:00Z',
      ipAddress: '192.168.1.100',
      tenantId: 'tenant-001',
      resolved: false,
    },
    {
      id: 'event-002',
      type: 'suspicious_activity' as const,
      severity: 'high' as const,
      description: 'Unusual API access pattern detected',
      timestamp: '2024-08-07T01:15:00Z',
      ipAddress: '10.0.0.45',
      tenantId: 'tenant-002',
      resolved: true,
    },
  ],
  vulnerabilities: [
    {
      id: 'vuln-001',
      severity: 'medium' as const,
      title: 'Outdated SSL certificate on subdomain',
      description: 'SSL certificate for test.schoolerp.com expires in 7 days',
      affectedTenants: ['tenant-001'],
      status: 'open' as const,
    },
  ],
  compliance: {
    gdpr: { status: 'compliant', score: 95 },
    ferpa: { status: 'compliant', score: 92 },
    coppa: { status: 'compliant', score: 88 },
    sox: { status: 'pending_review', score: 78 },
  },
};

// Quick Actions Mock Data
export const quickActions = [
  {
    id: 'action-001',
    title: 'Create New Tenant',
    description: 'Set up a new school tenant',
    icon: 'AddIcon',
    action: 'create_tenant',
    permissions: ['TENANT_CREATE'],
  },
  {
    id: 'action-002',
    title: 'System Maintenance',
    description: 'Schedule system maintenance',
    icon: 'SettingsIcon',
    action: 'schedule_maintenance',
    permissions: ['SYSTEM_ADMIN'],
  },
  {
    id: 'action-003',
    title: 'Generate Report',
    description: 'Create platform analytics report',
    icon: 'AssessmentIcon',
    action: 'generate_report',
    permissions: ['REPORTING_ACCESS'],
  },
  {
    id: 'action-004',
    title: 'Security Audit',
    description: 'Run comprehensive security scan',
    icon: 'SecurityIcon',
    action: 'security_audit',
    permissions: ['SECURITY_AUDIT'],
  },
  {
    id: 'action-005',
    title: 'Backup System',
    description: 'Initialize system backup',
    icon: 'BackupIcon',
    action: 'backup_system',
    permissions: ['BACKUP_ADMIN'],
  },
  {
    id: 'action-006',
    title: 'View Logs',
    description: 'Access system audit logs',
    icon: 'ListIcon',
    action: 'view_logs',
    permissions: ['LOG_ACCESS'],
  },
];

// Edge Cases and Error Scenarios
export const errorScenarios = {
  networkError: {
    message: 'Network request failed',
    code: 'NETWORK_ERROR',
    timestamp: '2024-08-07T03:00:00Z',
  },
  serverError: {
    message: 'Internal server error',
    code: 'SERVER_ERROR',
    status: 500,
    timestamp: '2024-08-07T03:00:00Z',
  },
  unauthorizedError: {
    message: 'Insufficient permissions',
    code: 'UNAUTHORIZED',
    status: 403,
    timestamp: '2024-08-07T03:00:00Z',
  },
  validationError: {
    message: 'Invalid input data',
    code: 'VALIDATION_ERROR',
    status: 400,
    details: {
      field: 'email',
      reason: 'Invalid email format',
    },
    timestamp: '2024-08-07T03:00:00Z',
  },
};

// Large Dataset for Performance Testing
export const largeDataset = {
  tenants: Array.from({ length: 1000 }, (_, i) => ({
    id: `tenant-${String(i + 1).padStart(3, '0')}`,
    name: `School ${i + 1}`,
    domain: `school${i + 1}.schoolerp.com`,
    status: Math.random() > 0.1 ? 'ACTIVE' : 'SUSPENDED',
    plan: ['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'][Math.floor(Math.random() * 4)],
    users: Math.floor(Math.random() * 500) + 50,
    students: Math.floor(Math.random() * 1000) + 100,
    monthlyRevenue: Math.floor(Math.random() * 5000) + 500,
  })),
  metrics: Array.from({ length: 365 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    users: Math.floor(Math.random() * 50000) + 40000,
    revenue: Math.floor(Math.random() * 100000) + 200000,
    apiCalls: Math.floor(Math.random() * 1000000) + 500000,
  })),
};

// Combined export object
export const mockData = {
  platformMetrics,
  tenants,
  systemHealth,
  revenueAnalytics,
  securityCenter,
  quickActions,
  errorScenarios,
  largeDataset,
};

export default mockData;
