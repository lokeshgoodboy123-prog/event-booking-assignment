const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { v4: uuidv4 } = require('uuid');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount provided' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise for INR
      currency: 'INR',
      receipt: `receipt_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: booking.user.toString()
      }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment error', error: error.message });
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const transactionId = `TXN-${uuidv4().slice(0, 12).toUpperCase()}`;

    const payment = new Payment({
      booking: bookingId,
      user: booking.user,
      amount: booking.totalPrice,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      transactionId,
      status: 'succeeded',
      paymentDate: new Date()
    });

    await payment.save();

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    await booking.save();

    // Create notification
    const notification = new Notification({
      user: booking.user,
      type: 'payment_success',
      title: 'Payment Successful',
      message: `Your payment of ₹${booking.totalPrice} has been processed successfully.`,
      relatedBooking: bookingId
    });
    await notification.save();

    res.json({
      message: 'Payment processed successfully',
      payment,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment processing error', error: error.message });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.userId })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
