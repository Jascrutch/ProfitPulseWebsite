import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const success = await login(credentials);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const demoCredentials = [
    { email: 'admin@profitpulse.com', role: 'Admin' },
    { email: 'trader@profitpulse.com', role: 'Trader' },
    { email: 'guest@profitpulse.com', role: 'Guest' },
  ];

  const fillDemo = (email: string) => {
    setCredentials(prev => ({
      ...prev,
      email,
      password: 'demo123',
    }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="logo" aria-label="ProfitPulse Home">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            <span>ProfitPulse</span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to your trading dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              autoComplete="email"
              required
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <span id="password-error" className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={credentials.rememberMe}
                onChange={handleInputChange}
              />
              <span className="checkbox-custom"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            aria-label={isLoading ? 'Signing in...' : 'Sign in'}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="demo-section">
          <h3>Demo Accounts</h3>
          <p>Try different user roles with these demo accounts (password: demo123):</p>
          <div className="demo-buttons">
            {demoCredentials.map((demo) => (
              <button
                key={demo.email}
                onClick={() => fillDemo(demo.email)}
                className="demo-button"
                type="button"
                aria-label={`Use ${demo.role} demo account`}
              >
                {demo.role} Demo
              </button>
            ))}
          </div>
        </div>

        <div className="signup-link">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up for free</Link>
          </p>
        </div>

        <div className="legal-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/disclaimers">Disclaimers</Link>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .login-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 3rem;
          width: 100%;
          max-width: 450px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #007bff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .login-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .login-header p {
          color: #666;
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .error-banner {
          background: #ffeaea;
          border: 1px solid #dc3545;
          border-radius: 6px;
          padding: 1rem;
          color: #721c24;
          font-size: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input {
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #007bff;
        }

        .form-group input.error {
          border-color: #dc3545;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 4px;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 14px;
          color: #666;
        }

        .checkbox-label input[type="checkbox"] {
          display: none;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #ddd;
          border-radius: 3px;
          position: relative;
          transition: all 0.2s;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
          background: #007bff;
          border-color: #007bff;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .forgot-password {
          color: #007bff;
          text-decoration: none;
          font-size: 14px;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .login-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .demo-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e0e0e0;
        }

        .demo-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .demo-section p {
          font-size: 14px;
          color: #666;
          margin: 0 0 1rem 0;
        }

        .demo-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .demo-button {
          flex: 1;
          min-width: 100px;
          padding: 8px 12px;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-button:hover {
          background: #e9ecef;
          border-color: #ccc;
        }

        .signup-link {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e0e0e0;
        }

        .signup-link p {
          color: #666;
          margin: 0;
        }

        .signup-link a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }

        .legal-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .legal-links a {
          color: #999;
          text-decoration: none;
          font-size: 12px;
        }

        .legal-links a:hover {
          color: #666;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 1rem;
          }

          .login-container {
            padding: 2rem 1.5rem;
          }

          .form-options {
            flex-direction: column;
            align-items: flex-start;
          }

          .demo-buttons {
            flex-direction: column;
          }

          .legal-links {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;