import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 1, name: 'Music', emoji: '🎵', filter: 'concert' },
    { id: 2, name: 'Comedy', emoji: '🎭', filter: 'comedy' },
    { id: 3, name: 'Theater', emoji: '🎪', filter: 'theater' },
    { id: 4, name: 'Sports', emoji: '⚽', filter: 'sports' },
    { id: 5, name: 'Business', emoji: '💼', filter: 'conference' }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    navigate(`/events?category=${category.filter}`);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to EventBook</h1>
        <p>Discover and Book Amazing Events Near You</p>
        <button onClick={() => navigate('/events')} className="cta-button">
          Browse Events
        </button>
      </div>

      {/* Category Browsing Section */}
      <div className="category-section">
        <div className="category-content">
          <h2>Browse by Category</h2>
          <p>Find events that match your interests</p>
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="category-icon">
                  {category.emoji}
                </div>
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose EventBook?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎭 Wide Selection</h3>
            <p>Browse thousands of events including concerts, conferences, sports, and more.</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payment</h3>
            <p>Book tickets with confidence using our secure Stripe payment processing.</p>
          </div>
          <div className="feature-card">
            <h3>📅 Easy Calendar</h3>
            <p>View event calendars and find events that fit your schedule.</p>
          </div>
          <div className="feature-card">
            <h3>🔔 Notifications</h3>
            <p>Receive instant notifications for bookings and event reminders.</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Book Your Perfect Event?</h2>
        <button onClick={() => navigate('/events')} className="primary-button">
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default Home;
