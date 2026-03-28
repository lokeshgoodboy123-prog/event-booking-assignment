const Event = require('../models/Event');

// Get all events with filters
exports.getAllEvents = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: 1 });

    const total = await Event.countDocuments(query);

    res.json({
      events,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create event (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, location, date, startTime, endTime, price, totalSeats } = req.body;

    const event = new Event({
      title,
      description,
      category,
      location,
      date,
      startTime,
      endTime,
      price,
      totalSeats,
      availableSeats: totalSeats,
      organizer: req.user.userId
    });

    await event.save();
    await event.populate('organizer', 'name email');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    event.updatedAt = Date.now();
    await event.save();

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete event (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check availability
exports.checkAvailability = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isAvailable = event.availableSeats >= numberOfTickets;

    res.json({
      eventId,
      availableSeats: event.availableSeats,
      requestedTickets: numberOfTickets,
      isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
