const Notification = require('../models/Notification');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.user;
    const notifications = await Notification.find({ user: userId })
      .populate('relatedBooking')
      .populate('relatedEvent')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create booking confirmation notification
exports.createBookingConfirmation = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('event')
      .populate('user');

    if (!booking) return;

    const notification = new Notification({
      user: booking.user._id,
      type: 'booking_confirmation',
      title: 'Booking Confirmed!',
      message: `Your booking for ${booking.event.title} on ${new Date(booking.event.date).toLocaleDateString()} has been confirmed. Booking ID: ${booking.bookingId}`,
      relatedBooking: bookingId,
      relatedEvent: booking.event._id
    });

    await notification.save();
  } catch (error) {
    console.error('Error creating booking confirmation:', error);
  }
};

// Create event reminder notification
exports.createEventReminder = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('event')
      .populate('user');

    if (!booking) return;

    const eventDate = new Date(booking.event.date);
    const eventTime = booking.event.startTime;

    const notification = new Notification({
      user: booking.user._id,
      type: 'event_reminder',
      title: 'Event Reminder',
      message: `Don't forget! ${booking.event.title} is happening today at ${eventTime} at ${booking.event.location}. You have ${booking.numberOfTickets} ticket(s).`,
      relatedBooking: bookingId,
      relatedEvent: booking.event._id
    });

    await notification.save();
    console.log(`Event reminder sent for booking: ${bookingId}`);
  } catch (error) {
    console.error('Error creating event reminder:', error);
  }
};

// Send event reminders for today (Run this as a scheduled job)
exports.sendEventReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all events happening today
    const eventsToday = await Event.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    console.log(`Found ${eventsToday.length} events for today`);

    for (const event of eventsToday) {
      // Find all bookings for this event
      const bookings = await Booking.find({
        event: event._id,
        status: 'confirmed'
      });

      for (const booking of bookings) {
        // Check if reminder already sent
        const existingReminder = await Notification.findOne({
          relatedBooking: booking._id,
          type: 'event_reminder'
        });

        if (!existingReminder) {
          await exports.createEventReminder(booking._id);
        }
      }
    }

    return { success: true, message: 'Event reminders sent successfully' };
  } catch (error) {
    console.error('Error sending event reminders:', error);
    return { success: false, error: error.message };
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.user;
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = exports;
