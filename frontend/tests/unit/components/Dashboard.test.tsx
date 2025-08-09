import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test-utils/helpers/test-utils'
import React from 'react'

// Mock Dashboard Layout Components
interface MockDashboardProps {
  children: React.ReactNode
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
}

const MockDashboardLayout: React.FC<MockDashboardProps> = ({
  children,
  sidebarOpen = true,
  onToggleSidebar
}) => {
  return (
    <div data-testid="dashboard-layout" className={sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}>
      <header data-testid="dashboard-header">
        <button 
          data-testid="sidebar-toggle" 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          Toggle Menu
        </button>
        <div data-testid="user-menu">User Menu</div>
      </header>
      
      {sidebarOpen && (
        <nav data-testid="dashboard-sidebar" role="navigation">
          <ul>
            <li><a href="/dashboard" data-testid="nav-dashboard">Dashboard</a></li>
            <li><a href="/students" data-testid="nav-students">Students</a></li>
            <li><a href="/teachers" data-testid="nav-teachers">Teachers</a></li>
            <li><a href="/classes" data-testid="nav-classes">Classes</a></li>
            <li><a href="/reports" data-testid="nav-reports">Reports</a></li>
          </ul>
        </nav>
      )}
      
      <main data-testid="dashboard-content" role="main">
        {children}
      </main>
    </div>
  )
}

// Mock Dashboard Content Components
const MockDashboardStats = () => {
  const stats = [
    { label: 'Total Students', value: 1245, testId: 'stat-students' },
    { label: 'Total Teachers', value: 87, testId: 'stat-teachers' },
    { label: 'Active Classes', value: 156, testId: 'stat-classes' },
    { label: 'Pending Assignments', value: 23, testId: 'stat-assignments' },
  ]

  return (
    <div data-testid="dashboard-stats">
      {stats.map(stat => (
        <div key={stat.testId} data-testid={stat.testId} className="stat-card">
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

const MockRecentActivities = () => {
  const activities = [
    'John Doe submitted assignment for Math 101',
    'Jane Smith enrolled in Physics 201', 
    'New teacher Sarah Johnson joined Biology department',
    'Grade update for Chemistry 301',
  ]

  return (
    <div data-testid="recent-activities">
      <h3>Recent Activities</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index} data-testid={`activity-${index}`}>
            {activity}
          </li>
        ))}
      </ul>
    </div>
  )
}

const MockUpcomingEvents = () => {
  const events = [
    { title: 'Parent-Teacher Conference', date: '2024-01-15', testId: 'event-ptc' },
    { title: 'Science Fair', date: '2024-01-20', testId: 'event-science' },
    { title: 'Sports Day', date: '2024-01-25', testId: 'event-sports' },
  ]

  return (
    <div data-testid="upcoming-events">
      <h3>Upcoming Events</h3>
      {events.map(event => (
        <div key={event.testId} data-testid={event.testId} className="event-card">
          <span className="event-title">{event.title}</span>
          <span className="event-date">{event.date}</span>
        </div>
      ))}
    </div>
  )
}

// Mock Widget Grid Component
interface MockWidgetProps {
  title: string
  children: React.ReactNode
  testId: string
}

const MockWidget: React.FC<MockWidgetProps> = ({ title, children, testId }) => {
  return (
    <div data-testid={testId} className="dashboard-widget">
      <div className="widget-header">
        <h4>{title}</h4>
      </div>
      <div className="widget-content">
        {children}
      </div>
    </div>
  )
}

const MockWidgetGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div data-testid="widget-grid" className="dashboard-grid">
      {children}
    </div>
  )
}

// Complete Dashboard Component
const MockDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <MockDashboardLayout 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div data-testid="dashboard-page">
        <h1>School Dashboard</h1>
        
        <MockWidgetGrid>
          <MockWidget title="Statistics" testId="stats-widget">
            <MockDashboardStats />
          </MockWidget>
          
          <MockWidget title="Recent Activities" testId="activities-widget">
            <MockRecentActivities />
          </MockWidget>
          
          <MockWidget title="Upcoming Events" testId="events-widget">
            <MockUpcomingEvents />
          </MockWidget>
        </MockWidgetGrid>
      </div>
    </MockDashboardLayout>
  )
}

// Role-specific Dashboard Components
const MockStudentDashboard = () => {
  return (
    <div data-testid="student-dashboard">
      <h1>Student Dashboard</h1>
      <div data-testid="my-courses">
        <h3>My Courses</h3>
        <div data-testid="course-math">Mathematics 101</div>
        <div data-testid="course-physics">Physics 201</div>
        <div data-testid="course-chemistry">Chemistry 301</div>
      </div>
      <div data-testid="my-grades">
        <h3>Recent Grades</h3>
        <div data-testid="grade-math">Math: A-</div>
        <div data-testid="grade-physics">Physics: B+</div>
      </div>
      <div data-testid="assignments">
        <h3>Pending Assignments</h3>
        <div data-testid="assignment-1">Math Homework - Due Jan 15</div>
        <div data-testid="assignment-2">Physics Lab Report - Due Jan 18</div>
      </div>
    </div>
  )
}

const MockTeacherDashboard = () => {
  return (
    <div data-testid="teacher-dashboard">
      <h1>Teacher Dashboard</h1>
      <div data-testid="my-classes">
        <h3>My Classes</h3>
        <div data-testid="class-math101">Math 101 - 25 students</div>
        <div data-testid="class-math201">Math 201 - 18 students</div>
      </div>
      <div data-testid="pending-grading">
        <h3>Pending Grading</h3>
        <div data-testid="grading-1">Quiz 1 - 15 submissions</div>
        <div data-testid="grading-2">Assignment 3 - 22 submissions</div>
      </div>
      <div data-testid="class-schedule">
        <h3>Today's Schedule</h3>
        <div data-testid="schedule-1">9:00 AM - Math 101 (Room 201)</div>
        <div data-testid="schedule-2">11:00 AM - Math 201 (Room 203)</div>
      </div>
    </div>
  )
}

describe('Dashboard Layout Components', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('DashboardLayout', () => {
    it('should render dashboard layout with header and content', () => {
      renderWithProviders(
        <MockDashboardLayout>
          <div>Test Content</div>
        </MockDashboardLayout>
      )

      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should show sidebar by default', () => {
      renderWithProviders(
        <MockDashboardLayout>
          <div>Content</div>
        </MockDashboardLayout>
      )

      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-layout')).toHaveClass('sidebar-open')
    })

    it('should hide sidebar when sidebarOpen is false', () => {
      renderWithProviders(
        <MockDashboardLayout sidebarOpen={false}>
          <div>Content</div>
        </MockDashboardLayout>
      )

      expect(screen.queryByTestId('dashboard-sidebar')).not.toBeInTheDocument()
      expect(screen.getByTestId('dashboard-layout')).toHaveClass('sidebar-closed')
    })

    it('should call onToggleSidebar when toggle button is clicked', async () => {
      const mockToggle = vi.fn()
      renderWithProviders(
        <MockDashboardLayout onToggleSidebar={mockToggle}>
          <div>Content</div>
        </MockDashboardLayout>
      )

      const toggleButton = screen.getByTestId('sidebar-toggle')
      await user.click(toggleButton)

      expect(mockToggle).toHaveBeenCalledTimes(1)
    })

    it('should have proper accessibility attributes', () => {
      renderWithProviders(
        <MockDashboardLayout>
          <div>Content</div>
        </MockDashboardLayout>
      )

      expect(screen.getByTestId('dashboard-sidebar')).toHaveAttribute('role', 'navigation')
      expect(screen.getByTestId('dashboard-content')).toHaveAttribute('role', 'main')
      expect(screen.getByTestId('sidebar-toggle')).toHaveAttribute('aria-label', 'Toggle sidebar')
    })

    it('should render navigation links in sidebar', () => {
      renderWithProviders(
        <MockDashboardLayout>
          <div>Content</div>
        </MockDashboardLayout>
      )

      expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('nav-students')).toBeInTheDocument()
      expect(screen.getByTestId('nav-teachers')).toBeInTheDocument()
      expect(screen.getByTestId('nav-classes')).toBeInTheDocument()
      expect(screen.getByTestId('nav-reports')).toBeInTheDocument()
    })
  })

  describe('Dashboard Statistics', () => {
    it('should render all statistics cards', () => {
      renderWithProviders(<MockDashboardStats />)

      expect(screen.getByTestId('stat-students')).toBeInTheDocument()
      expect(screen.getByTestId('stat-teachers')).toBeInTheDocument()
      expect(screen.getByTestId('stat-classes')).toBeInTheDocument()
      expect(screen.getByTestId('stat-assignments')).toBeInTheDocument()
    })

    it('should display correct statistics values', () => {
      renderWithProviders(<MockDashboardStats />)

      expect(screen.getByText('1245')).toBeInTheDocument() // Students
      expect(screen.getByText('87')).toBeInTheDocument()   // Teachers
      expect(screen.getByText('156')).toBeInTheDocument()  // Classes
      expect(screen.getByText('23')).toBeInTheDocument()   // Assignments
    })

    it('should display statistics labels', () => {
      renderWithProviders(<MockDashboardStats />)

      expect(screen.getByText('Total Students')).toBeInTheDocument()
      expect(screen.getByText('Total Teachers')).toBeInTheDocument()
      expect(screen.getByText('Active Classes')).toBeInTheDocument()
      expect(screen.getByText('Pending Assignments')).toBeInTheDocument()
    })
  })

  describe('Recent Activities', () => {
    it('should render recent activities section', () => {
      renderWithProviders(<MockRecentActivities />)

      expect(screen.getByTestId('recent-activities')).toBeInTheDocument()
      expect(screen.getByText('Recent Activities')).toBeInTheDocument()
    })

    it('should display activity items', () => {
      renderWithProviders(<MockRecentActivities />)

      expect(screen.getByTestId('activity-0')).toBeInTheDocument()
      expect(screen.getByTestId('activity-1')).toBeInTheDocument()
      expect(screen.getByTestId('activity-2')).toBeInTheDocument()
      expect(screen.getByTestId('activity-3')).toBeInTheDocument()
    })

    it('should show activity details', () => {
      renderWithProviders(<MockRecentActivities />)

      expect(screen.getByText(/John Doe submitted assignment/)).toBeInTheDocument()
      expect(screen.getByText(/Jane Smith enrolled/)).toBeInTheDocument()
      expect(screen.getByText(/New teacher Sarah Johnson/)).toBeInTheDocument()
    })
  })

  describe('Upcoming Events', () => {
    it('should render upcoming events section', () => {
      renderWithProviders(<MockUpcomingEvents />)

      expect(screen.getByTestId('upcoming-events')).toBeInTheDocument()
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
    })

    it('should display event cards', () => {
      renderWithProviders(<MockUpcomingEvents />)

      expect(screen.getByTestId('event-ptc')).toBeInTheDocument()
      expect(screen.getByTestId('event-science')).toBeInTheDocument()
      expect(screen.getByTestId('event-sports')).toBeInTheDocument()
    })

    it('should show event details', () => {
      renderWithProviders(<MockUpcomingEvents />)

      expect(screen.getByText('Parent-Teacher Conference')).toBeInTheDocument()
      expect(screen.getByText('Science Fair')).toBeInTheDocument()
      expect(screen.getByText('Sports Day')).toBeInTheDocument()
      expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    })
  })

  describe('Complete Dashboard', () => {
    it('should render complete dashboard with all widgets', () => {
      renderWithProviders(<MockDashboard />)

      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
      expect(screen.getByText('School Dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('widget-grid')).toBeInTheDocument()
      expect(screen.getByTestId('stats-widget')).toBeInTheDocument()
      expect(screen.getByTestId('activities-widget')).toBeInTheDocument()
      expect(screen.getByTestId('events-widget')).toBeInTheDocument()
    })

    it('should toggle sidebar functionality', async () => {
      renderWithProviders(<MockDashboard />)

      // Initially sidebar should be open
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument()

      // Click toggle button
      const toggleButton = screen.getByTestId('sidebar-toggle')
      await user.click(toggleButton)

      // Sidebar should be closed
      expect(screen.queryByTestId('dashboard-sidebar')).not.toBeInTheDocument()

      // Click again to open
      await user.click(toggleButton)

      // Sidebar should be open again
      expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument()
    })
  })

  describe('Role-specific Dashboards', () => {
    it('should render student dashboard with appropriate content', () => {
      renderWithProviders(<MockStudentDashboard />)

      expect(screen.getByTestId('student-dashboard')).toBeInTheDocument()
      expect(screen.getByText('Student Dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('my-courses')).toBeInTheDocument()
      expect(screen.getByTestId('my-grades')).toBeInTheDocument()
      expect(screen.getByTestId('assignments')).toBeInTheDocument()
    })

    it('should show student course information', () => {
      renderWithProviders(<MockStudentDashboard />)

      expect(screen.getByTestId('course-math')).toBeInTheDocument()
      expect(screen.getByTestId('course-physics')).toBeInTheDocument()
      expect(screen.getByTestId('course-chemistry')).toBeInTheDocument()
    })

    it('should display student grades and assignments', () => {
      renderWithProviders(<MockStudentDashboard />)

      expect(screen.getByText('Math: A-')).toBeInTheDocument()
      expect(screen.getByText('Physics: B+')).toBeInTheDocument()
      expect(screen.getByText(/Math Homework - Due Jan 15/)).toBeInTheDocument()
      expect(screen.getByText(/Physics Lab Report - Due Jan 18/)).toBeInTheDocument()
    })

    it('should render teacher dashboard with appropriate content', () => {
      renderWithProviders(<MockTeacherDashboard />)

      expect(screen.getByTestId('teacher-dashboard')).toBeInTheDocument()
      expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('my-classes')).toBeInTheDocument()
      expect(screen.getByTestId('pending-grading')).toBeInTheDocument()
      expect(screen.getByTestId('class-schedule')).toBeInTheDocument()
    })

    it('should show teacher class information', () => {
      renderWithProviders(<MockTeacherDashboard />)

      expect(screen.getByText('Math 101 - 25 students')).toBeInTheDocument()
      expect(screen.getByText('Math 201 - 18 students')).toBeInTheDocument()
    })

    it('should display teacher grading and schedule', () => {
      renderWithProviders(<MockTeacherDashboard />)

      expect(screen.getByText('Quiz 1 - 15 submissions')).toBeInTheDocument()
      expect(screen.getByText('9:00 AM - Math 101 (Room 201)')).toBeInTheDocument()
    })
  })

  describe('Widget System', () => {
    it('should render widgets with proper structure', () => {
      renderWithProviders(
        <MockWidget title="Test Widget" testId="test-widget">
          <div>Widget Content</div>
        </MockWidget>
      )

      expect(screen.getByTestId('test-widget')).toBeInTheDocument()
      expect(screen.getByText('Test Widget')).toBeInTheDocument()
      expect(screen.getByText('Widget Content')).toBeInTheDocument()
    })

    it('should render widget grid layout', () => {
      renderWithProviders(
        <MockWidgetGrid>
          <MockWidget title="Widget 1" testId="widget-1">Content 1</MockWidget>
          <MockWidget title="Widget 2" testId="widget-2">Content 2</MockWidget>
        </MockWidgetGrid>
      )

      expect(screen.getByTestId('widget-grid')).toBeInTheDocument()
      expect(screen.getByTestId('widget-1')).toBeInTheDocument()
      expect(screen.getByTestId('widget-2')).toBeInTheDocument()
    })
  })
})
