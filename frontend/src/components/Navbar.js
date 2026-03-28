import React from 'react';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14z"/>
            <path d="M7 7h10v2H7zM7 11h10v2H7zM7 15h10v2H7z"/>
          </svg>
          <span>EventBook</span>
        </a>

        <ul className="navbar-menu">
          <li>
            <a 
              href="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/events" 
              className={`nav-link ${isActive('/events') ? 'active' : ''}`}
            >
              Browse Events
            </a>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <a 
                  href="/bookings" 
                  className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}
                >
                  My Bookings
                </a>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <a 
                    href="/admin" 
                    className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                  >
                    Admin Panel
                  </a>
                </li>
              )}
              <li className="nav-user-info">
                <button 
                  onClick={() => navigate('/profile')}
                  className="profile-btn"
                  title="Go to Profile"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="user-name">{user?.name || 'User'}</span>
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li>
                <a 
                  href="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </a>
              </li>
              <li>
                <a 
                  href="/register" 
                  className="register-btn"
                >
                  Sign Up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
