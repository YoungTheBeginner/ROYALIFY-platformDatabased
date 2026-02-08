import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api';
import './Checkout.css';
import { formatCurrency } from '../utils/currency';

export default function Checkout(){
  const { items, total, clear } = useContext(CartContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({name:'',email:'',address:''});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmStep, setConfirmStep] = useState(1);

  function handleSubmit(e){
    e.preventDefault();
    if (!form.name || !form.email || !form.address) return alert('Please fill all fields');
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to complete purchase');
      navigate('/login');
      return;
    }

    setShowConfirmModal(true);
    setConfirmStep(1);
  }

  function advanceConfirmStep(){
    setConfirmStep(2);
  }

  function cancelConfirm(){
    setShowConfirmModal(false);
    setConfirmStep(1);
  }

  async function finalizeCheckout(){
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please login again');
        navigate('/login');
        return;
      }

      // Create order via API
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          quantity: item.qty,
          currency: item.currency || 'USD'
        })),
        customer: form,
        total,
        currency: items[0]?.currency || 'USD'
      };

      const response = await API.post('/orders', orderData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.order) {
        localStorage.setItem('lastOrder', JSON.stringify(response.data.order));
        clear();
        navigate('/thankyou');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Error creating order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setConfirmStep(1);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <h2 className="checkout-empty-title">Your cart is empty</h2>
          <p className="checkout-empty-text">Add items to proceed to checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="container checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Secure Checkout</h1>
          <p className="checkout-subtitle">Complete your legendary purchase</p>
        </div>

        <div className="checkout-grid">
          {/* Form Section */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form glass">
              <div className="form-step">
                {/* Header with Accent Line */}
                <div className="shipping-header">
                  <div className="shipping-header-accent"></div>
                  <div className="shipping-header-content">
                    <h3 className="form-step-title">Shipping Information</h3>
                    <p className="form-step-subtitle">Deliver to your royal residence</p>
                  </div>
                </div>

                {/* Contact Details Section */}
                <div className="form-section">
                  <div className="section-label">
                    <h4>Contact Details</h4>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text"
                        value={form.name} 
                        onChange={e=>setForm({...form,name:e.target.value})} 
                        className="form-input"
                        placeholder="Enter your full name"
                        required
                      />
                      <div className="input-border-accent"></div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email"
                        value={form.email} 
                        onChange={e=>setForm({...form,email:e.target.value})} 
                        className="form-input"
                        placeholder="your@email.com"
                        required
                      />
                      <div className="input-border-accent"></div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="form-section">
                  <div className="section-label">
                    <h4>Delivery Address</h4>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Complete Address</label>
                    <textarea 
                      value={form.address} 
                      onChange={e=>setForm({...form,address:e.target.value})} 
                      className="form-input form-textarea"
                      placeholder="Street address, apartment/suite, city, state, postal code"
                      rows={5}
                      required
                    />
                    <div className="input-border-accent"></div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="form-security-badge">
                  <span className="security-text">Your information is encrypted and secure</span>
                </div>

                <button 
                  type="submit" 
                  className="btn-checkout"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner"></span> Processing...</>
                  ) : (
                    <>Complete Purchase</>
                  )}
                </button>

                {/* Purchase Confirmation Modal */}
                {showConfirmModal && (
                  <div className="confirm-overlay">
                    <div className="confirm-modal glass">
                      <div className="confirm-header">
                        <div className="confirm-header-accent"></div>
                        <div className="confirm-header-content">
                          <h3 className="confirm-title">Confirm Your Purchase</h3>
                          <p className="confirm-subtitle">Royal transaction verification</p>
                        </div>
                      </div>

                      <div className="confirm-progress">
                        <div className={`progress-dot ${confirmStep >= 1 ? 'is-active' : ''}`}></div>
                        <div className={`progress-dot ${confirmStep >= 2 ? 'is-active' : ''}`}></div>
                      </div>

                      {confirmStep === 1 && (
                        <div className="confirm-content">
                          <p className="confirm-message">Review your purchase details carefully before proceeding</p>
                          <div className="confirm-order-summary">
                            <div className="summary-line">
                              <span>Items:</span>
                              <strong>{items.length}</strong>
                            </div>
                            <div className="summary-line">
                              <span>Total Amount:</span>
                              <strong>{formatCurrency(total, { currency: items[0]?.currency || 'USD' })}</strong>
                            </div>
                            <div className="summary-line">
                              <span>Shipping:</span>
                              <strong>FREE</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {confirmStep === 2 && (
                        <div className="confirm-content">
                          <p className="confirm-message">Final authorization required to complete this transaction</p>
                          <div className="confirm-notice">
                            <p>Your order will be processed immediately upon confirmation. All charges are final.</p>
                          </div>
                        </div>
                      )}

                      <div className="confirm-buttons">
                        <button 
                          type="button"
                          className="confirm-btn secondary"
                          onClick={cancelConfirm}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button"
                          className="confirm-btn primary"
                          onClick={() => {
                            console.log('Button clicked, confirmStep:', confirmStep);
                            if (confirmStep === 1) {
                              console.log('Advancing to step 2');
                              advanceConfirmStep();
                            } else {
                              console.log('Finalizing checkout');
                              finalizeCheckout();
                            }
                          }}
                          disabled={loading}
                        >
                          {loading ? (
                            <><span className="spinner"></span> Processing...</>
                          ) : (
                            confirmStep === 1 ? 'Continue' : 'Confirm Purchase'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="checkout-summary-section">
            <div className="checkout-summary glass">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-items">
                {items.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <div className="summary-item-info">
                      <p className="summary-item-name">{item.name}</p>
                      <p className="summary-item-qty">Qty: {item.qty}</p>
                    </div>
                    <p className="summary-item-price">{formatCurrency(item.price * item.qty, { currency: item.currency || 'USD' })}</p>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(total, { currency: items[0]?.currency || 'USD' })}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">{formatCurrency(total, { currency: items[0]?.currency || 'USD' })}</span>
              </div>

              <div className="summary-badge">
                <span className="summary-badge-content">
                  <img
                    src="/images/shield-icon.png"
                    alt="Secure payment"
                    className="summary-badge-icon"
                  />
                  Secure Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
