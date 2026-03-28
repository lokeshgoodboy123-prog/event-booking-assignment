import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Events.css';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';
import SearchFilters from '../components/SearchFilters';

const EventsList = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedDate, setSelectedDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Update category if it changes in URL params
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchEvents();
  }, [searchTitle, searchLocation, category, priceRange, selectedDate, page]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch all events initially
      const response = await eventService.getAllEvents(category, searchTitle, page, 100);
      let filteredEvents = response.data.events;

      // Client-side filtering for location and date
      if (searchLocation) {
        filteredEvents = filteredEvents.filter(event =>
          event.location?.toLowerCase().includes(searchLocation.toLowerCase())
        );
      }

      if (priceRange[0] > 0 || priceRange[1] < 500) {
        filteredEvents = filteredEvents.filter(event =>
          event.price >= priceRange[0] && event.price <= priceRange[1]
        );
      }

      if (selectedDate) {
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date).toLocaleDateString('en-CA');
          return eventDate === selectedDate;
        });
      }

      setEvents(filteredEvents);
      setError('');
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (title) => {
    setSearchTitle(title);
    setPage(1);
  };

  const handleLocationChange = (location) => {
    setSearchLocation(location);
    setPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    setPage(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPage(1);
  };

  return (
    <div className="events-page">
      {/* Animated background particles */}
      <div className="particles-container">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className="events-wrapper">
        <div className="events-container">
          {/* Header Section */}
          <div className="events-header">
            <h1 className="events-title">Discover Amazing Events</h1>
            <p className="events-subtitle">Find and book the perfect event for you</p>
          </div>

          {/* Advanced Search and Filters */}
          <SearchFilters 
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onDateChange={handleDateChange}
            onLocationChange={handleLocationChange}
          />

          {/* Results Summary */}
          {events.length > 0 && !isLoading && (
            <div className="results-summary">
              <p>Found <strong>{events.length}</strong> event{events.length !== 1 ? 's' : ''}</p>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="error-message">❌ {error}</div>}

          {/* Loading State */}
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <span>Loading amazing events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="no-events">
              <svg viewBox="0 0 100 100" className="no-events-icon">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M 35 65 L 50 50 L 65 65" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <p>✨ No events found</p>
              <p className="no-events-subtitle">
                {searchTitle || searchLocation || category || selectedDate 
                  ? 'Try adjusting your search or filters'
                  : 'Check back soon for upcoming events'}
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsList;
