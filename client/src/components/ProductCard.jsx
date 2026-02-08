import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/currency';

export default function ProductCard({ product }){
  const { addItem } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Generate star display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('⯨');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  const ratingValue = typeof product.rating === 'number' ? product.rating : 0;
  const displayPrice = product.priceDisplay || formatCurrency(product.price || 0, { currency: product.currency || 'USD' });
  const description = product.descShort || product.desc || '';

  return (
    <div className="product-card glass card-interactive">
      <Link to={`/product/${product.id}`} style={{color:'inherit', display:'block'}}>
        <div className="product-card-image" style={{position:'relative'}}>
          <img src={product.image} alt={product.name} />
          {product.comingSoon && <div className="badge-cta badge-coming">COMING SOON</div>}
          {product.badge && <div className="badge-promo">{product.badge}</div>}
          <button 
            className="wishlist-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isInWishlist(product.id)) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist(product);
              }
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isInWishlist(product.id) ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.3)',
              border: `2px solid ${isInWishlist(product.id) ? 'rgba(212, 175, 55, 0.6)' : 'rgba(255, 255, 255, 0.2)'}`,
              color: isInWishlist(product.id) ? '#d4af37' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
            title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist(product.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </Link>

      <div className="product-card-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{description}</p>
        
        {/* Rating Display */}
        {ratingValue > 0 && (
          <div style={{marginTop: 'var(--spacing-xs)', fontSize: '14px', color: '#d4af37', letterSpacing: '1px'}}>
            {renderStars(ratingValue)} 
            <span style={{color: 'rgba(245,245,245,0.7)', marginLeft: '6px', fontSize: '12px', fontWeight: 500}}>
              {ratingValue.toFixed(1)} ({product.reviews || 0})
            </span>
          </div>
        )}
        
        {/* Show placeholder if no reviews yet */}
        {(ratingValue === 0) && (
          <div style={{marginTop: 'var(--spacing-xs)', fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic'}}>
            No reviews yet
          </div>
        )}
        
        <div style={{marginTop:'var(--spacing-sm)'}}>
          <div className="product-price">{displayPrice}</div>
        </div>
      </div>
    </div>
  );
}
