import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types';
import { THEME_CONFIG } from '../../constants';

// Initial state
const initialState: UIState = {
  theme: (localStorage.getItem(THEME_CONFIG.STORAGE_KEY) as 'light' | 'dark') || THEME_CONFIG.DEFAULT_THEME,
  sidebarOpen: false,
  loading: false,
  notifications: [],
};

// UI slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme management
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem(THEME_CONFIG.STORAGE_KEY, action.payload);
    },

    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem(THEME_CONFIG.STORAGE_KEY, newTheme);
    },

    // Sidebar management
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Reset UI state
    resetUI: (state) => {
      return { ...initialState, theme: state.theme };
    },
  },
});

// Export actions
export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setLoading,
  resetUI,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
