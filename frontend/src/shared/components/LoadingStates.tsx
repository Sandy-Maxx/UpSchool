import React from 'react';
import {
  Box,
  CircularProgress,
  Skeleton,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Stack,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

// Loading Spinner Component
export const LoadingSpinner: React.FC<{
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
}> = ({ size = 40, color = 'primary', message }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      py: 3,
    }}
  >
    <CircularProgress size={size} color={color} />
    {message && (
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    )}
  </Box>
);

// Full Page Loading Component
export const FullPageLoader: React.FC<{
  message?: string;
  progress?: number;
}> = ({ message = 'Loading...', progress }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CircularProgress size={60} />
      </motion.div>
      
      <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          {message}
        </Typography>
        
        {progress !== undefined && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {Math.round(progress)}% complete
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Card Loading Skeleton
export const CardSkeleton: React.FC<{
  count?: number;
  height?: number;
  showAvatar?: boolean;
}> = ({ count = 1, height = 200, showAvatar = false }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} sx={{ mb: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            {showAvatar && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Box>
            )}
            
            <Skeleton variant="rectangular" height={height} />
            
            <Box>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    ))}
  </>
);

// Table Loading Skeleton
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => (
  <Box>
    {/* Header */}
    <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2 }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" width="25%" height={24} />
      ))}
    </Box>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1, p: 2 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" width="25%" height={20} />
        ))}
      </Box>
    ))}
  </Box>
);

// List Loading Skeleton
export const ListSkeleton: React.FC<{
  count?: number;
  showAvatar?: boolean;
  showActions?: boolean;
}> = ({ count = 5, showAvatar = true, showActions = false }) => (
  <Stack spacing={1}>
    {Array.from({ length: count }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        {showAvatar && (
          <Skeleton variant="circular" width={40} height={40} />
        )}
        
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
        
        {showActions && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={60} height={32} />
            <Skeleton variant="rectangular" width={60} height={32} />
          </Box>
        )}
      </Box>
    ))}
  </Stack>
);

// Dashboard Loading Skeleton
export const DashboardSkeleton: React.FC = () => (
  <Box sx={{ p: 3 }}>
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" height={20} />
    </Box>
    
    {/* Stats Cards */}
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
    
    {/* Chart and Table */}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
          <TableSkeleton rows={6} columns={3} />
        </CardContent>
      </Card>
    </Box>
  </Box>
);

// Inline Loader (for buttons, etc.)
export const InlineLoader: React.FC<{
  size?: number;
  message?: string;
}> = ({ size = 16, message }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <CircularProgress size={size} />
    {message && (
      <Typography variant="caption" color="text.secondary">
        {message}
      </Typography>
    )}
  </Box>
);

// Progressive Loading Component
export const ProgressiveLoader: React.FC<{
  steps: string[];
  currentStep: number;
  completed?: boolean;
}> = ({ steps, currentStep, completed = false }) => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Box sx={{ mb: 3 }}>
        {completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                color: 'white',
                fontSize: 24,
              }}
            >
              ✓
            </Box>
          </motion.div>
        ) : (
          <CircularProgress size={60} />
        )}
      </Box>

      <Typography variant="h6" gutterBottom>
        {completed ? 'Complete!' : steps[currentStep]}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <LinearProgress
          variant="determinate"
          value={completed ? 100 : ((currentStep + 1) / steps.length) * 100}
          sx={{ height: 6, borderRadius: 3 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
        </Typography>
      </Box>
    </Box>
  );
};

// Unified LoadingStates component for testing compatibility
export interface LoadingStatesProps {
  show?: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  fullscreen?: boolean;
  progress?: number;
  className?: string;
  delay?: number;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  show = true,
  text = 'Loading...',
  size = 'medium',
  variant = 'spinner',
  fullscreen = false,
  progress,
  className,
  delay = 0,
}) => {
  const [shouldShow, setShouldShow] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0 && show) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay, show]);

  if (!show || !shouldShow) {
    return null;
  }

  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
  };

  const getContent = () => {
    switch (variant) {
      case 'skeleton':
        return (
          <Box data-testid="skeleton-loader">
            <Skeleton variant="rectangular" width="100%" height={60} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        );

      case 'dots':
        return (
          <Box
            data-testid="dots-loader"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Box display="flex" gap={1}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'currentColor',
                    animation: 'pulse 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {text}
            </Typography>
          </Box>
        );

      case 'pulse':
        return (
          <Box
            data-testid="pulse-loader"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {text}
            </Typography>
          </Box>
        );

      case 'spinner':
      default:
        return (
          <Box
            data-testid="loading-spinner"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            className={className}
            role="status"
            aria-label="Loading"
          >
            <CircularProgress size={sizeMap[size]} />
            <Typography variant="body2" color="text.secondary">
              {text}
            </Typography>
            {progress !== undefined && (
              <Box width="100%" maxWidth={200}>
                <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
            )}
          </Box>
        );
    }
  };

  const content = getContent();

  if (fullscreen) {
    return (
      <Box
        data-testid="loading-overlay"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

// Export all loading components
export {
  LoadingSpinner as Loader,
  FullPageLoader as PageLoader,
};
