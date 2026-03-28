import React from 'react';
import '../styles/EventCard.css';
import { formatPrice } from '../utils/currency';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // Premium category-specific gradient backgrounds
  const getCategoryGradient = (category) => {
    const gradients = {
      conference: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      concert: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      comedy: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      sports: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      theater: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return gradients[category?.toLowerCase()] || gradients.default;
  };

  // Premium Unsplash image URLs for each category
  const getEventImage = (eventTitle, category) => {
    const categoryMap = {
      conference: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80',
      concert: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80',
      comedy: 'https://images.unsplash.com/photo-1508700115892-8048bbc1a245?w=800&h=600&fit=crop&q=80',
      sports: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop&q=80',
      theater: 'https://images.unsplash.com/photo-1504218253633-d92a19fb4e4e?w=800&h=600&fit=crop&q=80',
    };

    // Check specific event titles first
    if (eventTitle) {
      const titleLower = eventTitle.toLowerCase();
      
      // Specific event title mappings
      if (titleLower.includes('tech conference')) {
        return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80';
      }
      if (titleLower.includes('business') && titleLower.includes('networking')) {
        return 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&h=600&fit=crop&q=80';
      }
      if (titleLower.includes('sports') && titleLower.includes('championship')) {
        return 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&h=600&fit=crop&q=80';
      }
      if (titleLower.includes('comedy night special')) {
        return 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop&q=80';
      }
      if (titleLower.includes('theater') && titleLower.includes('modern drama')) {
        return 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop&q=80';
      }
      
      // Generic category-based mappings
      if (titleLower.includes('tech') || titleLower.includes('conference')) {
        return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80';
      }
      if (titleLower.includes('comedy')) {
        return 'https://images.unsplash.com/photo-1508700115892-8048bbc1a245?w=800&h=600&fit=crop&q=80';
      }
      if (titleLower.includes('concert') || titleLower.includes('music')) {
        return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80';
      }
      if (titleLower.includes('theater') || titleLower.includes('performance')) {
        return 'https://images.unsplash.com/photo-1504218253633-d92a19fb4e4e?w=800&h=600&fit=crop&q=80';
      }
    }

    // Fall back to category-based image
    return categoryMap[category?.toLowerCase()] || categoryMap.conference;
  };

  // Use either provided image or category-mapped Unsplash image
  const imageUrl = event.image || getEventImage(event.title, event.category);

  // Get organizer name with fallback
  const organizerName = event.organizer?.name || 'Event Organizer';

  // Calculate seats availability percentage
  const seatsPercentage = event.totalSeats > 0 
    ? Math.round((event.availableSeats / event.totalSeats) * 100) 
    : 0;

  // Determine seat status color
  const getSeatStatusClass = () => {
    if (seatsPercentage > 50) return 'seats-good';
    if (seatsPercentage > 20) return 'seats-warning';
    return 'seats-critical';
  };

  return (
    <div className="event-card">
      {/* Image Section with Category Badge */}
      <div 
        className="event-image"
        style={{ background: getCategoryGradient(event.category) }}
      >
        <img 
          src={imageUrl} 
          alt={event.title} 
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="image-overlay"></div>
        
        {/* Category Badge */}
        <div className="event-category-badge">
          {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Event'}
        </div>

        {/* Seats Status Indicator */}
        <div className={`seats-indicator ${getSeatStatusClass()}`}>
          {event.availableSeats === 0 ? (
            <span>Sold Out</span>
          ) : event.availableSeats <= 10 ? (
            <span>Limited Seats</span>
          ) : (
            <span>{seatsPercentage}% Available</span>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="event-details">
        {/* Event Title */}
        <h3 className="event-title">{event.title}</h3>

        {/* Organizer Info */}
        <div className="organizer-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="organizer-name">{organizerName}</span>
        </div>

        {/* Date and Location */}
        <div className="event-meta">
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="date-text">
              {event.date 
                ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                : 'Date TBA'
              }
            </span>
          </div>

          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="location-text">{event.location || 'Location TBA'}</span>
          </div>
        </div>

        {/* Description */}
        <p className="event-description">
          {event.description ? event.description.substring(0, 85) : 'Premium event'}...
        </p>

        {/* Footer with Price and Seats */}
        <div className="event-footer">
          <div className="price-info">
            <span className="price-label">From</span>
            <span className="event-price">{formatPrice(event.price || 0)}</span>
          </div>

          <div className="seats-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="seats-left">{event.availableSeats} seats</span>
          </div>
        </div>

        {/* View Details Button */}
        <button className="view-details-btn" onClick={() => navigate(`/events/${event._id}`)}>
          View Details
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
