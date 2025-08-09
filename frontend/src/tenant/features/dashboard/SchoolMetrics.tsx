import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  School,
  Assignment,
  Assessment,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';
import CountUp from 'react-countup';

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  format?: (value: number) => string;
  progress?: number;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
  format = val => val.toLocaleString(),
  progress,
  subtitle,
}) => {
  const theme = useTheme();
  const isPositive = change && change > 0;

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(color, 0.1),
              color: color,
            }}
          >
            {icon}
          </Box>
          {change !== undefined && (
            <Box display="flex" alignItems="center">
              {isPositive ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
              )}
              <Typography
                variant="caption"
                color={isPositive ? 'success.main' : 'error.main'}
                fontWeight="bold"
              >
                {change > 0 ? '+' : ''}
                {change}%
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
          <CountUp end={value} duration={2} formattingFn={format} />
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}

        {progress !== undefined && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.primary" fontWeight="bold">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {changeLabel && (
          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            {changeLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const SchoolMetrics: React.FC = () => {
  const theme = useTheme();

  // Mock data - in production this would come from API
  const metrics = [
    {
      title: 'Total Students',
      value: 1247,
      change: 5.2,
      changeLabel: 'vs last month',
      icon: <People sx={{ fontSize: 24 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Teachers',
      value: 89,
      change: 2.1,
      changeLabel: 'vs last month',
      icon: <Assignment sx={{ fontSize: 24 }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Average Attendance',
      value: 94.2,
      change: -1.5,
      changeLabel: 'vs last week',
      icon: <Schedule sx={{ fontSize: 24 }} />,
      color: theme.palette.info.main,
      format: val => `${val}%`,
    },
    {
      title: 'Academic Performance',
      value: 87.5,
      change: 3.2,
      changeLabel: 'vs last quarter',
      icon: <Assessment sx={{ fontSize: 24 }} />,
      color: theme.palette.warning.main,
      format: val => `${val}%`,
      progress: 87.5,
    },
    {
      title: 'Total Classes',
      value: 42,
      change: 0,
      changeLabel: 'no change',
      icon: <School sx={{ fontSize: 24 }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Revenue This Month',
      value: 125000,
      change: 8.7,
      changeLabel: 'vs last month',
      icon: <AttachMoney sx={{ fontSize: 24 }} />,
      color: theme.palette.success.main,
      format: val => `$${val.toLocaleString()}`,
    },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SchoolMetrics;
