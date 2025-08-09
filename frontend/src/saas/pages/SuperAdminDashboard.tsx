import React from 'react';
import { SuperAdminDashboard } from '../components/superadmin/dashboard';

/**
 * System Superadmin Dashboard Page
 *
 * This is the main dashboard page for system administrators of the SaaS platform.
 * It provides an overview of all tenants, system health, revenue analytics,
 * and quick actions for platform management.
 *
 * Features:
 * - Platform-wide metrics and KPIs
 * - Tenant overview and management
 * - System health monitoring
 * - Revenue and billing analytics
 * - Security center and alerts
 * - Quick actions for common tasks
 */
const SuperAdminDashboardPage: React.FC = () => {
  return <SuperAdminDashboard />;
};

export default SuperAdminDashboardPage;
