import React, { useState } from 'react';
import '../styles/SearchFilters.css';
import { convertToINR } from '../utils/currency';

const SearchFilters = ({ 
  onSearch, 
  onCategoryChange, 
  onPriceRangeChange, 
  onDateChange,
  onLocationChange 
}) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTitleSearch = (value) => {
    setSearchTitle(value);
    onSearch(value);
  };

  const handleLocationSearch = (value) => {
    setSearchLocation(value);
    onLocationChange(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  const handlePriceChange = (type, value) => {
    const newRange = type === 'min' 
      ? [value, priceRange[1]] 
      : [priceRange[0], value];
    setPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
    onDateChange(value);
  };

  const clearFilters = () => {
    setSearchTitle('');
    setSearchLocation('');
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setSelectedDate('');
    onSearch('');
    onLocationChange('');
    onCategoryChange('');
    onPriceRangeChange([0, 500]);
    onDateChange('');
  };

  return (
    <div className="search-filters-container">
      {/* Main Search Bar */}
      <div className="main-search">
        <div className="search-input-group">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search by event name, artist, or keywords..."
            value={searchTitle}
            onChange={(e) => handleTitleSearch(e.target.value)}
            className="search-input-main"
          />
        </div>

        <div className="location-input-group">
          <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <input
            type="text"
            placeholder="Search by location or city..."
            value={searchLocation}
            onChange={(e) => handleLocationSearch(e.target.value)}
            className="search-input-location"
          />
        </div>

        <button 
          className="filter-toggle-btn"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          {showAdvanced ? 'Hide' : 'Filters'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              <button
                className={`filter-option ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                All Events
              </button>
              <button
                className={`filter-option ${selectedCategory === 'concert' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('concert')}
              >
                🎵 Concert
              </button>
              <button
                className={`filter-option ${selectedCategory === 'conference' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('conference')}
              >
                💼 Conference
              </button>
              <button
                className={`filter-option ${selectedCategory === 'sports' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('sports')}
              >
                ⚽ Sports
              </button>
              <button
                className={`filter-option ${selectedCategory === 'comedy' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('comedy')}
              >
                😂 Comedy
              </button>
              <button
                className={`filter-option ${selectedCategory === 'theater' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('theater')}
              >
                🎭 Theater
              </button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Price Range: ₹{convertToINR(priceRange[0]).toLocaleString('en-IN')} - ₹{convertToINR(priceRange[1]).toLocaleString('en-IN')}
            </label>
            <div className="price-range-inputs">
              <div className="price-input">
                <label>Min:</label>
                <input
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                  className="price-input-field"
                />
              </div>
              <div className="price-input">
                <label>Max:</label>
                <input
                  type="number"
                  min={priceRange[0]}
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 500)}
                  className="price-input-field"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
              className="price-range-slider"
            />
          </div>

          {/* Date Filter */}
          <div className="filter-group">
            <label className="filter-label">Event Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="date-input"
            />
          </div>

          {/* Clear Filters */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
