import React, { useEffect } from 'react';
import '../styles/BookingConfirmationModal.css';
import { formatPrice } from '../utils/currency';

const BookingConfirmationModal = ({ 
  isOpen, 
  onClose, 
  bookingData, 
  onProceedToPayment 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !bookingData) return null;

  const {
    referenceId,
    eventTitle,
    eventDate,
    eventLocation,
    eventPrice,
    numberOfTickets,
    totalPrice,
    organizerName
  } = bookingData;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p className="booking-reference">
            Reference ID: <span className="reference-code">{referenceId}</span>
          </p>
        </div>

        <div className="modal-body">
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            
            <div className="summary-item">
              <span className="label">Event:</span>
              <span className="value">{eventTitle}</span>
            </div>

            <div className="summary-item">
              <span className="label">Organizer:</span>
              <span className="value">{organizerName}</span>
            </div>

            <div className="summary-item">
              <span className="label">Date:</span>
              <span className="value">
                {new Date(eventDate).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="summary-item">
              <span className="label">Location:</span>
              <span className="value">{eventLocation}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">
              <span className="label">Ticket Price:</span>
              <span className="value">{formatPrice(eventPrice)}</span>
            </div>

            <div className="summary-item">
              <span className="label">Number of Tickets:</span>
              <span className="value quantity">{numberOfTickets}</span>
            </div>

            <div className="summary-item total">
              <span className="label">Total Amount:</span>
              <span className="value total-price">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="booking-info-box">
            <h4>Next Steps:</h4>
            <ul>
              <li>Confirm your booking with the payment</li>
              <li>You'll receive a confirmation email shortly</li>
              <li>Save your Reference ID for future reference</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Save Reference ID
          </button>
          <button className="btn-primary" onClick={() => {
            onProceedToPayment();
            onClose();
          }}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
