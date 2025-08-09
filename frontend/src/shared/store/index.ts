import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Import reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import { apiSlice } from './slices/apiSlice';
import { sessionMiddleware } from './middleware/sessionMiddleware';

// Import root reducer
import rootReducer from './rootReducer';

// Persist configuration
const persistConfig = {
  key: 'erp-root',
  version: 1,
  storage,
  // Only persist authentication and critical user data
  whitelist: ['auth'],
  // Don't persist UI state and notifications
  blacklist: ['ui', 'notification', 'api'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with enhanced middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // Enable additional checks in development
      immutableCheck: process.env.NODE_ENV === 'development',
    })
      // Add RTK Query middleware and session middleware
      .concat(apiSlice.middleware)
      .prepend(sessionMiddleware.middleware),

  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'Multi-Tenant School ERP',
    trace: true,
    traceLimit: 25,
  },
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behavior
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export actions for easy access
export * from './slices/authSlice';
export * from './slices/uiSlice';
export * from './slices/notificationSlice';
export { apiSlice };
