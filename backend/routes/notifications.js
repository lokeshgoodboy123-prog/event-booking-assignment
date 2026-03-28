const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// Get user's notifications
router.get('/user', authenticateToken, notificationController.getUserNotifications);

// Get unread count
router.get('/unread-count', authenticateToken, notificationController.getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, notificationController.markAsRead);

// Delete notification
router.delete('/:notificationId', authenticateToken, notificationController.deleteNotification);

// Admin: Trigger event reminders (for testing/scheduling)
router.post('/send-reminders', async (req, res) => {
  try {
    const result = await notificationController.sendEventReminders();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error sending reminders', error: error.message });
  }
});

module.exports = router;
