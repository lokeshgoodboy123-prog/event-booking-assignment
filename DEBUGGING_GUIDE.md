# Profile Update Troubleshooting Guide

## Problem: Profile data not saving

When users try to save profile changes, the data appears to update successfully in the UI but doesn't persist after page reload.

---

## Debugging Steps

### Step 1: Check Browser Console  
1. Open browser Dev Tools (F12)
2. Go to **Console** tab
3. Try to save the profile form
4. Look for these log messages with 🔴 error indicators:

```
❌ Profile update error:
❌ Error response:
❌ Error message:
❌ Error details: {...}
```

### Step 2: Check Network Tab
1. Open Dev Tools → **Network** tab
2. Clear the network log
3. Click "Save Changes" button
4. Look for a PUT request to `/api/users/profile`
5. Click on that request and check:
   - **Request Headers**: Should include `Authorization: Bearer <token>`
   - **Request Body**: Should contain all profile data
   - **Response Status**: Should be 200 (not 400, 401, 500)
   - **Response Body**: Should show the updated user data

### Step 3: Check Backend Console
1. Look at the terminal where backend is running
2. You should see logs like:
```
📝 Profile update received for user: <user-id>
📝 Data received: {...}
📝 Data being saved to DB: {...}
✅ Profile updated successfully
✅ Saved data: {...}
```

If you see ❌ errors, note the exact message.

### Step 4: Verify Database
1. Check MongoDB to see if data is being saved
2. Connect to MongoDB and query the user:
```javascript
db.users.findOne({ _id: ObjectId("<user-id>") })
```
3. Check if the profile fields are there

---

## Common Issues and Solutions

### Issue 1: "Network Error" or No Response
**Symptoms**: 
- No PUT request appears in Network tab
- User sees error "Failed to update profile"

**Solutions**:
1. Make sure backend is running: `npm start` in backend folder
2. Check that frontend is configured to use correct API URL in `src/services/api.js`:
   ```javascript
   const API_BASE_URL = `http://${window.location.hostname}:5000/api`;
   ```
3. Check CORS settings in backend

### Issue 2: 401 Unauthorized Error
**Symptoms**:
- Network shows 401 status
- Error message: "Unauthorized"

**Solutions**:
1. Make sure you're logged in
2. Check that token is stored in localStorage:
   - Dev Tools → Application → LocalStorage → look for "token"
3. Try logging out and logging back in
4. Check token hasn't expired

### Issue 3: 500 Internal Server Error
**Symptoms**:
- Network shows 500 status
- Backend console shows ❌ errors

**Solutions**:
1. Check MongoDB is running and connected
2. Check User schema has all fields defined
3. Check for validation errors in backend logs
4. Clear browser cache and try again

### Issue 4: Data Saved but Not Showing on Page Reload
**Symptoms**:
- Success message appears
- Network shows 200 status
- Page reload shows old data

**Solutions**:
1. Check that `loadUserData()` is being called after save
2. Make sure the response from API is being processed correctly
3. Check GETprofile endpoint is working and returning new data
4. Try manual page refresh with Ctrl+F5

### Issue 5: Only Some Fields Saving
**Symptoms**:
- Name, email, phone save fine
- Address fields don't save
- Contact info doesn't save

**Solutions**:
1. Check User schema in `models/User.js` has the fields defined
2. Verify address objects have the correct structure
3. Check that nested objects are being sent correctly in request
4. Look at backend logs to see what data was received

---

## Testing the API Manually

### Using Browser Fetch
In browser console (F12):

```javascript
// Get current profile
fetch('http://localhost:5000/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log('Profile:', data))

// Update profile
fetch('http://localhost:5000/api/users/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Name',
    bio: 'New bio'
  })
})
.then(r => r.json())
.then(data => console.log('Updated:', data))
```

### Using Test Script
Run: `node test-profile-api.js`

This will show if the API endpoint is working correctly.

---

## Enable Detailed Logging

### Frontend
The code already has detailed logging. Look for:
- 📤 "Sending profile data"
- 📥 "Full Response"
- ✅ "Profile update successful"
- ❌ "Profile update error"

### Backend
Check `routes/users.js` for logs with emoji indicators:
- 📝 "Profile update received"
- 📝 "Data being saved to DB"
- ✅ "Profile updated successfully"
- ❌ "Profile update error"

---

## Common Code Issues Already Fixed

✅ Fixed 1: API service now properly handles password change  
✅ Fixed 2: Backend now logs detailed error information  
✅ Fixed 3: Frontend validation added before save  
✅ Fixed 4: Better error messages shown to user  

---

## Next Steps

1. **Open browser Dev Tools (F12)**
2. **Make a test change to your profile** (like changing your bio)
3. **Click "Save Changes"**
4. **Look at Console tab for error messages**
5. **Look at Network tab for API response**
6. **Provide the error message or API response** so we can diagnose further

---

## Quick Checklist

- [ ] Backend is running (npm start)
- [ ] You're logged in
- [ ] API can be accessed (http://localhost:5000/api)
- [ ] Browser console shows no errors
- [ ] Network tab shows PUT request with 200 status
- [ ] Backend logs show ✅ success messages
- [ ] MongoDB data has been updated
