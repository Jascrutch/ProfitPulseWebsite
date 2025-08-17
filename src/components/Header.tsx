import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onToggleHighContrast?: () => void;
  isHighContrast?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onToggleHighContrast,
  isHighContrast = false,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          {isAuthenticated && (
            <button
              className="sidebar-toggle"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </button>
          )}
          
          <Link to="/" className="logo" aria-label="ProfitPulse Home">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </div>
            <span className="logo-text">ProfitPulse</span>
          </Link>
        </div>

        {/* Center Section - Search (for authenticated users) */}
        {isAuthenticated && (
          <div className="header-center">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search symbols, stocks..."
                className="search-input"
                aria-label="Search"
              />
              <button className="search-button" aria-label="Submit search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="header-right">
          {/* Accessibility Toggle */}
          <button
            className="accessibility-toggle"
            onClick={onToggleHighContrast}
            aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
            title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a10 10 0 0 0 0 20V2z"/>
            </svg>
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="notification-button"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Profile Menu */}
              <div className="profile-menu">
                <button
                  className="profile-button"
                  onClick={handleProfileMenuToggle}
                  onKeyDown={(e) => handleKeyDown(e, handleProfileMenuToggle)}
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="profile-dropdown" role="menu">
                    <div className="profile-info">
                      <strong>{user?.firstName} {user?.lastName}</strong>
                      <span>{user?.email}</span>
                      <span className="role-badge">{user?.role}</span>
                    </div>
                    <hr />
                    <Link to="/profile" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>
                      Profile Settings
                    </Link>
                    <Link to="/order-history" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>
                      Order History
                    </Link>
                    <Link to="/watchlist" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>
                      Watchlist
                    </Link>
                    <hr />
                    <button onClick={handleLogout} role="menuitem">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link
                to="/login"
                className={`auth-button ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={`auth-button primary ${location.pathname === '/signup' ? 'active' : ''}`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          height: 64px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;
        }

        .sidebar-toggle:hover {
          background: #f5f5f5;
          color: #333;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #007bff;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .logo-icon {
          display: flex;
          align-items: center;
        }

        .header-center {
          flex: 1;
          max-width: 400px;
          margin: 0 2rem;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 8px 40px 8px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 14px;
          background: #f8f9fa;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
          background: white;
        }

        .search-button {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          padding: 4px;
          color: #666;
          cursor: pointer;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .accessibility-toggle {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;
        }

        .accessibility-toggle:hover {
          background: #f5f5f5;
          color: #333;
        }

        .notification-button {
          position: relative;
          padding: 8px;
          border-radius: 4px;
          color: #666;
          text-decoration: none;
          transition: all 0.2s;
        }

        .notification-button:hover {
          background: #f5f5f5;
          color: #333;
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #dc3545;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 600;
          min-width: 18px;
          text-align: center;
        }

        .profile-menu {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          padding: 4px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-button:hover {
          background: #f5f5f5;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          padding: 8px 0;
          z-index: 1000;
        }

        .profile-info {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .profile-info strong {
          font-weight: 600;
          color: #333;
        }

        .profile-info span:not(.role-badge) {
          font-size: 14px;
          color: #666;
        }

        .role-badge {
          font-size: 12px;
          padding: 2px 8px;
          background: #007bff;
          color: white;
          border-radius: 12px;
          width: fit-content;
          text-transform: capitalize;
        }

        .profile-dropdown hr {
          margin: 8px 0;
          border: none;
          border-top: 1px solid #eee;
        }

        .profile-dropdown a,
        .profile-dropdown button {
          display: block;
          width: 100%;
          padding: 8px 16px;
          text-decoration: none;
          color: #333;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
        }

        .profile-dropdown a:hover,
        .profile-dropdown button:hover {
          background: #f5f5f5;
        }

        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .auth-button {
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .auth-button:not(.primary) {
          color: #666;
        }

        .auth-button:not(.primary):hover {
          color: #333;
          background: #f5f5f5;
        }

        .auth-button.primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .auth-button.primary:hover {
          background: #0056b3;
          border-color: #0056b3;
        }

        @media (max-width: 768px) {
          .header-center {
            display: none;
          }

          .header-container {
            padding: 0 0.5rem;
          }

          .logo-text {
            display: none;
          }

          .auth-buttons {
            gap: 0.25rem;
          }

          .auth-button {
            padding: 6px 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;