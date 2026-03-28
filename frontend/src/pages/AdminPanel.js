import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [isAuthenticated, user, navigate]);

  const fetchAdminData = async () => {
    try {
      const statsResponse = await adminService.getDashboardStats();
      const bookingsResponse = await adminService.getAllBookings();
      setStats(statsResponse.data);
      setBookings(bookingsResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading admin panel...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-number">{stats?.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats?.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats?.totalRevenue}</p>
        </div>
      </div>

      <div className="bookings-section">
        <h2>All Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Tickets</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.user?.name}</td>
                    <td>{booking.event?.title}</td>
                    <td>{booking.numberOfTickets}</td>
                    <td>${booking.totalPrice}</td>
                    <td className={`status ${booking.status}`}>{booking.status}</td>
                    <td className={`payment ${booking.paymentStatus}`}>{booking.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
