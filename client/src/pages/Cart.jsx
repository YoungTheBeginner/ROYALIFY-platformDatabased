import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import products from '../data/products';
import { formatCurrency } from '../utils/currency';
import './Cart.css';

export default function CartPage() {
  const { items, removeItem, updateQty, total, clear } = useContext(CartContext);
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  const activeCurrency = items[0]?.currency || 'USD';
  const TAX_RATE = 0.1;
  const subtotal = total;
  const taxAmount = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + taxAmount;

  useEffect(() => {
    setAnimateItems(true);
  }, []);

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="cart-container page-enter">
        <div className="cart-empty" style={{animation: 'fadeUp 0.8s ease-out'}}>
          <div className="empty-illustration" style={{animation: 'scaleIn 0.6s ease-out'}}>
            <img src="/images/icon.png" alt="Empty Cart" className="empty-icon-img" />
          </div>
          <div className="empty-content" style={{animation: 'fadeUp 0.8s ease-out 0.2s both'}}>
            <h1 className="empty-title">Your Cart is Empty</h1>
            <p className="empty-subtitle">
              Discover magnificent artifacts awaiting in our exclusive collection
            </p>

            <div className="empty-features">
              <div className="feature" style={{animation: 'fadeUp 0.6s ease-out 0.3s both'}}>
                <span className="feature-emoji">✦</span>
                <p>Hand-curated luxury relics</p>
              </div>
              <div className="feature" style={{animation: 'fadeUp 0.6s ease-out 0.4s both'}}>
                <span className="feature-emoji">◆</span>
                <p>Limited edition artifacts</p>
              </div>
              <div className="feature" style={{animation: 'fadeUp 0.6s ease-out 0.5s both'}}>
                <span className="feature-emoji">◇</span>
                <p>Secured & authenticated</p>
              </div>
            </div>

            <Link to="/shop" className="empty-cta" style={{animation: 'fadeUp 0.6s ease-out 0.6s both'}}>
              Explore Our Collection
            </Link>

            <p className="empty-hint" style={{animation: 'fadeUp 0.6s ease-out 0.7s both'}}>
              Every artifact holds a story. Find yours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate savings/discounts if applicable
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <div className="header-content">
          <h1 className="cart-title">Your Royal Collection</h1>
          <p className="cart-subtitle">
            {itemCount} {itemCount === 1 ? 'artifact' : 'artifacts'} selected for your personal treasury
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="cart-content">
        {/* Items List */}
        <div className="cart-items-section">
          <div className="items-header">
            <h2 className="items-title">Order Summary</h2>
            <button
              className="clear-link"
              onClick={() => setShowClearConfirm(!showClearConfirm)}
            >
              Clear Cart
            </button>
          </div>

          {/* Clear Confirmation */}
          {showClearConfirm && (
            <div className="clear-confirmation glass">
              <p>Are you sure? This will remove all items from your cart.</p>
              <div className="confirm-buttons">
                <button
                  className="btn-confirm confirm"
                  onClick={() => {
                    clear();
                    setShowClearConfirm(false);
                  }}
                >
                  Yes, Clear
                </button>
                <button
                  className="btn-confirm cancel"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item glass">
                <div className="item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">{formatCurrency(item.price, { currency: item.currency || 'USD' })}</p>
                </div>

                <div className="item-controls">
                  <div className="quantity-control">
                    <button
                      onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.id, Math.max(1, Number(e.target.value)))
                      }
                      className="qty-input"
                    />
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="item-subtotal">
                    {formatCurrency(item.price * item.qty, { currency: item.currency || 'USD' })}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="cart-summary-section">
          <div className="summary-card glass">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">
                  {formatCurrency(subtotal, { currency: activeCurrency })}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value promo">Free</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Tax</span>
                <span className="summary-value">
                  {formatCurrency(taxAmount, { currency: activeCurrency })}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value total-value">
                  {formatCurrency(grandTotal, { currency: activeCurrency })}
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="benefits">
              <div className="benefit-item">
                <span className="benefit-icon">🔒</span>
                <span className="benefit-text">Secure Checkout</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📦</span>
                <span className="benefit-text">Fast Delivery</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">♻️</span>
                <span className="benefit-text">Easy Returns</span>
              </div>
            </div>

            <button
              className="btn-checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <Link to="/shop" className="btn-continue">
              Continue Shopping
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="trust-badge glass">
            <p className="trust-text">
              Join 1,000+ satisfied collectors who've found their perfect artifacts
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="cart-recommendations">
        <h2 className="rec-title">Complement Your Selection</h2>
        <p className="rec-subtitle">Complete your royal collection with these artifacts</p>
        
        <div className="rec-grid">
          {products
            .filter((p) => !items.find((i) => i.id === p.id) && !p.comingSoon)
            .slice(0, 3)
            .map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="rec-card glass"
              >
                <div className="rec-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                  />
                </div>
                <h3 className="rec-name">{product.name}</h3>
                <p className="rec-price">{product.priceDisplay}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
