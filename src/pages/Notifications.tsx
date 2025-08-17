import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification } from '@/types';
import { formatRelativeTime } from '@/utils';

const Notifications: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');

  const filteredNotifications = notifications.filter(notification => {
    const readFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);

    const notificationTypeFilter = typeFilter === 'all' || notification.type === typeFilter;

    return readFilter && notificationTypeFilter;
  });

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#007bff';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAllAsRead = () => {
    if (window.confirm('Mark all notifications as read?')) {
      markAllAsRead();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      clearAll();
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-main">
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="header-actions">
          {unreadCount > 0 && (
            <button
              className="action-button secondary"
              onClick={handleMarkAllAsRead}
            >
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="action-button danger"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="notifications-filters">
        <div className="filter-group">
          <label htmlFor="read-filter">Filter by status:</label>
          <select
            id="read-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="unread">Unread ({notifications.filter(n => !n.read).length})</option>
            <option value="read">Read ({notifications.filter(n => n.read).length})</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="type-filter">Filter by type:</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="info">Information</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <h3>No notifications found</h3>
            <p>
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                ? "No read notifications found."
                : "No notifications match your current filters."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.type}`}
              onClick={() => handleNotificationClick(notification)}
              role="button"
              tabIndex={0}
              aria-label={`${notification.title} - ${notification.read ? 'Read' : 'Unread'}`}
            >
              <div className="notification-icon" style={{ color: getTypeColor(notification.type) }}>
                {getTypeIcon(notification.type)}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <div className="notification-meta">
                    <span className="notification-time">
                      {formatRelativeTime(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <span className="unread-indicator" aria-label="Unread notification" />
                    )}
                  </div>
                </div>

                <p className="notification-message">{notification.message}</p>

                {notification.actionUrl && notification.actionText && (
                  <div className="notification-action">
                    <span className="action-link">{notification.actionText}</span>
                  </div>
                )}
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button
                    className="notification-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    aria-label="Mark as read"
                    title="Mark as read"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </button>
                )}
                <button
                  className="notification-action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  aria-label="Delete notification"
                  title="Delete notification"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .notifications-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notifications-header h1 {
          margin: 0;
          color: #333;
        }

        .unread-badge {
          background: #dc3545;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .action-button.secondary {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .action-button.secondary:hover {
          background: #e9ecef;
        }

        .action-button.danger {
          background: #dc3545;
          color: white;
        }

        .action-button.danger:hover {
          background: #c82333;
        }

        .notifications-filters {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #007bff;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-item {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-left: 4px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .notification-item:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        .notification-item.unread {
          background: #f8f9ff;
          border-left-color: #007bff;
        }

        .notification-item.success {
          border-left-color: #28a745;
        }

        .notification-item.warning {
          border-left-color: #ffc107;
        }

        .notification-item.error {
          border-left-color: #dc3545;
        }

        .notification-icon {
          flex-shrink: 0;
          padding: 0.5rem;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }

        .notification-title {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .notification-time {
          font-size: 14px;
          color: #666;
          white-space: nowrap;
        }

        .unread-indicator {
          width: 8px;
          height: 8px;
          background: #007bff;
          border-radius: 50%;
        }

        .notification-message {
          color: #666;
          margin: 0 0 0.5rem 0;
          line-height: 1.5;
        }

        .notification-action {
          margin-top: 0.5rem;
        }

        .action-link {
          color: #007bff;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
        }

        .notification-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .notification-item:hover .notification-actions {
          opacity: 1;
        }

        .notification-action-btn {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 6px;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;
        }

        .notification-action-btn:hover {
          background: #f8f9fa;
          border-color: #ccc;
        }

        .notification-action-btn.delete:hover {
          background: #fee;
          border-color: #dc3545;
          color: #dc3545;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .empty-icon {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .empty-state p {
          margin: 0;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .notifications-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            align-self: stretch;
          }

          .action-button {
            flex: 1;
            text-align: center;
          }

          .notifications-filters {
            flex-direction: column;
            gap: 1rem;
          }

          .notification-item {
            padding: 1rem;
          }

          .notification-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .notification-meta {
            align-self: flex-start;
          }

          .notification-actions {
            opacity: 1;
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;