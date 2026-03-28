import React, { useState, useEffect } from 'react';
import '../styles/ProfileSettings.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookingService, userService } from '../services/api';

// Countries list
const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Japan',
  'China',
  'Brazil',
  'Mexico',
  'Singapore',
  'South Korea',
  'Netherlands',
  'Sweden',
  'Switzerland',
  'New Zealand',
  'Ireland'
];

// USA States
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Indian States
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// UK States/Regions
const UK_STATES = [
  'England', 'Scotland', 'Wales', 'Northern Ireland'
];

// Get states based on country
const getStatesList = (country) => {
  switch(country) {
    case 'United States': return US_STATES;
    case 'India': return INDIAN_STATES;
    case 'United Kingdom': return UK_STATES;
    default: return [];
  }
};

const ProfileSettings = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    bio: '',
    avatar: '',
    profileImage: null,

    // Contact Information
    prefix: '',
    firstName: '',
    lastName: '',
    suffix: '',
    homePhone: '',
    cellPhone: '',
    jobTitle: '',
    company: '',
    website: '',
    blog: '',

    // Home Address
    homeAddress: {
      address: '',
      address2: '',
      city: '',
      state: '',
      country: 'United States',
      zipCode: ''
    },

    // Billing Address
    billingAddress: {
      address: '',
      address2: '',
      city: '',
      state: '',
      country: 'United States',
      zipCode: ''
    },

    // Shipping Address
    shippingAddress: {
      address: '',
      address2: '',
      city: '',
      state: '',
      country: 'United States',
      zipCode: ''
    },

    // Work Address
    workAddress: {
      address: '',
      address2: '',
      city: '',
      state: '',
      country: 'United States',
      zipCode: ''
    }
  });

  const [settingsData, setSettingsData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    eventUpdates: true,
    newsletter: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailChangeData, setEmailChangeData] = useState({
    newEmail: '',
    password: ''
  });

  const [cardData, setCardData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [savedCards, setSavedCards] = useState([]);

  // OTP verification states
  const [otpState, setOtpState] = useState({
    emailOtp: '',
    phoneOtp: '',
    emailOtpSent: false,
    phoneOtpSent: false,
    emailVerified: false,
    phoneVerified: false,
    otpLoading: false
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadUserData();
  }, [isAuthenticated, authLoading, navigate]);

  const loadUserData = async () => {
    setIsLoadingData(true);
    try {
      // Load profile and settings data from API
      const profileResponse = await userService.getProfile();
      const userData = profileResponse.data;

      // Safely extract phone number (remove country code prefix if present)
      let phoneNumber = userData.phone || '';
      const countryCodeValue = userData.countryCode || '+1';
      if (phoneNumber && phoneNumber.startsWith(countryCodeValue)) {
        phoneNumber = phoneNumber.replace(countryCodeValue, '');
      }

      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: phoneNumber,
        countryCode: countryCodeValue,
        bio: userData.bio || '',
        avatar: userData.profileImage || '',
        profileImage: userData.profileImage || null,
        prefix: userData.prefix || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        suffix: userData.suffix || '',
        homePhone: userData.homePhone || '',
        cellPhone: userData.cellPhone || '',
        jobTitle: userData.jobTitle || '',
        company: userData.company || '',
        website: userData.website || '',
        blog: userData.blog || '',
        homeAddress: {
          address: userData.homeAddress?.address || '',
          address2: userData.homeAddress?.address2 || '',
          city: userData.homeAddress?.city || '',
          state: userData.homeAddress?.state || '',
          country: userData.homeAddress?.country || 'United States',
          zipCode: userData.homeAddress?.zipCode || ''
        },
        billingAddress: {
          address: userData.billingAddress?.address || '',
          address2: userData.billingAddress?.address2 || '',
          city: userData.billingAddress?.city || '',
          state: userData.billingAddress?.state || '',
          country: userData.billingAddress?.country || 'United States',
          zipCode: userData.billingAddress?.zipCode || ''
        },
        shippingAddress: {
          address: userData.shippingAddress?.address || '',
          address2: userData.shippingAddress?.address2 || '',
          city: userData.shippingAddress?.city || '',
          state: userData.shippingAddress?.state || '',
          country: userData.shippingAddress?.country || 'United States',
          zipCode: userData.shippingAddress?.zipCode || ''
        },
        workAddress: {
          address: userData.workAddress?.address || '',
          address2: userData.workAddress?.address2 || '',
          city: userData.workAddress?.city || '',
          state: userData.workAddress?.state || '',
          country: userData.workAddress?.country || 'United States',
          zipCode: userData.workAddress?.zipCode || ''
        }
      });

      // Update OTP state with verification status
      setOtpState(prev => ({
        ...prev,
        emailVerified: userData.emailVerified || false,
        phoneVerified: userData.phoneVerified || false
      }));

      // Load notification settings from API
      setSettingsData({
        emailNotifications: userData.emailNotifications !== undefined ? userData.emailNotifications : true,
        smsNotifications: userData.smsNotifications !== undefined ? userData.smsNotifications : false,
        bookingReminders: userData.bookingReminders !== undefined ? userData.bookingReminders : true,
        eventUpdates: userData.eventUpdates !== undefined ? userData.eventUpdates : true,
        newsletter: userData.newsletter !== undefined ? userData.newsletter : true
      });

      // Load bookings
      const bookingsResponse = await bookingService.getUserBookings();
      setBookings(bookingsResponse.data || []);

      setError('');
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load user data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleProfileChange = (e, addressType = null) => {
    const { name, value } = e.target;
    
    if (addressType) {
      // Handle nested address fields
      setProfileData(prev => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          [name]: value
        }
      }));
    } else {
      // Handle regular fields
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettingsData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      console.log('🔐 Changing password...');
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      console.log('✅ Password changed:', response.data);
      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Password change error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMsg);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!emailChangeData.newEmail || !emailChangeData.password) {
      setError('Please enter new email and password');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailChangeData.newEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      console.log('📧 Sending email change request...');
      // In a real app, you would call an API here
      // For now, just show a success message
      setSuccess('A verification link has been sent to your new email address. Please check and click the link to confirm.');
      setEmailChangeData({ newEmail: '', password: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('❌ Email change error:', err);
      setError('Failed to initiate email change. Please try again.');
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry as MM/YY
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }
    
    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!cardData.cardHolder || !cardData.cardNumber || !cardData.expiry || !cardData.cvv) {
      setError('Please fill in all card details');
      return;
    }
    
    if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }
    
    try {
      console.log('💳 Adding card...');
      // In a real app, you would call Stripe or payment API
      // For now, simulate adding the card
      const lastFour = cardData.cardNumber.slice(-4);
      setSavedCards(prev => [...prev, {
        cardHolder: cardData.cardHolder,
        lastFourDigits: lastFour,
        expiryDate: cardData.expiry
      }]);
      
      setSuccess('Card added successfully!');
      setCardData({ cardHolder: '', cardNumber: '', expiry: '', cvv: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Card add error:', err);
      setError('Failed to add card. Please try again.');
    }
  };

  const handleRemoveCard = (idx) => {
    setSavedCards(prev => prev.filter((_, i) => i !== idx));
    setSuccess('Card removed successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDownloadData = async () => {
    try {
      setError('');
      setSuccess('');
      console.log('📥 Downloading personal data...');
      // Simulate data download
      const dataStr = JSON.stringify(profileData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `personal-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('Your data has been downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Download error:', err);
      setError('Failed to download data. Please try again.');
    }
  };

  const handleViewPrivacy = () => {
    // Open privacy policy in new tab
    window.open('https://example.com/privacy-policy', '_blank');
  };

  const handleLinkAccount = (provider) => {
    setError('');
    setSuccess('');
    console.log(`🔗 Linking ${provider} account...`);
    setSuccess(`${provider} account connected successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate that we have at least a name
    if (!profileData.name || profileData.name.trim() === '') {
      setError('Name is required');
      return;
    }
    
    try {
      // Log data being sent for debugging
      console.log('📤 Sending profile data:', JSON.stringify(profileData, null, 2));
      
      const response = await userService.updateProfile(profileData);
      console.log('📥 Full Response:', response);
      console.log('📥 Response data:', response.data);
      if (response.data.user) {
        console.log('📥 User object keys:', Object.keys(response.data.user));
        console.log('📥 Full User data:', JSON.stringify(response.data.user, null, 2));
      }
      
      console.log('✅ Profile update successful!');
      setSuccess('Profile updated successfully!');
      
      // Update profile data with the returned data - include ALL fields
      if (response.data.user) {
        console.log('📦 Processing returned user data...');
        const userData = response.data.user;
        
        // Safely extract phone number
        let phoneNumber = userData.phone || '';
        const countryCodeValue = userData.countryCode || '+1';
        if (phoneNumber && phoneNumber.startsWith(countryCodeValue)) {
          phoneNumber = phoneNumber.replace(countryCodeValue, '');
        }
        
        console.log('Updated profile data from API:', userData);
        console.log('HomeAddress from API:', userData.homeAddress);
        console.log('BillingAddress from API:', userData.billingAddress);
        console.log('ShippingAddress from API:', userData.shippingAddress);
        console.log('WorkAddress from API:', userData.workAddress);
        
        const newProfileData = {
          name: userData.name || '',
          email: userData.email || '',
          phone: phoneNumber,
          countryCode: countryCodeValue,
          bio: userData.bio || '',
          avatar: userData.profileImage || '',
          profileImage: userData.profileImage || null,
          prefix: userData.prefix || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          suffix: userData.suffix || '',
          homePhone: userData.homePhone || '',
          cellPhone: userData.cellPhone || '',
          jobTitle: userData.jobTitle || '',
          company: userData.company || '',
          website: userData.website || '',
          blog: userData.blog || '',
          homeAddress: {
            address: userData.homeAddress?.address || '',
            address2: userData.homeAddress?.address2 || '',
            city: userData.homeAddress?.city || '',
            state: userData.homeAddress?.state || '',
            country: userData.homeAddress?.country || 'United States',
            zipCode: userData.homeAddress?.zipCode || ''
          },
          billingAddress: {
            address: userData.billingAddress?.address || '',
            address2: userData.billingAddress?.address2 || '',
            city: userData.billingAddress?.city || '',
            state: userData.billingAddress?.state || '',
            country: userData.billingAddress?.country || 'United States',
            zipCode: userData.billingAddress?.zipCode || ''
          },
          shippingAddress: {
            address: userData.shippingAddress?.address || '',
            address2: userData.shippingAddress?.address2 || '',
            city: userData.shippingAddress?.city || '',
            state: userData.shippingAddress?.state || '',
            country: userData.shippingAddress?.country || 'United States',
            zipCode: userData.shippingAddress?.zipCode || ''
          },
          workAddress: {
            address: userData.workAddress?.address || '',
            address2: userData.workAddress?.address2 || '',
            city: userData.workAddress?.city || '',
            state: userData.workAddress?.state || '',
            country: userData.workAddress?.country || 'United States',
            zipCode: userData.workAddress?.zipCode || ''
          }
        };
        
        console.log('New profile data to be set:', JSON.stringify(newProfileData, null, 2));
        setProfileData(newProfileData);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Profile update error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.response?.data?.message
      });
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMsg);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await userService.updateSettings(settingsData);
      setSuccess('Settings updated successfully!');
      // Update settings data with returned data if available
      if (response.data.user) {
        setSettingsData({
          emailNotifications: response.data.user.emailNotifications,
          smsNotifications: response.data.user.smsNotifications,
          bookingReminders: response.data.user.bookingReminders,
          eventUpdates: response.data.user.eventUpdates,
          newsletter: response.data.user.newsletter
        });
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Settings update error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update settings';
      setError(errorMsg);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        loadUserData();
        setSuccess('Booking cancelled successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  // Request OTP for email verification
  const handleRequestEmailOTP = async () => {
    setError('');
    if (!profileData.email) {
      setError('Please enter an email address');
      return;
    }
    
    try {
      setOtpState(prev => ({ ...prev, otpLoading: true }));
      await userService.requestOTPEmail(profileData.email);
      setOtpState(prev => ({ ...prev, emailOtpSent: true }));
      setSuccess('OTP sent to your email!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Email OTP request error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
    } finally {
      setOtpState(prev => ({ ...prev, otpLoading: false }));
    }
  };

  // Request OTP for phone verification
  const handleRequestPhoneOTP = async () => {
    setError('');
    if (!profileData.phone) {
      setError('Please enter a phone number');
      return;
    }
    
    try {
      setOtpState(prev => ({ ...prev, otpLoading: true }));
      await userService.requestOTPPhone(profileData.phone, profileData.countryCode);
      setOtpState(prev => ({ ...prev, phoneOtpSent: true }));
      setSuccess('OTP sent to your phone!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Phone OTP request error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
    } finally {
      setOtpState(prev => ({ ...prev, otpLoading: false }));
    }
  };

  // Verify email OTP
  const handleVerifyEmailOTP = async () => {
    setError('');
    if (!otpState.emailOtp) {
      setError('Please enter OTP');
      return;
    }
    
    try {
      setOtpState(prev => ({ ...prev, otpLoading: true }));
      await userService.verifyOTPEmail(profileData.email, otpState.emailOtp);
      setOtpState(prev => ({ ...prev, emailVerified: true, emailOtp: '', emailOtpSent: false }));
      setSuccess('Email verified successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Email OTP verification error:', err);
      const errorMsg = err.response?.data?.message || 'Invalid OTP';
      setError(errorMsg);
    } finally {
      setOtpState(prev => ({ ...prev, otpLoading: false }));
    }
  };

  // Verify phone OTP
  const handleVerifyPhoneOTP = async () => {
    setError('');
    if (!otpState.phoneOtp) {
      setError('Please enter OTP');
      return;
    }
    
    try {
      setOtpState(prev => ({ ...prev, otpLoading: true }));
      await userService.verifyOTPPhone(profileData.phone, profileData.countryCode, otpState.phoneOtp);
      setOtpState(prev => ({ ...prev, phoneVerified: true, phoneOtp: '', phoneOtpSent: false }));
      setSuccess('Phone verified successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Phone OTP verification error:', err);
      const errorMsg = err.response?.data?.message || 'Invalid OTP';
      setError(errorMsg);
    } finally {
      setOtpState(prev => ({ ...prev, otpLoading: false }));
    }
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="profile-settings-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-wrapper">
        
        {/* Left Sidebar */}
        <aside className="settings-sidebar">
          <div className="sidebar-header">
            <div className="user-avatar-large">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p className="user-email">{user?.email}</p>
          </div>

          <nav className="settings-nav">
            <div className="nav-section-label">Account</div>
            
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Contact Info</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span>Change Email</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Password</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'cards' ? 'active' : ''}`}
              onClick={() => setActiveTab('cards')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Credit/Debit Cards</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'linked' ? 'active' : ''}`}
              onClick={() => setActiveTab('linked')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Linked Accounts</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'communication' ? 'active' : ''}`}
              onClick={() => setActiveTab('communication')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Communication</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
                <line x1="16" y1="1" x2="16" y2="5"></line>
                <line x1="8" y1="1" x2="8" y2="5"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
              </svg>
              <span>My Bookings</span>
              {bookings.length > 0 && <span className="badge">{bookings.length}</span>}
            </button>

            <button
              className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
              <span>Personal Data</span>
            </button>

            <button
              className={`nav-item nav-danger ${activeTab === 'close' ? 'active' : ''}`}
              onClick={() => setActiveTab('close')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>Close Account</span>
            </button>

            <div className="nav-section-divider"></div>
            
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m4.24-4.24l4.24-4.24"></path>
              </svg>
              <span>Preferences</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="settings-content">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Update your personal information and profile details</p>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="otp-field-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Your email"
                      className="form-input"
                    />
                    {!otpState.emailVerified && (
                      <button
                        type="button"
                        onClick={handleRequestEmailOTP}
                        disabled={otpState.otpLoading || otpState.emailOtpSent}
                        className="btn btn-small btn-secondary"
                      >
                        {otpState.emailOtpSent ? 'OTP Sent' : 'Verify'}
                      </button>
                    )}
                    {otpState.emailVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>

                  {otpState.emailOtpSent && !otpState.emailVerified && (
                    <div className="otp-input-group">
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter 6-digit OTP"
                        value={otpState.emailOtp}
                        onChange={(e) => setOtpState(prev => ({ ...prev, emailOtp: e.target.value }))}
                        className="form-input otp-input"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOTP}
                        disabled={otpState.otpLoading}
                        className="btn btn-small btn-primary"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="phone-group">
                    <select
                      value={profileData.countryCode}
                      onChange={(e) => setProfileData(prev => ({ ...prev, countryCode: e.target.value }))}
                      className="form-input country-code-select"
                    >
                      <option value="+1">🇺🇸 +1 (USA)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+61">🇦🇺 +61 (Australia)</option>
                      <option value="+81">🇯🇵 +81 (Japan)</option>
                      <option value="+86">🇨🇳 +86 (China)</option>
                      <option value="+33">🇫🇷 +33 (France)</option>
                      <option value="+49">🇩🇪 +49 (Germany)</option>
                      <option value="+39">🇮🇹 +39 (Italy)</option>
                      <option value="+34">🇪🇸 +34 (Spain)</option>
                      <option value="+55">🇧🇷 +55 (Brazil)</option>
                      <option value="+27">🇿🇦 +27 (South Africa)</option>
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="Phone number"
                      className="form-input"
                    />
                    {!otpState.phoneVerified && (
                      <button
                        type="button"
                        onClick={handleRequestPhoneOTP}
                        disabled={otpState.otpLoading || otpState.phoneOtpSent}
                        className="btn btn-small btn-secondary"
                      >
                        {otpState.phoneOtpSent ? 'OTP Sent' : 'Verify'}
                      </button>
                    )}
                    {otpState.phoneVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>

                  {otpState.phoneOtpSent && !otpState.phoneVerified && (
                    <div className="otp-input-group">
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter 6-digit OTP"
                        value={otpState.phoneOtp}
                        onChange={(e) => setOtpState(prev => ({ ...prev, phoneOtp: e.target.value }))}
                        className="form-input otp-input"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOTP}
                        disabled={otpState.otpLoading}
                        className="btn btn-small btn-primary"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself"
                    className="form-textarea"
                    rows="4"
                  ></textarea>
                </div>

                {/* Contact Information Section */}
                <div className="form-section-divider">
                  <h3>Contact Information</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prefix">Prefix</label>
                    <select
                      id="prefix"
                      name="prefix"
                      value={profileData.prefix}
                      onChange={handleProfileChange}
                      className="form-input"
                    >
                      <option value="">--</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      placeholder="First name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      placeholder="Last name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="suffix">Suffix</label>
                    <input
                      type="text"
                      id="suffix"
                      name="suffix"
                      value={profileData.suffix}
                      onChange={handleProfileChange}
                      placeholder="Jr., Sr., etc."
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="homePhone">Home Phone</label>
                    <input
                      type="tel"
                      id="homePhone"
                      name="homePhone"
                      value={profileData.homePhone}
                      onChange={handleProfileChange}
                      placeholder="Home phone number"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cellPhone">Cell Phone</label>
                    <input
                      type="tel"
                      id="cellPhone"
                      name="cellPhone"
                      value={profileData.cellPhone}
                      onChange={handleProfileChange}
                      placeholder="Cell phone number"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={profileData.jobTitle}
                      onChange={handleProfileChange}
                      placeholder="Your job title"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company / Organization</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      placeholder="Company name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={profileData.website}
                      onChange={handleProfileChange}
                      placeholder="https://example.com"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="blog">Blog</label>
                    <input
                      type="url"
                      id="blog"
                      name="blog"
                      value={profileData.blog}
                      onChange={handleProfileChange}
                      placeholder="https://blog.example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Home Address */}
                <div className="form-section-divider">
                  <h3>Home Address</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="homeAddress-address">Address</label>
                  <input
                    type="text"
                    id="homeAddress-address"
                    name="address"
                    value={profileData?.homeAddress?.address || ''}
                    onChange={(e) => handleProfileChange(e, 'homeAddress')}
                    placeholder="Street address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="homeAddress-address2">Address 2</label>
                  <input
                    type="text"
                    id="homeAddress-address2"
                    name="address2"
                    value={profileData?.homeAddress?.address2 || ''}
                    onChange={(e) => handleProfileChange(e, 'homeAddress')}
                    placeholder="Apartment, suite, etc."
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="homeAddress-country">Country</label>
                    <select
                      id="homeAddress-country"
                      name="country"
                      value={profileData?.homeAddress?.country || ''}
                      onChange={(e) => handleProfileChange(e, 'homeAddress')}
                      className="form-input"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="homeAddress-state">State/Province</label>
                    {getStatesList(profileData?.homeAddress?.country || '').length > 0 ? (
                      <select
                        id="homeAddress-state"
                        name="state"
                        value={profileData?.homeAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'homeAddress')}
                        className="form-input"
                      >
                        <option value="">Select State/Province</option>
                        {getStatesList(profileData?.homeAddress?.country || '').map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="homeAddress-state"
                        name="state"
                        value={profileData?.homeAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'homeAddress')}
                        placeholder="State/Province"
                        className="form-input"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="homeAddress-city">City</label>
                    <input
                      type="text"
                      id="homeAddress-city"
                      name="city"
                      value={profileData?.homeAddress?.city || ''}
                      onChange={(e) => handleProfileChange(e, 'homeAddress')}
                      placeholder="City"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="homeAddress-zipCode">Zip/Postal Code</label>
                    <input
                      type="text"
                      id="homeAddress-zipCode"
                      name="zipCode"
                      value={profileData?.homeAddress?.zipCode || ''}
                      onChange={(e) => handleProfileChange(e, 'homeAddress')}
                      placeholder="Zip/Postal code"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="form-section-divider">
                  <h3>Billing Address</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="billingAddress-address">Address</label>
                  <input
                    type="text"
                    id="billingAddress-address"
                    name="address"
                    value={profileData?.billingAddress?.address || ''}
                    onChange={(e) => handleProfileChange(e, 'billingAddress')}
                    placeholder="Street address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="billingAddress-address2">Address 2</label>
                  <input
                    type="text"
                    id="billingAddress-address2"
                    name="address2"
                    value={profileData?.billingAddress?.address2 || ''}
                    onChange={(e) => handleProfileChange(e, 'billingAddress')}
                    placeholder="Apartment, suite, etc."
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingAddress-country">Country</label>
                    <select
                      id="billingAddress-country"
                      name="country"
                      value={profileData?.billingAddress?.country || ''}
                      onChange={(e) => handleProfileChange(e, 'billingAddress')}
                      className="form-input"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingAddress-state">State/Province</label>
                    {getStatesList(profileData?.billingAddress?.country || '').length > 0 ? (
                      <select
                        id="billingAddress-state"
                        name="state"
                        value={profileData?.billingAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'billingAddress')}
                        className="form-input"
                      >
                        <option value="">Select State/Province</option>
                        {getStatesList(profileData?.billingAddress?.country || '').map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="billingAddress-state"
                        name="state"
                        value={profileData?.billingAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'billingAddress')}
                        placeholder="State/Province"
                        className="form-input"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingAddress-city">City</label>
                    <input
                      type="text"
                      id="billingAddress-city"
                      name="city"
                      value={profileData?.billingAddress?.city || ''}
                      onChange={(e) => handleProfileChange(e, 'billingAddress')}
                      placeholder="City"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="billingAddress-zipCode">Zip/Postal Code</label>
                    <input
                      type="text"
                      id="billingAddress-zipCode"
                      name="zipCode"
                      value={profileData?.billingAddress?.zipCode || ''}
                      onChange={(e) => handleProfileChange(e, 'billingAddress')}
                      placeholder="Zip/Postal code"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="form-section-divider">
                  <h3>Shipping Address</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="shippingAddress-address">Address</label>
                  <input
                    type="text"
                    id="shippingAddress-address"
                    name="address"
                    value={profileData?.shippingAddress?.address || ''}
                    onChange={(e) => handleProfileChange(e, 'shippingAddress')}
                    placeholder="Street address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shippingAddress-address2">Address 2</label>
                  <input
                    type="text"
                    id="shippingAddress-address2"
                    name="address2"
                    value={profileData?.shippingAddress?.address2 || ''}
                    onChange={(e) => handleProfileChange(e, 'shippingAddress')}
                    placeholder="Apartment, suite, etc."
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="shippingAddress-country">Country</label>
                    <select
                      id="shippingAddress-country"
                      name="country"
                      value={profileData?.shippingAddress?.country || ''}
                      onChange={(e) => handleProfileChange(e, 'shippingAddress')}
                      className="form-input"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="shippingAddress-state">State/Province</label>
                    {getStatesList(profileData?.shippingAddress?.country || '').length > 0 ? (
                      <select
                        id="shippingAddress-state"
                        name="state"
                        value={profileData?.shippingAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'shippingAddress')}
                        className="form-input"
                      >
                        <option value="">Select State/Province</option>
                        {getStatesList(profileData?.shippingAddress?.country || '').map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="shippingAddress-state"
                        name="state"
                        value={profileData?.shippingAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'shippingAddress')}
                        placeholder="State/Province"
                        className="form-input"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="shippingAddress-city">City</label>
                    <input
                      type="text"
                      id="shippingAddress-city"
                      name="city"
                      value={profileData?.shippingAddress?.city || ''}
                      onChange={(e) => handleProfileChange(e, 'shippingAddress')}
                      placeholder="City"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="shippingAddress-zipCode">Zip/Postal Code</label>
                    <input
                      type="text"
                      id="shippingAddress-zipCode"
                      name="zipCode"
                      value={profileData?.shippingAddress?.zipCode || ''}
                      onChange={(e) => handleProfileChange(e, 'shippingAddress')}
                      placeholder="Zip/Postal code"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Work Address */}
                <div className="form-section-divider">
                  <h3>Work Address</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="workAddress-address">Address</label>
                  <input
                    type="text"
                    id="workAddress-address"
                    name="address"
                    value={profileData?.workAddress?.address || ''}
                    onChange={(e) => handleProfileChange(e, 'workAddress')}
                    placeholder="Street address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="workAddress-address2">Address 2</label>
                  <input
                    type="text"
                    id="workAddress-address2"
                    name="address2"
                    value={profileData?.workAddress?.address2 || ''}
                    onChange={(e) => handleProfileChange(e, 'workAddress')}
                    placeholder="Apartment, suite, etc."
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="workAddress-country">Country</label>
                    <select
                      id="workAddress-country"
                      name="country"
                      value={profileData?.workAddress?.country || ''}
                      onChange={(e) => handleProfileChange(e, 'workAddress')}
                      className="form-input"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="workAddress-state">State/Province</label>
                    {getStatesList(profileData?.workAddress?.country || '').length > 0 ? (
                      <select
                        id="workAddress-state"
                        name="state"
                        value={profileData?.workAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'workAddress')}
                        className="form-input"
                      >
                        <option value="">Select State/Province</option>
                        {getStatesList(profileData?.workAddress?.country || '').map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="workAddress-state"
                        name="state"
                        value={profileData?.workAddress?.state || ''}
                        onChange={(e) => handleProfileChange(e, 'workAddress')}
                        placeholder="State/Province"
                        className="form-input"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="workAddress-city">City</label>
                    <input
                      type="text"
                      id="workAddress-city"
                      name="city"
                      value={profileData?.workAddress?.city || ''}
                      onChange={(e) => handleProfileChange(e, 'workAddress')}
                      placeholder="City"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="workAddress-zipCode">Zip/Postal Code</label>
                    <input
                      type="text"
                      id="workAddress-zipCode"
                      name="zipCode"
                      value={profileData?.workAddress?.zipCode || ''}
                      onChange={(e) => handleProfileChange(e, 'workAddress')}
                      placeholder="Zip/Postal code"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={loadUserData}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="content-section">
              <div className="section-header">
                <h2>My Bookings</h2>
                <p>Manage and view all your event bookings</p>
              </div>

              {bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No Bookings Yet</h3>
                  <p>You haven't booked any events yet. Start exploring and booking events now!</p>
                  <button 
                    onClick={() => navigate('/events')}
                    className="btn btn-primary"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map(booking => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-header">
                        <h3>{booking.event?.title}</h3>
                        <span className={`status-badge status-${booking.status?.toLowerCase() || 'pending'}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </div>

                      <div className="booking-details">
                        <div className="detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>{new Date(booking.event?.date).toLocaleDateString()}</span>
                        </div>

                        <div className="detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{booking.event?.location}</span>
                        </div>

                        <div className="detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                          </svg>
                          <span>{booking.numberOfTickets} tickets</span>
                        </div>

                        <div className="detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          <span className="price">${booking.totalPrice}</span>
                        </div>
                      </div>

                      <div className="booking-actions">
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-danger-small"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <button className="btn btn-secondary-small">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Notification Settings</h2>
                <p>Control how you receive notifications and updates</p>
              </div>

              <form onSubmit={handleSaveSettings} className="settings-form">
                <div className="settings-group">
                  <h3>Notifications</h3>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="emailNotifications">Email Notifications</label>
                      <p>Receive email notifications for your bookings and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={settingsData.emailNotifications}
                      onChange={handleSettingsChange}
                      className="checkbox-input"
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="smsNotifications">SMS Notifications</label>
                      <p>Receive SMS notifications for important updates</p>
                    </div>
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      name="smsNotifications"
                      checked={settingsData.smsNotifications}
                      onChange={handleSettingsChange}
                      className="checkbox-input"
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="bookingReminders">Booking Reminders</label>
                      <p>Get reminded about your upcoming events</p>
                    </div>
                    <input
                      type="checkbox"
                      id="bookingReminders"
                      name="bookingReminders"
                      checked={settingsData.bookingReminders}
                      onChange={handleSettingsChange}
                      className="checkbox-input"
                    />
                  </div>
                </div>

                <div className="settings-group">
                  <h3>Updates & Promotions</h3>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="eventUpdates">Event Updates</label>
                      <p>Receive updates about events you're interested in</p>
                    </div>
                    <input
                      type="checkbox"
                      id="eventUpdates"
                      name="eventUpdates"
                      checked={settingsData.eventUpdates}
                      onChange={handleSettingsChange}
                      className="checkbox-input"
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label htmlFor="newsletter">Newsletter</label>
                      <p>Subscribe to our weekly events and promotions newsletter</p>
                    </div>
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={settingsData.newsletter}
                      onChange={handleSettingsChange}
                      className="checkbox-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Preferences
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('settings')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Contact Information</h2>
                <p>Your contact details and business information</p>
              </div>

              <div className="info-display">
                <div className="info-item">
                  <h4>Phone Numbers</h4>
                  <p>Home: {profileData?.homePhone || 'Not provided'}</p>
                  <p>Cell: {profileData?.cellPhone || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <h4>Business Information</h4>
                  <p>Job Title: {profileData?.jobTitle || 'Not provided'}</p>
                  <p>Company: {profileData?.company || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <h4>Online Presence</h4>
                  <p>Website: {profileData?.website || 'Not provided'}</p>
                  <p>Blog: {profileData?.blog || 'Not provided'}</p>
                </div>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="btn btn-primary"
                >
                  Edit Contact Info
                </button>
              </div>
            </div>
          )}

          {/* Change Email Tab */}
          {activeTab === 'email' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Change Email Address</h2>
                <p>Update your email address and verify the new one</p>
              </div>

              <form onSubmit={handleChangeEmail} className="profile-form">
                <div className="info-box">
                  <h4>Current Email</h4>
                  <p className="current-email">{user?.email}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="newEmail">New Email Address</label>
                  <input
                    type="email"
                    id="newEmail"
                    value={emailChangeData.newEmail}
                    onChange={(e) => setEmailChangeData(prev => ({ ...prev, newEmail: e.target.value }))}
                    placeholder="Enter your new email"
                    className="form-input"
                    required
                  />
                  <small>You'll need to verify this email before we update it.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="emailPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="emailPassword"
                    value={emailChangeData.password}
                    onChange={(e) => setEmailChangeData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password to confirm"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Send Verification Link
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Change Your Password</h2>
                <p>Keep your account secure with a strong password</p>
              </div>

              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter a strong password"
                    className="form-input"
                    required
                  />
                  <small>At least 6 characters with numbers and letters</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Credit/Debit Cards Tab */}
          {activeTab === 'cards' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Credit/Debit Cards</h2>
                <p>Manage your payment methods securely</p>
              </div>

              {savedCards.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💳</div>
                  <h3>No Saved Cards</h3>
                  <p>You haven't added any payment methods yet.</p>
                </div>
              ) : (
                <div className="cards-section">
                  <h3>Your Cards</h3>
                  <div className="cards-list">
                    {savedCards.map((card, idx) => (
                      <div key={idx} className="card-item">
                        <div className="card-content">
                          <div className="card-logo">🏦</div>
                          <div className="card-details">
                            <p className="card-holder">{card.cardHolder}</p>
                            <p className="card-number">•••• •••• •••• {card.lastFourDigits}</p>
                            <p className="card-expiry">Expires {card.expiryDate}</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveCard(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="add-card-section">
                <h3>Add New Card</h3>
                <form onSubmit={handleAddCard} className="card-form">
                  <div className="form-group">
                    <label htmlFor="cardHolder">Cardholder Name</label>
                    <input 
                      type="text" 
                      id="cardHolder" 
                      name="cardHolder"
                      value={cardData.cardHolder}
                      onChange={handleCardChange}
                      className="form-input" 
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      className="form-input" 
                      placeholder="1234 5678 9012 3456" 
                      maxLength="19"
                      required
                    />
                    <small>16 digits</small>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiry">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiry" 
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        className="form-input" 
                        placeholder="MM/YY" 
                        maxLength="5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input 
                        type="text" 
                        id="cvv" 
                        name="cvv"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                        className="form-input" 
                        placeholder="123" 
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Add Card
                    </button>
                    <button 
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setCardData({ cardHolder: '', cardNumber: '', expiry: '', cvv: '' })}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              <div className="security-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Your card information is securely encrypted and never stored in full</span>
              </div>
            </div>
          )}

          {/* Linked Accounts Tab */}
          {activeTab === 'linked' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Linked Accounts</h2>
                <p>Connect social media and third-party accounts for easier login</p>
              </div>

              <div className="linked-accounts-list">
                <div className="linked-account-item">
                  <div className="account-header">
                    <h4>Google</h4>
                    <p>Sign in faster with your Google account</p>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleLinkAccount('Google')}
                  >
                    Connect
                  </button>
                </div>

                <div className="linked-account-item">
                  <div className="account-header">
                    <h4>Facebook</h4>
                    <p>Connect your Facebook account for quick registration</p>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleLinkAccount('Facebook')}
                  >
                    Connect
                  </button>
                </div>

                <div className="linked-account-item">
                  <div className="account-header">
                    <h4>Apple ID</h4>
                    <p>Use your Apple ID to sign in securely</p>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleLinkAccount('Apple')}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Communication Preferences Tab */}
          {activeTab === 'communication' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Communication Preferences</h2>
                <p>Choose how you want to receive updates from us</p>
              </div>

              <form className="settings-form">
                <div className="settings-group">
                  <h3>Email Communications</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label>Event Reminders</label>
                      <p>Reminders before your booked events</p>
                    </div>
                    <input type="checkbox" defaultChecked className="checkbox-input" />
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label>Event Recommendations</label>
                      <p>Personalized event suggestions based on your interests</p>
                    </div>
                    <input type="checkbox" defaultChecked className="checkbox-input" />
                  </div>
                </div>

                <div className="settings-group">
                  <h3>Promotional Communications</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label>Offers & Discounts</label>
                      <p>Special offers and promotions</p>
                    </div>
                    <input type="checkbox" defaultChecked className="checkbox-input" />
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label>Newsletter</label>
                      <p>Weekly digest of events and news</p>
                    </div>
                    <input type="checkbox" defaultChecked className="checkbox-input" />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-primary">Save Preferences</button>
                </div>
              </form>
            </div>
          )}

          {/* Personal Data Tab */}
          {activeTab === 'data' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Personal Data</h2>
                <p>Download your data or review our privacy practices</p>
              </div>

              <div className="data-actions">
                <div className="data-action-box">
                  <div className="data-icon">📥</div>
                  <h4>Download Your Data</h4>
                  <p>Get a copy of all your personal data in a portable JSON format. You can use this for your records or transfer to another service.</p>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleDownloadData}
                  >
                    Download Data
                  </button>
                </div>

                <div className="data-action-box">
                  <div className="data-icon">📋</div>
                  <h4>View Privacy Policy</h4>
                  <p>Read our complete privacy policy to understand how we collect, use, and protect your personal information.</p>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleViewPrivacy}
                  >
                    View Policy
                  </button>
                </div>

                <div className="data-action-box">
                  <div className="data-icon">🛡️</div>
                  <h4>Data Security</h4>
                  <p>Your data is protected with industry-standard encryption and security measures. We never share your information with third parties without consent.</p>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSuccess('Security details updated. View your account activity in the security section.')}
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="data-info">
                <h4>Your Data Rights</h4>
                <ul>
                  <li>Right to access: Request a copy of your personal data</li>
                  <li>Right to rectification: Request corrections to inaccurate data</li>
                  <li>Right to erasure: Request deletion of your data (with limitations)</li>
                  <li>Right to data portability: Get your data in a standard format</li>
                  <li>Right to restrict: Limit how we use your data</li>
                </ul>
              </div>
            </div>
          )}

          {/* Close Account Tab */}
          {activeTab === 'close' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Close Your Account</h2>
                <p>Permanently delete your account and all associated data</p>
              </div>

              <div className="warning-box">
                <h4>⚠️ Danger Zone</h4>
                <p>Once you close your account, there is no going back. All your data will be permanently deleted.</p>
              </div>

              <div className="close-account-info">
                <h4>Before you go:</h4>
                <ul>
                  <li>All your bookings will be cancelled</li>
                  <li>You won't be able to recover your account</li>
                  <li>Any pending refunds will be processed</li>
                  <li>Your profile will be removed from the platform</li>
                </ul>
              </div>

              <form className="profile-form">
                <div className="form-group">
                  <label htmlFor="closePassword">Confirm Password</label>
                  <input
                    type="password"
                    id="closePassword"
                    placeholder="Enter your password to confirm"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      required
                      className="checkbox-input"
                    />
                    <span>I understand that this action cannot be undone</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-danger">
                    Yes, Close My Account
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('profile')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;
