import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await API.post(endpoint, form);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Dispatch event to notify App component of login
      window.dispatchEvent(new Event('userLoggedIn'));

      setSuccess(`${isLogin ? 'Login' : 'Registration'} successful! Redirecting...`);
      
      setTimeout(() => {
        navigate(response.data.user.role === 'admin' ? '/admin' : '/');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setForm({ email: '', password: '', name: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-accent accent-1"></div>
        <div className="auth-accent accent-2"></div>
        <div className="auth-accent accent-3"></div>
      </div>

      <div className="auth-content">
        {/* Left side - Branding */}
        <div className="auth-branding fade-up">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="brand-logo gold-shimmer">ROYALIFY</h1>
          </Link>
          <p className="brand-tagline">Where Rarity Reigns</p>
          
          <div className="brand-divider"></div>

          <h2 className="auth-welcome">
            {isLogin ? 'Welcome Back to Your Royal Realm' : 'Join Our Exclusive Kingdom'}
          </h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Access your personal collection of magnificent artifacts and manage your orders.' 
              : 'Create an account to unlock access to exclusive relics and premium features.'}
          </p>

          <div className="auth-features">
            {[
              { icon: '✦', text: 'Exclusive Access' },
              { icon: '◆', text: 'Premium Artifacts' },
              { icon: '◇', text: 'Secure Transactions' }
            ].map((feature, idx) => (
              <div key={idx} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-wrapper fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="auth-form-container glass">
            <div className="form-header">
              <h3 className="form-title">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="form-subtitle">
                {isLogin ? 'Access your account' : 'Join our exclusive community'}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠</span>
                <span className="alert-text">{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                <span className="alert-text">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Name Field - Register Only */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your regal name"
                      className="form-input"
                      required={!isLogin}
                      disabled={loading}
                    />
                    <span className="input-icon">👑</span>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                  <span className="input-icon">✉</span>
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Password</label>
                  {isLogin && (
                    <a href="#forgot" className="forgot-link">Forgot password?</a>
                  )}
                </div>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? '👁' : '👁‍🗨'}
                  </button>
                </div>
              </div>

              {/* Remember Me - Login Only */}
              {isLogin && (
                <div className="form-checkbox">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Keep me signed in</label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="auth-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="form-divider">
              <span>or</span>
            </div>

            {/* Toggle Mode */}
            <div className="auth-toggle">
              <p className="toggle-text">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <button
                type="button"
                onClick={handleToggleMode}
                disabled={loading}
                className="toggle-button"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>

            {/* Footer */}
            <div className="form-footer">
              <p className="footer-text">
                By proceeding, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="back-to-home">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
