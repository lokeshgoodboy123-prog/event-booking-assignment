# Event Booking System - Installation & Integration Guide

## 🎯 Complete Setup Instructions

### Prerequisites Checklist
- [ ] Node.js v16+ installed
- [ ] npm v8+ installed  
- [ ] MongoDB installed or Atlas account
- [ ] Stripe account with API keys
- [ ] Git for version control
- [ ] Code editor (VS Code recommended)

---

## ⚡ Express Installation (5 Steps)

### Step 1: Backend Setup
```bash
cd event-booking-system/backend
npm install
```

**Installs:**
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- stripe (payment processing)
- cors (cross-origin requests)
- dotenv (environment variables)
- express-validator (input validation)
- nodemailer (email notifications)

### Step 2: Create Environment File
```bash
# Copy template
cp .env.example .env

# Edit .env with your values
```

**Required Variables:**
```
MONGO_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_random_secret_string_min_32_chars
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXX
STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXX
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Step 3: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Windows
mongod.exe

# Mac/Linux
mongod

# Port: mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 cluster
4. Get connection string
5. Update MONGO_URI in .env

### Step 4: Start Backend Server
```bash
npm run dev
```

**Output should show:**
```
MongoDB connected
Server is running on port 5000
```

**Test Backend:**
```bash
curl http://localhost:5000/api/health
# Response: {"status":"Server is running"}
```

---

## ⚛️ React Installation (4 Steps)

### Step 1: Frontend Setup
```bash
cd event-booking-system/frontend
npm install
```

**Installs:**
- react (UI framework)
- react-dom (DOM rendering)
- react-router-dom (routing)
- axios (HTTP client)
- stripe integration packages
- react-calendar (calendar component)

### Step 2: Create Environment File
```bash
# Copy template
cp .env.example .env

# Edit .env
```

**Required Variables:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Start Development Server
```bash
npm start
```

**Automatically opens:**
```
http://localhost:3000
```

### Step 4: Test Frontend
- Homepage loads ✓
- Navigation works ✓
- No console errors ✓

---

## 🔌 API Integration Points

### 1. Authentication Flow
```javascript
// Frontend
Login → GET token → Store in localStorage
Auth header: Authorization: Bearer {token}

// Backend
Verify JWT → Extract user ID → Authorize request
```

### 2. Event Fetching
```
GET /api/events?category=concert&search=summer
↓
Backend queries MongoDB
↓
Returns paginated event list
↓
Frontend displays in grid
```

### 3. Booking Creation
```
User clicks "Book Now"
  ↓
Select ticket quantity
  ↓
Check availability
  ↓
Create booking (status: pending)
  ↓
Reserve seats
  ↓
Redirect to payment
```

### 4. Payment Integration
```
Create Stripe PaymentIntent
  ↓
Client receives client_secret
  ↓
User completes payment
  ↓
Webhook confirms success
  ↓
Update booking status
  ↓
Send confirmation
```

---

## 🧪 Testing the System

### Test Account Credentials

**User Account**
```
Email: user@example.com
Password: Password123!
```

**Admin Account**
```
Email: admin@example.com
Password: Admin123!
```

### Test Event Creation (Admin)
```bash
# Using Postman or cURL

POST http://localhost:5000/api/events
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Summer Jazz Festival",
  "description": "Live jazz performances all summer long",
  "category": "concert",
  "location": "Riverside Park, NYC",
  "date": "2024-07-15",
  "startTime": "19:00",
  "endTime": "23:00",
  "price": 65.00,
  "totalSeats": 500
}
```

### Test Booking Flow
1. Register → Get JWT token
2. Browse events → GET /api/events
3. View event → GET /api/events/{id}
4. Check availability → POST /api/events/check-availability
5. Create booking → POST /api/bookings
6. View bookings → GET /api/bookings

### Stripe Test Cards
```
✓ Success: 4242 4242 4242 4242
✗ Decline: 4000 0000 0000 0002
☆ 3D Secure: 4000 0025 0000 3155
```

Use any future expiry and any 3-digit CVC.

---

## 📊 Database Seeding (Optional)

### Create Sample Events
```bash
# Connect to MongoDB
mongosh

# Use database
use event-booking

# Insert sample events
db.events.insertMany([
  {
    title: "Tech Conference 2024",
    description: "Annual technology conference",
    category: "conference",
    location: "San Francisco, CA",
    date: new Date("2024-06-15"),
    startTime: "09:00",
    endTime: "17:00",
    price: 99.00,
    totalSeats: 1000,
    availableSeats: 1000
  },
  {
    title: "Summer Music Festival",
    description: "Three-day music festival",
    category: "concert",
    location: "Central Park, NYC",
    date: new Date("2024-07-20"),
    startTime: "18:00",
    endTime: "23:00",
    price: 49.99,
    totalSeats: 500,
    availableSeats: 500
  }
])
```

---

## 🔍 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Check MongoDB is running (mongod)
2. Verify MONGO_URI in .env
3. Use MongoDB Atlas if local fails
```

**JWT Secret Error**
```
Error: jwt malformed

Solution:
1. Ensure JWT_SECRET in .env is set
2. Make 32+ character random string
3. Restart backend server
```

**CORS Error**
```
Error: Access to XMLHttpRequest has been blocked

Solution:
1. Check CORS_ORIGIN = http://localhost:3000
2. Frontend running on port 3000
3. Backend running on port 5000
4. Restart both servers
```

### Frontend Issues

**API Connection Failed**
```
Error: Cannot reach backend

Solution:
1. Check backend is running on 5000
2. Verify REACT_APP_API_URL in .env
3. Check firewall settings
4. Clear browser cache
```

**Token Not Persisting**
```
User logs out on refresh

Solution:
1. Check localStorage is enabled
2. Verify token saved in browser dev tools
3. Check AuthContext implementation
4. Enable browser cookies
```

---

## 🚀 Starting Fresh

### Full Restart Procedure

```bash
# Terminal 1: Backend
cd backend
rm -rf node_modules
npm install
npm run dev

# Terminal 2: Frontend (Wait 30 seconds)
cd frontend
rm -rf node_modules
npm install
npm start

# Terminal 3: MongoDB (if local)
mongod
```

---

## ✅ Verification Checklist

### Backend Ready?
- [ ] MongoDB connected
- [ ] Server running on port 5000
- [ ] /api/health endpoint responds
- [ ] All dependencies installed
- [ ] .env file configured

### Frontend Ready?
- [ ] React starts on port 3000
- [ ] Homepage displays
- [ ] Navigation works
- [ ] No console errors
- [ ] localStorage enabled

### Integration Ready?
- [ ] Backend ↔ Frontend connection works
- [ ] Can fetch events from API
- [ ] Authentication flow works
- [ ] Booking creation possible
- [ ] Admin panel accessible

---

## 📝 Common Commands

```bash
# Backend
npm run dev         # Start with nodemon
npm start          # Start production
npm test           # Run tests (setup needed)

# Frontend
npm start          # Start development server
npm build          # Create production build
npm test           # Run tests

# MongoDB
mongod             # Start MongoDB
mongosh            # Connect to MongoDB
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] .env files not committed to git
- [ ] CORS_ORIGIN is specific (not *)
- [ ] Passwords hashed with bcryptjs
- [ ] HTTPS in production
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Sensitive data not logged

---

## 📞 Getting Help

### Check Logs
```bash
# Backend errors in terminal
# Frontend errors in browser console (F12)
# MongoDB errors in MongoDB terminal
```

### Common Issues Portal
- MongoDB not starting → Check port 27017
- CORS errors → Check origin URLs
- Auth fails → Verify JWT_SECRET
- API not connecting → Verify API_URL

### Debug Commands
```bash
# Check if ports are in use
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Clear npm cache
npm cache clean --force

# React DevTools: Install browser extension
# Check Redux DevTools for state
```

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB University](https://university.mongodb.com)
- [React Official Docs](https://react.dev)
- [Stripe Integration Guide](https://stripe.com/docs)
- [JWT.io](https://jwt.io)

---

**Ready to Launch! Follow the steps above and you'll have a fully functional Event Booking System running locally.**

**Total Setup Time**: ~15 minutes
**Node Modules Download**: ~5-10 minutes
**Database Setup**: ~2 minutes

