// ============================================================================
// LOADING STATE COMPONENTS
// Reusable loading components for different UI patterns
// ============================================================================

import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Stack,
  Paper,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const PulseBox = styled(Box)(({ theme }) => ({
  animation: `${pulse} 2s ease-in-out infinite`,
}));

// ============================================================================
// BASIC LOADING COMPONENTS
// ============================================================================

interface LoadingSpinnerProps {
  size?: number | string;
  message?: string;
  color?: 'primary' | 'secondary' | 'inherit';
  variant?: 'determinate' | 'indeterminate';
  value?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message,
  color = 'primary',
  variant = 'indeterminate',
  value,
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={2}
    py={4}
  >
    <CircularProgress size={size} color={color} variant={variant} value={value} />
    {message && (
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {message}
      </Typography>
    )}
  </Box>
);

interface LoadingBarProps {
  message?: string;
  variant?: 'determinate' | 'indeterminate';
  value?: number;
  color?: 'primary' | 'secondary' | 'inherit';
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  message,
  variant = 'indeterminate',
  value,
  color = 'primary',
}) => (
  <Box width="100%" py={2}>
    {message && (
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {message}
      </Typography>
    )}
    <LinearProgress
      variant={variant}
      value={value}
      color={color}
      sx={{ borderRadius: 1, height: 6 }}
    />
  </Box>
);

// ============================================================================
// SKELETON LOADERS
// ============================================================================

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <Box>
    {Array.from({ length: rows }).map((_, index) => (
      <Box key={index} display="flex" gap={2} mb={2} alignItems="center">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" width={colIndex === 0 ? 200 : 150} height={40} />
        ))}
      </Box>
    ))}
  </Box>
);

export const CardSkeleton: React.FC<{ height?: number; showActions?: boolean }> = ({
  height = 200,
  showActions = true,
}) => (
  <Card>
    <Skeleton variant="rectangular" height={height * 0.6} />
    <CardContent>
      <Skeleton variant="text" height={30} />
      <Skeleton variant="text" height={20} width="60%" />
      {showActions && (
        <Box display="flex" gap={1} mt={2}>
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
      )}
    </CardContent>
  </Card>
);

export const ListSkeleton: React.FC<{ items?: number; showAvatar?: boolean }> = ({
  items = 5,
  showAvatar = true,
}) => (
  <Stack spacing={2}>
    {Array.from({ length: items }).map((_, index) => (
      <Box key={index} display="flex" alignItems="center" gap={2}>
        {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
        <Box flex={1}>
          <Skeleton variant="text" height={24} width="70%" />
          <Skeleton variant="text" height={20} width="50%" />
        </Box>
      </Box>
    ))}
  </Stack>
);

// ============================================================================
// DASHBOARD SKELETONS
// ============================================================================

export const DashboardSkeleton: React.FC = () => (
  <Box>
    {/* Header */}
    <Box mb={4}>
      <Skeleton variant="text" height={40} width="30%" />
      <Skeleton variant="text" height={24} width="50%" />
    </Box>

    {/* Stats Cards */}
    <Grid container spacing={3} mb={4}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={60} height={24} />
            </Box>
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" height={20} width="60%" />
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* Chart Skeleton */}
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Skeleton variant="text" height={32} width="25%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={300} />
    </Paper>

    {/* Table Skeleton */}
    <Paper elevation={2} sx={{ p: 3 }}>
      <Skeleton variant="text" height={32} width="25%" sx={{ mb: 2 }} />
      <TableSkeleton />
    </Paper>
  </Box>
);

// ============================================================================
// PAGE LOADING STATES
// ============================================================================

interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={fullScreen ? '100vh' : 400}
      gap={3}
    >
      <Box position="relative">
        <CircularProgress size={60} thickness={4} />
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PulseBox>
            <Typography variant="h6" component="div" color="primary">
              UpClass
            </Typography>
          </PulseBox>
        </Box>
      </Box>
      <Typography variant="h6" color="text.primary">
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgcolor="background.default"
        zIndex={9999}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export const InlineLoading: React.FC<{ message?: string; size?: 'small' | 'medium' | 'large' }> = ({
  message,
  size = 'medium',
}) => {
  const spinnerSize = size === 'small' ? 16 : size === 'large' ? 32 : 24;

  return (
    <Box display="inline-flex" alignItems="center" gap={1}>
      <CircularProgress size={spinnerSize} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

// ============================================================================
// FORM LOADING STATES
// ============================================================================

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
  <Stack spacing={3}>
    {Array.from({ length: fields }).map((_, index) => (
      <Box key={index}>
        <Skeleton variant="text" height={24} width="30%" sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
    ))}
    <Box display="flex" gap={2} mt={3}>
      <Skeleton variant="rectangular" width={100} height={40} />
      <Skeleton variant="rectangular" width={80} height={40} />
    </Box>
  </Stack>
);

// ============================================================================
// CONTENT LOADING PATTERNS
// ============================================================================

interface ContentLoadingProps {
  type: 'table' | 'cards' | 'list' | 'dashboard' | 'form' | 'chart';
  count?: number;
  height?: number;
}

export const ContentLoading: React.FC<ContentLoadingProps> = ({
  type,
  count = 5,
  height = 200,
}) => {
  switch (type) {
    case 'table':
      return <TableSkeleton rows={count} />;

    case 'cards':
      return (
        <Grid container spacing={3}>
          {Array.from({ length: count }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CardSkeleton height={height} />
            </Grid>
          ))}
        </Grid>
      );

    case 'list':
      return <ListSkeleton items={count} />;

    case 'dashboard':
      return <DashboardSkeleton />;

    case 'form':
      return <FormSkeleton fields={count} />;

    case 'chart':
      return (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Skeleton variant="text" height={32} width="25%" sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={height} />
        </Paper>
      );

    default:
      return <LoadingSpinner message="Loading content..." />;
  }
};

// ============================================================================
// LAZY LOADING WRAPPER
// ============================================================================

interface LazyLoadingProps {
  loading: boolean;
  error?: string | null;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  children: React.ReactNode;
}

export const LazyLoadingWrapper: React.FC<LazyLoadingProps> = ({
  loading,
  error,
  loadingComponent,
  errorComponent,
  children,
}) => {
  if (loading) {
    return <>{loadingComponent || <LoadingSpinner message="Loading..." />}</>;
  }

  if (error) {
    return (
      <>
        {errorComponent || (
          <Box textAlign="center" py={4}>
            <Typography color="error" variant="h6" gutterBottom>
              Error Loading Content
            </Typography>
            <Typography color="text.secondary">{error}</Typography>
          </Box>
        )}
      </>
    );
  }

  return <>{children}</>;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  LoadingSpinner,
  LoadingBar,
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
  DashboardSkeleton,
  PageLoading,
  InlineLoading,
  FormSkeleton,
  ContentLoading,
  LazyLoadingWrapper,
};
