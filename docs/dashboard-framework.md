# 📊 Dashboard Framework Documentation

## Overview

The Dashboard Framework provides a comprehensive, reusable system for creating responsive, interactive dashboards for both SaaS and Tenant portals. Built with TypeScript and React, it offers a modular widget architecture with real-time data support and extensive customization capabilities.

## 🚀 Current Implementation Status

### ✅ **COMPLETED DASHBOARDS**
- **SaaS Portal**: System Superadmin Dashboard ✅
- **Tenant Portal**: 
  - School Administrator Dashboard ✅
  - Teacher Dashboard ✅
  - Student Dashboard ✅

### 🎯 **IMPLEMENTED FEATURES**
- **Responsive Layout**: Mobile-first design with adaptive grids ✅
- **RBAC Integration**: Permission-based component rendering ✅
- **Real-time Updates**: Live data refresh capabilities ✅
- **Interactive Components**: Clickable metrics and action menus ✅
- **Type Safety**: Full TypeScript coverage ✅
- **Performance Optimized**: Efficient data loading and caching ✅

## Architecture

### Core Components

```
dashboard/
├── components/
│   ├── DashboardLayout.tsx    # Main dashboard layout with sidebar and header
│   ├── DashboardHeader.tsx    # Header with actions and breadcrumbs
│   ├── DashboardSidebar.tsx   # Responsive navigation sidebar
│   ├── Widget.tsx             # Individual widget component
│   └── WidgetGrid.tsx         # Grid layout manager for widgets
├── hooks/
│   └── useDashboard.ts        # Dashboard state management hook
├── types/
│   └── dashboard.ts           # TypeScript type definitions
└── index.ts                   # Main exports and utilities
```

## Quick Start

### Basic Dashboard Setup

```typescript
import React from 'react';
import { DashboardLayout } from '@/shared/dashboard';

const MyDashboard: React.FC = () => {
  return (
    <DashboardLayout
      title="School Admin Dashboard"
      subtitle="Manage your school operations"
      layoutId="school-admin-dashboard"
      permissions={['admin.dashboard.view']}
      sidebarItems={[
        { id: 'overview', label: 'Overview', icon: 'dashboard', href: '/overview' },
        { id: 'students', label: 'Students', icon: 'people', href: '/students' },
        { id: 'teachers', label: 'Teachers', icon: 'school', href: '/teachers' },
      ]}
    >
      {/* Dashboard content goes here */}
    </DashboardLayout>
  );
};
```

### Using the Dashboard Hook

```typescript
import React from 'react';
import { useDashboard, WidgetGrid } from '@/shared/dashboard';

const MyDashboardContent: React.FC = () => {
  const {
    widgets,
    isEditMode,
    isLoading,
    error,
    updateWidget,
    removeWidget,
    refreshWidget,
    toggleEditMode
  } = useDashboard('my-dashboard-layout');

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>Dashboard</h2>
        <button onClick={toggleEditMode}>
          {isEditMode ? 'Exit Edit' : 'Edit Dashboard'}
        </button>
      </div>
      
      <WidgetGrid
        widgets={widgets}
        isEditMode={isEditMode}
        gridSize={{ columns: 3, gap: 24 }}
        onWidgetUpdate={updateWidget}
        onWidgetRemove={removeWidget}
        onWidgetRefresh={refreshWidget}
      />
    </div>
  );
};
```

## Components Reference

### DashboardLayout

Main layout component that provides the structure for dashboards.

**Props:**
- `title: string` - Dashboard title
- `subtitle?: string` - Optional subtitle
- `layoutId: string` - Unique identifier for the dashboard
- `permissions?: string[]` - Required permissions to view dashboard
- `showSidebar?: boolean` - Whether to show sidebar (default: true)
- `sidebarItems?: SidebarItem[]` - Navigation items for sidebar
- `headerActions?: HeaderAction[]` - Custom actions for header
- `children: React.ReactNode` - Dashboard content

**Example:**
```typescript
<DashboardLayout
  title="System Dashboard"
  subtitle="Platform Overview"
  layoutId="system-overview"
  permissions={['system.admin.view']}
  sidebarItems={sidebarItems}
  headerActions={[
    { id: 'refresh', label: 'Refresh', icon: 'refresh', onClick: handleRefresh },
    { id: 'settings', label: 'Settings', icon: 'settings', onClick: handleSettings }
  ]}
>
  <MyDashboardContent />
</DashboardLayout>
```

### DashboardHeader

Header component with title, breadcrumbs, and action buttons.

**Props:**
- `title: string` - Header title
- `subtitle?: string` - Optional subtitle
- `breadcrumbs?: Breadcrumb[]` - Navigation breadcrumbs
- `actions?: HeaderAction[]` - Action buttons
- `showFullscreenToggle?: boolean` - Show fullscreen button
- `onRefresh?: () => void` - Refresh callback
- `isLoading?: boolean` - Loading state

### DashboardSidebar

Responsive sidebar with navigation items.

**Props:**
- `items: SidebarItem[]` - Navigation items
- `isOpen: boolean` - Sidebar open state
- `onToggle: () => void` - Toggle callback
- `variant?: 'permanent' | 'temporary'` - Sidebar behavior
- `width?: number` - Sidebar width in pixels

### Widget

Individual widget component with support for multiple content types.

**Props:**
- `widget: Widget` - Widget configuration and data
- `isEditMode: boolean` - Whether dashboard is in edit mode
- `onUpdate: (updates: Partial<Widget>) => void` - Update callback
- `onRemove: () => void` - Remove callback
- `onRefresh: () => void` - Refresh callback

**Supported Widget Types:**
- `stat` - Statistics/KPI cards
- `chart` - Data visualizations
- `table` - Tabular data
- `text` - Rich text content

### WidgetGrid

Grid layout manager for organizing widgets.

**Props:**
- `widgets: Widget[]` - Array of widgets
- `isEditMode: boolean` - Edit mode state
- `gridSize: GridSize` - Grid configuration
- `onWidgetUpdate: (id: string, updates: Partial<Widget>) => void` - Widget update handler
- `onWidgetRemove: (id: string) => void` - Widget removal handler
- `onWidgetRefresh: (id: string) => void` - Widget refresh handler

## Hooks Reference

### useDashboard

Main hook for dashboard state management.

**Parameters:**
- `layoutId: string` - Unique dashboard identifier

**Returns:**
```typescript
{
  // State
  widgets: Widget[];
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  isFullscreen: boolean;
  sidebarOpen: boolean;

  // Actions
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  removeWidget: (widgetId: string) => void;
  refreshWidget: (widgetId: string) => void;
  refreshAll: () => void;
  toggleEditMode: () => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  retryLoadData: () => void;
}
```

## Widget Types

### Stat Widget

Display key performance indicators and metrics.

**Data Structure:**
```typescript
{
  type: 'stat',
  data: {
    value: number | string;
    label: string;
    icon?: string;
    trend?: number;
    color?: string;
  }
}
```

**Example:**
```typescript
const studentCountWidget: Widget = {
  id: 'student-count',
  type: 'stat',
  title: 'Total Students',
  size: { width: 1, height: 1 },
  position: { row: 1, column: 1 },
  data: {
    value: 1247,
    label: 'Active Students',
    trend: 5.2,
    color: 'blue'
  }
};
```

### Chart Widget

Display data visualizations and charts.

**Data Structure:**
```typescript
{
  type: 'chart',
  data: {
    chartType: 'line' | 'bar' | 'pie' | 'area';
    datasets: ChartDataset[];
    labels: string[];
    options?: ChartOptions;
  }
}
```

### Table Widget

Display tabular data with sorting and filtering.

**Data Structure:**
```typescript
{
  type: 'table',
  data: {
    columns: string[];
    rows: any[][];
    sortable?: boolean;
    filterable?: boolean;
    pagination?: boolean;
  }
}
```

### Text Widget

Display rich text content and announcements.

**Data Structure:**
```typescript
{
  type: 'text',
  data: {
    content: string | React.ReactNode;
    variant?: 'announcement' | 'info' | 'warning';
  }
}
```

## Utilities

### DashboardUtils

Utility functions for dashboard management.

**Available Methods:**

#### `generateWidgetId(): string`
Generates a unique widget identifier.

#### `getOptimalGridSize(screenWidth: number): GridSize`
Calculates optimal grid configuration based on screen width.

#### `validateWidgetPosition(widget: Widget, gridSize: GridSize, existingWidgets: Widget[]): boolean`
Validates if a widget can be placed at a specific position.

#### `findAvailablePosition(size: WidgetSize, gridSize: GridSize, existingWidgets: Widget[]): WidgetPosition | null`
Finds the next available position for a widget.

#### `autoArrangeWidgets(widgets: Widget[], gridSize: GridSize): Widget[]`
Automatically arranges widgets to optimize layout.

## Responsive Behavior

### Grid Breakpoints

- **Mobile** (< 640px): 1 column, 16px gap
- **Tablet** (< 1024px): 2 columns, 20px gap  
- **Desktop** (< 1536px): 3 columns, 24px gap
- **Large Desktop** (≥ 1536px): 4 columns, 28px gap

### Responsive Features

- Automatic grid resizing based on viewport
- Collapsible sidebar on mobile devices
- Touch-friendly interactions
- Optimized widget sizing for small screens

## Customization

### Theming

The dashboard framework supports Material-UI theming for consistent styling.

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

### Custom Widgets

Create custom widget types by extending the base widget interface:

```typescript
interface CustomWidget extends Widget {
  type: 'custom-type';
  data: {
    customProperty: string;
    // ... other custom properties
  };
}

// Register custom widget renderer
const CustomWidgetRenderer: React.FC<{ widget: CustomWidget }> = ({ widget }) => {
  return (
    <div className="custom-widget">
      {/* Custom widget content */}
    </div>
  );
};
```

## Performance Considerations

### Optimization Features

- **Lazy Loading**: Widgets load content on demand
- **Virtual Scrolling**: Efficient rendering for large datasets
- **Memoization**: React.memo and useMemo for expensive operations
- **Debounced Updates**: Reduced API calls during user interactions
- **Chunk Loading**: Dynamic imports for widget types

### Best Practices

1. **Limit Widget Count**: Keep dashboards under 20 widgets for optimal performance
2. **Use Pagination**: Implement pagination for table widgets with large datasets
3. **Optimize Images**: Use WebP format and appropriate sizing for widget icons
4. **Cache Data**: Implement caching for frequently accessed widget data
5. **Monitor Performance**: Use React DevTools Profiler to identify bottlenecks

## Security Features

### RBAC Integration

All dashboard components integrate with the RBAC system:

```typescript
// Permission-protected dashboard
<PermissionGate permission="dashboard.admin.view">
  <DashboardLayout>
    {/* Dashboard content */}
  </DashboardLayout>
</PermissionGate>

// Widget-level permissions
<PermissionGate permission="students.view">
  <StudentStatsWidget />
</PermissionGate>
```

### Data Isolation

- Tenant-specific data isolation
- Role-based data filtering
- Permission-aware widget rendering
- Secure API token handling

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: 4.5:1 minimum contrast ratio
- **Focus Management**: Proper focus indicators
- **Alternative Text**: Images and icons have alt text

### Accessibility Features

- Skip navigation links
- High contrast mode support
- Reduced motion respect
- Semantic HTML structure
- ARIA live regions for dynamic content

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { DashboardLayout } from '@/shared/dashboard';

describe('DashboardLayout', () => {
  it('renders dashboard title', () => {
    render(
      <DashboardLayout title="Test Dashboard" layoutId="test">
        <div>Content</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test complete dashboard workflows including widget interactions, edit mode, and data updates.

## Migration Guide

### From v1.0 to v2.0

If upgrading from an earlier version:

1. Update import paths:
   ```typescript
   // Old
   import { Dashboard } from '@/components/dashboard';
   
   // New
   import { DashboardLayout } from '@/shared/dashboard';
   ```

2. Update prop names:
   ```typescript
   // Old
   <Dashboard heading="Title" />
   
   // New
   <DashboardLayout title="Title" />
   ```

3. Use new hook API:
   ```typescript
   // Old
   const dashboard = useDashboardState();
   
   // New
   const dashboard = useDashboard('layout-id');
   ```

## Troubleshooting

### Common Issues

#### Widgets Not Rendering
- Check widget data structure matches expected format
- Verify widget type is supported
- Ensure permissions are correctly configured

#### Layout Issues
- Validate grid configuration
- Check widget size and position values
- Verify responsive breakpoints

#### Performance Problems
- Limit number of concurrent widgets
- Implement data pagination
- Use React DevTools Profiler to identify bottlenecks

### Debug Mode

Enable debug mode for additional logging:

```typescript
// In development environment
localStorage.setItem('dashboard-debug', 'true');
```

## Support

### Resources

- [Component Storybook](./storybook-docs.md)
- [API Documentation](./api-documentation.md)
- [RBAC Integration Guide](./rbac.md)
- [Performance Best Practices](./performance-guide.md)

### Community

- GitHub Issues: Report bugs and request features
- Discussion Forum: Ask questions and share solutions
- Documentation: Contribute to documentation improvements

---

*This documentation covers the comprehensive dashboard framework implemented in Stage 3.1 of the frontend development plan. The framework provides a solid foundation for building interactive, responsive, and secure dashboards for both SaaS and Tenant portals.*
