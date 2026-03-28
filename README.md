# Event Booking System - MERN Stack

A full-featured event booking application built with MongoDB, Express.js, React, and Node.js (MERN). Users can browse events, make bookings, process secure payments, and manage their bookings. Admins can manage events and view analytics.

## 🎯 Features

### User Features
- **Event Browsing**: Browse and search events by category or keywords
- **Calendar Integration**: View events on an interactive calendar
- **Event Details**: Detailed information about each event
- **Secure Booking**: Simple booking process with availability checks
- **Stripe Payment Integration**: Secure payment processing
- **Booking Management**: View, manage, and cancel bookings
- **Notifications**: Event reminders and booking confirmations
- **Authentication**: Secure user registration and login
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Admin Features
- **Dashboard**: Overview of total events, bookings, and revenue
- **Event Management**: Create, update, and delete events
- **Booking Analytics**: View all bookings and payment status
- **User Management**: Manage user roles and permissions
- **Availability Management**: Control ticket inventory

## 🛠️ Tech Stack

### Backend
- **Node.js** (v16+)
- **Express.js** (v4.18+)
- **MongoDB** (v4.4+)
- **Stripe API** (Payment processing)
- **JWT** (Authentication)
- **Bcrypt** (Password hashing)

### Frontend
- **React** (v18.2+)
- **React Router** (v6+)
- **Axios** (API client)
- **CSS3** (Styling)
- **Stripe React** (Payment UI)

## 📋 Prerequisites

Before running the project, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Stripe account (https://stripe.com)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd event-booking-system
```

### 2. Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Setup environment variables
Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLIC_KEY=your_stripe_public_key_here
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

#### Step 4: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your connection string
```

#### Step 5: Start the backend server
```bash
npm run dev
```

The backend server should run on `http://localhost:5000`

### 3. Frontend Setup

#### Step 1: Navigate to frontend directory
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Start the frontend development server
```bash
npm start
```

The application should open automatically at `http://localhost:3000`

## 📱 Application Structure

### Backend Structure
```
backend/
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Booking.js
│   ├── Payment.js
│   └── Notification.js
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   ├── bookingController.js
│   └── paymentController.js
├── routes/
│   ├── auth.js
│   ├── events.js
│   ├── bookings.js
│   ├── payments.js
│   └── admin.js
├── middleware/
│   └── auth.js
├── server.js
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── EventCard.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── EventsList.js
│   │   ├── EventDetails.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── MyBookings.js
│   │   └── AdminPanel.js
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── Navbar.css
│   │   ├── EventCard.css
│   │   ├── Auth.css
│   │   ├── Events.css
│   │   ├── EventDetails.css
│   │   ├── Bookings.css
│   │   ├── Admin.css
│   │   └── Home.css
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
└── package.json
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users register with email and password
2. Password is hashed using bcryptjs before storing
3. Upon successful login, a JWT token is issued
4. Token is stored in localStorage
5. Token is sent with each API request in Authorization header
6. Backend validates token before processing requests

## 💳 Payment Integration

Stripe is integrated for secure payment processing:

1. User selects event and number of tickets
2. Booking is created in pending state
3. User proceeds to payment
4. Stripe PaymentIntent is created
5. User completes payment through Stripe
6. Payment webhook confirms transaction
7. Booking status is updated to confirmed

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user (protected)

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)
- `POST /api/events/check-availability` - Check seat availability

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

### Payments
- `POST /api/payments/create-intent` - Create payment intent (protected)
- `POST /api/payments/process` - Process payment (protected)
- `GET /api/payments/history` - Get payment history (protected)

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics (admin)
- `GET /api/admin/bookings` - Get all bookings (admin)

## 🎨 Pages & Functionality

### Home Page
- Welcome section with call-to-action
- Features overview
- Navigation to events

### Events Listing
- All events displayed in grid format
- Search by title/description
- Filter by category
- Pagination support
- Event cards with preview

### Event Details
- Full event information
- Location and timing
- Organizer details
- Ticket selection
- Availability status
- Book Now button

### Authentication Pages
- **Register**: Create new account with validation
- **Login**: Secure login with email and password

### My Bookings
- List all user bookings
- Booking status display
- Payment status
- Cancel booking option
- Booking ID and details

### Admin Dashboard
- Dashboard statistics
- Total events, bookings, revenue
- All bookings table
- Booking management

## 🧪 Testing the Application

### Test User Credentials
```
Email: test@example.com
Password: password123
```

### Test Admin Credentials
```
Email: admin@example.com
Password: admin123
```

### Stripe Test Cards
```
Success: 4242 4242 4242 4242
Failure: 4000 0000 0000 0002
CVC: Any 3 digits
Expiry: Any future date
```

## 🐛 Debugging

### Backend Debugging
- Check MongoDB connection
- Verify .env variables
- Check API logs in terminal
- Use Postman to test endpoints

### Frontend Debugging
- Check browser console for errors
- Verify API endpoint URLs
- Check localStorage for token
- Verify CORS settings on backend

## 📚 Important Notes

### Security
- Never commit .env files
- Use strong JWT secret
- Implement rate limiting in production
- Use HTTPS in production
- Validate all inputs on backend

### Performance
- Implement pagination for events
- Add caching for frequently accessed data
- Optimize database queries
- Use lazy loading for components

### Scalability
- Use MongoDB Atlas for cloud database
- Deploy backend on Heroku/AWS
- Deploy frontend on Vercel/Netlify
- Use CDN for static assets

## 🚀 Deployment

### Heroku Deployment (Backend)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Vercel Deployment (Frontend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with one click

## 📄 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description
4. Contact the development team

## 🎉 Acknowledgments

- Event Booking concepts inspired by Eventbrite and Ticketmaster
- Built with MERN stack best practices
- Stripe for secure payment processing
- MongoDB for flexible data storage

---

**Version**: 1.0.0
**Last Updated**: March 2026
