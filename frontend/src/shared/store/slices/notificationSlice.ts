import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';
import { UI_CONFIG } from '../../constants';

// Initial state
const initialState: {
  notifications: Notification[];
} = {
  notifications: [],
};

// Notification slice
export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add notification
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(notification);
      
      // Keep only the latest 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    // Add success notification
    addSuccessNotification: (state, action: PayloadAction<{ title: string; message: string }>) => {
      const notification: Notification = {
        ...action.payload,
        type: 'success',
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    // Add error notification
    addErrorNotification: (state, action: PayloadAction<{ title: string; message: string }>) => {
      const notification: Notification = {
        ...action.payload,
        type: 'error',
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    // Add warning notification
    addWarningNotification: (state, action: PayloadAction<{ title: string; message: string }>) => {
      const notification: Notification = {
        ...action.payload,
        type: 'warning',
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    // Add info notification
    addInfoNotification: (state, action: PayloadAction<{ title: string; message: string }>) => {
      const notification: Notification = {
        ...action.payload,
        type: 'info',
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    // Mark notification as read
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },

    // Mark all notifications as read
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },

    // Remove notification
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    // Remove all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Remove old notifications (older than 24 hours)
    cleanupOldNotifications: (state) => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      state.notifications = state.notifications.filter(notification => 
        new Date(notification.timestamp).getTime() > oneDayAgo
      );
    },
  },
});

// Export actions
export const {
  addNotification,
  addSuccessNotification,
  addErrorNotification,
  addWarningNotification,
  addInfoNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  cleanupOldNotifications,
} = notificationSlice.actions;

// Export reducer
export default notificationSlice.reducer;
