import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send error to logging service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Replace with actual error logging service (e.g., Sentry, LogRocket)
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Mock logging - in production, send to your error tracking service
    console.log('Error logged:', errorData);
    
    // You could also store critical errors locally for later reporting
    try {
      const errorLog = JSON.parse(localStorage.getItem('error_log') || '[]');
      errorLog.push(errorData);
      
      // Keep only last 10 errors to prevent storage bloat
      if (errorLog.length > 10) {
        errorLog.splice(0, errorLog.length - 10);
      }
      
      localStorage.setItem('error_log', JSON.stringify(errorLog));
    } catch (storageError) {
      console.error('Failed to store error log:', storageError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-content">
              <div className="error-boundary-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              
              <h1 className="error-boundary-title">Oops! Something went wrong</h1>
              
              <p className="error-boundary-message">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="error-boundary-details">
                  <summary>Error Details (Development Mode)</summary>
                  <div className="error-boundary-debug">
                    <h4>Error Message:</h4>
                    <p>{this.state.error.message}</p>
                    
                    {this.state.error.stack && (
                      <>
                        <h4>Stack Trace:</h4>
                        <pre>{this.state.error.stack}</pre>
                      </>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <>
                        <h4>Component Stack:</h4>
                        <pre>{this.state.errorInfo.componentStack}</pre>
                      </>
                    )}
                  </div>
                </details>
              )}

              <div className="error-boundary-actions">
                <button
                  onClick={this.handleRetry}
                  className="error-boundary-button error-boundary-button-primary"
                  aria-label="Try again"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleReload}
                  className="error-boundary-button error-boundary-button-secondary"
                  aria-label="Reload page"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="error-boundary-button error-boundary-button-secondary"
                  aria-label="Go back"
                >
                  Go Back
                </button>
              </div>

              <div className="error-boundary-help">
                <p>If this problem persists, please contact our support team:</p>
                <a 
                  href="/contact" 
                  className="error-boundary-link"
                  aria-label="Contact support"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f8f9fa;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .error-boundary-container {
              max-width: 600px;
              margin: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }

            .error-boundary-content {
              padding: 3rem 2rem;
              text-align: center;
            }

            .error-boundary-icon {
              color: #dc3545;
              margin-bottom: 2rem;
            }

            .error-boundary-title {
              font-size: 2rem;
              font-weight: 600;
              color: #333;
              margin-bottom: 1rem;
            }

            .error-boundary-message {
              font-size: 1.1rem;
              color: #666;
              margin-bottom: 2rem;
              line-height: 1.6;
            }

            .error-boundary-details {
              text-align: left;
              margin: 2rem 0;
              border: 1px solid #ddd;
              border-radius: 4px;
            }

            .error-boundary-details summary {
              padding: 1rem;
              background: #f8f9fa;
              cursor: pointer;
              font-weight: 500;
            }

            .error-boundary-debug {
              padding: 1rem;
            }

            .error-boundary-debug h4 {
              margin: 1rem 0 0.5rem 0;
              color: #333;
            }

            .error-boundary-debug pre {
              background: #f8f9fa;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.875rem;
              white-space: pre-wrap;
            }

            .error-boundary-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
              margin-bottom: 2rem;
            }

            .error-boundary-button {
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 4px;
              font-size: 1rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }

            .error-boundary-button-primary {
              background: #007bff;
              color: white;
            }

            .error-boundary-button-primary:hover {
              background: #0056b3;
            }

            .error-boundary-button-secondary {
              background: #6c757d;
              color: white;
            }

            .error-boundary-button-secondary:hover {
              background: #545b62;
            }

            .error-boundary-help {
              border-top: 1px solid #eee;
              padding-top: 2rem;
              color: #666;
            }

            .error-boundary-link {
              color: #007bff;
              text-decoration: none;
              font-weight: 500;
            }

            .error-boundary-link:hover {
              text-decoration: underline;
            }

            @media (max-width: 768px) {
              .error-boundary-container {
                margin: 1rem;
              }

              .error-boundary-content {
                padding: 2rem 1rem;
              }

              .error-boundary-title {
                font-size: 1.5rem;
              }

              .error-boundary-actions {
                flex-direction: column;
                align-items: center;
              }

              .error-boundary-button {
                width: 100%;
                max-width: 200px;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Functional component wrapper for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Hook for error reporting
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error('Error handled by useErrorHandler:', error);
    
    // TODO: Send to error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
    
    console.log('Error reported:', errorData);
  }, []);

  return handleError;
};