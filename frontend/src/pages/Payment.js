import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Payment.css';
import { formatPrice } from '../utils/currency';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  
  const booking = location.state?.booking;

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: '',
    email: '',
    upiId: '',
    walletType: '',
    walletNumber: '',
    bankName: '',
    netbankingUsername: '',
    giftVoucherCode: '',
    redeemPoints: ''
  });

  const [appliedVoucher, setAppliedVoucher] = useState({
    code: '',
    discount: 0,
    finalAmount: 0,
    message: ''
  });

  useEffect(() => {
    if (!booking) {
      // Redirect to events page if no booking data is available
      navigate('/events');
    }
  }, [booking, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      setFormData({ ...formData, [name]: formatted.slice(0, 19) });
    }
    // Format expiry date
    else if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        setFormData({ ...formData, [name]: `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` });
      } else {
        setFormData({ ...formData, [name]: cleaned });
      }
    }
    // Format CVV (only numbers)
    else if (name === 'cvv') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 4) });
    }
    // Format zip code
    else if (name === 'zipCode') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9-]/g, '').slice(0, 10) });
    }
    // Format redeemPoints (only numbers)
    else if (name === 'redeemPoints') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    // Email validation (required for all methods)
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Valid email is required';

    if (selectedMethod === 'card') {
      if (!formData.cardName.trim()) return 'Cardholder name is required';
      if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) return 'Card number must be 16 digits';
      if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) return 'Expiry must be MM/YY format';
      if (!formData.cvv.match(/^\d{3,4}$/)) return 'CVV must be 3-4 digits';
      if (!formData.billingAddress.trim()) return 'Billing address is required';
      if (!formData.city.trim()) return 'City is required';
      if (!formData.zipCode.trim()) return 'Zip code is required';
      if (!formData.country.trim()) return 'Country is required';
    } else if (selectedMethod === 'upi') {
      if (!formData.upiId.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)) return 'Valid UPI ID is required (e.g., username@bankname)';
    } else if (selectedMethod === 'wallet') {
      if (!formData.walletType) return 'Please select a mobile wallet';
      if (!formData.walletNumber.trim()) return 'Wallet number/ID is required';
    } else if (selectedMethod === 'netbanking') {
      if (!formData.bankName) return 'Please select a bank';
      if (!formData.netbankingUsername.trim()) return 'Net banking username is required';
    } else if (selectedMethod === 'voucher') {
      if (!formData.giftVoucherCode.trim()) return 'Gift voucher code is required';
    } else if (selectedMethod === 'points') {
      if (!formData.redeemPoints || formData.redeemPoints <= 0) return 'Please enter points to redeem';
    }

    return null;
  };

  const handleApplyVoucher = () => {
    const code = formData.giftVoucherCode.trim().toUpperCase();
    
    if (!code) {
      setAppliedVoucher({
        code: '',
        discount: 0,
        message: 'Please enter a voucher code'
      });
      return;
    }

    // Simulated voucher database - real apps would validate with backend
    const voucherDatabase = {
      'SAVE10': 100,      // ₹100 discount
      'SAVE20': 200,      // ₹200 discount
      'SAVE50': 500,      // ₹500 discount
      'WELC100': 100,     // Welcome voucher ₹100
      'PROMO25': 250      // Promo ₹250 discount
    };

    if (voucherDatabase[code]) {
      const voucherValue = parseInt(voucherDatabase[code]);
      const totalPrice = parseInt(booking.totalPrice) || 0;
      
      // Ensure discount doesn't exceed total price
      const actualDiscount = Math.min(voucherValue, totalPrice);
      const finalAmount = Math.max(0, totalPrice - actualDiscount);
      
      setAppliedVoucher({
        code: code,
        discount: actualDiscount,
        finalAmount: finalAmount,
        message: `Voucher applied! ₹${actualDiscount} discount`
      });
    } else {
      setAppliedVoucher({
        code: '',
        discount: 0,
        finalAmount: 0,
        message: 'Invalid voucher code'
      });
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher({
      code: '',
      discount: 0,
      finalAmount: 0,
      message: ''
    });
    setFormData({ ...formData, giftVoucherCode: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would call the payment API here
      // await paymentService.processPayment(booking._id, ...);

      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings', { state: { paymentSuccess: true } });
      }, 2000);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!booking) {
    return (
      <div className="payment-container">
        <div className="payment-wrapper" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Loading Payment Details...</h2>
          <p>Please wait while we load your booking information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        {/* Order Summary */}
        <div className="payment-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span>Event:</span>
              <strong>{booking.event?.title}</strong>
            </div>
            <div className="summary-item">
              <span>Date:</span>
              <strong>{new Date(booking.event?.date).toLocaleDateString()}</strong>
            </div>
            <div className="summary-item">
              <span>Tickets:</span>
              <strong>{booking.numberOfTickets} x {formatPrice(booking.event?.price)}</strong>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total Amount:</span>
              <strong className="amount">{formatPrice(booking.totalPrice)}</strong>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-form-container">
          <h2>Payment Details</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Payment successful! Redirecting...</div>}

          {/* Payment Method Selection */}
          <div className="payment-methods-section">
            <h3>Select Payment Method</h3>
            <div className="payment-methods-grid">
              <div 
                className={`payment-method-option ${selectedMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('upi')}
              >
                <div className="method-icon">📱</div>
                <div className="method-name">UPI</div>
              </div>

              <div 
                className={`payment-method-option ${selectedMethod === 'card' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <div className="method-icon">💳</div>
                <div className="method-name">Debit/Credit Card</div>
              </div>

              <div 
                className={`payment-method-option ${selectedMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('wallet')}
              >
                <div className="method-icon">📲</div>
                <div className="method-name">Mobile Wallets</div>
              </div>

              <div 
                className={`payment-method-option ${selectedMethod === 'voucher' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('voucher')}
              >
                <div className="method-icon">🎁</div>
                <div className="method-name">Gift Voucher</div>
              </div>

              <div 
                className={`payment-method-option ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('netbanking')}
              >
                <div className="method-icon">🏦</div>
                <div className="method-name">Net Banking</div>
              </div>

              <div 
                className={`payment-method-option ${selectedMethod === 'payLater' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('payLater')}
              >
                <div className="method-icon">💰</div>
                <div className="method-name">Pay Later</div>
              </div>

              <div 
                className={`payment-method-option ${selectedMethod === 'points' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('points')}
              >
                <div className="method-icon">⭐</div>
                <div className="method-name">Redeem Points</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Section - Common for all methods */}
            <div className="form-section">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  disabled={isProcessing}
                  required
                />
              </div>
            </div>

            {/* UPI Payment */}
            {selectedMethod === 'upi' && (
              <div className="form-section">
                <h3>UPI Payment</h3>
                <div className="form-group">
                  <label>UPI ID *</label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="username@bankname"
                    disabled={isProcessing}
                    required
                  />
                  <small>Example: john@okhdfcbank, jane@ybl</small>
                </div>
              </div>
            )}

            {/* Card Payment */}
            {selectedMethod === 'card' && (
              <>
                <div className="form-section">
                  <h3>Card Information</h3>
                  
                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Card Number *</label>
                    <div className="card-input-wrapper">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        disabled={isProcessing}
                        required
                      />
                      <div className="card-icons">
                        <span className="card-type">VISA</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        disabled={isProcessing}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        disabled={isProcessing}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Billing Address</h3>

                  <div className="form-group">
                    <label>Billing Address *</label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        disabled={isProcessing}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Zip Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        disabled={isProcessing}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mobile Wallet Payment */}
            {selectedMethod === 'wallet' && (
              <div className="form-section">
                <h3>Mobile Wallet Payment</h3>
                <div className="form-group">
                  <label>Select Wallet Provider *</label>
                  <select
                    name="walletType"
                    value={formData.walletType}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    required
                  >
                    <option value="">-- Select a wallet --</option>
                    <option value="paytm">Paytm</option>
                    <option value="googlepay">Google Pay</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="applepay">Apple Pay</option>
                    <option value="amazonpay">Amazon Pay</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Wallet Account Number *</label>
                  <input
                    type="text"
                    name="walletNumber"
                    value={formData.walletNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your wallet account number"
                    disabled={isProcessing}
                    required
                  />
                </div>
              </div>
            )}

            {/* Net Banking Payment */}
            {selectedMethod === 'netbanking' && (
              <div className="form-section">
                <h3>Net Banking Payment</h3>
                <div className="form-group">
                  <label>Select Your Bank *</label>
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    required
                  >
                    <option value="">-- Select a bank --</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Bank</option>
                    <option value="yesbank">Yes Bank</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Net Banking Username *</label>
                  <input
                    type="text"
                    name="netbankingUsername"
                    value={formData.netbankingUsername}
                    onChange={handleInputChange}
                    placeholder="Your net banking username"
                    disabled={isProcessing}
                    required
                  />
                </div>
              </div>
            )}

            {/* Gift Voucher */}
            {selectedMethod === 'voucher' && (
              <div className="form-section">
                <h3>Gift Voucher</h3>
                {appliedVoucher.code ? (
                  <div className="voucher-applied">
                    <div className="voucher-success">
                      <span className="check-mark">✓</span>
                      <div className="voucher-details">
                        <p className="voucher-code">Voucher: <strong>{appliedVoucher.code}</strong></p>
                        <p className="voucher-message success-message">{appliedVoucher.message}</p>
                      </div>
                    </div>
                    <div className="voucher-breakdown">
                      <div className="breakdown-item">
                        <span>Original Price:</span>
                        <span>{formatPrice(parseInt(booking.totalPrice))}</span>
                      </div>
                      <div className="breakdown-item discount">
                        <span>Discount:</span>
                        <span>-{formatPrice(appliedVoucher.discount)}</span>
                      </div>
                      <div className="breakdown-item total">
                        <span>Final Amount:</span>
                        <span className="final-amount">{formatPrice(appliedVoucher.finalAmount)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleRemoveVoucher}
                      disabled={isProcessing}
                    >
                      Remove Voucher
                    </button>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Gift Voucher Code *</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="giftVoucherCode"
                        value={formData.giftVoucherCode}
                        onChange={handleInputChange}
                        placeholder="Enter your gift voucher code"
                        disabled={isProcessing}
                        maxLength="20"
                      />
                      <button
                        type="button"
                        className="btn btn-primary apply-btn"
                        onClick={handleApplyVoucher}
                        disabled={isProcessing || !formData.giftVoucherCode.trim()}
                      >
                        Apply
                      </button>
                    </div>
                    {appliedVoucher.message && (
                      <small className={`form-hint ${appliedVoucher.discount > 0 ? 'success-message' : 'error-message'}`}>
                        {appliedVoucher.message}
                      </small>
                    )}
                    <small className="form-hint">
                      Try codes like: SAVE10, SAVE20, SAVE50, WELC100, PROMO25
                    </small>
                  </div>
                )}
              </div>
            )}

            {/* Pay Later */}
            {selectedMethod === 'payLater' && (
              <div className="form-section">
                <h3>Pay Later</h3>
                <div className="pay-later-info">
                  <p>💳 Get instant credit without a credit card</p>
                  <p>📅 Flexible payment options available</p>
                  <p>✅ Zero interest for 30 days</p>
                  <p className="terms">By continuing, you authorize us to debit your account as per terms and conditions.</p>
                </div>
              </div>
            )}

            {/* Redeem Points */}
            {selectedMethod === 'points' && (
              <div className="form-section">
                <h3>Redeem Loyalty Points</h3>
                <div className="form-group">
                  <label>Available Points: <strong>5,000</strong></label>
                  <input
                    type="number"
                    name="redeemPoints"
                    value={formData.redeemPoints}
                    onChange={handleInputChange}
                    placeholder="Enter points to redeem"
                    disabled={isProcessing}
                    min="1"
                    max="5000"
                    required
                  />
                  <small>1 Point = Rs. 1 | Amount to be paid: {formatPrice(Math.max(0, parseInt(booking.totalPrice) - parseInt(formData.redeemPoints || 0)))}</small>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="security-info">
              <span className="lock-icon">🔒</span>
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="payment-button"
              disabled={isProcessing || success || (selectedMethod === 'voucher' && !appliedVoucher.code)}
            >
              {isProcessing ? 'Processing...' : success ? 'Payment Successful' : 
                selectedMethod === 'voucher' 
                  ? `Pay ${formatPrice(appliedVoucher.finalAmount)}` 
                  : selectedMethod === 'points'
                    ? `Pay ${formatPrice(Math.max(0, parseInt(booking.totalPrice) - parseInt(formData.redeemPoints || 0)))}`
                    : `Pay ${formatPrice(booking.totalPrice)}`
              }
            </button>

            <div className="payment-footer">
              <p>By clicking Pay, you agree to our Terms of Service</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
