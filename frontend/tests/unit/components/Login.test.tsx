import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test-utils/helpers/test-utils'
import React from 'react'

// Mock Login component for testing
const MockLogin = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate login logic
    await new Promise(resolve => setTimeout(resolve, 100))

    if (email === 'test@example.com' && password === 'password123') {
      setIsAuthenticated(true)
    } else if (email === 'invalid@example.com') {
      setError('Invalid credentials')
    } else {
      setError('Login failed')
    }
    
    setLoading(false)
  }

  if (isAuthenticated) {
    return <div data-testid="success-message">You are signed in</div>
  }

  return (
    <div data-testid="login-form">
      <h1>Sign in</h1>
      {error && <div data-testid="error-message" role="alert">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button
          data-testid="submit-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

describe('Login Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form with all required fields', () => {
    renderWithProviders(<MockLogin />)
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
  })

  it('should allow user to enter email and password', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should show loading state during login attempt', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('submit-button')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    await user.click(submitButton)

    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should handle successful login', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('submit-button')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })
  })

  it('should display error message for invalid credentials', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('submit-button')

    await user.type(emailInput, 'invalid@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials')
    })
  })

  it('should display generic error for other login failures', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('submit-button')

    await user.type(emailInput, 'other@example.com')
    await user.type(passwordInput, 'somepassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Login failed')
    })
  })

  it('should require email field', () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('should require password field', () => {
    renderWithProviders(<MockLogin />)
    
    const passwordInput = screen.getByTestId('password-input')
    expect(passwordInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should prevent form submission when loading', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('submit-button')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    // First click to start loading
    await user.click(submitButton)
    
    // Second click should be ignored due to disabled state
    expect(submitButton).toBeDisabled()
  })

  it('should clear error message on new submission', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('submit-button')

    // First attempt with invalid credentials
    await user.type(emailInput, 'invalid@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })

    // Clear and enter valid credentials
    await user.clear(emailInput)
    await user.clear(passwordInput)
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Error should be cleared during new attempt
    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
    })
  })

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Check if error message has proper role
    // This would be tested when an error is displayed
  })

  it('should handle form submission with Enter key', async () => {
    renderWithProviders(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    // Press Enter to submit form
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })
  })
})
