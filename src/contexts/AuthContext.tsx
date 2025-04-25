import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api-route';
import axios from 'axios';
import Cookies from 'js-cookie';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: TokenResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const setupRefreshTimer = (expiresIn: number) => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Set up refresh timer to trigger 1 minute before expiration
    const refreshTime = (expiresIn - 60) * 1000; // Convert to milliseconds
    
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await api.post<TokenResponse>('/auth/refresh', {
          refreshToken
        });

        // Update tokens with new expiration times
        login(response.data);
      } catch (error) {
        console.error('Auto refresh failed:', error);
        logout();
      }
    }, refreshTime);
  };

  const login = (tokenResponse: TokenResponse) => {
    const { 
      access_token, 
      refresh_token, 
      access_token_expires_in,
      refresh_token_expires_in 
    } = tokenResponse;

    // Store tokens with proper expiration
    Cookies.set('accessToken', access_token, {
      expires: access_token_expires_in / (24 * 60 * 60),
      secure: true,
      sameSite: 'strict'
    });

    Cookies.set('refreshToken', refresh_token, {
      expires: refresh_token_expires_in / (24 * 60 * 60),
      secure: true,
      sameSite: 'strict'
    });

    // Update axios headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    setIsAuthenticated(true);

    // Setup refresh timer
    setupRefreshTimer(access_token_expires_in);
  };

  const logout = useCallback(() => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setIsAuthenticated(false);
    
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    // Initial auth check
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    setIsLoading(false);

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Add axios request interceptor to include access token
  const requestInterceptor = axios.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add axios response interceptor for token refresh
  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post<TokenResponse>('/auth/refresh', {
          refreshToken
        });

        // Update tokens with new expiration times
        login(response.data);

        // Update the original request authorization
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;

        // Retry the original request with new token
        return axios(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }
  );

  // Cleanup interceptors on unmount
  useEffect(() => {
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [requestInterceptor, responseInterceptor]);

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