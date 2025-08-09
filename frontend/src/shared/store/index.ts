import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authSlice } from './slices/authSlice';
import { uiSlice } from './slices/uiSlice';
import { notificationSlice } from './slices/notificationSlice';
import { sessionMiddleware } from './middleware/sessionMiddleware';

// Root reducer configuration
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  ui: uiSlice.reducer,
  notifications: notificationSlice.reducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // Only persist certain slices
  whitelist: ['auth', 'ui'],
  // Don't persist sensitive data or temporary state
  blacklist: ['notifications'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sessionMiddleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

// Type definitions  
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

// Utility function to reset store
export const resetStore = () => {
  store.dispatch({ type: 'RESET_STORE' });
  persistor.purge();
};
