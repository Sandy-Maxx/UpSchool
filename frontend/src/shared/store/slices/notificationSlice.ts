import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  autoHide?: boolean;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
        autoHide: action.payload.autoHide ?? true,
        duration: action.payload.duration ?? 5000,
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },

    markAllAsRead: state => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },

    clearAllNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    clearReadNotifications: state => {
      state.notifications = state.notifications.filter(n => !n.read);
    },
  },
});

export const {
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  clearReadNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

// Helper action creators
export const showSuccessNotification = (title: string, message: string) =>
  addNotification({ type: 'success', title, message });

export const showErrorNotification = (title: string, message: string) =>
  addNotification({ type: 'error', title, message, autoHide: false });

export const showWarningNotification = (title: string, message: string) =>
  addNotification({ type: 'warning', title, message });

export const showInfoNotification = (title: string, message: string) =>
  addNotification({ type: 'info', title, message });
