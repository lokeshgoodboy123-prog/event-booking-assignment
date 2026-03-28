# Event Booking System - API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-api-domain.com`

## Authentication

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

## Response Format

Success Response:
```json
{
  "message": "Success message",
  "data": {}
}
```

Error Response:
```json
{
  "message": "Error message"
}
```

---

## API Endpoints

### 1. Authentication (/api/auth)

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response: {token, user}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {token, user}
```

#### Get Current User [Protected]
```
GET /api/auth/user
Authorization: Bearer TOKEN

Response: {user object}
```

---

### 2. Events (/api/events)

#### Get All Events
```
GET /api/events?category=concert&search=summer&page=1&limit=10

Query Parameters:
- category: concert | conference | sports | comedy | theater
- search: keyword
- page: page number (default: 1)
- limit: results per page (default: 10)

Response: {events: [], total: number, pages: number, currentPage: number}
```

#### Get Event by ID
```
GET /api/events/:id

Response: {event object}
```

#### Create Event [Protected - Admin]
```
POST /api/events
Authorization: Bearer ADMIN_TOKEN

{
  "title": "Summer Festival",
  "description": "A grand summer music festival",
  "category": "concert",
  "location": "Central Park, NYC",
  "date": "2024-06-15",
  "startTime": "18:00",
  "endTime": "23:00",
  "price": 49.99,
  "totalSeats": 500
}

Response: {event object}
```

#### Update Event [Protected - Admin]
```
PUT /api/events/:id
Authorization: Bearer ADMIN_TOKEN

{
  "title": "Updated Title",
  "price": 59.99
}

Response: {event object}
```

#### Delete Event [Protected - Admin]
```
DELETE /api/events/:id
Authorization: Bearer ADMIN_TOKEN

Response: {message: "Event deleted successfully"}
```

#### Check Availability
```
POST /api/events/check-availability

{
  "eventId": "event_id",
  "numberOfTickets": 2
}

Response: {
  "eventId": "...",
  "availableSeats": number,
  "requestedTickets": 2,
  "isAvailable": true/false
}
```

---

### 3. Bookings (/api/bookings)

#### Create Booking [Protected]
```
POST /api/bookings
Authorization: Bearer TOKEN

{
  "eventId": "event_id",
  "numberOfTickets": 2
}

Response: {
  "message": "Booking created successfully",
  "booking": {
    "bookingId": "BK-XXXXXXXX",
    "event": {...},
    "user": {...},
    "numberOfTickets": 2,
    "totalPrice": 99.98,
    "status": "pending",
    "paymentStatus": "pending"
  }
}
```

#### Get User Bookings [Protected]
```
GET /api/bookings
Authorization: Bearer TOKEN

Response: [booking objects]
```

#### Get Booking by ID [Protected]
```
GET /api/bookings/:id
Authorization: Bearer TOKEN

Response: {booking object}
```

#### Cancel Booking [Protected]
```
PUT /api/bookings/:id/cancel
Authorization: Bearer TOKEN

Response: {
  "message": "Booking cancelled successfully",
  "booking": {...}
}
```

---

### 4. Payments (/api/payments)

#### Create Payment Intent [Protected]
```
POST /api/payments/create-intent
Authorization: Bearer TOKEN

{
  "bookingId": "booking_id",
  "amount": 99.98
}

Response: {
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### Process Payment [Protected]
```
POST /api/payments/process
Authorization: Bearer TOKEN

{
  "bookingId": "booking_id",
  "paymentIntentId": "pi_xxx",
  "paymentMethodId": "pm_xxx"
}

Response: {
  "message": "Payment processed successfully",
  "payment": {...},
  "booking": {...}
}
```

#### Get Payment History [Protected]
```
GET /api/payments/history
Authorization: Bearer TOKEN

Response: [payment objects]
```

---

### 5. Admin (/api/admin)

#### Get Dashboard Stats [Protected - Admin]
```
GET /api/admin/dashboard/stats
Authorization: Bearer ADMIN_TOKEN

Response: {
  "totalUsers": number,
  "totalEvents": number,
  "totalBookings": number,
  "confirmedBookings": number,
  "totalRevenue": number,
  "monthlyBookings": []
}
```

#### Get All Bookings [Protected - Admin]
```
GET /api/admin/bookings
Authorization: Bearer ADMIN_TOKEN

Response: [booking objects]
```

#### Get All Users [Protected - Admin]
```
GET /api/admin/users
Authorization: Bearer ADMIN_TOKEN

Response: [user objects without passwords]
```

#### Update User Role [Protected - Admin]
```
PUT /api/admin/users/:userId/role
Authorization: Bearer ADMIN_TOKEN

{
  "role": "admin" | "user"
}

Response: {
  "message": "User role updated",
  "user": {...}
}
```

#### Delete User [Protected - Admin]
```
DELETE /api/admin/users/:userId
Authorization: Bearer ADMIN_TOKEN

Response: {
  "message": "User deleted successfully"
}
```

---

## Status Codes

- `200`: OK - Request successful
- `201`: Created - Resource created successfully
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - No/invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Server Error - Internal server error

---

## Error Messages

```
"Invalid email or password"
"User already registered"
"Not enough available seats"
"Not authorized to perform this action"
"Event not found"
"Token expired"
```

---

## Rate Limiting

Recommended rate limits per endpoint:
- Auth endpoints: 5 requests per minute
- Public endpoints: 100 requests per minute
- Protected endpoints: 50 requests per minute

---

## Version History

- **v1.0.0** (March 2026)
  - Initial API release
  - Authentication system
  - Event management
  - Booking system
  - Admin dashboard

