import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../shared/theme/theme';
import { authSlice } from '../../shared/store/slices/authSlice';
import { uiSlice } from '../../shared/store/slices/uiSlice';
import { notificationSlice } from '../../shared/store/slices/notificationSlice';
import { combineReducers } from '@reduxjs/toolkit';

// Create root reducer for tests
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  ui: uiSlice.reducer,
  notifications: notificationSlice.reducer,
});

// Create test store with all reducers
export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });
};

// Interface for custom render options
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
  store?: any;
  route?: string;
}

/**
 * Custom render function that wraps component with all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    initialState = {},
    store = createTestStore(initialState),
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Update window location for testing routes
  window.history.pushState({}, 'Test page', route);
  
  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
  }
  
  return { 
    store,
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions })
  };
}

// Re-export everything
export * from '@testing-library/react';
export { renderWithProviders as render };
