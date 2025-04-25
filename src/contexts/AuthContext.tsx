import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api-route';

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Try to use current token
        await api.get('/auth/validate');
        setIsAuthenticated(true);
      } catch (error) {
        // Token validation failed, try refresh
        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { access_token, refresh_token } = response.data;
          
          Cookies.set('accessToken', access_token);
          Cookies.set('refreshToken', refresh_token);
          
          setIsAuthenticated(true);
        } catch (refreshError) {
          // Refresh failed, clear tokens
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (tokenResponse: TokenResponse) => {
    const { access_token, refresh_token } = tokenResponse;
    
    Cookies.set('accessToken', access_token);
    Cookies.set('refreshToken', refresh_token);
    
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setIsAuthenticated(false);
  };

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