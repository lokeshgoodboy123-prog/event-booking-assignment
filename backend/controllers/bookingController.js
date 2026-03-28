const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const notificationController = require('./notificationController');
const { v4: uuidv4 } = require('uuid');

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    console.log('Booking request:', { eventId, numberOfTickets, userId: req.user?.userId });

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    const totalPrice = numberOfTickets * event.price;
    const bookingId = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;

    const booking = new Booking({
      bookingId,
      event: eventId,
      user: req.user.userId,
      numberOfTickets,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'completed'
    });

    await booking.save();

    // Update available seats
    event.availableSeats -= numberOfTickets;
    await event.save();

    // Populate references
    await booking.populate('event');
    await booking.populate('user', 'name email');

    // Create booking confirmation notification
    await notificationController.createBookingConfirmation(booking._id);

    console.log('Booking created successfully:', booking);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('event')
      .populate('user', 'name email')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Return seats to event
    const event = await Event.findById(booking.event);
    event.availableSeats += booking.numberOfTickets;
    await event.save();

    // Create cancellation notification
    const notification = new Notification({
      user: booking.user._id,
      type: 'cancellation',
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.event.title} has been cancelled. Refund will be processed within 5-7 business days.`,
      relatedBooking: booking._id,
      relatedEvent: booking.event._id
    });
    await notification.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
