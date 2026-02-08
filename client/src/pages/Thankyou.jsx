import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Thankyou.css';
import { formatCurrency } from '../utils/currency';

export default function ThankYou() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (!storedOrder) {
      navigate('/');
      return;
    }
    setOrder(JSON.parse(storedOrder));
  }, [navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!order) return null;

  const orderItems = Array.isArray(order.items)
    ? order.items
    : (typeof order.items === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(order.items);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : []);

  const activeCurrency = order.currency || orderItems[0]?.currency || 'USD';

  return (
    <div className="thankyou-container">
      {/* Animated Background */}
      <div className="thankyou-background">
        <div className="confetti confetti-1"></div>
        <div className="confetti confetti-2"></div>
        <div className="confetti confetti-3"></div>
        <div className="confetti confetti-4"></div>
        <div className="confetti confetti-5"></div>
      </div>

      {/* Main Content */}
      <div className="thankyou-content">
        {/* Success Icon */}
        <div className="success-icon fade-in">
          <div className="checkmark">✓</div>
        </div>

        {/* Main Message */}
        <div className="message-section fade-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="thankyou-title">Your Royal Order Is Confirmed</h1>
          <p className="thankyou-subtitle">
            Thank you for choosing ROYALIFY. Your magnificent artifacts have been secured.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="order-card glass fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="order-section">
            <h3 className="section-heading">Order Details</h3>
            
            <div className="order-detail-item">
              <span className="detail-label">Order ID</span>
              <span className="detail-value">{order.id || '—'}</span>
            </div>

            <div className="order-detail-item">
              <span className="detail-label">Confirmation Email</span>
              <span className="detail-value email-value">{order.customer?.email || '—'}</span>
            </div>

            <div className="order-detail-item">
              <span className="detail-label">Order Date</span>
              <span className="detail-value">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            <div className="order-divider"></div>

            <div className="order-detail-item">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value total-amount">{formatCurrency(order.total, { currency: activeCurrency })}</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="items-section">
            <h3 className="section-heading">Order Summary</h3>
            <div className="items-list">
              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.qty}</span>
                    <span className="item-price">{formatCurrency(item.price * item.qty, { currency: item.currency || activeCurrency })}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'rgba(232,232,232,0.6)' }}>No items in order</p>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="shipping-section">
            <h3 className="section-heading">Shipping To</h3>
            <div className="shipping-info">
              <p className="shipping-name">{order.customer?.name || 'Valued Customer'}</p>
              <p className="shipping-address">{order.customer?.address || 'Address on file'}</p>
            </div>
            <div className="shipping-status">
              <span className="status-badge">Processing</span>
              <span className="status-info">We're preparing your artifacts for shipment</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps fade-in" style={{ animationDelay: '0.9s' }}>
          <h3 className="steps-title">What Happens Next?</h3>
          <div className="steps-list">
            <div className="step">
              <div className="step-icon">1</div>
              <div className="step-content">
                <p className="step-title">Order Confirmation</p>
                <p className="step-desc">Check your email for detailed order information</p>
              </div>
            </div>
            <div className="step-divider"></div>
            <div className="step">
              <div className="step-icon">2</div>
              <div className="step-content">
                <p className="step-title">Verification</p>
                <p className="step-desc">We verify and authenticate your artifacts</p>
              </div>
            </div>
            <div className="step-divider"></div>
            <div className="step">
              <div className="step-icon">3</div>
              <div className="step-content">
                <p className="step-title">Shipment</p>
                <p className="step-desc">Your items ship within 2-3 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons fade-in" style={{ animationDelay: '1.2s' }}>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/" className="btn btn-secondary">
            Return to Home
          </Link>
        </div>

        {/* Auto Redirect Message */}
        <p className="redirect-message">
          Redirecting to shop in <span className="countdown">{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
}
