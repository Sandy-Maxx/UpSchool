/**
 * Tenant Overview Component Tests - Production-Grade Testing
 * Multi-Tenant School ERP Platform
 *
 * Comprehensive testing for Tenant Overview dashboard component,
 * covering RBAC security, data management, bulk operations, and real-world scenarios.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import TenantOverview from '../TenantOverview';
import { mockData } from '../../../../../tests/fixtures/mockData';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Create theme for testing
const theme = createTheme();

// Wrapper component with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('TenantOverview Component - Production Testing', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  describe('Data Display and Tenant Management', () => {
    test('should display tenant list with correct information', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: {
              page: 1,
              limit: 10,
              total: mockData.tenants.length,
              totalPages: 1,
            },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        console.log(screen.debug());
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      const row = await screen.findByTestId('tenant-row-tenant-001');
      expect(within(row).getByText('Greenwood Elementary School')).toBeInTheDocument();
      expect(within(row).getByText('greenwood.schoolerp.com')).toBeInTheDocument();
      expect(within(row).getByText('ACTIVE')).toBeInTheDocument();
      expect(within(row).getByText('PREMIUM')).toBeInTheDocument();
      expect(within(row).getByText('580')).toBeInTheDocument(); // Students count
      expect(within(row).getByText('$2,450.00')).toBeInTheDocument(); // Monthly revenue

      // Verify suspended tenant
      const suspendedRow = await screen.findByTestId('tenant-row-tenant-002');
      expect(within(suspendedRow).getByText('Oak Hill High School')).toBeInTheDocument();
      expect(within(suspendedRow).getByText('SUSPENDED')).toBeInTheDocument();

      // Verify enterprise tenant
      const enterpriseRow = await screen.findByTestId('tenant-row-tenant-003');
      expect(within(enterpriseRow).getByText('Riverside International Academy')).toBeInTheDocument();
      expect(within(enterpriseRow).getByText('ENTERPRISE')).toBeInTheDocument();
    });

    test('should handle tenant status indicators correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: {
              page: 1,
              limit: 10,
              total: mockData.tenants.length,
              totalPages: 1,
            },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

await waitFor(() => {
        expect(within(screen.getByTestId('tenant-overview-header')).getByText(/tenants/i)).toBeInTheDocument();
      });

      // Check status indicators have correct styling/colors
      const activeStatus = screen.getAllByText('ACTIVE')[0];
      expect(activeStatus).toHaveClass('status-active'); // Assuming CSS class

      const suspendedStatus = screen.getByText('SUSPENDED');
      expect(suspendedStatus).toHaveClass('status-suspended');

      // Check for status icons
      expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument(); // Active icon
      expect(screen.getByTestId('PauseCircleIcon')).toBeInTheDocument(); // Suspended icon
    });

    test('should display tenant metrics accurately', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: {
              page: 1,
              limit: 10,
              total: mockData.tenants.length,
              totalPages: 1,
            },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

await waitFor(() => {
        expect(within(screen.getByTestId('tenant-overview-header')).getByText(/tenants/i)).toBeInTheDocument();
      });

      // Verify storage usage formatting
      expect(screen.getByText('15.7 GB')).toBeInTheDocument(); // Greenwood storage
      expect(screen.getByText('23.4 GB')).toBeInTheDocument(); // Oak Hill storage
      expect(screen.getByText('45.8 GB')).toBeInTheDocument(); // Riverside storage

      // Verify user count formatting
      expect(screen.getByText('245')).toBeInTheDocument(); // Users
      expect(screen.getByText('32')).toBeInTheDocument(); // Teachers

      // Verify dates are formatted correctly
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument(); // Created date
      expect(screen.getByText(/Aug 7, 2024/)).toBeInTheDocument(); // Last activity
    });

    test('should handle empty tenant list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No tenants found')).toBeInTheDocument();
        expect(screen.getByText('No tenants match your current filters')).toBeInTheDocument();
      });
    });
  });

  describe('RBAC Security and Permission Testing', () => {
    test('should enforce tenant management permissions', async () => {
      // Mock user with insufficient permissions
      const restrictedUser = {
        id: 'user-123',
        role: 'viewer',
        permissions: ['TENANT_READ'], // Missing TENANT_UPDATE, TENANT_DELETE
      };

      // Mock auth context to provide restricted user
      jest.mock('@shared/contexts/AuthContext', () => ({
        useAuth: () => ({
          user: restrictedUser,
          hasPermission: (permission: string) => restrictedUser.permissions.includes(permission),
        }),
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

await waitFor(() => {
        expect(within(screen.getByTestId('tenant-overview-header')).getByText(/tenants/i)).toBeInTheDocument();
      });

      // Action buttons should be disabled for restricted user
      const actionButtons = screen.queryAllByTestId('tenant-actions-menu');
      actionButtons.forEach(button => {
        expect(button).toBeDisabled();
      });

      // Bulk operations should not be available
      expect(screen.queryByText('Bulk Actions')).not.toBeInTheDocument();

      // Create tenant button should not be visible
      expect(screen.queryByText('Create Tenant')).not.toBeInTheDocument();
    });

    test('should allow full access for super admin', async () => {
      // Mock super admin user
      const superAdminUser = {
        id: 'superadmin-123',
        role: 'superadmin',
        permissions: [
          'PLATFORM_ADMIN',
          'TENANT_CREATE',
          'TENANT_READ',
          'TENANT_UPDATE',
          'TENANT_DELETE',
          'TENANT_SUSPEND',
          'TENANT_ACTIVATE',
        ],
      };

      jest.mock('@shared/contexts/AuthContext', () => ({
        useAuth: () => ({
          user: superAdminUser,
          hasPermission: (permission: string) => superAdminUser.permissions.includes(permission),
        }),
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

await waitFor(() => {
        expect(within(screen.getByTestId('tenant-overview-header')).getByText(/tenants/i)).toBeInTheDocument();
      });

      // All action buttons should be available
      const actionMenus = screen.getAllByTestId('tenant-actions-menu');
      expect(actionMenus.length).toBeGreaterThan(0);

      // Bulk operations should be available
      expect(screen.getByText('Select All')).toBeInTheDocument();

      // Create tenant button should be visible
      expect(screen.getByText('Create Tenant')).toBeInTheDocument();
    });

    test('should validate permission before tenant actions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Click on first tenant's action menu
      const firstActionMenu = screen.getAllByTestId('tenant-actions-menu')[0];
      fireEvent.click(firstActionMenu);

      // Should show permission-based menu items
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Suspend Tenant')).toBeInTheDocument();
      expect(screen.getByText('Edit Configuration')).toBeInTheDocument();

      // Dangerous actions should have confirmation
      const suspendAction = screen.getByText('Suspend Tenant');
      fireEvent.click(suspendAction);

      // Should show confirmation dialog
      expect(screen.getByText('Confirm Tenant Suspension')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to suspend/)).toBeInTheDocument();
    });
  });

  describe('Tenant Operations and State Management', () => {
    test('should handle tenant suspension workflow', async () => {
      // Initial tenant list
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Greenwood Elementary School')).toBeInTheDocument();
      });

      // Click suspend action for first tenant (assuming it's active)
      const firstActionMenu = screen.getAllByTestId('tenant-actions-menu')[0];
      fireEvent.click(firstActionMenu);

      const suspendAction = screen.getByText('Suspend Tenant');
      fireEvent.click(suspendAction);

      // Confirm suspension
      const confirmButton = screen.getByText('Confirm Suspension');

      // Mock suspension API call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Tenant suspended successfully',
          data: {
            ...mockData.tenants[0],
            status: 'SUSPENDED',
          },
        }),
      });

      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Tenant suspended successfully')).toBeInTheDocument();
      });

      // Verify API was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith('/api/saas/tenants/tenant-001/suspend', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: expect.stringContaining('Bearer'),
        },
      });
    });

    test('should handle tenant activation workflow', async () => {
      // Start with suspended tenant
      const suspendedTenants = mockData.tenants.map(tenant =>
        tenant.id === 'tenant-002' ? { ...tenant, status: 'SUSPENDED' as const } : tenant
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: suspendedTenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Oak Hill High School')).toBeInTheDocument();
      });

      // Find and click activate action for suspended tenant
      const suspendedRow = screen.getByText('Oak Hill High School').closest('tr');
      if (suspendedRow) {
        const actionMenu = within(suspendedRow).getByTestId('tenant-actions-menu');
        fireEvent.click(actionMenu);

        const activateAction = screen.getByText('Activate Tenant');

        // Mock activation API call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Tenant activated successfully',
            data: {
              ...mockData.tenants[1],
              status: 'ACTIVE',
            },
          }),
        });

        fireEvent.click(activateAction);

        await waitFor(() => {
          expect(screen.getByText('Tenant activated successfully')).toBeInTheDocument();
        });
      }
    });

    test('should handle bulk operations securely', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Select multiple tenants
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // First tenant
      fireEvent.click(checkboxes[2]); // Second tenant

      // Bulk actions menu should appear
      expect(screen.getByText('2 selected')).toBeInTheDocument();
      expect(screen.getByText('Bulk Actions')).toBeInTheDocument();

      // Click bulk actions
      const bulkActionsButton = screen.getByText('Bulk Actions');
      fireEvent.click(bulkActionsButton);

      // Should show available bulk operations
      expect(screen.getByText('Suspend Selected')).toBeInTheDocument();
      expect(screen.getByText('Change Plan')).toBeInTheDocument();
      expect(screen.getByText('Export Data')).toBeInTheDocument();

      // Test bulk suspension
      const bulkSuspendAction = screen.getByText('Suspend Selected');
      fireEvent.click(bulkSuspendAction);

      // Should show bulk confirmation dialog
      expect(screen.getByText('Confirm Bulk Suspension')).toBeInTheDocument();
      expect(screen.getByText('2 tenants will be suspended')).toBeInTheDocument();

      // Should list affected tenants
      expect(screen.getByText('Greenwood Elementary School')).toBeInTheDocument();
      expect(screen.getByText('Oak Hill High School')).toBeInTheDocument();
    });

    test('should handle bulk operation failures gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Select tenants and attempt bulk operation
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      fireEvent.click(checkboxes[2]);

      const bulkActionsButton = screen.getByText('Bulk Actions');
      fireEvent.click(bulkActionsButton);

      const bulkSuspendAction = screen.getByText('Suspend Selected');
      fireEvent.click(bulkSuspendAction);

      // Mock partial failure response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: {
            code: 'BULK_OPERATION_PARTIAL_FAILURE',
            message: 'Some operations failed',
            details: {
              successful: ['tenant-001'],
              failed: [
                {
                  tenantId: 'tenant-002',
                  error: 'Tenant has active subscriptions',
                },
              ],
            },
          },
        }),
      });

      const confirmButton = screen.getByText('Confirm Bulk Suspension');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Bulk Operation Completed with Errors')).toBeInTheDocument();
        expect(screen.getByText('1 successful, 1 failed')).toBeInTheDocument();
        expect(screen.getByText('Tenant has active subscriptions')).toBeInTheDocument();
      });
    });
  });

  describe('Search and Filtering', () => {
    test('should filter tenants by status', async () => {
      // Initial load with all tenants
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Find and use status filter
      const statusFilter = screen.getByLabelText('Filter by status');
      fireEvent.mouseDown(statusFilter);

      const suspendedOption = screen.getByText('Suspended Only');

      // Mock filtered results
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: [mockData.tenants[1]], // Only suspended tenant
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          },
        }),
      });

      fireEvent.click(suspendedOption);

      await waitFor(() => {
        expect(screen.getByText('Oak Hill High School')).toBeInTheDocument();
        expect(screen.queryByText('Greenwood Elementary School')).not.toBeInTheDocument();
      });

      // Verify API was called with filter
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/saas/tenants?page=1&limit=10&status=SUSPENDED',
        expect.any(Object)
      );
    });

    test('should search tenants by name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Use search input
      const searchInput = screen.getByPlaceholderText('Search tenants...');

      // Mock search results
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: [mockData.tenants[0]], // Only matching tenant
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          },
        }),
      });

      fireEvent.change(searchInput, { target: { value: 'Greenwood' } });

      // Should debounce the search
      await waitFor(
        () => {
          expect(screen.getByText('Greenwood Elementary School')).toBeInTheDocument();
          expect(screen.queryByText('Oak Hill High School')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Verify API was called with search query
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/saas/tenants?page=1&limit=10&search=Greenwood',
        expect.any(Object)
      );
    });

    test('should handle advanced filtering combinations', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Open advanced filters
      const advancedFiltersButton = screen.getByText('Advanced Filters');
      fireEvent.click(advancedFiltersButton);

      // Set multiple filters
      const planFilter = screen.getByLabelText('Subscription Plan');
      fireEvent.mouseDown(planFilter);
      fireEvent.click(screen.getByText('Premium'));

      const locationFilter = screen.getByLabelText('Location');
      fireEvent.change(locationFilter, { target: { value: 'New York' } });

      const revenueFilter = screen.getByLabelText('Min Monthly Revenue');
      fireEvent.change(revenueFilter, { target: { value: '2000' } });

      // Apply filters
      const applyButton = screen.getByText('Apply Filters');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: [mockData.tenants[0]], // Filtered result
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          },
        }),
      });

      fireEvent.click(applyButton);

      await waitFor(() => {
        // Verify complex filter query
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('plan=PREMIUM'),
          expect.any(Object)
        );
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('location=New%20York'),
          expect.any(Object)
        );
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('minRevenue=2000'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Pagination and Data Loading', () => {
    test('should handle pagination correctly', async () => {
      // First page
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants.slice(0, 2),
            pagination: { page: 1, limit: 2, total: 3, totalPages: 2 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Showing 1-2 of 3 tenants')).toBeInTheDocument();
      });

      // Should show pagination controls
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();

      // Click next page
      const nextButton = screen.getByText('Next');

      // Mock second page
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants.slice(2),
            pagination: { page: 2, limit: 2, total: 3, totalPages: 2 },
          },
        }),
      });

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Showing 3-3 of 3 tenants')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
      });
    });

    test('should handle page size changes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Change page size
      const pageSizeSelector = screen.getByLabelText('Rows per page');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 25, total: 3, totalPages: 1 },
          },
        }),
      });

      fireEvent.change(pageSizeSelector, { target: { value: '25' } });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/saas/tenants?page=1&limit=25',
          expect.any(Object)
        );
      });
    });

    test('should show loading states during data fetch', async () => {
      // Mock delayed response
      mockFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    success: true,
                    data: {
                      tenants: mockData.tenants,
                      pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
                    },
                  }),
                }),
              1000
            )
          )
      );

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      // Should show loading state
      expect(screen.getByTestId('tenant-overview-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading tenants...')).toBeInTheDocument();

      // Should show skeleton rows
      expect(screen.getAllByTestId('tenant-row-skeleton')).toHaveLength(10);

      await waitFor(
        () => {
          expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
          expect(screen.queryByTestId('tenant-overview-loading')).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Failed to load tenant data',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-error')).toBeInTheDocument();
        expect(screen.getByText('Error Loading Tenants')).toBeInTheDocument();
        expect(screen.getByText('Failed to load tenant data')).toBeInTheDocument();
      });

      // Should show retry option
      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();

      // Test retry functionality
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
        expect(screen.queryByTestId('tenant-overview-error')).not.toBeInTheDocument();
      });
    });

    test('should handle tenant action failures with detailed error messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Try to suspend a tenant
      const firstActionMenu = screen.getAllByTestId('tenant-actions-menu')[0];
      fireEvent.click(firstActionMenu);

      const suspendAction = screen.getByText('Suspend Tenant');
      fireEvent.click(suspendAction);

      // Mock suspension failure
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          success: false,
          error: {
            code: 'TENANT_SUSPENSION_BLOCKED',
            message: 'Cannot suspend tenant with active students',
            details: {
              activeStudents: 580,
              activeTeachers: 32,
              subscriptionEnd: '2024-12-31T23:59:59Z',
            },
          },
        }),
      });

      const confirmButton = screen.getByText('Confirm Suspension');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Suspension Failed')).toBeInTheDocument();
        expect(screen.getByText('Cannot suspend tenant with active students')).toBeInTheDocument();
        expect(screen.getByText('580 active students')).toBeInTheDocument();
        expect(screen.getByText('Subscription ends: Dec 31, 2024')).toBeInTheDocument();
      });
    });

    test('should validate tenant data integrity', async () => {
      // Mock response with invalid/malformed data
      const corruptedTenants = [
        {
          id: 'tenant-001',
          name: '', // Missing name
          domain: 'invalid-domain', // Invalid domain format
          status: 'UNKNOWN_STATUS', // Invalid status
          plan: null, // Missing plan
          users: -50, // Negative count
          students: 'not_a_number', // Invalid data type
          monthlyRevenue: undefined, // Missing revenue
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: corruptedTenants,
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show data validation error
        expect(screen.getByTestId('data-validation-error')).toBeInTheDocument();
        expect(screen.getByText('Invalid Tenant Data Detected')).toBeInTheDocument();

        // Should list specific validation issues
        expect(screen.getByText('Missing tenant name')).toBeInTheDocument();
        expect(screen.getByText('Invalid domain format')).toBeInTheDocument();
        expect(screen.getByText('Unknown tenant status')).toBeInTheDocument();
        expect(screen.getByText('Invalid student count')).toBeInTheDocument();
      });
    });

    test('should handle network timeouts gracefully', async () => {
      // Mock very slow response (timeout simulation)
      mockFetch.mockImplementation(
        () =>
          new Promise(resolve => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    success: true,
                    data: {
                      tenants: mockData.tenants,
                      pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
                    },
                  }),
                }),
              30000
            ); // 30 second delay
          })
      );

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      // Should show loading state initially
      expect(screen.getByTestId('tenant-overview-loading')).toBeInTheDocument();

      // Simulate timeout detection after 10 seconds
      setTimeout(() => {
        expect(screen.getByTestId('request-timeout-error')).toBeInTheDocument();
        expect(screen.getByText('Request Timed Out')).toBeInTheDocument();
        expect(screen.getByText('The server is taking too long to respond')).toBeInTheDocument();
      }, 10000);
    });
  });

  describe('Accessibility and User Experience', () => {
    test('should be fully accessible to screen readers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Check main table accessibility
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label', 'Tenant management table');

      // Check column headers
      const columnHeaders = screen.getAllByRole('columnheader');
      columnHeaders.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });

      // Check row accessibility
      const tenantRows = screen.getAllByRole('row');
      tenantRows.slice(1).forEach((row, index) => {
        // Skip header row
        expect(row).toHaveAttribute('aria-label', expect.stringContaining('Tenant row'));
      });

      // Check action buttons have proper labels
      const actionMenus = screen.getAllByTestId('tenant-actions-menu');
      actionMenus.forEach((menu, index) => {
        expect(menu).toHaveAttribute('aria-label', expect.stringContaining('Actions for tenant'));
      });
    });

    test('should support keyboard navigation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Test tab navigation
      const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip "Select All"
      firstCheckbox.focus();
      expect(firstCheckbox).toHaveFocus();

      // Test Enter key on checkbox
      fireEvent.keyDown(firstCheckbox, { key: 'Enter' });
      expect(firstCheckbox).toBeChecked();

      // Test Space key on checkbox
      fireEvent.keyDown(firstCheckbox, { key: ' ' });
      expect(firstCheckbox).not.toBeChecked();

      // Test action menu keyboard access
      const firstActionMenu = screen.getAllByTestId('tenant-actions-menu')[0];
      firstActionMenu.focus();
      expect(firstActionMenu).toHaveFocus();

      // Test Enter key opens menu
      fireEvent.keyDown(firstActionMenu, { key: 'Enter' });
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    test('should provide proper visual feedback for actions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tenants: mockData.tenants,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        }),
      });

      render(
        <TestWrapper>
          <TenantOverview />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tenant-overview-header')).toBeInTheDocument();
      });

      // Test hover states
      const firstTenantRow = screen.getByText('Greenwood Elementary School').closest('tr');
      if (firstTenantRow) {
        fireEvent.mouseEnter(firstTenantRow);
        expect(firstTenantRow).toHaveClass('row-hover');

        fireEvent.mouseLeave(firstTenantRow);
        expect(firstTenantRow).not.toHaveClass('row-hover');
      }

      // Test selection visual feedback
      const checkbox = screen.getAllByRole('checkbox')[1];
      fireEvent.click(checkbox);

      const selectedRow = checkbox.closest('tr');
      if (selectedRow) {
        expect(selectedRow).toHaveClass('row-selected');
      }

      // Test loading states for actions
      const actionMenu = screen.getAllByTestId('tenant-actions-menu')[0];
      fireEvent.click(actionMenu);

      const suspendAction = screen.getByText('Suspend Tenant');
      fireEvent.click(suspendAction);

      // Mock delayed suspension
      mockFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    success: true,
                    message: 'Tenant suspended successfully',
                  }),
                }),
              2000
            )
          )
      );

      const confirmButton = screen.getByText('Confirm Suspension');
      fireEvent.click(confirmButton);

      // Should show loading state
      expect(screen.getByTestId('suspension-loading')).toBeInTheDocument();
      expect(confirmButton).toBeDisabled();

      await waitFor(
        () => {
          expect(screen.getByText('Tenant suspended successfully')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
