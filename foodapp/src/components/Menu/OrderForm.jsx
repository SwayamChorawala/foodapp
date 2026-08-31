import React, { useState, useEffect } from 'react';
import './OrderForm.css';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { removeitem } from '../../redux/CreateSlice';
import { LuLogIn } from 'react-icons/lu';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const OrderForm = () => {
  const items = useSelector(state => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem('user');
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const [formData, setFormData] = useState({
    fullName: currentUser?.username || '',
    phoneNumber: '',
    address: '',
    paymentMethod: 'COD',
    orderNotes: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [orderSnapshot, setOrderSnapshot] = useState({ items: [], total: 0 });

  const subtotal = items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const deliveryFee = subtotal > 0 ? 20 : 0;
  const taxes = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + taxes;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[- ]/g, ''))) {
      tempErrors.phoneNumber = "Phone Number must be 10 digits";
    }
    if (!formData.address.trim()) tempErrors.address = "Address is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setApiError('Please login');
      navigate('/login', { state: { returnUrl: '/orderform', message: 'Please login' } });
      return;
    }

    if (!validate()) {
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const orderPayload = {
        title: items
          .map((item) => item.title || item.name || 'Food Item')
          .join(', '),
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes,
        items: items.map((item) => ({
          title: item.title || item.name || 'Food Item',
          price: Number(item.price),
          quantity: Number(item.quantity || 1),
        })),
        totalPrice: Number(total.toFixed(2)),
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to place your order right now.');
      }

      setOrderSnapshot({
        items: orderPayload.items,
        total: orderPayload.totalPrice,
      });
      setOrderId(data.orderId);

      items.forEach((item) => {
        dispatch(removeitem(item.id));
      });
    } catch (error) {
      setApiError(error.message || 'Something went wrong while placing the order.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Unauthenticated User Guard Screen ────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="orderform-page-wrapper">
        <Navbar />
        <div className="order-login-guard-wrapper">
          <div className="order-login-guard-card">
            <div className="guard-icon">🔒</div>
            <h2>Login Required to Order Food</h2>
            <p className="guard-subtitle">
              Aapko order place karne ke liye pehle login karna padega.
              <br />
              Please log in or create an account to proceed with your order.
            </p>
            <div className="guard-actions">
              <button
                className="place-order-btn"
                onClick={() =>
                  navigate('/login', {
                    state: {
                      returnUrl: '/orderform',
                      message: 'Please login',
                    },
                  })
                }
              >
                <LuLogIn style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Go to Login / Register
              </button>
              <button
                style={{
                  marginTop: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-secondary, #ccc)',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                onClick={() => navigate('/menu')}
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Order Success Screen ───────────────────────────────────────────────────
  if (orderId) {
    return (
      <div className="orderform-page-wrapper">
        <Navbar />
        <div className="order-success-wrapper">
          <div className="order-success-card">
            <div className="success-icon">✅</div>
            <h2>Order Placed Successfully!</h2>
            <p className="success-subtitle">Your food is being prepared with love 🍽️</p>
            <div className="success-order-id">
              <span>Order Number:</span>
              <code># {orderId}</code>
            </div>
            <div className="success-summary">
              <h4>Items Ordered:</h4>
              <ul>
                {orderSnapshot.items.map((item, i) => (
                  <li key={i}>
                    {item.title || item.name} × {item.quantity || 1} — ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="success-total">Total Paid: ₹{orderSnapshot.total.toFixed(2)}</div>
            </div>
            <button className="place-order-btn" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orderform-page-wrapper">
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Checkout Details</h2>
            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error-input' : ''}
                  placeholder="John Doe"
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? 'error-input' : ''}
                  placeholder="1234567890"
                />
                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error-input' : ''}
                  placeholder="Enter your full delivery address..."
                  rows="3"
                ></textarea>
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="orderNotes">Order Notes (Optional)</label>
                <textarea
                  id="orderNotes"
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="Any special instructions for your order?"
                  rows="2"
                ></textarea>
              </div>

              <div className="form-group payment-group">
                <label>Payment Method</label>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                  />
                  <label htmlFor="cod" className="radio-label">Cash on Delivery (COD)</label>
                </div>
              </div>

              {apiError && (
                <div className="api-error-banner">
                  ⚠️ {apiError}
                </div>
              )}

              <button type="submit" className="place-order-btn" disabled={isLoading}>
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="checkout-summary-section">
            <h2>Order Summary</h2>
            <div className="summary-items-list">
              {items.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                items.map((item, index) => (
                  <div key={index} className="summary-item-row">
                    <div className="item-info">
                      <span className="item-name">{item.title || item.name || 'Food Item'}</span>
                      <span className="item-qty">Qty: {item.quantity || 1}</span>
                    </div>
                    <span className="item-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <hr className="summary-divider" />

            <div className="summary-pricing">
              <div className="pricing-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="pricing-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="pricing-row">
                <span>Taxes (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="pricing-row total-row">
                <span>Total Price</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
