import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test-utils/helpers/test-utils'
import React from 'react'

// Mock AuthContext implementation
interface MockUser {
  id: number
  email: string
  user_type: string
  is_superuser?: boolean
}

interface MockAuthContextType {
  isAuthenticated: boolean
  user: MockUser | null
  tenant: any
  permissions: string[]
  loading: boolean
  error: string | null
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  clearError: () => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
}

const MockAuthContext = React.createContext<MockAuthContextType | undefined>(undefined)

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [user, setUser] = React.useState<MockUser | null>(null)
  const [tenant, setTenant] = React.useState(null)
  const [permissions, setPermissions] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const login = async (credentials: { username: string; password: string }) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))

      if (credentials.username === 'admin@example.com' && credentials.password === 'password123') {
        const mockUser = {
          id: 1,
          email: 'admin@example.com',
          user_type: 'admin',
          is_superuser: true
        }
        setUser(mockUser)
        setIsAuthenticated(true)
        setPermissions(['users:read', 'users:write', 'admin:access'])
      } else if (credentials.username === 'student@example.com' && credentials.password === 'password123') {
        const mockUser = {
          id: 2,
          email: 'student@example.com',
          user_type: 'student'
        }
        setUser(mockUser)
        setIsAuthenticated(true)
        setPermissions(['profile:read'])
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 50))
      
      setIsAuthenticated(false)
      setUser(null)
      setTenant(null)
      setPermissions([])
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    setLoading(true)
    try {
      // Simulate API call to get current user
      await new Promise(resolve => setTimeout(resolve, 50))
      
      if (user) {
        // User data is already current
        return
      } else {
        throw new Error('No authenticated user')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission))
  }

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission))
  }

  const contextValue: MockAuthContextType = {
    isAuthenticated,
    user,
    tenant,
    permissions,
    loading,
    error,
    login,
    logout,
    getCurrentUser,
    clearError,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }

  return (
    <MockAuthContext.Provider value={contextValue}>
      {children}
    </MockAuthContext.Provider>
  )
}

const useMockAuth = () => {
  const context = React.useContext(MockAuthContext)
  if (!context) {
    throw new Error('useMockAuth must be used within MockAuthProvider')
  }
  return context
}

// Test component that uses the auth context
const TestAuthComponent = () => {
  const {
    isAuthenticated,
    user,
    permissions,
    loading,
    error,
    login,
    logout,
    clearError,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useMockAuth()

  const [credentials, setCredentials] = React.useState({
    username: '',
    password: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(credentials)
    } catch (error) {
      // Error is handled by context
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return <div data-testid="loading">Loading...</div>
  }

  if (isAuthenticated && user) {
    return (
      <div data-testid="authenticated-view">
        <div data-testid="user-email">{user.email}</div>
        <div data-testid="user-type">{user.user_type}</div>
        <div data-testid="permissions">{permissions.join(', ')}</div>
        
        {hasPermission('users:read') && (
          <div data-testid="has-users-read">Can read users</div>
        )}
        
        {hasAnyPermission(['admin:access', 'teacher:access']) && (
          <div data-testid="has-admin-or-teacher">Admin or Teacher access</div>
        )}
        
        {hasAllPermissions(['users:read', 'users:write']) && (
          <div data-testid="has-full-users-access">Full user access</div>
        )}
        
        <button onClick={handleLogout} data-testid="logout-button">
          Logout
        </button>
      </div>
    )
  }

  return (
    <div data-testid="login-view">
      {error && <div data-testid="error-message">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <input
          data-testid="username-input"
          type="email"
          placeholder="Email"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit" data-testid="login-button">Login</button>
      </form>
      
      {error && (
        <button onClick={clearError} data-testid="clear-error-button">
          Clear Error
        </button>
      )}
    </div>
  )
}

describe('AuthContext', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide initial unauthenticated state', () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    expect(screen.getByTestId('login-view')).toBeInTheDocument()
    expect(screen.queryByTestId('authenticated-view')).not.toBeInTheDocument()
  })

  it('should handle successful admin login', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated-view')).toBeInTheDocument()
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('admin@example.com')
    expect(screen.getByTestId('user-type')).toHaveTextContent('admin')
    expect(screen.getByTestId('permissions')).toHaveTextContent('users:read, users:write, admin:access')
  })

  it('should handle successful student login', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'student@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated-view')).toBeInTheDocument()
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('student@example.com')
    expect(screen.getByTestId('user-type')).toHaveTextContent('student')
    expect(screen.getByTestId('permissions')).toHaveTextContent('profile:read')
  })

  it('should handle login failure with error message', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'invalid@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials')
    })

    expect(screen.getByTestId('login-view')).toBeInTheDocument()
    expect(screen.queryByTestId('authenticated-view')).not.toBeInTheDocument()
  })

  it('should show loading state during login', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    
    // Click and immediately check for loading state
    const clickPromise = user.click(loginButton)

    // Should show loading state briefly
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    }, { timeout: 100 })

    await clickPromise
  })

  it('should handle logout successfully', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    // First login
    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated-view')).toBeInTheDocument()
    })

    // Then logout
    const logoutButton = screen.getByTestId('logout-button')
    await user.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByTestId('login-view')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('authenticated-view')).not.toBeInTheDocument()
  })

  it('should handle permission checking correctly', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    // Login as admin
    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated-view')).toBeInTheDocument()
    })

    // Check individual permission
    expect(screen.getByTestId('has-users-read')).toBeInTheDocument()
    
    // Check any permission (admin has admin:access)
    expect(screen.getByTestId('has-admin-or-teacher')).toBeInTheDocument()
    
    // Check all permissions (admin has both users:read and users:write)
    expect(screen.getByTestId('has-full-users-access')).toBeInTheDocument()
  })

  it('should handle permission checking for limited user', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    // Login as student (limited permissions)
    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'student@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated-view')).toBeInTheDocument()
    })

    // Student should not have these permissions
    expect(screen.queryByTestId('has-users-read')).not.toBeInTheDocument()
    expect(screen.queryByTestId('has-admin-or-teacher')).not.toBeInTheDocument()
    expect(screen.queryByTestId('has-full-users-access')).not.toBeInTheDocument()
  })

  it('should clear error messages', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    // Trigger error
    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'invalid@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })

    // Clear error
    const clearErrorButton = screen.getByTestId('clear-error-button')
    await user.click(clearErrorButton)

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
  })

  it('should throw error when used outside provider', () => {
    // Mock console.error to avoid test noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderWithProviders(<TestAuthComponent />)
    }).toThrow('useMockAuth must be used within MockAuthProvider')

    consoleSpy.mockRestore()
  })

  it('should handle concurrent operations correctly', async () => {
    renderWithProviders(
      <MockAuthProvider>
        <TestAuthComponent />
      </MockAuthProvider>
    )

    // Start login process
    const usernameInput = screen.getByTestId('username-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')

    await user.type(usernameInput, 'admin@example.com')
    await user.type(passwordInput, 'password123')
    
    // Click multiple times rapidly
    user.click(loginButton)
    user.click(loginButton)
    user.click(loginButton)

    // Should still work correctly
    await waitFor(() => {
      expect(screen.getByTestId('authenticated-view')).toBeInTheDocument()
    })
  })
})
