const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { sendOTP, verifyOTP } = require('../utils/otp');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('📝 Profile update received for user:', req.user.userId);
    console.log('📝 Data received:', JSON.stringify(req.body, null, 2));
    
    const userId = req.user.userId;

    // Get current user to preserve existing nested fields
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Build update object - merge all provided fields
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };
    
    // Remove password field and profileImage if not provided
    delete updateData.password;
    if (updateData.profileImage === null) {
      delete updateData.profileImage;
    }
    if (updateData.avatar) {
      delete updateData.avatar; // Avatar is not a DB field, use profileImage instead
    }

    console.log('📝 Data being saved to DB:', JSON.stringify(updateData, null, 2));

    // Update using direct assignment (not $set) to properly handle nested objects
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: false }
    ).select('-password');

    if (!user) {
      console.log('❌ Failed to update user:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Profile updated successfully');
    console.log('✅ Saved data:', JSON.stringify(user.toObject(), null, 2));

    res.json({ 
      message: 'Profile updated successfully', 
      user: user.toObject()
    });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    console.error('❌ Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: err.message 
    });
  }
});

// Update user settings (notifications)
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const {
      emailNotifications,
      smsNotifications,
      bookingReminders,
      eventUpdates,
      newsletter
    } = req.body;

    // Build update object with only provided fields
    const updateData = { updatedAt: Date.now() };
    if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) updateData.smsNotifications = smsNotifications;
    if (bookingReminders !== undefined) updateData.bookingReminders = bookingReminders;
    if (eventUpdates !== undefined) updateData.eventUpdates = eventUpdates;
    if (newsletter !== undefined) updateData.newsletter = newsletter;

    // Update user settings
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Settings updated successfully', 
      user 
    });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ 
      message: 'Failed to update settings', 
      error: err.message 
    });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }

    // Get user with password field
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to change password', 
      error: err.message 
    });
  }
});

// Request OTP for email verification
router.post('/request-otp/email', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email already exists (for another user)
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const result = sendOTP('email', email);
    res.json({ 
      message: 'OTP sent to email',
      identifier: email 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// Request OTP for phone verification
router.post('/request-otp/phone', authenticateToken, async (req, res) => {
  try {
    const { phone, countryCode } = req.body;

    if (!phone || !countryCode) {
      return res.status(400).json({ message: 'Phone and country code are required' });
    }

    const fullPhone = `${countryCode}${phone}`;

    // Check if phone already exists (for another user)
    const existingUser = await User.findOne({ phone: fullPhone, _id: { $ne: req.user.userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    const result = sendOTP('phone', fullPhone);
    res.json({ 
      message: 'OTP sent to phone',
      identifier: fullPhone 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// Verify OTP for email
router.post('/verify-otp/email', authenticateToken, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const verification = verifyOTP(email, otp);
    
    if (!verification.success) {
      return res.status(400).json({ message: verification.message });
    }

    // Update user email
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { email, emailVerified: true, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Email verified and updated successfully',
      user 
    });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
});

// Verify OTP for phone
router.post('/verify-otp/phone', authenticateToken, async (req, res) => {
  try {
    const { phone, countryCode, otp } = req.body;

    if (!phone || !countryCode || !otp) {
      return res.status(400).json({ message: 'Phone, country code, and OTP are required' });
    }

    const fullPhone = `${countryCode}${phone}`;
    const verification = verifyOTP(fullPhone, otp);
    
    if (!verification.success) {
      return res.status(400).json({ message: verification.message });
    }

    // Update user phone and country code
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { phone: fullPhone, countryCode, phoneVerified: true, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Phone number verified and updated successfully',
      user 
    });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
});

module.exports = router;
