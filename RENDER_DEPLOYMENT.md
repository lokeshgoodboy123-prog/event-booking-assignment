# Deploy to Render - Complete Guide

## Overview
This guide walks you through deploying the Event Booking System to [Render](https://render.com) with a MongoDB database.

## Prerequisites
- Render.com account (free tier available)
- Git repository pushed to GitHub (required for Render)
- Stripe API keys
- Email service credentials (optional)

---

## Step 1: Push Code to GitHub

```bash
cd event-booking-system
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Sign up** and choose GitHub
3. Authorize Render to access your GitHub repositories

---

## Step 3: Create a MongoDB Database

1. In Render dashboard, click **New +** → **PostgreSQL** (or use MongoDB Atlas instead)
2. Configure:
   - **Name**: `event-booking-db`
   - **Database**: `event_booking`
   - **Region**: Oregon (or your closest region)
   - **Plan**: Free
3. Click **Create Database**
4. Copy the connection string (you'll need this)

**Alternative: Use MongoDB Atlas**
- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string and replace in environment variables

---

## Step 4: Create Backend Service

1. Click **New +** → **Web Service**
2. Connect GitHub repository (select `event-booking-system`)
3. Configure:
   - **Name**: `event-booking-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon`
   - **Plan**: `Free`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. **Add Environment Variables** (click Add):

```
PORT=5000
NODE_ENV=production
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<Generate a random string: openssl rand -base64 32>
STRIPE_SECRET_KEY=<Your Stripe Secret Key>
STRIPE_PUBLIC_KEY=<Your Stripe Public Key>
CORS_ORIGIN=https://event-booking-frontend.onrender.com
EMAIL_USER=<Your email>
EMAIL_PASSWORD=<Your email password or app password>
```

5. Click **Create Web Service**
6. Wait for deployment (5-10 minutes)
7. Once deployed, copy the backend URL (e.g., `https://event-booking-backend.onrender.com`)

---

## Step 5: Create Frontend Service

1. Click **New +** → **Web Service** again
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `event-booking-frontend`
   - **Environment**: `Node`
   - **Region**: `Oregon`
   - **Plan**: `Free`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
4. **Add Environment Variables**:

```
REACT_APP_API_URL=https://event-booking-backend.onrender.com
```

5. Click **Create Web Service**
6. Wait for deployment (10-15 minutes)
7. Once deployed, your frontend URL will be displayed

---

## Step 6: Update Backend CORS Configuration

After frontend installation completes:

1. Go to backend service settings
2. Update `CORS_ORIGIN` with your actual frontend URL:
   ```
   https://your-frontend-name.onrender.com
   ```
3. Click **Save**
4. The backend will automatically redeploy

---

## Step 7: Test the Deployment

1. Open your frontend URL in browser
2. Register a new account
3. Test login
4. Browse events
5. Create a booking
6. Test payment with Stripe test keys

---

## Step 8: Database Seeding (Optional)

To seed sample events into production database:

1. In Render backend service → **Shell** tab
2. Run:
   ```bash
   cd backend
   node seedEvents.js
   ```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `MONGO_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing key | Auto-generate: `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret key | From Stripe dashboard |
| `STRIPE_PUBLIC_KEY` | Stripe public key | From Stripe dashboard |
| `CORS_ORIGIN` | Frontend URL | `https://event-booking-frontend.onrender.com` |
| `EMAIL_USER` | Email address | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email password | Gmail app password |
| `REACT_APP_API_URL` | Backend API URL | `https://event-booking-backend.onrender.com` |

---

## Troubleshooting

### Backend deployment fails
- Check logs: Click service → **Logs** tab
- Verify all dependencies are installed: `npm install`
- Check that `server.js` exists in backend folder

### Frontend cannot connect to backend
- Verify `REACT_APP_API_URL` is set correctly
- Check backend `CORS_ORIGIN` matches frontend URL
- Restart frontend service after updating variables

### Database connection error
- Verify `MONGO_URI` is correct
- Ensure MongoDB allows connections from Render IPs
- If using MongoDB Atlas, add `0.0.0.0/0` to IP whitelist

### Port already in use
- Render automatically manages ports
- Ensure `PORT` environment variable is set to `5000`

---

## Performance Tips

- **Free tier** apps go to sleep after 15 minutes of inactivity
- Upgrade to paid plan for always-on services
- Use **MongoDB Atlas** (free tier) for more reliable database

---

## Next Steps

1. **Custom Domain**: Update Render service settings to add custom domain
2. **SSL Certificate**: Automatically added by Render (HTTPS enabled)
3. **Monitoring**: Set up email alerts in Render dashboard
4. **Backups**: Enable automated MongoDB backups

---

## Support

For issues:
- Check Render documentation: https://render.com/docs
- View service logs in Render dashboard
- Contact Render support: support@render.com

