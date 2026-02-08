import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import '../styles/Profile.css';
import { formatCurrency } from '../utils/currency';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutStep, setLogoutStep] = useState(1);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Fetch fresh user data and orders
    fetchUserData();
    fetchOrders();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/orders/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    }
  };

  const handleUpgradePremium = () => {
    setShowConfirmModal(true);
  };

  const confirmUpgrade = async () => {
    setShowConfirmModal(false);
    setUpgrading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await API.post('/auth/upgrade-premium', {
        paymentAmount: 50000
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('userLoggedIn'));
        setShowSuccessModal(true);
        
        // If user is admin, navigate to admin page after 3 seconds
        if (response.data.user.role === 'admin') {
          setTimeout(() => {
            navigate('/admin');
          }, 3000);
        }
      }

      setUpgrading(false);
    } catch (error) {
      setUpgrading(false);
      alert('Failed to upgrade: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    setLogoutStep(1);
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    setLogoutStep(1);
  };

  const finalizeLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userLoggedOut'));
    setShowLogoutModal(false);
    setLogoutStep(1);
    navigate('/login');
  };

  const advanceLogoutStep = () => {
    if (logoutStep === 1) {
      setLogoutStep(2);
      return;
    }
    finalizeLogout();
  };

  if (loading || !user) return <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>Loading...</div>;

  const firstName = user?.name?.split(' ')[0] || 'Collector';
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member';
  const premiumSince = user?.premiumSince ? new Date(user.premiumSince).toLocaleDateString() : null;
  const accountInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'R';

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="container profile-hero-inner">
          <div className="profile-hero-content">
            <span className="profile-hero-eyebrow">Account Atelier</span>
            <h1 className="profile-hero-title">Welcome back, {firstName}.</h1>
            <p className="profile-hero-subtitle">
              Curate your identity, track your orders, and unlock the prestige of Royalify Premium.
            </p>
            <div className="profile-hero-meta">
              <div className="profile-hero-stat">
                <span className="profile-hero-stat-label">Membership</span>
                <span className="profile-hero-stat-value">
                  {user.isPremium ? 'Premium' : 'Standard'}
                </span>
              </div>
              <div className="profile-hero-stat">
                <span className="profile-hero-stat-label">Orders</span>
                <span className="profile-hero-stat-value">{orders.length}</span>
              </div>
              <div className="profile-hero-stat">
                <span className="profile-hero-stat-label">Role</span>
                <span className="profile-hero-stat-value">{roleLabel}</span>
              </div>
            </div>
            <div className="profile-hero-actions">
              <Link to="/" className="profile-btn primary">Explore Collection</Link>
              <a href="#order-history" className="profile-btn ghost">View Orders</a>
            </div>
          </div>
          <div className="profile-hero-panel glass">
            <div className="profile-hero-panel-header">
              <span className="profile-hero-panel-title">Account Overview</span>
              <span className={`profile-hero-badge ${user.isPremium ? 'is-premium' : 'is-standard'}`}>
                {user.isPremium ? 'Premium' : 'Standard'}
              </span>
            </div>
            <div className="profile-hero-panel-grid">
              <div>
                <p className="profile-hero-panel-label">Name</p>
                <p className="profile-hero-panel-value">{user.name}</p>
              </div>
              <div>
                <p className="profile-hero-panel-label">Email</p>
                <p className="profile-hero-panel-value">{user.email}</p>
              </div>
              <div>
                <p className="profile-hero-panel-label">Status</p>
                <p className="profile-hero-panel-value">
                  {user.isPremium ? 'Premium Member' : 'Standard Member'}
                </p>
              </div>
              <div>
                <p className="profile-hero-panel-label">Role</p>
                <p className="profile-hero-panel-value">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="profile-grid">
        {/* Profile Information Section */}
        <div className="profile-section profile-info-card">
          <div className="section-header">
            <h2 className="section-title">
              <span className="profile-title-content">
                <img
                  src="/images/profile-icon.png"
                  alt="Profile"
                  className="profile-icon"
                />
                Profile Information
              </span>
            </h2>
          </div>

          <div className="profile-info-body">
            <div className="profile-identity-block">
              <div className="profile-avatar-ring">{accountInitial}</div>
              <div className="profile-identity-text">
                <span className="profile-name">{user.name}</span>
                <span className="profile-email">{user.email}</span>
                <div className="profile-identity-tags">
                  <span className="profile-tag profile-tag-role">{roleLabel}</span>
                  <span className={`profile-tag ${user.isPremium ? 'profile-tag-premium' : 'profile-tag-standard'}`}>
                    {user.isPremium ? 'Premium Member' : 'Standard Member'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="profile-info-tile">
                <span className="tile-label">Orders Placed</span>
                <span className="tile-value">{orders.length}</span>
              </div>
              <div className="profile-info-tile">
                <span className="tile-label">Membership Tier</span>
                <span className="tile-value">{user.isPremium ? 'Premium' : 'Standard'}</span>
              </div>
              <div className="profile-info-tile">
                <span className="tile-label">Account Role</span>
                <span className="tile-value">{roleLabel}</span>
              </div>
              <div className="profile-info-tile">
                <span className="tile-label">Premium Since</span>
                <span className="tile-value">{premiumSince || '—'}</span>
              </div>
            </div>

            <div className="profile-info-actions">
              <div className={`profile-status-callout ${user.isPremium ? 'is-premium' : 'is-standard'}`}>
                {user.isPremium ? (
                  <>
                    ✨ Premium member{premiumSince ? ` since ${premiumSince}` : ''}
                  </>
                ) : (
                  <>Standard membership — unlock premium to access concierge perks.</>
                )}
              </div>
              <button onClick={handleLogout} className="profile-action-btn">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Premium Upgrade Section */}
        {!user.isPremium && (
          <div className="profile-section glass" style={{borderColor: '#d4af37'}}>
            <div className="section-header">
              <h2 className="section-title">
                <span className="premium-title-content">
                  <img
                    src="/images/premium-icon.png"
                    alt="Premium"
                    className="premium-icon"
                  />
                  Upgrade to Premium
                </span>
              </h2>
            </div>
            <div style={{padding: 20}}>
              <h3 style={{color: '#d4af37', marginBottom: 15}}>Unlock Exclusive Features</h3>
              <ul style={{listStyle: 'none', padding: 0, marginBottom: 20}}>
                <li style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                  ✓ Admin Access to Manage Products
                </li>
                <li style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                  ✓ Create and Publish New Products
                </li>
                <li style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                  ✓ Edit Product Prices and Descriptions
                </li>
                <li style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                  ✓ Add Tags and Categories
                </li>
                <li style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                  ✓ Priority Customer Support
                </li>
              </ul>
              <div style={{fontSize: 24, fontWeight: 'bold', color: '#d4af37', marginBottom: 15}}>
                $50,000 One-Time Payment
              </div>
              <button 
                onClick={handleUpgradePremium}
                disabled={upgrading}
                className={`premium-upgrade-btn ${upgrading ? 'upgrading' : ''}`}
              >
                {upgrading ? (
                  'Processing...'
                ) : (
                  <span className="premium-button-content">
                    <img
                      src="/images/premium-icon.png"
                      alt="Premium"
                      className="premium-icon"
                    />
                    Upgrade to Premium Now
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Premium Curation Workspace */}
        {user.isPremium && (
          <div className="profile-section premium-studio-card glass">
            <div className="premium-studio-top">
              <div className="premium-studio-heading">
                <h2 className="section-title premium-studio-title">Premium Curation Studio</h2>
                <p className="premium-studio-subtitle">
                  Shape the Royalify collection with concierge-level control and launch new capsules the moment inspiration strikes.
                </p>
              </div>
              <Link to="/admin" className="premium-studio-launch">
                Enter Product Studio →
              </Link>
            </div>

            <div className="premium-studio-body">
              <div className="premium-studio-highlight">
                <span className="premium-studio-chip">Live Access</span>
                <p>
                  Command product publishing, bespoke pricing, and gallery presentation in a single private workspace built for premium curators.
                </p>
              </div>

              <div className="premium-studio-grid">
                <div className="premium-studio-tile">
                  <h3>Curate Releases</h3>
                  <p>Stage limited drops, set publish windows, and refresh hero imagery before every reveal.</p>
                </div>
                <div className="premium-studio-tile">
                  <h3>Refine Catalog</h3>
                  <p>Edit descriptions, adjust tags, and maintain a flawless storefront without waiting on support.</p>
                </div>
                <div className="premium-studio-tile">
                  <h3>Steer Pricing</h3>
                  <p>Update valuations on the fly and coordinate concierge offers with confidence.</p>
                </div>
              </div>

              <div className="premium-studio-footer">
                <span className="premium-studio-meta">
                  Concierge support prioritizes premium curators with two-hour response windows.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Order History Section */}
        <div className="profile-section order-history-card" id="order-history">
          <div className="section-header">
            <h2 className="section-title">
              <span className="history-title-content">
                <img
                  src="/images/history-icon.png"
                  alt="Order history"
                  className="history-icon"
                />
                Order History
              </span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state order-empty">
              <p>No orders yet. Start shopping to build your collection.</p>
              <Link to="/" className="order-empty-link">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="order-history-list">
              {orders.map((order) => {
                let items = [];
                if (Array.isArray(order.items)) {
                  items = order.items;
                } else if (typeof order.items === 'string') {
                  try {
                    items = JSON.parse(order.items);
                  } catch (error) {
                    items = [];
                  }
                }

                const currency = order.currency || (Array.isArray(items) && items[0]?.currency) || 'USD';
                const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—';
                const orderTotal = formatCurrency(Number(order.total), { currency });
                const statusClass = (order.status || 'pending').toLowerCase().replace(/[^a-z0-9]+/g, '-');

                return (
                  <article key={order.id} className="order-entry">
                    <header className="order-entry-header">
                      <div className="order-entry-headline">
                        <span className="order-entry-id">Order #{order.orderId}</span>
                        <span className="order-entry-date">{formattedDate}</span>
                      </div>
                      <span className={`order-status-chip status-${statusClass}`}>
                        {order.status}
                      </span>
                    </header>

                    <div className="order-entry-meta">
                      <span className="order-meta">
                        <span className="order-meta-icon" aria-hidden="true">💰</span>
                        {orderTotal}
                      </span>
                      <span className="order-meta">
                        <span className="order-meta-icon" aria-hidden="true">📦</span>
                        {Array.isArray(items) ? `${items.length} item${items.length === 1 ? '' : 's'}` : '0 items'}
                      </span>
                    </div>

                    {Array.isArray(items) && items.length > 0 && (
                      <div className="order-items-list">
                        {items.map((item, idx) => {
                          const quantity = item.qty ?? item.quantity ?? item.count ?? 0;
                          const productLink = item.id ? `/product/${item.id}` : '/shop';

                          return (
                            <div key={`${order.id}-${idx}`} className="order-item-row">
                              <div className="order-item-info">
                                <span className="order-item-name">{item.name}</span>
                                <span className="order-item-qty">Qty {quantity}</span>
                              </div>
                              <Link to={productLink} className="order-review-btn">
                                Write Review
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={cancelLogout}>
          <div className="modal-content logout-modal" onClick={(event) => event.stopPropagation()}>
            <div className="logout-modal-crest" aria-hidden="true">
              <div className="logout-crest-ring" />
              <div className="logout-crest-core" />
            </div>
            <p className="logout-modal-eyebrow">Royal exit protocol</p>
            <div className="logout-modal-progress" aria-hidden="true">
              <span className={`progress-dot${logoutStep >= 1 ? ' is-active' : ''}`} />
              <span className={`progress-dot${logoutStep >= 2 ? ' is-active' : ''}`} />
            </div>
            <h3 className="logout-modal-title">
              {logoutStep === 1 ? 'Preparing to depart the atelier?' : 'Shall we close your royal session?'}
            </h3>
            <p className="logout-modal-copy">
              {logoutStep === 1
                ? 'Confirm that you wish to begin the sign-out sequence for your Royalify account.'
                : 'All premium access tokens will be cleared and your session will conclude elegantly.'}
            </p>
            <div className="logout-modal-buttons">
              <button type="button" className="logout-modal-btn secondary" onClick={cancelLogout}>
                Stay signed in
              </button>
              <button type="button" className="logout-modal-btn primary" onClick={advanceLogoutStep}>
                {logoutStep === 1 ? 'Continue' : 'Confirm logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-sparkles">
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
            </div>
            <div className="rotating-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
            <div className="ambient-glow"></div>
            <div className="modal-header">
              <img src="/images/premium-icon.png" alt="Premium" className="modal-icon" />
              <h2 className="modal-title">Upgrade to Premium</h2>
            </div>
            <div className="modal-body">
              <p className="modal-text">
                You're about to unlock exclusive features including admin access to manage products.
              </p>
              <div className="modal-price">$50,000</div>
              <p className="modal-subtext">One-time payment</p>
            </div>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmUpgrade}>
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay success-modal" onClick={() => setShowSuccessModal(false)}>
          <div className="fullscreen-animation-effects">
            <svg className="animated-lines-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <line className="anim-line line-1" x1="0" y1="100" x2="1920" y2="100" />
              <line className="anim-line line-2" x1="1920" y1="300" x2="0" y2="300" />
              <line className="anim-line line-3" x1="0" y1="500" x2="1920" y2="500" />
              <line className="anim-line line-4" x1="1920" y1="700" x2="0" y2="700" />
              <line className="anim-line line-5" x1="0" y1="900" x2="1920" y2="900" />
              
              <path className="anim-curve curve-1" d="M 0,400 Q 480,200 960,400 T 1920,400" />
              <path className="anim-curve curve-2" d="M 1920,600 Q 1440,800 960,600 T 0,600" />
              <path className="anim-curve curve-3" d="M 0,800 Q 480,600 960,800 T 1920,800" />
            </svg>
          </div>
          
          <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()}>
            <div className="success-content">
              <div className="success-animation">
                <div className="success-checkmark">
                  <svg viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="25" fill="none"/>
                    <path fill="none" d="M14 27l7.5 7.5L38 18"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="modal-title success-title">Welcome to Premium!</h2>
              <p className="success-message">
                You now have access to all premium features including admin dashboard.
              </p>
              <button className="modal-btn modal-btn-primary" onClick={() => setShowSuccessModal(false)}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
