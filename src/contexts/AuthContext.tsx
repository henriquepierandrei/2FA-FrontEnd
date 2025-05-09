import { createContext, useContext, useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { api } from '../api/api';
import { apiRefreshToken } from '../api/apiRefreshToken';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokenResponse: TokenResponse) => void;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Initialize useRef with undefined
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const setupRefreshTimer = (expiresIn: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Convert expiresIn to milliseconds and subtract 30 seconds as buffer
    const timeoutMs = (expiresIn * 1000) - (30 * 1000);
    console.log(`Setting up refresh timer for ${timeoutMs}ms`);
    
    refreshTimeoutRef.current = setTimeout(async () => {
      console.log('Token refresh triggered');
      await refreshToken();
    }, timeoutMs);
  };

  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      console.log('Refreshing token...');
      const response = await apiRefreshToken.post<TokenResponse>('/auth/refresh', {
        refreshToken
      });

      const { access_token, refresh_token, access_token_expires_in } = response.data;
      console.log('Token refreshed successfully, new expiration:', access_token_expires_in);

      // Update tokens
      Cookies.set('accessToken', access_token);
      Cookies.set('refreshToken', refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Setup next refresh
      setupRefreshTimer(access_token_expires_in);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const login = (tokenResponse: TokenResponse) => {
    const { 
      access_token, 
      refresh_token, 
      access_token_expires_in 
    } = tokenResponse;

    console.log('Login successful, token expires in:', access_token_expires_in);

    // Store tokens
    Cookies.set('accessToken', access_token);
    Cookies.set('refreshToken', refresh_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setIsAuthenticated(true);
    
    // Setup initial refresh timer
    setupRefreshTimer(access_token_expires_in);
  };

  const logout = () => {
    // Clear timers
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Clear tokens
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Reset auth state
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get('accessToken');
      
      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Just set the token in headers and mark as authenticated
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};