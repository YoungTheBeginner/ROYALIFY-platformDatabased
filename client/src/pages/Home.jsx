import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products';

export default function Home(){
  const [animateHero, setAnimateHero] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "/images/model.png",
    "/images/model-2.png",
    "/images/model-3.png",
    "/images/model-4.png"
  ];

  useEffect(() => {
    setAnimateHero(true);
    setTimeout(() => setAnimateFeatures(true), 300);
  }, []);

  // Auto-slide carousel every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };
  
  return (
    <>
      <section className="hero container page-enter hero-animated">
        <div className="hero-inner">
          <div className="hero-left reveal-left">
            <div className="hero-eyebrow">✦ Exclusive Collection</div>
            <h1 className="hero-title">Artifacts of Eternal Power</h1>
            <p className="hero-sub">
              Discover legendary relics forged in forgotten realms. Each piece carries the essence of ancient civilizations and untold stories waiting to be unveiled.
            </p>
            <Link to="/shop" className="hero-cta">
              Explore Collection
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Artifacts</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">Collectors</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Authentic</div>
              </div>
            </div>
          </div>

          <div className="hero-right reveal-right">
            <div className="hero-artifact glass hero-orbit">
              <div className="carousel-container">
                <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {heroImages.map((img, index) => (
                    <div 
                      key={index} 
                      className="carousel-slide"
                      style={{
                        opacity: index === currentSlide ? 1 : 0.4,
                        transition: 'opacity 0.8s ease-in-out'
                      }}
                    >
                      <img src={img} alt={`artifact ${index + 1}`} />
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button className="carousel-btn carousel-btn-prev" onClick={prevSlide} aria-label="Previous slide">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="carousel-btn carousel-btn-next" onClick={nextSlide} aria-label="Next slide">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Dots Indicator */}
                <div className="carousel-dots">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container fade-up" style={{marginTop: 'var(--spacing-xl)'}}>
        <div className="reveal-up" style={{marginBottom: 'var(--spacing-lg)', textAlign: 'center', maxWidth: '700px', margin: '0 auto var(--spacing-lg)'}}>
          <h2 style={{ 
            color: "var(--royal-gold)", 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 600, 
            marginBottom: 'var(--spacing-sm)', 
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.2
          }}>
            Featured Masterpieces
          </h2>
          <p style={{
            opacity: 0.7, 
            fontSize: '1.05rem', 
            letterSpacing: '0.01em',
            lineHeight: 1.7,
            fontWeight: 300
          }}>
            Handpicked treasures from the most exclusive and legendary collections across realms
          </p>
        </div>
        <div className="grid">
          {products.slice(0,4).map((p, idx) => (
            <div 
              key={p.id} 
              className="product-card glass card-interactive"
              style={{
                animation: animateFeatures ? `fadeUp 0.6s ease-out ${0.2 + idx * 0.1}s forwards` : 'none',
                opacity: animateFeatures ? 1 : 0
              }}
            >
              <Link to={`/product/${p.id}`} style={{color:'inherit', display:'block'}}>
                <div className="product-card-image" style={{position:'relative'}}>
                  <img src={p.image} alt={p.name} />
                  {p.comingSoon && <div className="badge-cta badge-coming">COMING SOON</div>}
                  {p.badge && <div className="badge-promo">{p.badge}</div>}
                </div>
                <div className="product-card-content">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-desc">{p.descShort}</p>
                  <div className="product-price">{p.priceDisplay}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
