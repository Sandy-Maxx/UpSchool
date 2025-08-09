import React, { useMemo } from 'react';
import { Widget } from './Widget';
import type { Widget as WidgetType, GridSize } from '../types/dashboard';

interface WidgetGridProps {
  widgets: WidgetType[];
  isEditMode: boolean;
  gridSize: GridSize;
  onWidgetUpdate: (widgetId: string, updates: Partial<WidgetType>) => void;
  onWidgetRemove: (widgetId: string) => void;
  onWidgetRefresh: (widgetId: string) => void;
  className?: string;
}

/**
 * WidgetGrid Component
 *
 * Manages the grid layout for dashboard widgets with:
 * - Responsive CSS Grid layout
 * - Dynamic widget positioning
 * - Edit mode support
 * - Customizable grid sizes
 * - Gap and spacing management
 */
export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  isEditMode,
  gridSize,
  onWidgetUpdate,
  onWidgetRemove,
  onWidgetRefresh,
  className = '',
}) => {
  // Calculate grid template based on size
  const gridStyles = useMemo(() => {
    const { columns, gap } = gridSize;

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: `${gap}px`,
      minHeight: '200px',
    };
  }, [gridSize]);

  // Sort widgets by position for consistent rendering
  const sortedWidgets = useMemo(() => {
    return [...widgets].sort((a, b) => {
      if (a.position.row !== b.position.row) {
        return a.position.row - b.position.row;
      }
      return a.position.column - b.position.column;
    });
  }, [widgets]);

  // Handle widget updates
  const handleWidgetUpdate = (widgetId: string, updates: Partial<WidgetType>) => {
    onWidgetUpdate(widgetId, updates);
  };

  const handleWidgetRemove = (widgetId: string) => {
    onWidgetRemove(widgetId);
  };

  const handleWidgetRefresh = (widgetId: string) => {
    onWidgetRefresh(widgetId);
  };

  if (widgets.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets</h3>
          <p className="text-sm mb-4">
            {isEditMode
              ? 'Add widgets to customize your dashboard'
              : 'No widgets are currently configured for this dashboard'}
          </p>
          {isEditMode && (
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Add Widget
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={gridStyles}>
      {sortedWidgets.map(widget => (
        <Widget
          key={widget.id}
          widget={widget}
          isEditMode={isEditMode}
          onUpdate={updates => handleWidgetUpdate(widget.id, updates)}
          onRemove={() => handleWidgetRemove(widget.id)}
          onRefresh={() => handleWidgetRefresh(widget.id)}
          className={`
            transition-all duration-200
            ${isEditMode ? 'cursor-move hover:scale-105' : ''}
          `}
          style={{
            gridColumn: `${widget.position.column} / span ${widget.size.width}`,
            gridRow: `${widget.position.row} / span ${widget.size.height}`,
          }}
        />
      ))}

      {/* Add widget placeholder in edit mode */}
      {isEditMode && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => {
            // TODO: Implement add widget functionality
            console.log('Add widget clicked');
          }}
        >
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">+</div>
            <p className="text-sm">Add Widget</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Auto-arranging grid variant for simpler layout management
 */
export const AutoWidgetGrid: React.FC<Omit<WidgetGridProps, 'gridSize'>> = props => {
  // Auto-calculate grid size based on viewport
  const autoGridSize = useMemo((): GridSize => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return { columns: 1, gap: 16 }; // mobile
      if (width < 1024) return { columns: 2, gap: 20 }; // tablet
      if (width < 1536) return { columns: 3, gap: 24 }; // desktop
      return { columns: 4, gap: 28 }; // large desktop
    }
    return { columns: 3, gap: 24 };
  }, []);

  return <WidgetGrid {...props} gridSize={autoGridSize} />;
};
