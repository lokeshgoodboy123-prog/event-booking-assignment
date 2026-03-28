// OTP Generation and Verification Utility

// Generate a random OTP (6 digits)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate OTP expiry time (5 minutes from now)
function getOTPExpiry() {
  return new Date(Date.now() + 5 * 60 * 1000);
}

// Store OTP in-memory cache (In production, use Redis)
// Format: { identifier: { otp: '123456', expiry: timestamp, attempts: 0 } }
const otpStore = {};

// Send OTP (mock implementation - in production use Twilio/SendGrid)
function sendOTP(type, value) {
  const otp = generateOTP();
  const expiry = getOTPExpiry();
  
  // Store OTP with expiry and attempt tracking
  otpStore[value] = {
    otp,
    expiry,
    attempts: 0,
    type // 'email' or 'phone'
  };

  // Log OTP for development (remove in production)
  console.log(`📧 OTP for ${type} (${value}): ${otp}`);
  
  // In production, call actual SMS/Email service:
  // if (type === 'phone') triggerSMS(value, otp);
  // if (type === 'email') triggerEmail(value, otp);

  return { success: true, message: `OTP sent to ${type}` };
}

// Verify OTP
function verifyOTP(identifier, inputOTP) {
  const stored = otpStore[identifier];

  if (!stored) {
    return { success: false, message: 'No OTP found for this identifier' };
  }

  // Check if OTP expired
  if (new Date() > stored.expiry) {
    delete otpStore[identifier];
    return { success: false, message: 'OTP has expired' };
  }

  // Check maximum attempts (3 tries)
  if (stored.attempts >= 3) {
    delete otpStore[identifier];
    return { success: false, message: 'Maximum OTP attempts exceeded' };
  }

  // Verify OTP
  if (stored.otp !== inputOTP.toString()) {
    stored.attempts++;
    return { success: false, message: 'Invalid OTP', attempts: stored.attempts };
  }

  // OTP verified successfully
  delete otpStore[identifier];
  return { success: true, message: 'OTP verified successfully' };
}

// Clear expired OTPs (cleanup)
function clearExpiredOTPs() {
  const now = new Date();
  for (const key in otpStore) {
    if (now > otpStore[key].expiry) {
      delete otpStore[key];
    }
  }
}

// Cleanup every 10 minutes
setInterval(clearExpiredOTPs, 10 * 60 * 1000);

module.exports = {
  generateOTP,
  getOTPExpiry,
  sendOTP,
  verifyOTP,
  clearExpiredOTPs
};
