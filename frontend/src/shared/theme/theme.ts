import { createTheme } from '@mui/material/styles';

// Minimal MUI theme used for tests and app
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

export default theme;
