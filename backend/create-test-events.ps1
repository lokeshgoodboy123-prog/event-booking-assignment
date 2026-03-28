# Event Creation Script for Windows PowerShell
# This script creates test events with TODAY'S DATE for testing event reminders

# Configuration
$API_URL = "http://localhost:5000/api"
$ADMIN_EMAIL = "admin@example.com"   # Change to your admin email
$ADMIN_PASSWORD = "admin@123"        # Change to your admin password

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Event Creation Script (Windows)" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as admin
Write-Host "Step 1: Authenticating as admin..." -ForegroundColor Cyan

$loginBody = @{
    email    = $ADMIN_EMAIL
    password = $ADMIN_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody
    
    $ADMIN_TOKEN = $loginResponse.token
    
    if (-not $ADMIN_TOKEN) {
        Write-Host "❌ Login failed!" -ForegroundColor Red
        Write-Host "Make sure admin account exists with:" -ForegroundColor Red
        Write-Host "  Email: $ADMIN_EMAIL" -ForegroundColor Red
        Write-Host "  Password: $ADMIN_PASSWORD" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Authentication successful" -ForegroundColor Green
    Write-Host "Token: $($ADMIN_TOKEN.Substring(0, 20))..." -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Get today's date
$TODAY = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$TODAY_DATE = (Get-Date).ToString("yyyy-MM-dd")

Write-Host "Step 2: Creating test events for today ($TODAY_DATE)..." -ForegroundColor Cyan
Write-Host ""

# Define events
$events = @(
    @{
        title       = "Tech Conference 2026"
        description = "Annual technology conference featuring latest innovations in web development, AI, and cloud computing."
        category    = "conference"
        location    = "Convention Center, City Hall"
        startTime   = "9:00 AM"
        endTime     = "5:00 PM"
        price       = 199
        totalSeats  = 500
    },
    @{
        title       = "Live Music Concert"
        description = "Experience live performances by international artists. A night full of music and entertainment."
        category    = "concert"
        location    = "Grand Theater"
        startTime   = "7:00 PM"
        endTime     = "11:00 PM"
        price       = 75
        totalSeats  = 2000
    },
    @{
        title       = "Comedy Night Show"
        description = "Laugh out loud with top comedians performing hilarious stand-up comedy."
        category    = "comedy"
        location    = "Comedy Club Downtown"
        startTime   = "8:00 PM"
        endTime     = "10:00 PM"
        price       = 45
        totalSeats  = 200
    },
    @{
        title       = "Sports Championship Finals"
        description = "Watch the exciting final match of the season. High-energy sports action guaranteed!"
        category    = "sports"
        location    = "National Stadium"
        startTime   = "6:00 PM"
        endTime     = "9:00 PM"
        price       = 150
        totalSeats  = 50000
    },
    @{
        title       = "Theater Performance"
        description = "Classic theater performance with professional actors. A night of dramatic excellence."
        category    = "theater"
        location    = "Arts Theater"
        startTime   = "7:30 PM"
        endTime     = "10:30 PM"
        price       = 85
        totalSeats  = 300
    }
)

# Create each event
$count = 0
$headers = @{
    "Content-Type"  = "application/json"
    "Authorization" = "Bearer $ADMIN_TOKEN"
}

foreach ($event in $events) {
    Write-Host "Creating: $($event.title)" -ForegroundColor Cyan
    
    # Add date to event
    $event.date = $TODAY
    
    try {
        $eventBody = $event | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_URL/events" `
            -Method Post `
            -Headers $headers `
            -Body $eventBody
        
        $count++
        Write-Host "✓ Created successfully" -ForegroundColor Green
        Write-Host "  Event ID: $($response._id)"
        Write-Host "  Title: $($response.title)"
        Write-Host ""
    }
    catch {
        Write-Host "❌ Failed to create event" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "================================" -ForegroundColor Green
Write-Host "✓ Successfully created $count events!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Login to the app and make a booking on one of these events"
Write-Host "2. Run the event reminder scheduler:"
Write-Host "   curl -X POST http://localhost:5000/api/notifications/send-reminders"
Write-Host "3. Check your notifications panel in the app"
Write-Host "4. You should see event reminders for today's events"
Write-Host ""

Write-Host "To test reminders manually:" -ForegroundColor Cyan
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:5000/api/notifications/user' -Headers @{Authorization='Bearer YOUR_JWT_TOKEN'}"
