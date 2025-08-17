import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import MaintenanceBanner from '@/components/MaintenanceBanner';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Page imports - we'll create these next
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import {
  Trading,
  Portfolio,
  Watchlist,
  OrderHistory,
  Notifications,
  Analytics,
  Profile,
  Help,
  Contact,
  ApiDocs,
  Terms,
  Privacy,
  Disclaimers,
} from '@/pages/PlaceholderPages';

// Layout component for authenticated pages
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Load high contrast preference
  useEffect(() => {
    const stored = localStorage.getItem('high_contrast_mode');
    setIsHighContrast(stored === 'true');
  }, []);

  // Apply high contrast styles
  useEffect(() => {
    const body = document.body;
    if (isHighContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Store preference
    localStorage.setItem('high_contrast_mode', isHighContrast.toString());
  }, [isHighContrast]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleHighContrast = () => setIsHighContrast(!isHighContrast);

  return (
    <div className="app-layout">
      <MaintenanceBanner />
      <Header
        onToggleSidebar={toggleSidebar}
        onToggleHighContrast={toggleHighContrast}
        isHighContrast={isHighContrast}
      />
      <div className="app-main">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="app-content" role="main">
          {children}
        </main>
      </div>

      <style jsx>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-main {
          display: flex;
          flex: 1;
        }

        .app-content {
          flex: 1;
          padding: 2rem;
          background: #f8f9fa;
          min-height: calc(100vh - 64px); /* Account for header height */
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .app-content {
            padding: 1rem;
          }
        }

        /* High contrast styles */
        :global(body.high-contrast) {
          --primary-color: #000000;
          --secondary-color: #ffffff;
          --accent-color: #ffff00;
          --text-color: #000000;
          --background-color: #ffffff;
          --border-color: #000000;
        }

        :global(body.high-contrast *) {
          border-color: var(--border-color) !important;
          background-color: var(--background-color) !important;
          color: var(--text-color) !important;
        }

        :global(body.high-contrast button),
        :global(body.high-contrast .primary) {
          background-color: var(--primary-color) !important;
          color: var(--secondary-color) !important;
        }

        :global(body.high-contrast a) {
          color: var(--primary-color) !important;
          text-decoration: underline !important;
        }

        :global(body.high-contrast input),
        :global(body.high-contrast select),
        :global(body.high-contrast textarea) {
          background-color: var(--secondary-color) !important;
          color: var(--primary-color) !important;
          border: 2px solid var(--primary-color) !important;
        }
      `}</style>
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole as any)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Public route wrapper (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />

              {/* Protected routes with layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trading"
                element={
                  <ProtectedRoute requiredRole="trader">
                    <AppLayout>
                      <Trading />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute requiredRole="trader">
                    <AppLayout>
                      <Portfolio />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Watchlist />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-history"
                element={
                  <ProtectedRoute requiredRole="trader">
                    <AppLayout>
                      <OrderHistory />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Notifications />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Analytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Support and information pages */}
              <Route
                path="/help"
                element={
                  <AppLayout>
                    <Help />
                  </AppLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <AppLayout>
                    <Contact />
                  </AppLayout>
                }
              />
              <Route
                path="/api-docs"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <ApiDocs />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Legal pages */}
              <Route
                path="/terms"
                element={
                  <AppLayout>
                    <Terms />
                  </AppLayout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <AppLayout>
                    <Privacy />
                  </AppLayout>
                }
              />
              <Route
                path="/disclaimers"
                element={
                  <AppLayout>
                    <Disclaimers />
                  </AppLayout>
                }
              />

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>

      <style jsx global>{`
        /* Loading styles */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Access denied styles */
        .access-denied {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
          padding: 2rem;
        }

        .access-denied h2 {
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .access-denied p {
          color: #666;
          font-size: 1.1rem;
        }

        /* Focus styles for accessibility */
        *:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        /* Skip link for screen readers */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #007bff;
          color: white;
          padding: 8px;
          z-index: 9999;
          text-decoration: none;
          border-radius: 4px;
        }

        .skip-link:focus {
          top: 6px;
        }

        /* Ensure proper color contrast */
        h1, h2, h3, h4, h5, h6 {
          color: #333;
        }

        p, span, div {
          color: #666;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default App;