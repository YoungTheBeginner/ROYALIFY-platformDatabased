import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';
import { formatCurrency } from '../utils/currency';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (product) => {
    addItem(product);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-header">
            <h1 className="page-title">My Collection</h1>
          </div>
          
          <div className="empty-wishlist glass">
            <div className="empty-wishlist-icon">💎</div>
            <h2>Your Collection is Empty</h2>
            <p className="empty-wishlist-subtitle">Discover and save the most exquisite artifacts for your royal collection.</p>
            <Link to="/shop" className="btn-cta-premium">
              Explore the Emporium
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = wishlist.reduce((sum, item) => sum + (item.price || 0), 0);
  const activeCurrency = wishlist[0]?.currency || 'USD';

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div>
            <h1 className="page-title">My Treasured Collection</h1>
            <p className="wishlist-subtitle">{wishlist.length} {wishlist.length === 1 ? 'artifact' : 'artifacts'} saved</p>
          </div>
          {wishlist.length > 0 && (
            <button onClick={clearWishlist} className="btn-clear-wishlist">
              Clear All
            </button>
          )}
        </div>

        <div className="wishlist-content">
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item glass">
                <Link to={`/product/${item.id}`} className="wishlist-item-image">
                  <div className="image-container">
                    <img src={item.image} alt={item.name} />
                    <div className="image-overlay"></div>
                  </div>
                </Link>

                <div className="wishlist-item-content">
                  <Link to={`/product/${item.id}`} className="wishlist-item-name">
                    {item.name}
                  </Link>
                  <p className="wishlist-item-description">{item.descShort}</p>
                  
                  <div className="wishlist-item-footer">
                    <div className="wishlist-item-price">{formatCurrency(item.price, { currency: item.currency || 'USD' })}</div>
                    <div className="wishlist-item-actions">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="btn-move-to-cart"
                        title="Add to cart"
                      >
                        🛒 Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="btn-remove-wishlist"
                        title="Remove from collection"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="wishlist-summary glass">
            <div className="summary-header">
              <h2>Collection Summary</h2>
            </div>
            
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Items</span>
                <span className="stat-value">{wishlist.length}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-label">Estimated Value</span>
                <span className="stat-value">{formatCurrency(totalValue, { currency: activeCurrency })}</span>
              </div>
            </div>

            <div className="summary-actions">
              <button
                onClick={() => {
                  wishlist.forEach(item => addItem(item));
                  clearWishlist();
                }}
                className="btn-move-all-cart"
              >
                Move All to Cart
              </button>
              <Link to="/shop" className="btn-continue-shopping">
                Continue Exploring
              </Link>
            </div>

            <p className="summary-note">
              ✨ Save your favorite artifacts and access them anytime. Your collection is secure and private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
