import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import MIALogo from './MIALogo';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-content fade-in">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <MIALogo className="logo-icon" size={80} />
            </div>
            <h2 className="login-title">Marketing Intelligence Agent</h2>
            <p className="login-subtitle">
              Welcome back! Sign in to access your marketing insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="input form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                <span className="checkbox-text">Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              className={`btn btn-primary login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="#" className="signup-link">Sign up</a></p>
          </div>
        </div>

        <div className="features-preview">
          <h3>Unlock Powerful Marketing Insights</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Real-time Analytics</h4>
              <p>Monitor campaign performance with live data visualization</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <h4>AI-Powered Insights</h4>
              <p>Get intelligent recommendations and trend predictions</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <h4>ROI Optimization</h4>
              <p>Maximize your marketing spend with data-driven decisions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
