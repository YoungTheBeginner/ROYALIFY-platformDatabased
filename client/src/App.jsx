import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/Thankyou';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isPremiumMember = user && (user.role === 'admin' || user.isPremium);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Listen for auth events
    const handleUserLoggedIn = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    const handleUserLoggedOut = () => {
      setUser(null);
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <WishlistProvider>
      <CartProvider>
        <ScrollToTop />
        <div className="app">
        <header className="site-header glass">
          <div className="header-inner container">
            <Link to="/" className="brand">
              <div className="brand-text">
                <h1 className="logo-title">ROYALIFY</h1>
                <small className="tagline">Where Rarity Reigns</small>
              </div>
            </Link>

            <div className="header-nav-wrapper">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search artifacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <img src="/images/search-icon.png" alt="Search" className="search-icon" />
                </button>
              </form>

              <nav className="nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/shop" className="nav-link">Shop</Link>
              
              {/* Categories Dropdown */}
              <div className="nav-dropdown">
                <span className="nav-link dropdown-trigger">Categories</span>
                <div className="dropdown-menu">
                  <Link to="/shop?category=sword" className="dropdown-item">⚔️ Swords</Link>
                  <Link to="/shop?category=headgear" className="dropdown-item">👑 Headgear</Link>
                  <Link to="/shop?category=book" className="dropdown-item">📖 Books</Link>
                  <Link to="/shop?category=crown" className="dropdown-item">💎 Crowns</Link>
                  <Link to="/shop?category=armor" className="dropdown-item">🛡️ Armor</Link>
                  <Link to="/shop?category=cape" className="dropdown-item">🦸 Capes</Link>
                  <Link to="/shop?category=staff" className="dropdown-item">🪄 Staffs</Link>
                  <Link to="/shop?category=glove" className="dropdown-item">🧤 Gloves</Link>
                  <Link to="/shop?category=ring" className="dropdown-item">💍 Rings</Link>
                  <Link to="/shop?category=orb" className="dropdown-item">🔮 Orbs</Link>
                </div>
              </div>
              
              <Link to="/wishlist" className="nav-link">Wishlist</Link>
              <Link to="/cart" className="nav-link">Cart</Link>
              {isPremiumMember && (
                <Link to="/admin" className="nav-link nav-link--highlight">Product Studio</Link>
              )}
              </nav>

              {!loading && (
                user ? (
                  <div className="nav-user-section">
                    <Link to="/profile" className="profile-bar">
                      <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
                      <div className="profile-info">
                        <span className="profile-name">{user.name}</span>
                        <span className="profile-role">{user.role}</span>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <Link to="/login" className="nav-login-btn">
                    Login
                  </Link>
                )
              )}
            </div>
          </div>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* About in App so it's visible on every page */}
        <section className="about-section fade-up">
          <div className="container about-luxury">
            <div className="about-header">
              <span className="about-eyebrow">THE HOUSE OF ROYALIFY</span>
              <h2 className="about-title gold-shimmer">Where Legacy Meets Luminescence</h2>
              <p className="about-subtitle">
                ROYALIFY curates heirlooms forged in celestial ateliers and whispered through dynasties. Each curation is a coronation in waiting.
              </p>
            </div>

            <div className="about-main">
              <article className="about-story">
                <h3>Our Manifesto</h3>
                <p>
                  Rarity is not a matter of scarcity alone—it is the harmony of provenance, artistry, and destiny. Our archivists travel from astral bazaars to ancient vaults to authenticate every aura that crosses our threshold.
                </p>
                <p>
                  From the Scepter of Silent Majesty to the Crystalline Veil of Empyrea, each artifact is preserved in a stasis of reverence, awaiting the sovereign bold enough to claim it.
                </p>
                <ul className="about-list">
                  <li>Curations sealed with astral provenance keys</li>
                  <li>Bespoke consultations for emerging dynasties</li>
                  <li>White-glove delivery encased in starlit vaults</li>
                </ul>
              </article>

              <aside className="about-insight">
                <h3>House Promises</h3>
                <p>
                  Every heirloom receives a dedicated curator to chronicle its cycles, certify its resonance, and prepare ceremonial bestowal rites tailored to your lineage.
                </p>
                <ul className="about-promises">
                  <li><span>02</span>Dynastic authentication dossiers with astral seals.</li>
                  <li><span>12</span>Concierge touchpoints from selection to enthronement.</li>
                  <li><span>72h</span>Quiet-room delivery windows with rite keepers.</li>
                </ul>
              </aside>
            </div>

            <div className="about-highlights">
              <div className="highlight-card">
                <span className="highlight-value">284</span>
                <span className="highlight-label">Artifacts in rotation</span>
              </div>
              <div className="highlight-card">
                <span className="highlight-value">37</span>
                <span className="highlight-label">Royal houses in residence</span>
              </div>
              <div className="highlight-card">
                <span className="highlight-value">∞</span>
                <span className="highlight-label">Stories illuminated nightly</span>
              </div>
            </div>

            <div className="about-salons">
              <div className="salon-card">
                <h4>Signature Salon</h4>
                <p>Private midnight unveilings guided by our archivists with astral symphonies composed for each heirloom.</p>
              </div>
              <div className="salon-card">
                <h4>Legacy Atelier</h4>
                <p>Collaborate with our luminary artisans to restore or rebirth artifacts destined for your lineage.</p>
              </div>
              <div className="salon-card">
                <h4>Celestial Custodianship</h4>
                <p>Lifetime stewardship detailing alignments, resonance, and bespoke coronation ceremonies.</p>
              </div>
            </div>

            <div className="about-legacy">
              <div className="legacy-ribbon">
                <span>Est. 1284</span>
                <span>Revived 1896</span>
                <span>Reimagined 2026</span>
              </div>
              <p>
                Commissioned by the luminary consul of Astralis, the House of ROYALIFY remains devoted to uniting modern sovereigns with relics that amplify their reign.
              </p>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <h3 className="footer-title">ROYALIFY</h3>
              <p>
                A sanctuary for seekers of sovereign artifacts. Curated with celestial precision, delivered with ceremonial grace.
              </p>
              <div className="footer-badge">Heritage Curators Since 1284</div>
            </div>

            <div className="footer-links">
              <h4>Collections</h4>
              <ul>
                <li><Link to="/shop?category=crown">Crown Vault</Link></li>
                <li><Link to="/shop?category=armor">Armor Hall</Link></li>
                <li><Link to="/shop?category=staff">Arcane Arsenal</Link></li>
                <li><Link to="/shop?category=orb">Celestial Orbs</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>House Services</h4>
              <ul>
                <li><Link to="/profile">Private Registry</Link></li>
                <li><Link to="/checkout">Bespoke Delivery</Link></li>
                <li><Link to="/wishlist">Wish Sanctum</Link></li>
                <li><Link to="/admin">Premier Atelier</Link></li>
              </ul>
            </div>

            <div className="footer-newsletter">
              <h4>Join the Constellation</h4>
              <p>Receive lunar alignments, private invitations, and first rights to unveiled relics.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your royal correspondence" aria-label="Email address" />
                <button type="submit">Enlist</button>
              </form>
            </div>
          </div>
          <div className="footer-bottom container">
            <p>© {new Date().getFullYear()} ROYALIFY — Sovereign rights reserved.</p>
            <div className="footer-socials">
              <span>Follow our luminary echoes</span>
              <div className="social-runes">
                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
                <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </CartProvider>
    </WishlistProvider>
  );
}
