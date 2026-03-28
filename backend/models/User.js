const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Address sub-schema
const addressSchema = new mongoose.Schema({
  address: { type: String, default: null },
  address2: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: 'United States' },
  zipCode: { type: String, default: null }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  countryCode: {
    type: String,
    default: '+1'
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  // Contact Information
  prefix: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  suffix: { type: String, default: null },
  homePhone: { type: String, default: null },
  cellPhone: { type: String, default: null },
  jobTitle: { type: String, default: null },
  company: { type: String, default: null },
  website: { type: String, default: null },
  blog: { type: String, default: null },
  
  // Addresses using sub-schema
  homeAddress: { type: addressSchema, default: () => ({}) },
  billingAddress: { type: addressSchema, default: () => ({}) },
  shippingAddress: { type: addressSchema, default: () => ({}) },
  workAddress: { type: addressSchema, default: () => ({}) },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Notification Settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  bookingReminders: {
    type: Boolean,
    default: true
  },
  eventUpdates: {
    type: Boolean,
    default: true
  },
  newsletter: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(passwordToCompare) {
  return await bcrypt.compare(passwordToCompare, this.password);
};

module.exports = mongoose.model('User', userSchema);
