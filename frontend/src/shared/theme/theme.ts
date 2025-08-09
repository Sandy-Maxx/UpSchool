import { createTheme, ThemeOptions } from '@mui/material/styles'

// UpSchool Brand Colors
const brandColors = {
  primary: '#1976d2', // Professional blue
  secondary: '#dc004e', // Accent red
  success: '#2e7d32', // Green for success states
  warning: '#ed6c02', // Orange for warnings
  error: '#d32f2f', // Red for errors
  info: '#0288d1', // Light blue for info
}

// Extended palette for both portals
const palette = {
  primary: {
    main: brandColors.primary,
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: brandColors.secondary,
    light: '#ff5983',
    dark: '#9a0036',
    contrastText: '#ffffff',
  },
  success: {
    main: brandColors.success,
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  warning: {
    main: brandColors.warning,
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  error: {
    main: brandColors.error,
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
  },
  info: {
    main: brandColors.info,
    light: '#03dac6',
    dark: '#018786',
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
}

// Typography configuration
const typography = {
  fontFamily: [
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.43,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none' as const,
  },
}

// Component customizations
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 16px',
        fontWeight: 600,
        textTransform: 'none' as const,
      },
      contained: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
}

// Create theme options
const themeOptions: ThemeOptions = {
  palette,
  typography,
  components,
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.1)',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 3px 6px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.15)',
    '0px 5px 10px rgba(0,0,0,0.15)',
    '0px 6px 12px rgba(0,0,0,0.15)',
    '0px 7px 14px rgba(0,0,0,0.15)',
    '0px 8px 16px rgba(0,0,0,0.15)',
    '0px 9px 18px rgba(0,0,0,0.15)',
    '0px 10px 20px rgba(0,0,0,0.15)',
    '0px 11px 22px rgba(0,0,0,0.15)',
    '0px 12px 24px rgba(0,0,0,0.15)',
    '0px 13px 26px rgba(0,0,0,0.15)',
    '0px 14px 28px rgba(0,0,0,0.15)',
    '0px 15px 30px rgba(0,0,0,0.15)',
    '0px 16px 32px rgba(0,0,0,0.15)',
    '0px 17px 34px rgba(0,0,0,0.15)',
    '0px 18px 36px rgba(0,0,0,0.15)',
    '0px 19px 38px rgba(0,0,0,0.15)',
    '0px 20px 40px rgba(0,0,0,0.15)',
    '0px 21px 42px rgba(0,0,0,0.15)',
    '0px 22px 44px rgba(0,0,0,0.15)',
    '0px 23px 46px rgba(0,0,0,0.15)',
    '0px 24px 48px rgba(0,0,0,0.15)',
  ],
}

// Create and export the theme
export const theme = createTheme(themeOptions)

// Create portal-specific theme variants
export const saasTheme = createTheme({
  ...themeOptions,
  palette: {
    ...palette,
    primary: {
      main: brandColors.primary,
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
  },
})

export const tenantTheme = createTheme({
  ...themeOptions,
  palette: {
    ...palette,
    primary: {
      main: '#2e7d32', // Green for tenant portal
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
  },
})

// Export default theme
export default theme
