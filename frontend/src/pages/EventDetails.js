import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EventDetails.css';
import { eventService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
import { formatPrice } from '../utils/currency';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookingReference, setBookingReference] = useState(null);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await eventService.getEventById(id);
      setEvent(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEventById(id);
      setEvent(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate booking reference ID
  const generateBookingReference = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `EVT${timestamp}${random}`;
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsBooking(true);
    try {
      const response = await bookingService.createBooking(id, numberOfTickets);
      const booking = response.data.booking;
      const referenceId = generateBookingReference();

      // Create booking object with correct structure for Payment page
      const bookingData = {
        _id: booking._id,
        referenceId,
        numberOfTickets,
        totalPrice: event.price * numberOfTickets,
        event: {
          _id: event._id,
          title: event.title,
          date: event.date,
          location: event.location,
          price: event.price,
          organizer: event.organizer
        }
      };

      setBookingReference({
        referenceId,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        eventPrice: event.price,
        numberOfTickets,
        totalPrice: event.price * numberOfTickets,
        organizerName: event.organizer?.name || 'Event Organizer',
        bookingData // Store the full booking data for payment page
      });

      setShowConfirmationModal(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleProceedToPayment = () => {
    if (bookingReference && bookingReference.bookingData) {
      navigate('/payment', { state: { booking: bookingReference.bookingData } });
    }
  };

  // Format event duration
  const formatDuration = (startTime, endTime) => {
    try {
      const start = new Date(`2000-01-01 ${startTime}`);
      const end = new Date(`2000-01-01 ${endTime}`);
      const durationMinutes = (end - start) / (1000 * 60);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
      if (hours > 0) return `${hours}h`;
      return `${minutes}m`;
    } catch {
      return `${startTime} - ${endTime}`;
    }
  };

  // Get seat status color
  const getSeatStatusClass = () => {
    if (!event) return '';
    if (event.availableSeats > 50) return 'status-good';
    if (event.availableSeats > 10) return 'status-warning';
    return 'status-critical';
  };

  if (isLoading) return (
    <div className="event-details-page">
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading event details...</span>
      </div>
    </div>
  );

  if (error && !event) return (
    <div className="event-details-page">
      <div className="error-message">❌ {error}</div>
    </div>
  );

  if (!event) return (
    <div className="event-details-page">
      <div className="error-message">Event not found</div>
    </div>
  );

  return (
    <div className="event-details-page">
      <button onClick={() => navigate('/events')} className="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Events
      </button>

      <div className="event-details-wrapper">
        {/* Hero Image Section */}
        <div className="event-hero">
          <img 
            src={event.image || 'https://via.placeholder.com/1000x400'} 
            alt={event.title} 
            className="hero-image"
          />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="event-category-badge">{event.category}</span>
            <h1 className="hero-title">{event.title}</h1>
          </div>
        </div>

        <div className="details-content">
          {/* Main Content and Sidebar */}
          <div className="details-layout">
            {/* Left: Event Information */}
            <div className="event-info-column">
              {/* Event Description */}
              <section className="details-section">
                <h2>About This Event</h2>
                <p className="event-description-full">{event.description}</p>
              </section>

              {/* Basic Details Grid */}
              <section className="details-section">
                <h3>Event Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div className="detail-content">
                      <label>Date</label>
                      <p>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"></circle>
                      <path d="M12 6v6m0 0v6"></path>
                    </svg>
                    <div className="detail-content">
                      <label>Time</label>
                      <p>{event.startTime} - {event.endTime}</p>
                      <small>{formatDuration(event.startTime, event.endTime)}</small>
                    </div>
                  </div>

                  <div className="detail-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div className="detail-content">
                      <label>Location</label>
                      <p>{event.location}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <div className="detail-content">
                      <label>Capacity</label>
                      <p>{event.totalSeats} seats</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Organizer Section */}
              <section className="details-section organizer-section">
                <h3>Organizer</h3>
                <div className="organizer-card">
                  <div className="organizer-avatar">
                    {event.organizer?.name?.charAt(0) || 'O'}
                  </div>
                  <div className="organizer-info">
                    <h4>{event.organizer?.name || 'Event Organizer'}</h4>
                    <p>Professional Event Organizer</p>
                    <p className="organizer-email">{event.organizer?.email || 'contact@event.com'}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Booking Summary Sidebar */}
            <aside className="booking-sidebar">
              {/* Seat Status Alert */}
              {event.availableSeats <= 20 && event.availableSeats > 0 && (
                <div className="seat-warning">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                  </svg>
                  <span>Only {event.availableSeats} seats left!</span>
                </div>
              )}

              {event.availableSeats === 0 && (
                <div className="sold-out-alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="2"></line>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="2"></line>
                  </svg>
                  <span>This event is sold out</span>
                </div>
              )}

              {/* Booking Summary */}
              <div className="booking-summary-box">
                <h3>Booking Summary</h3>

                <div className="summary-row">
                  <span className="label">Price per Ticket:</span>
                  <span className="value">{formatPrice(event.price)}</span>
                </div>

                <div className="ticket-selector">
                  <label>Number of Tickets:</label>
                  <select 
                    value={numberOfTickets} 
                    onChange={(e) => setNumberOfTickets(Number(e.target.value))}
                    disabled={event.availableSeats === 0}
                  >
                    {Array.from({ length: Math.min(20, event.availableSeats) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="seats-available">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  <span className={getSeatStatusClass()}>
                    {event.availableSeats === 0 
                      ? 'Sold Out' 
                      : `${event.availableSeats} seats available`}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="total-price">
                  <span className="label">Total Price:</span>
                  <span className="amount">{formatPrice(event.price * numberOfTickets)}</span>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <button 
                  className="book-btn-primary"
                  onClick={handleBooking}
                  disabled={isBooking || event.availableSeats === 0}
                >
                  {isBooking ? (
                    <>
                      <span className="spinner-small"></span>
                      Booking...
                    </>
                  ) : event.availableSeats === 0 ? (
                    'Event Sold Out'
                  ) : (
                    'Complete Booking'
                  )}
                </button>

                <p className="booking-note">
                  You'll be redirected to payment after confirming your booking.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        bookingData={bookingReference}
        onProceedToPayment={handleProceedToPayment}
      />
    </div>
  );
};

export default EventDetails;
