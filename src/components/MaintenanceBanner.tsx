import React from 'react';

interface MaintenanceBannerProps {
  message?: string;
  estimatedTime?: string;
  severity?: 'info' | 'warning' | 'error';
}

const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({
  message = 'Scheduled maintenance in progress. Some features may be temporarily unavailable.',
  estimatedTime,
  severity = 'warning',
}) => {
  // Check if maintenance mode is enabled via environment variable
  const isMaintenanceMode = __MAINTENANCE_MODE__;

  if (!isMaintenanceMode) {
    return null;
  }

  const severityStyles = {
    info: {
      background: 'linear-gradient(90deg, #3498db, #2980b9)',
      color: '#ffffff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      ),
    },
    warning: {
      background: 'linear-gradient(90deg, #f39c12, #e67e22)',
      color: '#ffffff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    error: {
      background: 'linear-gradient(90deg, #e74c3c, #c0392b)',
      color: '#ffffff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
    },
  };

  const currentStyle = severityStyles[severity];

  return (
    <div 
      className="maintenance-banner"
      style={{
        background: currentStyle.background,
        color: currentStyle.color,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        position: 'sticky',
        top: 0,
      }}
      role="alert"
      aria-live="polite"
    >
      <span className="maintenance-banner-icon">
        {currentStyle.icon}
      </span>
      
      <span className="maintenance-banner-message">
        {message}
      </span>
      
      {estimatedTime && (
        <span className="maintenance-banner-time">
          (Est. completion: {estimatedTime})
        </span>
      )}

      <style jsx>{`
        .maintenance-banner {
          animation: slideDown 0.3s ease-out;
        }

        .maintenance-banner-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .maintenance-banner-message {
          flex-grow: 1;
          text-align: center;
        }

        .maintenance-banner-time {
          opacity: 0.9;
          font-size: 13px;
          white-space: nowrap;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .maintenance-banner {
            padding: 10px 16px;
            font-size: 13px;
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .maintenance-banner-time {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceBanner;