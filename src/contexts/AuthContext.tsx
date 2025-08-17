import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupData, UserRole } from '@/types';

// Auth Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasRole: (role: UserRole) => boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Secure token storage utilities
const TokenStorage = {
  setToken: (token: string) => {
    try {
      // In production, consider using httpOnly cookies for enhanced security
      localStorage.setItem('auth_token', token);
      // Also set a shorter-lived session storage for additional security
      sessionStorage.setItem('auth_session', 'active');
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  },
  
  getToken: (): string | null => {
    try {
      const token = localStorage.getItem('auth_token');
      const session = sessionStorage.getItem('auth_session');
      // Return token only if session is active
      return session === 'active' ? token : null;
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  },
  
  removeToken: () => {
    try {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_session');
      // Clear any user data
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  },
  
  setUserData: (user: User) => {
    try {
      localStorage.setItem('user_data', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },
  
  getUserData: (): User | null => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = TokenStorage.getToken();
      const userData = TokenStorage.getUserData();
      
      if (token && userData) {
        // TODO: Validate token with backend
        // For now, we'll trust the stored data
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: userData, token },
        });
      }
    };

    initializeAuth();
  }, []);

  // Mock authentication functions - TODO: Replace with real API calls
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login - TODO: Replace with real authentication
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          username: credentials.email.split('@')[0],
          firstName: 'John',
          lastName: 'Doe',
          role: credentials.email.includes('admin') ? 'admin' : 'trader',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isVerified: true,
        };

        const mockToken = `mock_token_${Date.now()}`;

        // Store authentication data
        TokenStorage.setToken(mockToken);
        TokenStorage.setUserData(mockUser);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: mockUser, token: mockToken },
        });

        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: message });
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!data.acceptTerms) {
        throw new Error('You must accept the terms of service');
      }

      // Mock successful signup - TODO: Replace with real API
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'trader',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        createdAt: new Date().toISOString(),
        isVerified: false, // Would require email verification
      };

      const mockToken = `mock_token_${Date.now()}`;

      // Store authentication data
      TokenStorage.setToken(mockToken);
      TokenStorage.setUserData(mockUser);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'LOGIN_ERROR', payload: message });
      return false;
    }
  };

  const logout = () => {
    TokenStorage.removeToken();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      TokenStorage.setUserData(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!state.user) return false;
    
    // Admin has access to everything
    if (state.user.role === 'admin') return true;
    
    // Check exact role match
    return state.user.role === role;
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // TODO: Implement token refresh logic
      const currentToken = TokenStorage.getToken();
      if (!currentToken) return false;

      // Mock token refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate new token (in real app, this would come from server)
      const newToken = `refreshed_token_${Date.now()}`;
      TokenStorage.setToken(newToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Force logout on refresh failure
      return false;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
    hasRole,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for route protection
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole
) => {
  return (props: P) => {
    const { isAuthenticated, hasRole, isLoading } = useAuth();

    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return <div>You don't have permission to access this page.</div>;
    }

    return <Component {...props} />;
  };
};