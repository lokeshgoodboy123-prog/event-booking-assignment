import { QRCodeCanvas } from 'qrcode.react';
import React, { useState, useEffect } from 'react';
import '../styles/Bookings.css';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // Wait for auth check to complete
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, authLoading, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getUserBookings();
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        fetchBookings();
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  const handlePayNow = (booking) => {
    navigate('/payment', { state: { booking } });
  };

  if (isLoading) return <div className="loading">Loading your bookings...</div>;

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>
      {error && <div className="error-message">{error}</div>}
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
          <a href="/events">Browse Events</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.event?.title}</h3>
                <span className={`status ${booking.status}`}>{booking.status}</span>
              </div>
              <div className="booking-details">
                <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                <p><strong>Event Date:</strong> {new Date(booking.event?.date).toLocaleDateString()}</p>
                <p><strong>Tickets:</strong> {booking.numberOfTickets}</p>
                <p><strong>Total Price:</strong> {formatPrice(booking.totalPrice)}</p>
                <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
  <QRCodeCanvas
    value={`${booking._id} | ${booking.event?.title || 'Event'} | ${booking.numberOfTickets}`}
    size={85}
  />
</div>
                <p><strong>Booked On:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div className="booking-actions">
                {booking.status !== 'cancelled' && booking.paymentStatus === 'pending' && (
                  <button 
                    className="pay-btn"
                    onClick={() => handlePayNow(booking)}
                  >
                    Pay Now
                  </button>
                )}
                {booking.status !== 'cancelled' && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
