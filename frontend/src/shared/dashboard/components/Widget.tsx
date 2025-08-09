import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Refresh,
  Delete,
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  School,
  People,
  Assignment,
  Event,
  Notifications,
  Speed,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import type { Widget as WidgetType } from '../types/dashboard';

interface WidgetProps {
  widget: WidgetType;
  isEditMode?: boolean;
  onUpdate?: (updates: Partial<WidgetType>) => void;
  onRemove?: () => void;
  onRefresh?: () => void;
  sx?: any;
}

export const Widget: React.FC<WidgetProps> = ({
  widget,
  isEditMode = false,
  onUpdate,
  onRemove,
  onRefresh,
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
    handleMenuClose();
  }, [onRefresh]);

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove();
    }
    handleMenuClose();
  }, [onRemove]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
    handleMenuClose();
  }, [isExpanded]);

  const renderContent = () => {
    // Error state
    if (widget.error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="body2" gutterBottom>
            Error loading widget
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {widget.error}
          </Typography>
          {onRefresh && (
            <Button size="small" onClick={handleRefresh} sx={{ mt: 1 }}>
              Retry
            </Button>
          )}
        </Alert>
      );
    }

    // Loading state
    if (widget.isLoading) {
      return (
        <Box sx={{ p: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Loading...
          </Typography>
        </Box>
      );
    }

    // Content based on widget type
    switch (widget.type) {
      case 'stat-card': {
        const statWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {statWidget.data?.value || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {statWidget.data?.label}
                </Typography>
              </Box>
              {statWidget.data?.icon && (
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <School />
                </Avatar>
              )}
            </Box>
            {statWidget.data?.trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {statWidget.data.trend.isPositive ? (
                  <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  color={statWidget.data.trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {statWidget.data.trend.value}% {statWidget.data.trend.period}
                </Typography>
              </Box>
            )}
          </Box>
        );
      }

      case 'chart': {
        const chartWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                height: 200,
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Chart: {chartWidget.chartType}
              </Typography>
            </Box>
          </Box>
        );
      }

      case 'table': {
        const tableWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Table data would be rendered here
              </Typography>
            </Box>
          </Box>
        );
      }

      case 'list': {
        const listWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <List dense>
              {listWidget.data?.items?.slice(0, isExpanded ? undefined : 5).map((item: any, index: number) => (
                <ListItem key={item.id || index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <People />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.subtitle}
                  />
                </ListItem>
              ))}
            </List>
            {listWidget.data?.items && listWidget.data.items.length > 5 && !isExpanded && (
              <Button size="small" onClick={handleToggleExpand}>
                Show more
              </Button>
            )}
          </Box>
        );
      }

      case 'notification': {
        const notificationWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <List dense>
              {notificationWidget.data?.notifications?.slice(0, isExpanded ? undefined : 5).map((notification: any, index: number) => (
                <ListItem key={notification.id || index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Notifications color={notification.type === 'error' ? 'error' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.message}
                  />
                  <Chip
                    label={notification.type}
                    size="small"
                    color={notification.type === 'error' ? 'error' : 'default'}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      }

      case 'quick-actions': {
        const quickActionsWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              {quickActionsWidget.data?.actions?.map((action: any, index: number) => (
                <Button
                  key={action.id || index}
                  variant="outlined"
                  size="small"
                  startIcon={<Assignment />}
                  onClick={action.action}
                  disabled={action.disabled}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </Box>
        );
      }

      case 'progress': {
        const progressWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            {progressWidget.data?.items?.map((item: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.value}/{item.total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / item.total) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Box>
        );
      }

      case 'metric': {
        const metricWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            {metricWidget.data?.metrics?.map((metric: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">{metric.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                {metric.change && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    {metric.change.isPositive ? (
                      <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
                    )}
                    <Typography
                      variant="caption"
                      color={metric.change.isPositive ? 'success.main' : 'error.main'}
                    >
                      {metric.change.value}% {metric.change.period}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        );
      }

      case 'calendar': {
        const calendarWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Calendar events would be rendered here
            </Typography>
          </Box>
        );
      }

      case 'custom': {
        const customWidget = widget as any;
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Custom widget content
            </Typography>
          </Box>
        );
      }

      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Widget type "{(widget as any).type}" not supported
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isEditMode && {
          border: 2,
          borderColor: 'primary.main',
          '&:hover': {
            boxShadow: 4,
          },
        }),
        ...sx,
      }}
    >
      <CardHeader
        title={widget.title}
        subheader={widget.subtitle}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {widget.lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                Updated {widget.lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        {renderContent()}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {onRefresh && (
          <MenuItem onClick={handleRefresh}>
            <Refresh sx={{ mr: 1 }} />
            Refresh
          </MenuItem>
        )}
        <MenuItem onClick={handleToggleExpand}>
          {isExpanded ? <ExpandLess sx={{ mr: 1 }} /> : <ExpandMore sx={{ mr: 1 }} />}
          {isExpanded ? 'Collapse' : 'Expand'}
        </MenuItem>
        {isEditMode && onRemove && (
          <MenuItem onClick={handleRemove} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Remove
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default Widget;
