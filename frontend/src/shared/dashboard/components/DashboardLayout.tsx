import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Container, useTheme, useMediaQuery, Paper, Fade, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import GridLayout from './GridLayout';
import { useDashboard } from '../hooks/useDashboard';
import { usePermissions } from '../../rbac';
import type {
  DashboardLayout as DashboardLayoutType,
  Widget,
  DashboardHeaderProps,
} from '../types/dashboard';

/**
 * DashboardLayout - Main layout component for all dashboards
 *
 * This component provides the core layout structure for both SaaS and Tenant portals,
 * with responsive design, permission-based widget rendering, and real-time updates.
 *
 * Key Features:
 * - Responsive grid layout with breakpoint support
 * - Sidebar navigation with collapsible design
 * - Header with actions and breadcrumbs
 * - Permission-based widget access control
 * - Real-time data updates
 * - Edit mode for dashboard customization
 * - Full-screen mode support
 * - Loading states and error handling
 */

interface DashboardLayoutProps {
  /** Dashboard configuration */
  layout: DashboardLayoutType;

  /** Page title */
  title: string;

  /** Page subtitle */
  subtitle?: string;

  /** Header actions */
  headerActions?: React.ReactNode;

  /** Breadcrumb navigation */
  breadcrumbs?: DashboardHeaderProps['breadcrumbs'];

  /** Show sidebar */
  showSidebar?: boolean;

  /** Sidebar content */
  sidebarContent?: React.ReactNode;

  /** Show edit mode toggle */
  allowEdit?: boolean;

  /** Show refresh button */
  allowRefresh?: boolean;

  /** Show fullscreen toggle */
  allowFullscreen?: boolean;

  /** Custom loading component */
  LoadingComponent?: React.ComponentType;

  /** Custom error component */
  ErrorComponent?: React.ComponentType<{ error: string; onRetry?: () => void }>;

  /** Additional container props */
  containerProps?: React.ComponentProps<typeof Container>;

  /** Custom styling */
  sx?: React.ComponentProps<typeof Box>['sx'];
}

// Styled components
const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const LayoutContainer = styled(Box)<{ sidebarOpen: boolean; sidebarWidth: number }>(
  ({ theme, sidebarOpen, sidebarWidth }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    marginLeft: sidebarOpen ? 0 : 0,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: sidebarOpen ? sidebarWidth : 0,
    },
  })
);

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: 'calc(100vh - 64px)', // Subtract header height
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  marginBottom: theme.spacing(2),
}));

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  layout,
  title,
  subtitle,
  headerActions,
  breadcrumbs,
  showSidebar = true,
  sidebarContent,
  allowEdit = false,
  allowRefresh = true,
  allowFullscreen = true,
  LoadingComponent,
  ErrorComponent,
  containerProps,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { hasPermission } = usePermissions();

  // Dashboard state management
  const {
    widgets,
    isEditMode,
    isLoading,
    error,
    isFullscreen,
    sidebarOpen,
    updateWidget,
    removeWidget,
    refreshWidget,
    refreshAll,
    toggleEditMode,
    toggleSidebar,
    toggleFullscreen,
    retryLoadData,
  } = useDashboard(layout.id);

  // Sidebar state
  const [localSidebarOpen, setLocalSidebarOpen] = useState(!isMobile);
  const sidebarWidth = 280;

  // Mobile-aware sidebar control
  useEffect(() => {
    setLocalSidebarOpen(!isMobile && sidebarOpen);
  }, [isMobile, sidebarOpen]);

  const handleSidebarToggle = useCallback(() => {
    if (isMobile) {
      setLocalSidebarOpen(!localSidebarOpen);
    } else {
      toggleSidebar();
    }
  }, [isMobile, localSidebarOpen, toggleSidebar]);

  const handleSidebarClose = useCallback(() => {
    setLocalSidebarOpen(false);
  }, []);

  // Filter widgets based on permissions
  const visibleWidgets = useMemo(() => {
    return widgets.filter(widget => {
      if (!widget.isVisible) return false;

      if (widget.permissions?.view) {
        return widget.permissions.view.some(permission =>
          hasPermission('widgets', 'VIEW', { widgetId: widget.id, permission })
        );
      }

      return true;
    });
  }, [widgets, hasPermission]);

  // Header handlers
  const handleRefresh = useCallback(() => {
    refreshAll();
  }, [refreshAll]);

  const handleSettings = useCallback(() => {
    if (allowEdit && hasPermission('dashboard', 'UPDATE')) {
      toggleEditMode();
    }
  }, [allowEdit, hasPermission, toggleEditMode]);

  const handleFullscreen = useCallback(() => {
    if (allowFullscreen) {
      toggleFullscreen();
    }
  }, [allowFullscreen, toggleFullscreen]);

  // Widget handlers
  const handleWidgetUpdate = useCallback(
    (widgetId: string, updates: Partial<Widget>) => {
      if (hasPermission('widgets', 'UPDATE', { widgetId })) {
        updateWidget(widgetId, updates);
      }
    },
    [hasPermission, updateWidget]
  );

  const handleWidgetRemove = useCallback(
    (widgetId: string) => {
      if (hasPermission('widgets', 'DELETE', { widgetId })) {
        removeWidget(widgetId);
      }
    },
    [hasPermission, removeWidget]
  );

  const handleWidgetRefresh = useCallback(
    (widgetId: string) => {
      if (hasPermission('widgets', 'VIEW', { widgetId })) {
        refreshWidget(widgetId);
      }
    },
    [hasPermission, refreshWidget]
  );

  // Loading state
  if (isLoading && !widgets.length) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }

    return (
      <LayoutRoot>
        <LoadingContainer>
          <Skeleton variant="rectangular" height={64} />
          <Container {...containerProps}>
            <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={200} />
              ))}
            </Box>
          </Container>
        </LoadingContainer>
      </LayoutRoot>
    );
  }

  // Error state
  if (error && !widgets.length) {
    if (ErrorComponent) {
      return <ErrorComponent error={error} onRetry={retryLoadData} />;
    }

    return (
      <LayoutRoot>
        <LayoutContainer sidebarOpen={false} sidebarWidth={0}>
          <DashboardHeader
            title={title}
            subtitle="Error loading dashboard"
            showRefresh={allowRefresh}
            onRefresh={retryLoadData}
          />
          <ContentArea>
            <ErrorContainer elevation={1}>
              <Box>{error}</Box>
              {retryLoadData && (
                <Box mt={2}>
                  <button onClick={retryLoadData}>Retry</button>
                </Box>
              )}
            </ErrorContainer>
          </ContentArea>
        </LayoutContainer>
      </LayoutRoot>
    );
  }

  return (
    <LayoutRoot sx={sx}>
      {/* Sidebar */}
      {showSidebar && sidebarContent && (
        <DashboardSidebar
          open={localSidebarOpen}
          onClose={handleSidebarClose}
          width={sidebarWidth}
          variant={isMobile ? 'temporary' : 'persistent'}
        >
          {sidebarContent}
        </DashboardSidebar>
      )}

      {/* Main Content */}
      <LayoutContainer sidebarOpen={showSidebar && localSidebarOpen} sidebarWidth={sidebarWidth}>
        {/* Header */}
        {!isFullscreen && (
          <DashboardHeader
            title={title}
            subtitle={subtitle}
            actions={headerActions}
            breadcrumbs={breadcrumbs}
            showRefresh={allowRefresh}
            showSettings={allowEdit && hasPermission('dashboard', 'UPDATE')}
            showFullscreen={allowFullscreen}
            onRefresh={handleRefresh}
            onSettings={handleSettings}
            onFullscreen={handleFullscreen}
          />
        )}

        {/* Content Area */}
        <ContentArea>
          <Container
            maxWidth={false}
            disableGutters={isFullscreen}
            {...containerProps}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              ...containerProps?.sx,
            }}
          >
            {/* Error Banner */}
            {error && widgets.length > 0 && (
              <Fade in>
                <ErrorContainer elevation={1}>
                  <Box>Some widgets failed to load: {error}</Box>
                </ErrorContainer>
              </Fade>
            )}

            {/* Dashboard Grid */}
            <Box flexGrow={1}>
              <GridLayout
                widgets={visibleWidgets}
                isEditMode={isEditMode}
                onWidgetUpdate={handleWidgetUpdate}
                onWidgetRemove={handleWidgetRemove}
                onWidgetRefresh={handleWidgetRefresh}
                layout={layout}
              />
            </Box>
          </Container>
        </ContentArea>
      </LayoutContainer>
    </LayoutRoot>
  );
};

export default DashboardLayout;

// Export styled components for custom usage
export { LayoutRoot, LayoutContainer, ContentArea, LoadingContainer, ErrorContainer };
