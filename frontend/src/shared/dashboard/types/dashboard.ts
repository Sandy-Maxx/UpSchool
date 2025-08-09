import { ComponentType, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

/**
 * Core Dashboard Types & Interfaces
 *
 * This module defines all TypeScript interfaces and types for the dashboard system,
 * supporting both SaaS and Tenant portal dashboards with responsive layouts,
 * customizable widgets, and real-time data integration.
 */

// Widget Types
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type WidgetType =
  | 'stat-card'
  | 'chart'
  | 'table'
  | 'calendar'
  | 'notification'
  | 'quick-actions'
  | 'progress'
  | 'list'
  | 'metric'
  | 'custom';

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'doughnut'
  | 'area'
  | 'scatter'
  | 'radar'
  | 'heatmap';

// Color Schemes
export type ColorScheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

// Data Types
export interface DataPoint {
  label: string;
  value: number | string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
    metadata?: Record<string, any>;
  }[];
}

export interface TableData {
  headers: {
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: string;
  }[];
  rows: Record<string, any>[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// Widget Configuration
export interface BaseWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  colorScheme?: ColorScheme;
  refreshInterval?: number; // in milliseconds
  permissions?: {
    view: string[];
    edit?: string[];
  };
  isVisible?: boolean;
  isLoading?: boolean;
  error?: string;
  lastUpdated?: Date;
  metadata?: Record<string, any>;
}

// Specific Widget Types
export interface StatCardWidget extends BaseWidget {
  type: 'stat-card';
  data: {
    value: number | string;
    label: string;
    trend?: {
      value: number;
      isPositive: boolean;
      period: string;
    };
    icon?: string;
    format?: 'number' | 'currency' | 'percentage' | 'text';
    target?: number;
    unit?: string;
  };
}

export interface ChartWidget extends BaseWidget {
  type: 'chart';
  chartType: ChartType;
  data: ChartData;
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    showLegend?: boolean;
    showTooltips?: boolean;
    showAxes?: boolean;
    height?: number;
    animation?: boolean;
    [key: string]: any;
  };
}

export interface TableWidget extends BaseWidget {
  type: 'table';
  data: TableData;
  options?: {
    density?: 'comfortable' | 'standard' | 'compact';
    showSearch?: boolean;
    showPagination?: boolean;
    selectable?: boolean;
    sortable?: boolean;
    exportable?: boolean;
    maxHeight?: number;
  };
}

export interface CalendarWidget extends BaseWidget {
  type: 'calendar';
  data: {
    events: {
      id: string;
      title: string;
      start: Date;
      end?: Date;
      color?: string;
      description?: string;
      category?: string;
    }[];
    view?: 'month' | 'week' | 'day' | 'agenda';
  };
}

export interface NotificationWidget extends BaseWidget {
  type: 'notification';
  data: {
    notifications: {
      id: string;
      title: string;
      message: string;
      type: 'info' | 'warning' | 'error' | 'success';
      timestamp: Date;
      read: boolean;
      action?: {
        label: string;
        url: string;
      };
    }[];
    maxItems?: number;
    showUnreadOnly?: boolean;
  };
}

export interface QuickActionsWidget extends BaseWidget {
  type: 'quick-actions';
  data: {
    actions: {
      id: string;
      label: string;
      icon: string;
      action: () => void;
      permission?: string;
      color?: ColorScheme;
      disabled?: boolean;
    }[];
    layout?: 'grid' | 'list';
  };
}

export interface ProgressWidget extends BaseWidget {
  type: 'progress';
  data: {
    items: {
      label: string;
      value: number;
      total: number;
      color?: string;
      description?: string;
    }[];
    showPercentage?: boolean;
    showValues?: boolean;
  };
}

export interface ListWidget extends BaseWidget {
  type: 'list';
  data: {
    items: {
      id: string;
      title: string;
      subtitle?: string;
      avatar?: string;
      icon?: string;
      action?: () => void;
      metadata?: Record<string, any>;
    }[];
    maxItems?: number;
    showActions?: boolean;
  };
}

export interface MetricWidget extends BaseWidget {
  type: 'metric';
  data: {
    metrics: {
      label: string;
      value: number | string;
      change?: {
        value: number;
        isPositive: boolean;
        period: string;
      };
      format?: 'number' | 'currency' | 'percentage';
      color?: ColorScheme;
    }[];
    layout?: 'horizontal' | 'vertical';
  };
}

export interface CustomWidget extends BaseWidget {
  type: 'custom';
  component: ComponentType<any>;
  props?: Record<string, any>;
}

// Union type for all widgets
export type Widget =
  | StatCardWidget
  | ChartWidget
  | TableWidget
  | CalendarWidget
  | NotificationWidget
  | QuickActionsWidget
  | ProgressWidget
  | ListWidget
  | MetricWidget
  | CustomWidget;

// Dashboard Configuration
export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  widgets: Widget[];
  grid: {
    columns: number;
    rowHeight: number;
    margin: [number, number];
    containerPadding: [number, number];
    breakpoints: {
      lg: number;
      md: number;
      sm: number;
      xs: number;
    };
  };
  theme?: {
    colorScheme: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    backgroundColor?: string;
    cardElevation?: number;
  };
  permissions?: {
    view: string[];
    edit?: string[];
    customize?: string[];
  };
  refreshInterval?: number;
  autoRefresh?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Dashboard Context
export interface DashboardContextData {
  layout: DashboardLayout;
  widgets: Widget[];
  isEditMode: boolean;
  selectedWidget?: string;
  isLoading: boolean;
  error?: string;

  // Actions
  updateLayout: (layout: DashboardLayout) => void;
  addWidget: (widget: Widget) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  removeWidget: (widgetId: string) => void;
  toggleEditMode: () => void;
  selectWidget: (widgetId?: string) => void;
  refreshWidget: (widgetId: string) => void;
  refreshAll: () => void;
  resetLayout: () => void;
  exportLayout: () => void;
  importLayout: (layout: DashboardLayout) => void;
}

// Widget Props Interface
export interface WidgetProps<T extends BaseWidget = Widget> {
  widget: T;
  isEditMode?: boolean;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<T>) => void;
  onRemove?: () => void;
  onRefresh?: () => void;
  sx?: SxProps<Theme>;
}

// Dashboard Header Props
export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showRefresh?: boolean;
  showSettings?: boolean;
  showFullscreen?: boolean;
  onRefresh?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
  breadcrumbs?: {
    label: string;
    path?: string;
  }[];
}

// Dashboard Sidebar Props
export interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
  width?: number;
  variant?: 'permanent' | 'persistent' | 'temporary';
  anchor?: 'left' | 'right';
  children: ReactNode;
}

// Grid Layout Props
export interface GridLayoutProps {
  widgets: Widget[];
  layout: DashboardLayout;
  isEditMode?: boolean;
  onLayoutChange?: (layout: any) => void;
  onWidgetUpdate?: (widgetId: string, updates: Partial<Widget>) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onWidgetRefresh?: (widgetId: string) => void;
  children?: ReactNode;
}

// Real-time Data Types
export interface RealTimeConfig {
  enabled: boolean;
  interval: number;
  endpoints: {
    [widgetId: string]: {
      url: string;
      method?: 'GET' | 'POST';
      headers?: Record<string, string>;
      transform?: (data: any) => any;
    };
  };
  onError?: (widgetId: string, error: Error) => void;
  onUpdate?: (widgetId: string, data: any) => void;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: any) => void;
}

// Dashboard Analytics
export interface DashboardAnalytics {
  widgetViews: Record<string, number>;
  widgetInteractions: Record<string, number>;
  averageLoadTime: Record<string, number>;
  errorRates: Record<string, number>;
  userPreferences: {
    favoriteWidgets: string[];
    hiddenWidgets: string[];
    customLayouts: string[];
  };
  performanceMetrics: {
    renderTime: number;
    dataLoadTime: number;
    memoryUsage: number;
  };
}

// Widget Template
export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  type: WidgetType;
  category: string;
  icon: string;
  preview?: string;
  defaultConfig: Partial<Widget>;
  configSchema?: any; // JSON Schema for configuration
  requiredPermissions?: string[];
  supportedPortals?: ('saas' | 'tenant')[];
  tags?: string[];
}

// Dashboard Export/Import
export interface DashboardExport {
  version: string;
  layout: DashboardLayout;
  widgets: Widget[];
  metadata: {
    exportedAt: Date;
    exportedBy: string;
    portal: 'saas' | 'tenant';
    version: string;
  };
}

// Widget Customization
export interface WidgetCustomization {
  widgetId: string;
  customizations: {
    title?: string;
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
    styling?: SxProps<Theme>;
    dataFilters?: Record<string, any>;
    displayOptions?: Record<string, any>;
  };
}

// Dashboard Theme
export interface DashboardTheme {
  palette: {
    mode: 'light' | 'dark';
    primary: string;
    secondary: string;
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    divider: string;
    widget: {
      background: string;
      border: string;
      shadow: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: {
      widget: {
        title: string;
        subtitle: string;
        body: string;
        caption: string;
      };
    };
  };
  spacing: {
    widget: {
      padding: string;
      margin: string;
      borderRadius: string;
    };
    grid: {
      gap: string;
    };
  };
  transitions: {
    duration: {
      standard: string;
      short: string;
    };
    easing: {
      easeInOut: string;
    };
  };
}

// Error Handling
export interface DashboardError {
  type: 'widget' | 'layout' | 'data' | 'permission' | 'network';
  widgetId?: string;
  message: string;
  code?: string;
  timestamp: Date;
  recoverable: boolean;
  retryAction?: () => void;
}

export default {
  // Export all interfaces for easy import
  BaseWidget,
  StatCardWidget,
  ChartWidget,
  TableWidget,
  CalendarWidget,
  NotificationWidget,
  QuickActionsWidget,
  ProgressWidget,
  ListWidget,
  MetricWidget,
  CustomWidget,
  Widget,
  DashboardLayout,
  DashboardContextData,
  WidgetProps,
  DashboardHeaderProps,
  DashboardSidebarProps,
  GridLayoutProps,
  RealTimeConfig,
  WebSocketConfig,
  DashboardAnalytics,
  WidgetTemplate,
  DashboardExport,
  WidgetCustomization,
  DashboardTheme,
  DashboardError,
};
