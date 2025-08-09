import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  CreditCard,
  Receipt,
  AccountBalance,
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../../../../shared/utils/formatters';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  averageRevenuePerTenant: number;
  recurringRevenue: number;
  growth: {
    total: number;
    monthly: number;
    avgPerTenant: number;
    recurring: number;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    tenants: number;
    churn: number;
  }>;
  paymentMethods: Array<{
    method: string;
    percentage: number;
    amount: number;
  }>;
  subscriptions: {
    active: number;
    trial: number;
    cancelled: number;
    expired: number;
  };
}

interface RevenueCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'info';
}

const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color,
}) => {
  const theme = useTheme();
  const colorPalette = theme.palette[color];

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    return trend > 0 ? (
      <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
    ) : (
      <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />
    );
  };

  const getTrendColor = () => {
    if (trend === undefined) return 'text.secondary';
    return trend > 0 ? 'success.main' : 'error.main';
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(colorPalette.main, 0.08)} 0%, ${alpha(colorPalette.main, 0.03)} 100%)`,
        border: `1px solid ${alpha(colorPalette.main, 0.12)}`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Box sx={{ color: colorPalette.main }}>{icon}</Box>
          <Typography variant="caption" color="text.secondary" textAlign="right">
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" fontWeight="bold" color={colorPalette.main} gutterBottom>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
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

const RevenueChart: React.FC<{ data: RevenueData['monthlyData'] }> = ({ data }) => {
  const theme = useTheme();
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Monthly Revenue Trend
      </Typography>
      <Box display="flex" alignItems="end" gap={1} height={120}>
        {data.slice(-6).map((item, index) => (
          <Box
            key={item.month}
            display="flex"
            flexDirection="column"
            alignItems="center"
            flex={1}
            gap={0.5}
          >
            <Typography variant="caption" color="text.secondary">
              {formatCurrency(item.revenue, 'USD')}
            </Typography>
            <Box
              sx={{
                width: '100%',
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 1,
                height: `${(item.revenue / maxRevenue) * 80}px`,
                background: `linear-gradient(to top, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`,
                minHeight: 8,
              }}
            />
            <Typography variant="caption" color="text.secondary" textAlign="center">
              {item.month}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const PaymentMethodsBreakdown: React.FC<{ data: RevenueData['paymentMethods'] }> = ({ data }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Methods
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {data.map((method, index) => (
          <Box key={method.method}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="body2" fontWeight="medium">
                {method.method}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                  {formatPercentage(method.percentage)}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(method.amount)}
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={method.percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: `hsl(${210 + index * 30}, 70%, 50%)`,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const RevenueAnalytics: React.FC = () => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API integration
      const mockData: RevenueData = {
        totalRevenue: 1240000,
        monthlyRevenue: 89500,
        averageRevenuePerTenant: 1850,
        recurringRevenue: 1180000,
        growth: {
          total: 23.5,
          monthly: 8.2,
          avgPerTenant: 12.1,
          recurring: 19.8,
        },
        monthlyData: [
          { month: 'Jan', revenue: 65000, tenants: 35, churn: 2 },
          { month: 'Feb', revenue: 72000, tenants: 39, churn: 1 },
          { month: 'Mar', revenue: 78000, tenants: 42, churn: 3 },
          { month: 'Apr', revenue: 82000, tenants: 44, churn: 2 },
          { month: 'May', revenue: 85000, tenants: 46, churn: 1 },
          { month: 'Jun', revenue: 89500, tenants: 48, churn: 2 },
        ],
        paymentMethods: [
          { method: 'Credit Card', percentage: 65, amount: 58175 },
          { method: 'Bank Transfer', percentage: 25, amount: 22375 },
          { method: 'PayPal', percentage: 8, amount: 7160 },
          { method: 'Other', percentage: 2, amount: 1790 },
        ],
        subscriptions: {
          active: 48,
          trial: 12,
          cancelled: 3,
          expired: 2,
        },
      };

      setData(mockData);
      setError(null);
    } catch (err) {
      setError('Failed to load revenue data');
      console.error('Error fetching revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  if (error || !data) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography variant="body2" color="error">
          {error || 'No data available'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Revenue Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}>
          <RevenueCard
            title="Total Revenue"
            value={formatCurrency(data.totalRevenue)}
            trend={data.growth.total}
            icon={<AttachMoney sx={{ fontSize: 24 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <RevenueCard
            title="Monthly Revenue"
            value={formatCurrency(data.monthlyRevenue)}
            trend={data.growth.monthly}
            icon={<Receipt sx={{ fontSize: 24 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <RevenueCard
            title="Avg per Tenant"
            value={formatCurrency(data.averageRevenuePerTenant)}
            trend={data.growth.avgPerTenant}
            icon={<CreditCard sx={{ fontSize: 24 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <RevenueCard
            title="Recurring Revenue"
            value={formatCurrency(data.recurringRevenue)}
            trend={data.growth.recurring}
            icon={<AccountBalance sx={{ fontSize: 24 }} />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card elevation={1}>
            <CardContent>
              <RevenueChart data={data.monthlyData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Methods */}
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent>
              <PaymentMethodsBreakdown data={data.paymentMethods} />
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Status */}
        <Grid item xs={12}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {data.subscriptions.active}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Subscriptions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {data.subscriptions.trial}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trial Subscriptions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="error.main" fontWeight="bold">
                      {data.subscriptions.cancelled}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cancelled
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="text.secondary" fontWeight="bold">
                      {data.subscriptions.expired}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expired
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Status chips */}
              <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                <Chip
                  label={`${formatPercentage((data.subscriptions.active / (data.subscriptions.active + data.subscriptions.trial + data.subscriptions.cancelled + data.subscriptions.expired)) * 100)} Active`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${formatCurrency(data.monthlyRevenue)} Monthly`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${data.growth.monthly > 0 ? '+' : ''}${formatPercentage(data.growth.monthly)} Growth`}
                  color={data.growth.monthly > 0 ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueAnalytics;
