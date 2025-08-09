// ============================================================================
// ERROR BOUNDARY COMPONENT
// Global error boundary for catching and handling React errors
// ============================================================================

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  AlertTitle,
  Stack,
  Divider,
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';

import { ENV } from '@shared/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    if (ENV.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Report error to monitoring service (e.g., Sentry)
    this.reportError(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo): void => {
    // In a real application, you would report to a service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      errorId: this.state.errorId,
    };

    // Log to console in development
    if (ENV.NODE_ENV === 'development') {
      console.warn('Error Report:', errorReport);
    }

    // In production, send to monitoring service
    if (ENV.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorReport });
      this.sendErrorToService(errorReport);
    }
  };

  private sendErrorToService = async (errorReport: any): Promise<void> => {
    try {
      // Send error report to your monitoring endpoint
      await fetch('/api/errors/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private getUserId = (): string | null => {
    try {
      const userStr = localStorage.getItem('school_erp_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || null;
      }
      return null;
    } catch {
      return null;
    }
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  private handleReportBug = (): void => {
    const subject = encodeURIComponent(
      `Bug Report: ${this.state.error?.message || 'Unknown Error'}`
    );
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message || 'Unknown'}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
[Your description here]
    `);

    window.open(`mailto:support@upclass.com?subject=${subject}&body=${body}`);
  };

  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <Stack spacing={3} alignItems="center">
              {/* Error Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'error.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <ErrorIcon sx={{ fontSize: 40, color: 'error.contrastText' }} />
              </Box>

              {/* Error Title */}
              <Typography variant="h4" component="h1" gutterBottom>
                Oops! Something went wrong
              </Typography>

              {/* Error Description */}
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                We're sorry, but something unexpected happened. Our team has been notified and is
                working to fix this issue. Please try refreshing the page or contact support if the
                problem persists.
              </Typography>

              {/* Error ID */}
              {this.state.errorId && (
                <Alert severity="info" sx={{ width: '100%' }}>
                  <AlertTitle>Error ID</AlertTitle>
                  <Typography variant="body2" fontFamily="monospace">
                    {this.state.errorId}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Please include this ID when contacting support
                  </Typography>
                </Alert>
              )}

              <Divider sx={{ width: '100%' }} />

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  fullWidth
                >
                  Refresh Page
                </Button>

                <Button variant="outlined" color="primary" onClick={this.handleGoHome} fullWidth>
                  Go to Home
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<BugIcon />}
                  onClick={this.handleReportBug}
                  fullWidth
                >
                  Report Bug
                </Button>
              </Stack>

              {/* Development Error Details */}
              {ENV.NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ width: '100%', mt: 4 }}>
                  <Alert severity="warning">
                    <AlertTitle>Development Error Details</AlertTitle>
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        maxHeight: 200,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {this.state.error.stack}
                    </Typography>
                  </Alert>

                  {this.state.errorInfo && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <AlertTitle>Component Stack</AlertTitle>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          fontSize: '0.75rem',
                          overflow: 'auto',
                          maxHeight: 150,
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Typography>
                    </Alert>
                  )}

                  <Button variant="text" color="warning" onClick={this.resetError} sx={{ mt: 2 }}>
                    Try to Recover (Dev Only)
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// HOC wrapper for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorHandler?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary onError={errorHandler}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
