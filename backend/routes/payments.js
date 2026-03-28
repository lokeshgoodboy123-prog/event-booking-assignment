const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes
router.post('/create-intent', authenticateToken, paymentController.createPaymentIntent);
router.post('/process', authenticateToken, paymentController.processPayment);
router.get('/history', authenticateToken, paymentController.getPaymentHistory);

module.exports = router;
