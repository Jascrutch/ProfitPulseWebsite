import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'LOAD_NOTIFICATIONS'; payload: Notification[] };

const notificationReducer = (state: Notification[], action: NotificationAction): Notification[] => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [action.payload, ...state];
    case 'MARK_AS_READ':
      return state.map(notification =>
        notification.id === action.payload
          ? { ...notification, read: true }
          : notification
      );
    case 'MARK_ALL_AS_READ':
      return state.map(notification => ({ ...notification, read: true }));
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    case 'CLEAR_ALL':
      return [];
    case 'LOAD_NOTIFICATIONS':
      return action.payload;
    default:
      return state;
  }
};

// Notification storage utilities
const NotificationStorage = {
  saveNotifications: (notifications: Notification[]) => {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  },

  loadNotifications: (): Notification[] => {
    try {
      const stored = localStorage.getItem('app_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  },
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = NotificationStorage.loadNotifications();
    if (storedNotifications.length > 0) {
      dispatch({ type: 'LOAD_NOTIFICATIONS', payload: storedNotifications });
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    NotificationStorage.saveNotifications(notifications);
  }, [notifications]);

  // Sample notification logic - this would be triggered by various app events
  useEffect(() => {
    // Example: Add welcome notification for new users
    const hasWelcomeNotification = notifications.some(n => n.title === 'Welcome to ProfitPulse!');
    
    if (!hasWelcomeNotification && notifications.length === 0) {
      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'Welcome to ProfitPulse!',
          message: 'Get started by exploring your dashboard and setting up your first trade.',
          actionUrl: '/onboarding',
          actionText: 'Start Tour',
        });
      }, 2000);
    }

    // Example: Simulate periodic market updates
    const marketUpdateInterval = setInterval(() => {
      const marketHours = new Date().getHours();
      if (marketHours >= 9 && marketHours <= 16) { // Mock market hours
        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        const change = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
        
        addNotification({
          type: change > 0 ? 'success' : 'warning',
          title: `${randomSymbol} Price Alert`,
          message: `${randomSymbol} is ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)}%`,
          actionUrl: `/trading?symbol=${randomSymbol}`,
          actionText: 'View Details',
        });
      }
    }, 30000); // Every 30 seconds during market hours

    return () => clearInterval(marketUpdateInterval);
  }, [notifications]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto-remove notifications after 5 minutes for non-critical ones
    if (notificationData.type === 'info') {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: newNotification.id });
      }, 5 * 60 * 1000);
    }
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Hook for creating specific types of notifications
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  return {
    notifySuccess: (title: string, message: string, actionUrl?: string, actionText?: string) =>
      addNotification({ type: 'success', title, message, actionUrl, actionText }),
    
    notifyError: (title: string, message: string, actionUrl?: string, actionText?: string) =>
      addNotification({ type: 'error', title, message, actionUrl, actionText }),
    
    notifyWarning: (title: string, message: string, actionUrl?: string, actionText?: string) =>
      addNotification({ type: 'warning', title, message, actionUrl, actionText }),
    
    notifyInfo: (title: string, message: string, actionUrl?: string, actionText?: string) =>
      addNotification({ type: 'info', title, message, actionUrl, actionText }),

    notifyTradeExecuted: (symbol: string, type: 'buy' | 'sell', quantity: number, price: number) =>
      addNotification({
        type: 'success',
        title: 'Trade Executed',
        message: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${symbol} at $${price.toFixed(2)}`,
        actionUrl: '/order-history',
        actionText: 'View Details',
      }),

    notifyPriceAlert: (symbol: string, price: number, threshold: number, direction: 'above' | 'below') =>
      addNotification({
        type: 'warning',
        title: 'Price Alert',
        message: `${symbol} is now ${direction} your threshold of $${threshold}. Current price: $${price}`,
        actionUrl: `/trading?symbol=${symbol}`,
        actionText: 'Trade Now',
      }),
  };
};