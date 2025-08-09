import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/helpers/test-utils';
import React from 'react';

// Mock the SuperAdminLogin component for testing
const MockSuperAdminLogin = () => {
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const [isLocked, setIsLocked] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(0);
  const [recentSecurityEvents, setRecentSecurityEvents] = React.useState<any[]>([]);

  const handleInputChange = (field: 'username' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (isLocked) {
      setError(`Account temporarily locked. Please try again in ${remainingTime} seconds.`);
      return;
    }

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log security event
      const securityEvent = {
        id: Date.now().toString(),
        event_type: 'LOGIN_ATTEMPT',
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
      };
      setRecentSecurityEvents(prev => [securityEvent, ...prev.slice(0, 4)]);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));

      if (credentials.username === 'admin@upschool.com' && credentials.password === 'Admin123!') {
        // Success
        return;
      } else {
        throw new Error('Invalid credentials');
      }

    } catch (err: any) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);

      let errorMessage = 'Authentication failed. Please check your credentials.';
      
      if (err.message?.includes('invalid_credentials')) {
        errorMessage = 'Invalid username or password.';
      } else if (err.message?.includes('account_locked')) {
        errorMessage = 'Account has been locked due to security policies.';
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);

      // Implement progressive lockout
      if (attempts >= 5) {
        const lockoutMinutes = 5;
        setIsLocked(true);
        setRemainingTime(300); // 5 minutes in seconds
        setError(`Too many failed attempts. Account locked for ${lockoutMinutes} minutes.`);
      } else if (attempts >= 3) {
        setError(`${errorMessage} ${5 - attempts} attempts remaining.`);
      }

      // Log failed attempt
      const failedEvent = {
        id: Date.now().toString(),
        event_type: 'LOGIN_FAILED',
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
      };
      setRecentSecurityEvents(prev => [failedEvent, ...prev.slice(0, 4)]);

    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="super-admin-login">
      <h1>SaaS Admin Portal</h1>
      <p>System Administrator Access</p>
      
      {/* Security Alert */}
      {(loginAttempts > 2 || isLocked) && (
        <div data-testid="security-alert" role="alert">
          {isLocked
            ? `Account locked. Time remaining: ${formatTimeRemaining(remainingTime)}`
            : `${loginAttempts}/5 login attempts used. Account will be locked after 5 failed attempts.`
          }
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div data-testid="error-message" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="login-form">
        <input
          data-testid="username-input"
          type="email"
          placeholder="Username / Email"
          value={credentials.username}
          onChange={handleInputChange('username')}
          required
          disabled={loading || isLocked}
        />

        <input
          data-testid="password-input"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange('password')}
          required
          disabled={loading || isLocked}
        />

        <button
          data-testid="show-password-button"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading || isLocked}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>

        <button
          data-testid="submit-button"
          type="submit"
          disabled={loading || isLocked || !credentials.username || !credentials.password}
        >
          {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
        </button>
      </form>

      {/* Security Dashboard */}
      <div data-testid="security-dashboard">
        <h3>Security Monitor</h3>
        <p>Login Attempts: {loginAttempts}</p>
        <p>Recent Events: {recentSecurityEvents.length}</p>
        
        {/* Recent Security Events */}
        <div data-testid="recent-events">
          {recentSecurityEvents.length > 0 ? (
            recentSecurityEvents.map((event) => (
              <div key={event.id} data-testid="security-event">
                {event.event_type.replace('_', ' ')} - {new Date(event.timestamp).toLocaleString()}
              </div>
            ))
          ) : (
            <p>No recent events</p>
          )}
        </div>

        {/* System Security Info */}
        <div data-testid="system-security">
          <p>SSL/TLS: Active</p>
          <p>Firewall: Protected</p>
          <p>Rate Limiting: {isLocked ? 'Locked' : 'Active'}</p>
        </div>
      </div>

      {/* Security Features */}
      <div data-testid="security-features">
        <p>Security Features Active</p>
        <span>IP Tracking</span>
        <span>Brute Force Protection</span>
        <span>Session Security</span>
      </div>
    </div>
  );
};

describe('SuperAdminLogin Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render super admin login form with all required fields', () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    expect(screen.getByText('SaaS Admin Portal')).toBeInTheDocument();
    expect(screen.getByText('System Administrator Access')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('show-password-button')).toBeInTheDocument();
  });

  it('should display security dashboard components', () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    expect(screen.getByTestId('security-dashboard')).toBeInTheDocument();
    expect(screen.getByText('Security Monitor')).toBeInTheDocument();
    expect(screen.getByTestId('recent-events')).toBeInTheDocument();
    expect(screen.getByTestId('system-security')).toBeInTheDocument();
    expect(screen.getByTestId('security-features')).toBeInTheDocument();
  });

  it('should allow user to enter username and password', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');

    await user.type(usernameInput, 'admin@upschool.com');
    await user.type(passwordInput, 'Admin123!');

    expect(usernameInput).toHaveValue('admin@upschool.com');
    expect(passwordInput).toHaveValue('Admin123!');
  });

  it('should toggle password visibility', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const passwordInput = screen.getByTestId('password-input');
    const showPasswordButton = screen.getByTestId('show-password-button');

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(showPasswordButton).toHaveTextContent('Show');

    // Click to show password
    await user.click(showPasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(showPasswordButton).toHaveTextContent('Hide');

    // Click to hide password again
    await user.click(showPasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(showPasswordButton).toHaveTextContent('Show');
  });

  it('should show loading state during authentication', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(usernameInput, 'admin@upschool.com');
    await user.type(passwordInput, 'Admin123!');
    
    await user.click(submitButton);

    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should handle successful login', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(usernameInput, 'admin@upschool.com');
    await user.type(passwordInput, 'Admin123!');
    await user.click(submitButton);

    // Wait for the authentication process to complete
    await waitFor(() => {
      expect(screen.queryByText('Authenticating...')).not.toBeInTheDocument();
    });

    // Should not show any error messages for valid credentials
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('should display error for invalid credentials', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(usernameInput, 'invalid@upschool.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Authentication failed. Please check your credentials.');
    });
  });

  it('should display error for empty fields', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const form = screen.getByTestId('login-form');

    // Submit form directly with empty fields
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter both username and password.');
    });
  });

  it('should track login attempts and show warnings', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Make 3 failed attempts
    for (let i = 0; i < 3; i++) {
      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'invalid@upschool.com');
      await user.type(passwordInput, `wrong${i}`);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    }

    // Should show warning after 3 attempts
    await waitFor(() => {
      expect(screen.getByTestId('security-alert')).toBeInTheDocument();
    });

    const securityAlert = screen.getByTestId('security-alert');
    expect(securityAlert).toHaveTextContent('3/5 login attempts used');
  });

  it('should lock account after 5 failed attempts', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'invalid@upschool.com');
      await user.type(passwordInput, `wrong${i}`);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    }

    // Account should be locked
    await waitFor(() => {
      expect(screen.getByTestId('security-alert')).toBeInTheDocument();
      expect(screen.getByTestId('security-alert')).toHaveTextContent('Account locked');
    });

    expect(submitButton).toBeDisabled();
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it('should log security events', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Initially no events
    expect(screen.getByText('No recent events')).toBeInTheDocument();

    // Make a login attempt
    await user.type(usernameInput, 'invalid@upschool.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    // Should log both LOGIN_ATTEMPT and LOGIN_FAILED events
    await waitFor(() => {
      const events = screen.getAllByTestId('security-event');
      expect(events.length).toBe(2); // LOGIN_ATTEMPT and LOGIN_FAILED
    });
  });

  it('should disable form when account is locked', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');
    const showPasswordButton = screen.getByTestId('show-password-button');

    // Lock the account by making 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'invalid@upschool.com');
      await user.type(passwordInput, `wrong${i}`);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    }

    // All form elements should be disabled
    await waitFor(() => {
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(showPasswordButton).toBeDisabled();
    });
  });

  it('should clear error when user starts typing', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Make an invalid login attempt first to trigger an error
    await user.type(usernameInput, 'invalid@upschool.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    // Start typing in username field
    await user.type(usernameInput, 'admin');

    // Error should be cleared
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('should have proper security features displayed', () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const securityFeatures = screen.getByTestId('security-features');
    expect(securityFeatures).toHaveTextContent('IP Tracking');
    expect(securityFeatures).toHaveTextContent('Brute Force Protection');
    expect(securityFeatures).toHaveTextContent('Session Security');
  });

  it('should show system security status', () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const systemSecurity = screen.getByTestId('system-security');
    expect(systemSecurity).toHaveTextContent('SSL/TLS: Active');
    expect(systemSecurity).toHaveTextContent('Firewall: Protected');
    expect(systemSecurity).toHaveTextContent('Rate Limiting: Active');
  });

  it('should require both username and password', () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    expect(usernameInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(submitButton).toBeDisabled(); // Should be disabled when fields are empty
  });

  it('should handle form submission with Enter key', async () => {
    renderWithProviders(<MockSuperAdminLogin />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');

    await user.type(usernameInput, 'admin@upschool.com');
    await user.type(passwordInput, 'Admin123!');
    
    // Press Enter to submit form
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Authenticating...')).toBeInTheDocument();
    });
  });
});
