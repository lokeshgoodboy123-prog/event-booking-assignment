#!/bin/bash

# Event Creation Script
# This script creates test events with TODAY'S DATE for testing event reminders

# Configuration
API_URL="http://localhost:5000/api"
ADMIN_EMAIL="admin@example.com"  # Change this to your admin email
ADMIN_PASSWORD="admin@123"        # Change this to your admin password

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Event Creation Script${NC}"
echo -e "${BLUE}================================${NC}\n"

# Step 1: Login as admin to get token
echo -e "${BLUE}Step 1: Authenticating as admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}❌ Login failed!${NC}"
  echo "Response: $LOGIN_RESPONSE"
  echo -e "${RED}Make sure admin account exists with:${NC}"
  echo "  Email: $ADMIN_EMAIL"
  echo "  Password: $ADMIN_PASSWORD"
  exit 1
fi

echo -e "${GREEN}✓ Authentication successful${NC}"
echo "Token: ${ADMIN_TOKEN:0:20}...\n"

# Get today's date in ISO format
TODAY=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TODAY_DATE=$(date -u +"%Y-%m-%d")

echo -e "${BLUE}Step 2: Creating test events for today ($TODAY_DATE)...${NC}\n"

# Define events to create
EVENTS=(
  '{
    "title": "Tech Conference 2026",
    "description": "Annual technology conference featuring latest innovations in web development, AI, and cloud computing.",
    "category": "conference",
    "location": "Convention Center, City Hall",
    "date": "'$TODAY'",
    "startTime": "9:00 AM",
    "endTime": "5:00 PM",
    "price": 199,
    "totalSeats": 500,
    "image": null
  }'
  '{
    "title": "Live Music Concert",
    "description": "Experience live performances by international artists. A night full of music and entertainment.",
    "category": "concert",
    "location": "Grand Theater",
    "date": "'$TODAY'",
    "startTime": "7:00 PM",
    "endTime": "11:00 PM",
    "price": 75,
    "totalSeats": 2000,
    "image": null
  }'
  '{
    "title": "Comedy Night Show",
    "description": "Laugh out loud with top comedians performing hilarious stand-up comedy.",
    "category": "comedy",
    "location": "Comedy Club Downtown",
    "date": "'$TODAY'",
    "startTime": "8:00 PM",
    "endTime": "10:00 PM",
    "price": 45,
    "totalSeats": 200,
    "image": null
  }'
  '{
    "title": "Sports Championship Finals",
    "description": "Watch the exciting final match of the season. High-energy sports action guaranteed!",
    "category": "sports",
    "location": "National Stadium",
    "date": "'$TODAY'",
    "startTime": "6:00 PM",
    "endTime": "9:00 PM",
    "price": 150,
    "totalSeats": 50000,
    "image": null
  }'
  '{
    "title": "Theater Performance",
    "description": "Classic theater performance with professional actors. A night of dramatic excellence.",
    "category": "theater",
    "location": "Arts Theater",
    "date": "'$TODAY'",
    "startTime": "7:30 PM",
    "endTime": "10:30 PM",
    "price": 85,
    "totalSeats": 300,
    "image": null
  }'
)

# Create each event
COUNT=0
for EVENT_JSON in "${EVENTS[@]}"; do
  EVENT_TITLE=$(echo $EVENT_JSON | grep -o '"title":"[^"]*' | cut -d'"' -f4)
  
  echo -e "${BLUE}Creating: $EVENT_TITLE${NC}"
  
  RESPONSE=$(curl -s -X POST "$API_URL/events" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d "$EVENT_JSON")
  
  EVENT_ID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
  
  if [ ! -z "$EVENT_ID" ]; then
    COUNT=$((COUNT + 1))
    echo -e "${GREEN}✓ Created successfully${NC}"
    echo "  Event ID: $EVENT_ID"
    echo "  Title: $EVENT_TITLE"
    echo ""
  else
    echo -e "${RED}❌ Failed to create event${NC}"
    echo "Response: $RESPONSE\n"
  fi
done

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Successfully created $COUNT events!${NC}"
echo -e "${GREEN}================================${NC}\n"

echo -e "${BLUE}Next Steps:${NC}"
echo "1. Login to the app and make a booking on one of these events"
echo "2. Run the event reminder scheduler:"
echo "   ${BLUE}curl -X POST http://localhost:5000/api/notifications/send-reminders${NC}"
echo "3. Check your notifications panel in the app"
echo "4. You should see event reminders for today's events"
echo ""
echo -e "${BLUE}To test reminders manually:${NC}"
echo "   ${BLUE}curl http://localhost:5000/api/notifications/user \\${NC}"
echo "     ${BLUE}-H \"Authorization: Bearer YOUR_JWT_TOKEN\"${NC}"
