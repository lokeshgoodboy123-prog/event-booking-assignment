# Event Booking System - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally or connection string ready
- npm installed

### Step 1: Install Backend
```bash
cd backend
npm install
```

### Step 2: Configure Backend
Create `.env` in backend folder:
```
MONGO_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_secret_key_12345
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Start Backend
```bash
npm run dev
```
✅ Backend runs on http://localhost:5000

### Step 4: Install Frontend (New Terminal)
```bash
cd frontend
npm install
```

### Step 5: Start Frontend
```bash
npm start
```
✅ Frontend runs on http://localhost:3000

## 📸 Application Screenshots/Pages

### 1. Home Page
- Welcome banner with "Browse Events" CTA
- Features section highlighting key benefits
- Call-to-action sections
- Responsive navigation bar

### 2. Events Listing Page
- Grid layout of event cards
- Search functionality
- Category filters (Concert, Conference, Sports, Comedy, Theater)
- Event cards showing image, title, location, date, price, availability
- "View Details" button on each card

### 3. Event Details Page
- Full event information with image
- Event metadata (date, time, location, organizer)
- Description section
- Ticket selector (1-10 tickets)
- Price calculation
- "Book Now" button

### 4. Login Page
- Email input field
- Password input field
- Submit button
- Link to registration page
- Gradient background

### 5. Registration Page
- Full name input
- Email input
- Password input
- Confirm password input
- Form validation
- Link to login page

### 6. My Bookings Page
- List of user's bookings in card format
- Booking ID, event name, date, tickets, total price
- Payment status badge
- Booking status (confirmed/pending/cancelled)
- Cancel booking button

### 7. Admin Dashboard
- Statistics cards showing:
  - Total Events
  - Total Bookings
  - Total Revenue
- All Bookings table with columns:
  - Booking ID
  - User Name
  - Event Title
  - Tickets
  - Total Amount
  - Status
  - Payment Status

## 🎯 Key Features Implemented

✅ User Registration & Authentication
✅ Event Browsing with Filters
✅ Event Search & Pagination
✅ Secure Booking System
✅ Payment Integration (Stripe architecture)
✅ Admin Dashboard
✅ Responsive Design
✅ JWT Authentication
✅ Password Hashing
✅ Real-time Availability Checks

## 🔧 API Testing

### Test with cURL or Postman

**Register User:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Events:**
```bash
GET http://localhost:5000/api/events?category=concert&page=1&limit=10
```

**Create Booking:**
```bash
POST http://localhost:5000/api/bookings
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "eventId": "EVENT_ID",
  "numberOfTickets": 2
}
```

## 📝 Sample Test Data

### Create Sample Event (Admin)
```bash
POST http://localhost:5000/api/events
Authorization: Bearer ADMIN_TOKEN

{
  "title": "Summer Music Festival",
  "description": "Grand summer music festival with top artists",
  "category": "concert",
  "location": "Central Park, NYC",
  "date": "2024-06-15",
  "startTime": "18:00",
  "endTime": "23:00",
  "price": 49.99,
  "totalSeats": 500
}
```

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify .env variables
- Check port 5000 is available

**Frontend won't connect:**
- Check backend is running on 5000
- Verify CORS_ORIGIN in .env
- Clear browser cache and restart

**Stripe errors:**
- Use test keys from Stripe dashboard
- Use test card: 4242 4242 4242 4242

## 📚 Useful Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Best Practices

1. ✅ Passwords hashed with bcryptjs
2. ✅ JWT for authentication
3. ✅ CORS configured
4. ✅ Environment variables for secrets
5. ✅ Input validation
6. ✅ Error handling

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Ready to start?** Run the quick start commands above and you'll be up and running in minutes!
