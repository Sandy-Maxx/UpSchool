import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Business,
  People,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Info,
  Refresh,
  School,
  Groups,
  CreditCard,
  Speed,
} from '@mui/icons-material';
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
} from '../../../../shared/utils/formatters';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  loading?: boolean;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color,
  loading = false,
  onClick,
}) => {
  const theme = useTheme();
  const colorPalette = theme.palette[color];

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? (
      <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
    ) : (
      <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />
    );
  };

  const getTrendColor = () => {
    if (!trend) return 'text.secondary';
    return trend > 0 ? 'success.main' : 'error.main';
  };

  return (
    <Card
      elevation={2}
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${alpha(colorPalette.main, 0.05)} 0%, ${alpha(colorPalette.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(colorPalette.main, 0.1)}`,
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            }
          : {},
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {loading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              borderRadius: '4px 4px 0 0',
            }}
          />
        )}

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box sx={{ color: colorPalette.main }}>{icon}</Box>
          <Tooltip title={`${title} Details`}>
            <IconButton size="small" sx={{ opacity: 0.6 }}>
              <Info sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h4" fontWeight="bold" color={colorPalette.main} gutterBottom>
          {loading ? '---' : value}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {subtitle}
          </Typography>
        )}

        {trend !== undefined && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {getTrendIcon()}
            <Typography variant="caption" color={getTrendColor()} fontWeight="medium">
              {trend > 0 ? '+' : ''}
              {formatPercentage(Math.abs(trend))}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const PlatformMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulated data - replace with actual API calls
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API integration
      const mockMetrics = {
        totalTenants: 234,
        activeTenants: 221,
        totalUsers: 12547,
        activeUsers: 8932,
        totalRevenue: 342500,
        monthlyRevenue: 45600,
        systemUptime: 99.97,
        responseTime: 245,
        trends: {
          tenants: 8.5,
          users: 12.3,
          revenue: 15.7,
          uptime: 0.2,
        },
      };

      setMetrics(mockMetrics);
      setError(null);
    } catch (err) {
      setError('Failed to load platform metrics');
      console.error('Error fetching platform metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = () => {
    fetchMetrics();
  };

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" p={4}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
        <IconButton onClick={handleRefresh} size="small" sx={{ ml: 1 }}>
          <Refresh />
        </IconButton>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Total Tenants */}
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Tenants"
          value={loading ? '---' : formatNumber(metrics?.totalTenants || 0)}
          subtitle={`${formatNumber(metrics?.activeTenants || 0)} active`}
          trend={metrics?.trends?.tenants}
          icon={<Business sx={{ fontSize: 28 }} />}
          color="primary"
          loading={loading}
          onClick={() => {
            // Navigate to tenant management
            console.log('Navigate to tenant management');
          }}
        />
      </Grid>

      {/* Total Users */}
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Users"
          value={loading ? '---' : formatNumber(metrics?.totalUsers || 0)}
          subtitle={`${formatNumber(metrics?.activeUsers || 0)} active today`}
          trend={metrics?.trends?.users}
          icon={<People sx={{ fontSize: 28 }} />}
          color="success"
          loading={loading}
          onClick={() => {
            // Navigate to user analytics
            console.log('Navigate to user analytics');
          }}
        />
      </Grid>

      {/* Revenue */}
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Revenue"
          value={loading ? '---' : formatCurrency(metrics?.totalRevenue || 0)}
          subtitle={`${formatCurrency(metrics?.monthlyRevenue || 0)} this month`}
          trend={metrics?.trends?.revenue}
          icon={<AttachMoney sx={{ fontSize: 28 }} />}
          color="warning"
          loading={loading}
          onClick={() => {
            // Navigate to revenue analytics
            console.log('Navigate to revenue analytics');
          }}
        />
      </Grid>

      {/* System Performance */}
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="System Uptime"
          value={loading ? '---' : `${formatPercentage(metrics?.systemUptime || 0)}`}
          subtitle={`${metrics?.responseTime || 0}ms avg response`}
          trend={metrics?.trends?.uptime}
          icon={<Speed sx={{ fontSize: 28 }} />}
          color="info"
          loading={loading}
          onClick={() => {
            // Navigate to system health
            console.log('Navigate to system health');
          }}
        />
      </Grid>

      {/* Additional Metrics Row */}
      <Grid item xs={12}>
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center" mt={2}>
          <Chip
            icon={<School />}
            label={`${formatNumber(metrics?.totalTenants || 0)} Schools Connected`}
            variant="outlined"
            color="primary"
          />
          <Chip
            icon={<Groups />}
            label={`${formatNumber(metrics?.activeUsers || 0)} Daily Active Users`}
            variant="outlined"
            color="success"
          />
          <Chip
            icon={<CreditCard />}
            label={`${formatCurrency(metrics?.monthlyRevenue || 0)} Monthly Revenue`}
            variant="outlined"
            color="warning"
          />
          <Chip
            icon={<Speed />}
            label={`${formatPercentage(metrics?.systemUptime || 0)} Uptime`}
            variant="outlined"
            color="info"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default PlatformMetrics;
