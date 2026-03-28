import axios from 'axios';

// Dynamically construct API URL based on current host
const API_BASE_URL = `http://${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  register: (name, email, password, confirmPassword) =>
    api.post('/auth/register', { name, email, password, confirmPassword }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/user')
};

// Event services
export const eventService = {
  getAllEvents: (category = '', search = '', page = 1, limit = 10) =>
    api.get('/events', { params: { category, search, page, limit } }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  checkAvailability: (eventId, numberOfTickets) =>
    api.post('/events/check-availability', { eventId, numberOfTickets })
};

// Booking services
export const bookingService = {
  createBooking: (eventId, numberOfTickets) =>
    api.post('/bookings', { eventId, numberOfTickets }),
  getUserBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`)
};

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  updateSettings: (settingsData) => api.put('/users/settings', settingsData),
  changePassword: (passwordData) => {
    // Handle both object and parameter passing
    const { oldPassword, newPassword, currentPassword } = passwordData;
    return api.post('/users/change-password', { 
      oldPassword: oldPassword || currentPassword, 
      newPassword 
    });
  },
  
  // OTP services
  requestOTPEmail: (email) => api.post('/users/request-otp/email', { email }),
  requestOTPPhone: (phone, countryCode) => api.post('/users/request-otp/phone', { phone, countryCode }),
  verifyOTPEmail: (email, otp) => api.post('/users/verify-otp/email', { email, otp }),
  verifyOTPPhone: (phone, countryCode, otp) => api.post('/users/verify-otp/phone', { phone, countryCode, otp })
};

// Payment services
export const paymentService = {
  createPaymentIntent: (bookingId, amount) =>
    api.post('/payments/create-intent', { bookingId, amount }),
  processPayment: (bookingId, paymentIntentId, paymentMethodId) =>
    api.post('/payments/process', { bookingId, paymentIntentId, paymentMethodId }),
  getPaymentHistory: () => api.get('/payments/history')
};

// Admin services
export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllBookings: () => api.get('/admin/bookings')
};

export default api;
