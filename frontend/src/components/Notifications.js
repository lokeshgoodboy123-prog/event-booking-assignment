import React, { useState, useEffect } from 'react';
import '../styles/Notifications.css';
import { axiosInstance } from '../services/api';

const Notifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/notifications/user');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/api/notifications/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/api/notifications/${notificationId}/read`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmation':
        return '✓';
      case 'event_reminder':
        return '🔔';
      case 'payment_success':
        return '✓';
      case 'cancellation':
        return '✕';
      case 'email':
        return '📧';
      default:
        return '•';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_confirmation':
        return '#4CAF50';
      case 'event_reminder':
        return '#2196F3';
      case 'payment_success':
        return '#4CAF50';
      case 'cancellation':
        return '#f44336';
      case 'email':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-overlay" onClick={onClose}>
      <div className="notifications-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notifications-header">
          <h2>Notifications</h2>
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          <button className="notifications-close" onClick={onClose}>×</button>
        </div>

        <div className="notifications-content">
          {isLoading ? (
            <div className="loading">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="no-notifications">No notifications yet</div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                >
                  <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notification._id)}
                        title="Mark as read"
                      >
                        •
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNotification(notification._id)}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
