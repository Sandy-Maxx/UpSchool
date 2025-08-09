import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Storage,
  Memory,
  NetworkCheck,
  Speed,
  Cloud,
  Security,
} from '@mui/icons-material';
import { formatPercentage } from '../../../../shared/utils/formatters';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  icon: React.ReactNode;
  description: string;
}

interface SystemHealthProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const HealthCard: React.FC<{ metric: HealthMetric }> = ({ metric }) => {
  const theme = useTheme();

  const getStatusColor = (status: string): any => {
    switch (status) {
      case 'healthy':
        return theme.palette.success;
      case 'warning':
        return theme.palette.warning;
      case 'critical':
        return theme.palette.error;
      default:
        return theme.palette.grey;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'critical':
        return <Error />;
      default:
        return <CheckCircle />;
    }
  };

  const statusColor = getStatusColor(metric.status);
  const progressValue = Math.min(metric.value, 100);

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(statusColor.main, 0.05)} 0%, ${alpha(statusColor.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(statusColor.main, 0.2)}`,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ color: statusColor.main }}>{metric.icon}</Box>
            <Typography variant="body2" fontWeight="medium">
              {metric.name}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(metric.status)}
            label={metric.status.toUpperCase()}
            size="small"
            color={metric.status as any}
            variant="outlined"
          />
        </Box>

        <Box mb={2}>
          <Typography variant="h4" color={statusColor.main} fontWeight="bold">
            {metric.value}
            {metric.unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {metric.description}
          </Typography>
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="caption" color="text.secondary">
              Usage
            </Typography>
            <Typography variant="caption" color={statusColor.main}>
              {formatPercentage(progressValue)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(statusColor.main, 0.1),
              '& .MuiLinearProgress-bar': {
                backgroundColor: statusColor.main,
                borderRadius: 3,
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" color="text.secondary">
              Warning: {metric.threshold.warning}
              {metric.unit}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Critical: {metric.threshold.critical}
              {metric.unit}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const SystemHealth: React.FC<SystemHealthProps> = ({
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSystemHealth = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock data - replace with actual system monitoring API
      const mockMetrics: HealthMetric[] = [
        {
          id: 'cpu',
          name: 'CPU Usage',
          value: 67,
          status: 'warning',
          unit: '%',
          threshold: { warning: 70, critical: 85 },
          icon: <Speed sx={{ fontSize: 20 }} />,
          description: 'Average CPU utilization across all servers',
        },
        {
          id: 'memory',
          name: 'Memory Usage',
          value: 45,
          status: 'healthy',
          unit: '%',
          threshold: { warning: 80, critical: 90 },
          icon: <Memory sx={{ fontSize: 20 }} />,
          description: 'System memory consumption',
        },
        {
          id: 'storage',
          name: 'Disk Usage',
          value: 78,
          status: 'warning',
          unit: '%',
          threshold: { warning: 75, critical: 90 },
          icon: <Storage sx={{ fontSize: 20 }} />,
          description: 'Primary storage utilization',
        },
        {
          id: 'database',
          name: 'Database Performance',
          value: 92,
          status: 'healthy',
          unit: '%',
          threshold: { warning: 70, critical: 50 },
          icon: <Storage sx={{ fontSize: 20 }} />,
          description: 'Database query performance score',
        },
        {
          id: 'network',
          name: 'Network Latency',
          value: 25,
          status: 'healthy',
          unit: 'ms',
          threshold: { warning: 100, critical: 200 },
          icon: <NetworkCheck sx={{ fontSize: 20 }} />,
          description: 'Average network response time',
        },
        {
          id: 'uptime',
          name: 'System Uptime',
          value: 99.97,
          status: 'healthy',
          unit: '%',
          threshold: { warning: 99.5, critical: 99.0 },
          icon: <Cloud sx={{ fontSize: 20 }} />,
          description: 'Service availability over 30 days',
        },
      ];

      setMetrics(mockMetrics);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch system health metrics');
      console.error('Error fetching system health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchSystemHealth, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = () => {
    fetchSystemHealth();
  };

  const getOverallStatus = () => {
    if (metrics.some(m => m.status === 'critical')) return 'critical';
    if (metrics.some(m => m.status === 'warning')) return 'warning';
    return 'healthy';
  };

  const getOverallStatusLabel = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'healthy':
        return 'All Systems Operational';
      case 'warning':
        return 'Minor Issues Detected';
      case 'critical':
        return 'Critical Issues Detected';
      default:
        return 'Status Unknown';
    }
  };

  const getOverallStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={getOverallStatus() === 'healthy' ? <CheckCircle /> : <Warning />}
            label={getOverallStatusLabel()}
            color={getOverallStatusColor() as any}
            variant="outlined"
          />
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <Tooltip title="Refresh System Health">
          <IconButton onClick={handleRefresh} size="small" disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={2}>
        {metrics.map(metric => (
          <Grid item xs={12} sm={6} md={4} key={metric.id}>
            <HealthCard metric={metric} />
          </Grid>
        ))}
      </Grid>

      {/* System Alerts */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          System Alerts
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {metrics
            .filter(m => m.status !== 'healthy')
            .map(metric => (
              <Card key={`alert-${metric.id}`} variant="outlined">
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{ color: metric.status === 'critical' ? 'error.main' : 'warning.main' }}
                    >
                      {metric.status === 'critical' ? <Error /> : <Warning />}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {metric.name} - {metric.status.toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Current: {metric.value}
                        {metric.unit} | Threshold:{' '}
                        {metric.status === 'critical'
                          ? metric.threshold.critical
                          : metric.threshold.warning}
                        {metric.unit}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date().toLocaleTimeString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          {metrics.filter(m => m.status !== 'healthy').length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" p={2}>
              No active alerts
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SystemHealth;
