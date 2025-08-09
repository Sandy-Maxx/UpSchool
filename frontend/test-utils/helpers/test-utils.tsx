import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store } from '@/shared/store'
import { theme } from '@/shared/theme/theme'

// Portal Context Mock
interface PortalContextType {
  type: 'saas' | 'tenant'
  tenant?: {
    id: string
    name: string
    domain: string
  }
}

const defaultPortalContext: PortalContextType = {
  type: 'saas'
}

// Create a mock portal context provider
export const MockPortalProvider = ({ 
  children, 
  value = defaultPortalContext 
}: { 
  children: ReactNode
  value?: PortalContextType 
}) => {
  return <div data-portal-context={JSON.stringify(value)}>{children}</div>
}

// All the providers wrapper
const AllTheProviders = ({ 
  children,
  portalContext = defaultPortalContext
}: { 
  children: ReactNode
  portalContext?: PortalContextType
}) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MockPortalProvider value={portalContext}>
            {children}
          </MockPortalProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

// Custom render function with all providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    portalContext?: PortalContextType
  }
) => {
  const { portalContext, ...renderOptions } = options || {}
  
  return render(ui, { 
    wrapper: ({ children }) => (
      <AllTheProviders portalContext={portalContext}>
        {children}
      </AllTheProviders>
    ), 
    ...renderOptions 
  })
}

// Test utilities for different portal contexts
export const renderWithSaaSContext = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return customRender(ui, {
    ...options,
    portalContext: { type: 'saas' }
  })
}

export const renderWithTenantContext = (
  ui: ReactElement, 
  options?: Omit<RenderOptions, 'wrapper'> & {
    tenant?: PortalContextType['tenant']
  }
) => {
  const { tenant, ...renderOptions } = options || {}
  return customRender(ui, {
    ...renderOptions,
    portalContext: { 
      type: 'tenant',
      tenant: tenant || { id: '1', name: 'Test School', domain: 'test.upschool.com' }
    }
  })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
