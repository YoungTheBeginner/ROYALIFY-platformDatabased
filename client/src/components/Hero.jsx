import { useNavigate } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      {/* Animated Background Elements */}
      <div className="hero-bg-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="glow-line line-1"></div>
        <div className="glow-line line-2"></div>
      </div>

      {/* Main Content */}
      <div className="hero-container">
        {/* Premium Badge */}
        <div className="hero-badge">
          <span className="badge-icon">✨</span>
          <span className="badge-text">Curated Luxury Artifacts</span>
        </div>

        {/* Main Title with Letter Animation */}
        <h1 className="hero-title">
          <span className="title-word">
            <span className="letter" style={{ '--index': 0 }}>R</span>
            <span className="letter" style={{ '--index': 1 }}>O</span>
            <span className="letter" style={{ '--index': 2 }}>Y</span>
            <span className="letter" style={{ '--index': 3 }}>A</span>
            <span className="letter" style={{ '--index': 4 }}>L</span>
            <span className="letter" style={{ '--index': 5 }}>I</span>
            <span className="letter" style={{ '--index': 6 }}>F</span>
            <span className="letter" style={{ '--index': 7 }}>Y</span>
          </span>
        </h1>

        {/* Tagline */}
        <div className="hero-divider"></div>
        <p className="hero-tagline">
          Where Rarity Reigns
        </p>

        {/* Description */}
        <p className="hero-desc">
          Discover the most exquisite artifacts of power and prestige. Each piece holds the essence of ancient magic, crafted for those destined to reign over their realm.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-section">
          <button 
            className="hero-btn hero-btn-primary"
            onClick={() => navigate('/shop')}
          >
            <span className="btn-shine"></span>
            <span className="btn-text">Explore the Emporium</span>
          </button>
          
          <button 
            className="hero-btn hero-btn-secondary"
            onClick={() => navigate('/shop')}
          >
            View All Categories
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-dot"></div>
          <p>Scroll to discover</p>
        </div>
      </div>

      {/* Particle Effect */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ '--particle-delay': `${i * 0.1}s` }}></div>
        ))}
      </div>
    </div>
  );
}
