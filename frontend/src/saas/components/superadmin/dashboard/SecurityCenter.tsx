import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  LinearProgress,
  useTheme,
  alpha,
  Divider,
  Button,
} from '@mui/material';
import {
  Shield,
  Warning,
  Error,
  CheckCircle,
  Security,
  VpnLock,
  Visibility,
  Block,
  Refresh,
  GppGood,
  GppBad,
  GppMaybe,
} from '@mui/icons-material';
import { formatRelativeTime } from '../../../../shared/utils/formatters';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  resolved: boolean;
  tenantId?: string;
  tenantName?: string;
}

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
  unit: string;
}

export const SecurityCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock security alerts
      const mockAlerts: SecurityAlert[] = [
        {
          id: '1',
          type: 'critical',
          title: 'Multiple Failed Login Attempts',
          description: 'Detected 15 failed login attempts from IP 192.168.1.100',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          source: 'Authentication System',
          resolved: false,
          tenantId: 'riverside',
          tenantName: 'Riverside High School',
        },
        {
          id: '2',
          type: 'high',
          title: 'Suspicious Data Access Pattern',
          description: 'Unusual data access pattern detected for admin user',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          source: 'Data Access Monitor',
          resolved: false,
          tenantId: 'springfield',
          tenantName: 'Springfield Elementary',
        },
        {
          id: '3',
          type: 'medium',
          title: 'SSL Certificate Expiration Warning',
          description: 'SSL certificate for oakwood.schoolerp.com expires in 7 days',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          source: 'Certificate Monitor',
          resolved: false,
          tenantId: 'oakwood',
          tenantName: 'Oakwood Academy',
        },
        {
          id: '4',
          type: 'low',
          title: 'Password Policy Violation',
          description: 'User attempted to set weak password',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          source: 'Password Policy',
          resolved: true,
        },
      ];

      // Mock security metrics
      const mockMetrics: SecurityMetric[] = [
        {
          id: 'threat-score',
          name: 'Threat Score',
          value: 25,
          status: 'good',
          description: 'Overall platform security score',
          unit: '/100',
        },
        {
          id: 'failed-logins',
          name: 'Failed Logins',
          value: 23,
          status: 'warning',
          description: 'Failed login attempts in last 24h',
          unit: 'attempts',
        },
        {
          id: 'active-sessions',
          name: 'Active Sessions',
          value: 1247,
          status: 'good',
          description: 'Currently active user sessions',
          unit: 'sessions',
        },
        {
          id: 'security-events',
          name: 'Security Events',
          value: 8,
          status: 'good',
          description: 'Security events in last hour',
          unit: 'events',
        },
      ];

      setAlerts(mockAlerts);
      setMetrics(mockMetrics);
      setError(null);
    } catch (err) {
      setError('Failed to load security data');
      console.error('Error fetching security data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <Error color="error" />;
      case 'high':
        return <Warning color="error" />;
      case 'medium':
        return <Warning color="warning" />;
      case 'low':
        return <Warning color="info" />;
      default:
        return <CheckCircle color="success" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'success';
    }
  };

  const getMetricIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <GppGood color="success" />;
      case 'warning':
        return <GppMaybe color="warning" />;
      case 'critical':
        return <GppBad color="error" />;
      default:
        return <Shield />;
    }
  };

  const getMetricColor = (status: string): any => {
    switch (status) {
      case 'good':
        return theme.palette.success;
      case 'warning':
        return theme.palette.warning;
      case 'critical':
        return theme.palette.error;
      default:
        return theme.palette.grey;
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && !alert.resolved);

  return (
    <Box>
      {/* Security Status Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Shield color={criticalAlerts.length > 0 ? 'error' : 'success'} />
          <Typography variant="body2" fontWeight="medium">
            Security Status: {criticalAlerts.length > 0 ? 'Alert' : 'Normal'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={fetchSecurityData}>
          <Refresh />
        </IconButton>
      </Box>

      {/* Security Metrics */}
      <Box mb={2}>
        {metrics.map(metric => {
          const metricColor = getMetricColor(metric.status);
          return (
            <Box
              key={metric.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{
                background: alpha(metricColor.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(metricColor.main, 0.2)}`,
                mb: 1,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {getMetricIcon(metric.status)}
                <Typography variant="caption" color="text.secondary">
                  {metric.name}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold" color={metricColor.main}>
                {metric.value}
                {metric.unit}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Recent Security Alerts */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" fontWeight="medium">
            Recent Alerts ({unresolvedAlerts.length} active)
          </Typography>
          <Button size="small" variant="text">
            View All
          </Button>
        </Box>

        <List dense sx={{ p: 0 }}>
          {alerts.slice(0, 4).map(alert => {
            const alertColor = getAlertColor(alert.type);
            return (
              <ListItem
                key={alert.id}
                sx={{
                  background: alert.resolved
                    ? alpha(theme.palette.success.main, 0.05)
                    : alpha(theme.palette[alertColor as any].main, 0.05),
                  border: `1px solid ${alpha(
                    alert.resolved
                      ? theme.palette.success.main
                      : theme.palette[alertColor as any].main,
                    0.2
                  )}`,
                  borderRadius: 1,
                  mb: 1,
                  opacity: alert.resolved ? 0.7 : 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {alert.resolved ? <CheckCircle color="success" /> : getAlertIcon(alert.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {alert.title}
                      </Typography>
                      <Chip
                        label={alert.type.toUpperCase()}
                        size="small"
                        color={alertColor as any}
                        variant="outlined"
                      />
                      {alert.resolved && (
                        <Chip label="RESOLVED" size="small" color="success" variant="outlined" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {alert.description}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={0.5}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {alert.tenantName || 'Platform-wide'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatRelativeTime(alert.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        {alerts.length === 0 && (
          <Box textAlign="center" py={3}>
            <CheckCircle color="success" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No security alerts
            </Typography>
          </Box>
        )}
      </Box>

      {/* Security Actions */}
      <Divider sx={{ my: 2 }} />

      <Box display="flex" flexDirection="column" gap={1}>
        <Button variant="outlined" size="small" startIcon={<Security />} fullWidth>
          Security Settings
        </Button>
        <Button variant="outlined" size="small" startIcon={<VpnLock />} fullWidth>
          Access Control
        </Button>
        <Button variant="outlined" size="small" startIcon={<Visibility />} fullWidth>
          Audit Logs
        </Button>
      </Box>
    </Box>
  );
};

export default SecurityCenter;
