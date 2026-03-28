const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/check-availability', eventController.checkAvailability);

// Protected routes (Admin only)
router.post('/', authenticateToken, authorizeAdmin, eventController.createEvent);
router.put('/:id', authenticateToken, authorizeAdmin, eventController.updateEvent);
router.delete('/:id', authenticateToken, authorizeAdmin, eventController.deleteEvent);

module.exports = router;
