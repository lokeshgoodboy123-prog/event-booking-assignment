const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Admin dashboard stats
router.get('/dashboard/stats', authenticateToken, authorizeAdmin, adminController.getDashboardStats);

// Get all bookings (Admin)
router.get('/bookings', authenticateToken, authorizeAdmin, async (req, res) => {
  const Booking = require('../models/Booking');
  try {
    const bookings = await Booking.find()
      .populate('event')
      .populate('user', 'name email')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (Admin)
router.get('/users', authenticateToken, authorizeAdmin, adminController.getAllUsers);

// Update user role (Admin)
router.put('/users/:userId/role', authenticateToken, authorizeAdmin, adminController.updateUserRole);

// Delete user (Admin)
router.delete('/users/:userId', authenticateToken, authorizeAdmin, adminController.deleteUser);

module.exports = router;
