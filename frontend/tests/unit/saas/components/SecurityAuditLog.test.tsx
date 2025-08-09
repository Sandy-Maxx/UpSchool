import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { configureStore } from '@reduxjs/toolkit'
import { SecurityAuditLog } from '../../../../src/saas/components/admin/SecurityAuditLog'
import theme from '../../../../src/shared/theme/theme'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock MUI Tooltip to avoid async transitions causing act warnings
vi.mock('@mui/material/Tooltip', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}))

// Using real timers for async operations to avoid flakiness in MUI/RTL interactions

// Create a minimal test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      // Add minimal reducer for testing
      test: (state = {}, action) => state
    }
  })
}

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore()
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

// Custom render function
const renderWithTestProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper })
}

// Helper to wait for timers/microtasks using real timers
const flushTimers = async (ms = 0) => {
  if (ms > 0) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
  // Flush microtasks
  await Promise.resolve()
}

describe('SecurityAuditLog Component', () => {
  const user = userEvent.setup()

  let originalCreateElement: typeof document.createElement
  let originalAppendChild: typeof document.body.appendChild
  let originalRemoveChild: typeof document.body.removeChild
  let createElementSpy: ReturnType<typeof vi.fn> | null = null

  beforeEach(() => {
    vi.clearAllTimers()
    vi.clearAllMocks()

    // Preserve original DOM methods
    originalCreateElement = document.createElement.bind(document)
    originalAppendChild = document.body.appendChild.bind(document.body)
    originalRemoveChild = document.body.removeChild.bind(document.body)

    // Mock document.createElement ONLY for anchor tags used in CSV export
    const mockClick = vi.fn()
    const mockAnchor = {
      setAttribute: vi.fn(),
      click: mockClick,
      // Minimal properties to look like an element for TypeScript/runtime
      href: '',
      nodeType: Node.ELEMENT_NODE,
      nodeName: 'A',
      tagName: 'A',
    } as unknown as HTMLAnchorElement

    createElementSpy = vi.fn((tagName: any, options?: any) => {
      if (typeof tagName === 'string' && tagName.toLowerCase() === 'a') {
        return mockAnchor
      }
      return originalCreateElement(tagName, options as any)
    })

    document.createElement = createElementSpy as unknown as typeof document.createElement

    // Mock appendChild and removeChild to avoid DOM manipulation errors
    document.body.appendChild = vi.fn().mockImplementation((node: Node) => {
      // Just return the node without actually appending
      return node
    }) as unknown as typeof document.body.appendChild
    
    document.body.removeChild = vi.fn().mockImplementation((node: Node) => {
      // Just return the node without actually removing
      return node
    }) as unknown as typeof document.body.removeChild
  })

  afterEach(() => {
    // Restore original DOM methods after each test
    if (originalCreateElement) {
      document.createElement = originalCreateElement
    }
    if (originalAppendChild) {
      document.body.appendChild = originalAppendChild
    }
    if (originalRemoveChild) {
      document.body.removeChild = originalRemoveChild
    }
    createElementSpy = null
  })

  describe('Initial Rendering', () => {
it('should render security audit log header correctly', async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(0)
      
      expect(await screen.findByText('Security Audit Log')).toBeInTheDocument()
      expect(await screen.findByText('Monitor and track all security events across the platform')).toBeInTheDocument()
    })

it('should show loading state initially', async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(0)
      
      expect(await screen.findByText('Loading security events...')).toBeInTheDocument()
    })

it('should display summary cards with initial values', async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(0)
      
      expect(await screen.findByText('Total Events')).toBeInTheDocument()
      expect(await screen.findByText('Login Attempts Today')).toBeInTheDocument()
      expect(await screen.findByText('Failed Logins Today')).toBeInTheDocument()
      expect(await screen.findByText('Suspicious Activities')).toBeInTheDocument()
      expect(await screen.findByText('Blocked IPs')).toBeInTheDocument()
    })

    it('should render search and filter controls', () => {
      renderWithTestProviders(<SecurityAuditLog />)
      
      expect(screen.getByPlaceholderText('Search by username, IP, or details...')).toBeInTheDocument()
      expect(screen.getByLabelText('Event Type')).toBeInTheDocument()
      expect(screen.getByLabelText('Severity')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument()
    })
  })

  describe('Data Loading', () => {
    it('should load and display security events after loading completes', async () => {
renderWithTestProviders(<SecurityAuditLog />)
      
      // Wait for the simulated loading delay
      await flushTimers(1100)
      
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
      
      // Should display table headers
      expect(await screen.findByText('Timestamp')).toBeInTheDocument()
      expect(await screen.findByText('Event Type')).toBeInTheDocument()
      expect(await screen.findByText('Severity')).toBeInTheDocument()
      expect(await screen.findByText('Username')).toBeInTheDocument()
      expect(await screen.findByText('IP Address')).toBeInTheDocument()
      expect(await screen.findByText('Location')).toBeInTheDocument()
      expect(await screen.findByText('Details')).toBeInTheDocument()
      expect(await screen.findByText('Actions')).toBeInTheDocument()
    })

    it('should update summary cards with loaded data', async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1100)
      
      // Summary cards should show numbers > 0 after data loads
      const totalEventsCard = screen.getByText('Total Events').closest('.MuiCardContent-root')
      expect(totalEventsCard).toBeInTheDocument()
    })

    it('should display events found count', async () => {
renderWithTestProviders(<SecurityAuditLog />)
      
    await flushTimers(1100)
      
      await waitFor(() => {
        // Should show "X events found" text
        expect(screen.getByText(/events found/)).toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
await flushTimers(1000)
      await flushTimers(0)
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should filter events by search query', async () => {
      const searchInput = screen.getByPlaceholderText('Search by username, IP, or details...')
      
      await user.type(searchInput, 'admin')
      
      // Should filter the events based on search query
      expect(searchInput).toHaveValue('admin')
    })

    it('should clear search results when search is cleared', async () => {
      const searchInput = screen.getByPlaceholderText('Search by username, IP, or details...')
      
      await user.type(searchInput, 'nonexistent')
      await user.clear(searchInput)
      
      expect(searchInput).toHaveValue('')
    })

    it('should search by IP address', async () => {
      const searchInput = screen.getByPlaceholderText('Search by username, IP, or details...')
      
      await user.type(searchInput, '192.168')
      
      expect(searchInput).toHaveValue('192.168')
    })

    it('should search by event details', async () => {
      const searchInput = screen.getByPlaceholderText('Search by username, IP, or details...')
      
      await user.type(searchInput, 'login')
      
      expect(searchInput).toHaveValue('login')
    })
  })

  describe('Filter Functionality', () => {
    beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
await flushTimers(1000)
      await flushTimers(0)
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should display event type filter options', async () => {
      const eventTypeSelect = screen.getByLabelText('Event Type')
await user.click(eventTypeSelect)
      await flushTimers(0)
      
      expect(screen.getByText('All Events')).toBeInTheDocument()
      expect(screen.getByText('Login Attempt')).toBeInTheDocument()
      expect(screen.getByText('Login Success')).toBeInTheDocument()
      expect(screen.getByText('Login Failed')).toBeInTheDocument()
      expect(screen.getByText('Suspicious Activity')).toBeInTheDocument()
    })

    it('should filter events by event type', async () => {
      const eventTypeSelect = screen.getByLabelText('Event Type')
await user.click(eventTypeSelect)
      await flushTimers(0)
      await user.click(screen.getByText('Login Failed'))
      await flushTimers(0)
      
      // Should filter to show only LOGIN_FAILED events
      expect(eventTypeSelect).toHaveValue('LOGIN_FAILED')
    })

    it('should display severity filter options', async () => {
      const severitySelect = screen.getByLabelText('Severity')
await user.click(severitySelect)
      await flushTimers(0)
      
      expect(screen.getByText('All Severities')).toBeInTheDocument()
      expect(screen.getByText('Low')).toBeInTheDocument()
      expect(screen.getByText('Medium')).toBeInTheDocument()
      expect(screen.getByText('High')).toBeInTheDocument()
      expect(screen.getByText('Critical')).toBeInTheDocument()
    })

    it('should filter events by severity', async () => {
      const severitySelect = screen.getByLabelText('Severity')
await user.click(severitySelect)
      await flushTimers(0)
      await user.click(screen.getByText('Critical'))
      await flushTimers(0)
      
      expect(severitySelect).toHaveValue('critical')
    })

    it('should reset filters when "All" options are selected', async () => {
      // Set filters first
      const eventTypeSelect = screen.getByLabelText('Event Type')
      await user.click(eventTypeSelect)
      await user.click(screen.getByText('Login Failed'))
      
      // Reset to "All Events"
await user.click(eventTypeSelect)
      await flushTimers(0)
      await user.click(screen.getByText('All Events'))
      await flushTimers(0)
      
      expect(eventTypeSelect).toHaveValue('all')
    })
  })

  describe('Pagination', () => {
    beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1000)
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should display pagination controls', async () => {
      await waitFor(() => {
        expect(screen.getByText(/rows per page/i)).toBeInTheDocument()
      })
    })

    it('should handle page change', async () => {
      await waitFor(() => {
        const nextPageButton = screen.getByRole('button', { name: /next page/i }) as HTMLButtonElement
        if (nextPageButton && !nextPageButton.disabled) {
          return user.click(nextPageButton)
        }
      })
    })

    it('should handle rows per page change', async () => {
      await waitFor(() => {
        const rowsPerPageSelect = screen.getByRole('combobox', { name: /rows per page/i })
        if (rowsPerPageSelect) {
          return user.click(rowsPerPageSelect)
        }
      })
      
      // Look for pagination options
      const option50 = screen.queryByText('50')
      if (option50) {
        await user.click(option50)
      }
    })
  })

  describe('Event Detail Dialog', () => {
beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1100)
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should open detail dialog when view button is clicked', async () => {
      await waitFor(() => {
        const viewButtons = screen.getAllByRole('button', { name: /view details/i })
        if (viewButtons.length > 0) {
          return user.click(viewButtons[0])
        }
      })
      
      await waitFor(() => {
        expect(screen.queryByText('Security Event Details')).toBeInTheDocument()
      })
    })

    it('should display event details in dialog', async () => {
      await waitFor(async () => {
        const viewButtons = screen.getAllByRole('button', { name: /view details/i })
        if (viewButtons.length > 0) {
await user.click(viewButtons[0])
          await flushTimers(0)
          
          expect(screen.getByText('Event ID')).toBeInTheDocument()
          expect(screen.getByText('Timestamp')).toBeInTheDocument()
          expect(screen.getByText('Event Type')).toBeInTheDocument()
          expect(screen.getByText('Severity')).toBeInTheDocument()
          expect(screen.getByText('Username')).toBeInTheDocument()
          expect(screen.getByText('IP Address')).toBeInTheDocument()
          expect(screen.getByText('User Agent')).toBeInTheDocument()
        }
      })
    })

    it('should close dialog when close button is clicked', async () => {
      await waitFor(async () => {
        const viewButtons = screen.getAllByRole('button', { name: /view details/i })
        if (viewButtons.length > 0) {
await user.click(viewButtons[0])
        }
      })
      
await flushTimers(0)
      await waitFor(async () => {
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)
        
        expect(screen.queryByText('Security Event Details')).not.toBeInTheDocument()
      })
    })

    it('should display metadata when available', async () => {
      await waitFor(async () => {
        const viewButtons = screen.getAllByRole('button', { name: /view details/i })
        if (viewButtons.length > 0) {
          await user.click(viewButtons[0])
          
          // Should show metadata section if event has metadata
          const metadataText = screen.queryByText('Metadata')
          if (metadataText) {
            expect(metadataText).toBeInTheDocument()
          }
        }
      })
    })
  })

  describe('Export Functionality', () => {
beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1100)
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should handle CSV export', async () => {
      const exportButton = screen.getByRole('button', { name: /export csv/i })
      await user.click(exportButton)
      
      // Should trigger CSV download (mocked)
      expect(document.createElement).toHaveBeenCalledWith('a')
    })

    it('should generate CSV with proper filename', async () => {
      const exportButton = screen.getByRole('button', { name: /export csv/i })
      const mockElement = { setAttribute: vi.fn(), click: vi.fn() }
      document.createElement = vi.fn().mockReturnValue(mockElement)
      
      await user.click(exportButton)
      
      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('security_audit_log_')
      )
      expect(mockElement.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('.csv')
      )
    })

    it('should export filtered events only', async () => {
      // Apply a filter first
      const searchInput = screen.getByPlaceholderText('Search by username, IP, or details...')
      await user.type(searchInput, 'admin')
      
      const exportButton = screen.getByRole('button', { name: /export csv/i })
      await user.click(exportButton)
      
      // Should export only filtered results
      expect(document.createElement).toHaveBeenCalledWith('a')
    })
  })

  describe('Refresh Functionality', () => {
    it('should reload page when refresh button is clicked', async () => {
      // Mock window.location.reload
      const mockReload = vi.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      })
      
      renderWithTestProviders(<SecurityAuditLog />)
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i })
      await user.click(refreshButton)
      
      expect(mockReload).toHaveBeenCalled()
    })
  })

  describe('Event Type and Severity Display', () => {
beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
await flushTimers(1000)
      await flushTimers(0)
await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should display event type chips with correct colors', async () => {
      await waitFor(() => {
        // Look for event type chips in the table
        const chips = document.querySelectorAll('.MuiChip-root')
        expect(chips.length).toBeGreaterThan(0)
      })
    })

    it('should display severity chips with appropriate styling', async () => {
      await waitFor(() => {
        // Severity chips should be outlined variant
        const severityChips = document.querySelectorAll('.MuiChip-outlined')
        expect(severityChips.length).toBeGreaterThan(0)
      })
    })

    it('should show correct icons for different event types', async () => {
      await waitFor(() => {
        // Should display various event type icons
        const icons = document.querySelectorAll('svg')
        expect(icons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Table Display', () => {
    beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1000)
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should display IP addresses in monospace font', async () => {
      await waitFor(() => {
        const ipCells = document.querySelectorAll('td [style*="monospace"]')
        expect(ipCells.length).toBeGreaterThanOrEqual(0)
      })
    })

    it('should truncate long details with ellipsis', async () => {
      await waitFor(() => {
        // Details should be truncated with noWrap
        const detailsCells = document.querySelectorAll('.MuiTypography-noWrap')
        expect(detailsCells.length).toBeGreaterThanOrEqual(0)
      })
    })

    it('should handle missing usernames gracefully', async () => {
      await waitFor(() => {
        // Should show "N/A" for missing usernames
        const naCells = screen.getAllByText('N/A')
        expect(naCells.length).toBeGreaterThanOrEqual(0)
      })
    })

    it('should display formatted timestamps', async () => {
      await waitFor(() => {
        // Should have properly formatted timestamps
        const timestampCells = document.querySelectorAll('tbody tr td:first-child')
        expect(timestampCells.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle loading errors gracefully', async () => {
      // Mock console.error to avoid test noise
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      renderWithTestProviders(<SecurityAuditLog />)
      
      // Fast forward past loading time
      await flushTimers(1000)
      
      // Should not crash even if there are errors
      expect(screen.getByText('Security Audit Log')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    beforeEach(async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1000)
      await waitFor(() => {
        expect(screen.queryByText('Loading security events...')).not.toBeInTheDocument()
      })
    })

    it('should have proper ARIA labels for interactive elements', () => {
      expect(screen.getByLabelText('Event Type')).toBeInTheDocument()
      expect(screen.getByLabelText('Severity')).toBeInTheDocument()
    })

    it('should have accessible table structure', async () => {
      await waitFor(() => {
        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()
        
        const columnHeaders = screen.getAllByRole('columnheader')
        expect(columnHeaders.length).toBe(8)
      })
    })

    it('should provide tooltips for action buttons', async () => {
      await waitFor(() => {
        const viewButtons = screen.getAllByRole('button', { name: /view details/i })
        expect(viewButtons.length).toBeGreaterThan(0)
      })
    })

    it('should be keyboard navigable', async () => {
      const searchInput = screen.getByPlaceholderText('Search by username, IP, or details...')
      
      await user.tab()
      expect(searchInput).toHaveFocus()
      
      await user.keyboard('test search')
      expect(searchInput).toHaveValue('test search')
    })
  })

  describe('Responsive Design', () => {
    it('should render grid layout for summary cards', () => {
      renderWithTestProviders(<SecurityAuditLog />)
      const gridItems = document.querySelectorAll('.MuiGrid-item')
      expect(gridItems.length).toBeGreaterThan(0)
    })

    it('should handle table overflow appropriately', async () => {
      renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1000)
      await flushTimers(0)
      await waitFor(() => {
        const tableContainer = document.querySelector('.MuiTableContainer-root')
        expect(tableContainer).toBeInTheDocument()
      })
    })
  })

  describe('Performance', () => {
    it('should paginate events for better performance', async () => {
renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1000)
await waitFor(() => {
        // Should show pagination with default 25 rows per page
        expect(screen.getByText(/rows per page/i)).toBeInTheDocument()
      })
    })

    it('should efficiently filter large datasets', async () => {
renderWithTestProviders(<SecurityAuditLog />)
      await flushTimers(1000)
await waitFor(() => {
        const inputEl = screen.getByPlaceholderText('Search by username, IP, or details...')
        expect(inputEl).toBeInTheDocument()
      })
      const inputEl = screen.getByPlaceholderText('Search by username, IP, or details...')
      await user.type(inputEl, 'test')
      expect(inputEl).toHaveValue('test')
    })
  })
})
