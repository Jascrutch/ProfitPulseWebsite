import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  requiredRole?: 'admin' | 'trader' | 'guest';
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      path: '/trading',
      label: 'Trading',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      ),
      requiredRole: 'trader',
    },
    {
      path: '/portfolio',
      label: 'Portfolio',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="m19 9-5 5-4-4-3 3"/>
        </svg>
      ),
      requiredRole: 'trader',
    },
    {
      path: '/watchlist',
      label: 'Watchlist',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
    },
    {
      path: '/order-history',
      label: 'Order History',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      requiredRole: 'trader',
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      badge: 'Pro',
    },
  ];

  const supportItems: NavigationItem[] = [
    {
      path: '/help',
      label: 'Help & FAQ',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    {
      path: '/contact',
      label: 'Contact Support',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
    },
    {
      path: '/api-docs',
      label: 'API Documentation',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      requiredRole: 'admin',
    },
  ];

  const legalItems: NavigationItem[] = [
    {
      path: '/terms',
      label: 'Terms of Service',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      ),
    },
    {
      path: '/privacy',
      label: 'Privacy Policy',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      path: '/disclaimers',
      label: 'Disclaimers',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
  ];

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const filterItemsByRole = (items: NavigationItem[]) => {
    return items.filter(item => {
      if (!item.requiredRole) return true;
      return hasRole(item.requiredRole);
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const NavigationSection: React.FC<{
    title: string;
    items: NavigationItem[];
    compact?: boolean;
  }> = ({ title, items, compact = false }) => {
    const filteredItems = filterItemsByRole(items);
    
    if (filteredItems.length === 0) return null;

    return (
      <div className={`nav-section ${compact ? 'compact' : ''}`}>
        <h3 className="nav-section-title">{title}</h3>
        <ul className="nav-list" role="menu">
          {filteredItems.map((item) => (
            <li key={item.path} role="none">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={onClose}
                role="menuitem"
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          onKeyDown={(e) => handleKeyDown(e, onClose)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="sidebar-content">
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
              </div>
              <div className="user-details">
                <strong>{user.firstName} {user.lastName}</strong>
                <span>{user.role}</span>
              </div>
            </div>
          )}

          <NavigationSection title="Main" items={navigationItems} />
          <NavigationSection title="Support" items={supportItems} />
          <NavigationSection title="Legal" items={legalItems} compact />
        </div>

        <div className="sidebar-footer">
          <div className="version-info">
            <span>Version {__VERSION__}</span>
          </div>
        </div>

        <style jsx>{`
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            animation: fadeIn 0.2s ease-out;
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: -280px;
            width: 280px;
            height: 100vh;
            background: white;
            border-right: 1px solid #e0e0e0;
            z-index: 1000;
            transition: left 0.3s ease-out;
            display: flex;
            flex-direction: column;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }

          .sidebar.open {
            left: 0;
          }

          .sidebar-header {
            display: flex;
            justify-content: flex-end;
            padding: 1rem;
            border-bottom: 1px solid #e0e0e0;
          }

          .sidebar-close {
            background: none;
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            color: #666;
            transition: all 0.2s;
          }

          .sidebar-close:hover {
            background: #f5f5f5;
            color: #333;
          }

          .sidebar-content {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 0;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0 1rem 1rem 1rem;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 1rem;
          }

          .user-avatar img,
          .avatar-placeholder {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }

          .user-avatar img {
            object-fit: cover;
          }

          .avatar-placeholder {
            background: #007bff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
          }

          .user-details {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .user-details strong {
            font-weight: 600;
            color: #333;
          }

          .user-details span {
            font-size: 12px;
            color: #666;
            text-transform: capitalize;
          }

          .nav-section {
            margin-bottom: 2rem;
          }

          .nav-section.compact {
            margin-bottom: 1rem;
          }

          .nav-section-title {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 0.5rem 1rem;
          }

          .nav-section.compact .nav-section-title {
            font-size: 11px;
            margin-bottom: 0.25rem;
          }

          .nav-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: #666;
            text-decoration: none;
            transition: all 0.2s;
            position: relative;
          }

          .nav-section.compact .nav-link {
            padding: 0.5rem 1rem;
            font-size: 14px;
          }

          .nav-link:hover {
            background: #f8f9fa;
            color: #333;
          }

          .nav-link.active {
            background: #e3f2fd;
            color: #007bff;
            border-right: 3px solid #007bff;
          }

          .nav-icon {
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }

          .nav-label {
            font-weight: 500;
          }

          .nav-badge {
            margin-left: auto;
            background: #007bff;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 600;
          }

          .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid #e0e0e0;
          }

          .version-info {
            font-size: 12px;
            color: #999;
            text-align: center;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @media (min-width: 1024px) {
            .sidebar-overlay {
              display: none;
            }

            .sidebar {
              position: relative;
              left: 0;
              width: 260px;
              height: auto;
              box-shadow: none;
            }

            .sidebar-header {
              display: none;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;