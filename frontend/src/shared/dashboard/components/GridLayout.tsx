import React, { useState, useCallback, useMemo } from 'react';
import { Box, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Widget } from './Widget';
import type { GridLayoutProps, Widget as WidgetType } from '../types/dashboard';

/**
 * GridLayout - Responsive grid layout for dashboard widgets
 *
 * This component provides a responsive grid system for displaying dashboard widgets
 * with support for edit mode, drag-and-drop, and responsive breakpoints.
 *
 * Key Features:
 * - Responsive grid layout with Material-UI Grid system
 * - Edit mode with widget customization
 * - Drag-and-drop functionality (future enhancement)
 * - Automatic widget sizing based on widget.size
 * - Real-time layout updates
 * - Performance optimized with React.memo
 */

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  minHeight: '100%',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gridAutoRows: 'minmax(200px, auto)',
  
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  },
  
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  },
  
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
  },
  
  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
  },
}));

const WidgetContainer = styled(Box)<{ size: string; isEditMode?: boolean }>(
  ({ theme, size, isEditMode }) => ({
    position: 'relative',
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: theme.transitions.duration.standard,
    }),
    
    // Size-based grid spans
    ...(size === 'small' && {
      gridColumn: 'span 1',
      gridRow: 'span 1',
    }),
    
    ...(size === 'medium' && {
      gridColumn: 'span 1',
      gridRow: 'span 2',
      [theme.breakpoints.up('md')]: {
        gridColumn: 'span 2',
        gridRow: 'span 1',
      },
    }),
    
    ...(size === 'large' && {
      gridColumn: 'span 1',
      gridRow: 'span 2',
      [theme.breakpoints.up('md')]: {
        gridColumn: 'span 2',
        gridRow: 'span 2',
      },
    }),
    
    ...(size === 'full' && {
      gridColumn: '1 / -1',
      gridRow: 'span 1',
    }),
    
    // Edit mode styling
    ...(isEditMode && {
      cursor: 'move',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: theme.shadows[8],
        zIndex: 1,
      },
    }),
  })
);

const GridLayout: React.FC<GridLayoutProps> = ({
  widgets,
  isEditMode = false,
  onLayoutChange,
  onWidgetUpdate,
  onWidgetRemove,
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Sort widgets by position for consistent layout
  const sortedWidgets = useMemo(() => {
    return [...widgets].sort((a, b) => {
      // Sort by y position first, then by x position
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y;
      }
      return a.position.x - b.position.x;
    });
  }, [widgets]);

  // Handle widget updates
  const handleWidgetUpdate = useCallback(
    (widgetId: string, updates: Partial<WidgetType>) => {
      if (onWidgetUpdate) {
        onWidgetUpdate(widgetId, updates);
      }
    },
    [onWidgetUpdate]
  );

  // Handle widget removal
  const handleWidgetRemove = useCallback(
    (widgetId: string) => {
      if (onWidgetRemove) {
        onWidgetRemove(widgetId);
      }
    },
    [onWidgetRemove]
  );

  // Handle widget refresh
  const handleWidgetRefresh = useCallback(
    (widgetId: string) => {
      // This would typically trigger a data refresh for the specific widget
      console.log(`Refreshing widget: ${widgetId}`);
    },
    []
  );

  // Render widget with appropriate sizing
  const renderWidget = useCallback(
    (widget: WidgetType) => {
      return (
        <WidgetContainer
          key={widget.id}
          size={widget.size}
          isEditMode={isEditMode}
          data-widget-id={widget.id}
        >
          <Widget
            widget={widget}
            isEditMode={isEditMode}
            onUpdate={(updates) => handleWidgetUpdate(widget.id, updates)}
            onRemove={() => handleWidgetRemove(widget.id)}
            onRefresh={() => handleWidgetRefresh(widget.id)}
          />
        </WidgetContainer>
      );
    },
    [isEditMode, handleWidgetUpdate, handleWidgetRemove, handleWidgetRefresh]
  );

  // Render empty state
  const renderEmptyState = useCallback(() => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        p={4}
      >
        <Box
          component="img"
          src="/images/empty-dashboard.svg"
          alt="Empty Dashboard"
          sx={{ width: 200, height: 200, mb: 2, opacity: 0.5 }}
        />
        <Box textAlign="center">
          <Box component="h3" sx={{ typography: 'h5', mb: 1 }}>
            No Widgets Available
          </Box>
          <Box sx={{ typography: 'body1', color: 'text.secondary' }}>
            {isEditMode
              ? 'Add widgets to customize your dashboard'
              : 'Contact your administrator to configure dashboard widgets'}
          </Box>
        </Box>
      </Box>
    );
  }, [isEditMode]);

  // Render loading state
  const renderLoadingState = useCallback(() => {
    return (
      <GridContainer>
        {Array.from({ length: 6 }).map((_, index) => (
          <WidgetContainer key={index} size="medium">
            <Paper
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
              }}
            >
              <Box>Loading...</Box>
            </Paper>
          </WidgetContainer>
        ))}
      </GridContainer>
    );
  }, []);

  // If no widgets, show empty state
  if (!widgets || widgets.length === 0) {
    return renderEmptyState();
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <GridContainer>
        {sortedWidgets.map(renderWidget)}
      </GridContainer>
      
      {/* Render children if provided (for additional content) */}
      {children && (
        <Box mt={2}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(GridLayout);
