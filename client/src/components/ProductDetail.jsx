import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import products from '../data/products';
import { CartContext } from '../context/CartContext';
import API from '../api';
import { formatCurrency } from '../utils/currency';

const hashSeed = (value) => {
  if (!value) return 0;
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getLuxuryPrice = (record) => {
  const seedSource = record?.id || record?.name || 'royalify';
  const seed = hashSeed(String(seedSource));
  const normalized = (seed % 1000) / 1000;
  return 1000000 + Math.round(normalized * 900000);
};

export default function ProductDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(() => products.find(p => p.id === id) || null);
  const { addItem } = useContext(CartContext);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 5, title: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(!product);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  function adaptProduct(record) {
    if (!record) return null;
    const currency = record.currency || 'USD';
    const price = getLuxuryPrice(record);
    const description = record.descLong || record.desc || record.descShort || '';

    return {
      ...record,
      price,
      currency,
      descShort: record.descShort || (description ? `${description.slice(0, 180)}${description.length > 180 ? '...' : ''}` : ''),
      descLong: description || '',
      priceDisplay: formatCurrency(price, { currency })
    };
  }

  async function fetchProduct() {
    setLoadingProduct(true);
    setProductError('');
    try {
      const response = await API.get(`/products/${id}`);
      if (response.data) {
        const normalized = adaptProduct(response.data);
        setProduct(normalized || null);
      } else {
        const fallback = products.find(p => p.id === id);
        setProduct(adaptProduct(fallback));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      const fallback = products.find(p => p.id === id);
      if (fallback) {
        setProduct(adaptProduct(fallback));
        setProductError('Showing showcase details while live data loads.');
      } else {
        setProduct(null);
        setProductError('This product is not available.');
      }
    } finally {
      setLoadingProduct(false);
    }
  }

  async function fetchReviews() {
    try {
      const response = await API.get(`/reviews/product/${id}`);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await API.post('/reviews', {
        productId: id,
        ...userReview
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      await fetchReviews();
      
      // Show success message
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '★' : '☆');
    }
    return stars.join('');
  };

  if (loadingProduct) {
    return (
      <div className="container"><p>Preparing product details...</p></div>
    );
  }

  if (!product) {
    return (
      <div className="container"><p>This artifact is no longer available.</p></div>
    );
  }

  return (
    <div className="container detail">
      {productError && (
        <div className="catalog-alert" role="status" style={{marginBottom: '16px'}}>
          {productError}
        </div>
      )}
      <Link to="/shop" className="detail-back">
        <span className="back-arrow">←</span>
        <span className="back-text">Back to Collection</span>
      </Link>

      <div className="detail-header">
        <h1 className="detail-title">{product.name}</h1>
        <p className="detail-subtitle">Premium Collection</p>
      </div>

      <div className="detail-grid">
        <div className="detail-image-container glass">
          <div className="detail-image-wrapper">
            <img src={product.image} alt={product.name} className="detail-image-main" />
            <div className="detail-image-glow"></div>
          </div>
          {product.badge && <span className="detail-badge-promo">{product.badge}</span>}
          {product.comingSoon && <span className="detail-badge-coming">COMING SOON</span>}
        </div>

        <p className="detail-description">{product.descLong}</p>

        <div className="detail-info-premium">
          <div className="detail-price-section">
            <div className="price-label">Investment Price</div>
            <div className="price-premium">{product.priceDisplay}</div>
            <div className="price-accent">Exclusive Access</div>
          </div>

          <div className="detail-cta-section">
            {!product.comingSoon ? (
              <button 
                className="detail-btn-primary" 
                onClick={() => { addItem(product,1); navigate('/cart'); }}
              >
                <span className="btn-text-main">BUY YOUR MASTERPIECE</span>
                <span className="btn-accent">Exclusive Access • Limited Availability</span>
              </button>
            ) : (
              <button className="detail-btn-coming" disabled>
                <span className="btn-icon">⏳</span>
                <span className="btn-text">Coming Soon</span>
              </button>
            )}
          </div>

          <div className="detail-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Premium Quality</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Free Shipping</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="detail-reviews-section">
        <div className="reviews-header">
          <h3 className="reviews-title">Customer Reviews</h3>
          <span className="reviews-count">{reviews.length} Reviews</span>
        </div>

        {/* Review Form */}
        {user && (
          <div className="review-form-container">
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="review-form-toggle"
            >
              <span className="form-icon">{showReviewForm ? '✕' : '✎'}</span>
              <span className="form-label">{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
            </button>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="review-form-premium">
                <div className="form-group">
                  <label className="form-label-text">Your Rating</label>
                  <div className="rating-stars-input">
                    {[1,2,3,4,5].map(star => (
                      <span 
                        key={star}
                        onClick={() => setUserReview({...userReview, rating: star})}
                        className={`star ${star <= userReview.rating ? 'active' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label-text">Review Title</label>
                  <input 
                    type="text"
                    value={userReview.title}
                    onChange={(e) => setUserReview({...userReview, title: e.target.value})}
                    placeholder="Share your headline"
                    required
                    className="form-input-premium"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label-text">Your Comment</label>
                  <textarea 
                    value={userReview.comment}
                    onChange={(e) => setUserReview({...userReview, comment: e.target.value})}
                    placeholder="Tell us more about your experience"
                    rows={4}
                    className="form-textarea-premium"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`review-submit-btn ${loading ? 'loading' : ''}`}
                >
                  {loading ? '⌛ Submitting...' : '✓ Submit Review'}
                </button>
              </form>
            )}
          </div>
        )}

        {!user && (
          <div className="review-login-prompt">
            <p className="prompt-text">
              <Link to="/login" className="prompt-link">Sign in</Link> to share your experience
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-list-container">
          {reviews.length === 0 ? (
            <p className="reviews-empty">No reviews yet. Be the first to share your thoughts!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-card-premium">
                <div className="review-header-card">
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <small className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </small>
                </div>
                <h4 className="review-title-text">{review.title}</h4>
                {review.comment && (
                  <p className="review-comment-text">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
