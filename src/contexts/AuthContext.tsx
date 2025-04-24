import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('🔄 Verificando autenticação...');
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      if (!accessToken && !refreshToken) {
        console.log('❌ Nenhum token encontrado. Usuário não autenticado.');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Tenta validar o access token atual
        await axios.get('http://localhost:8080/api/v1/auth/validate', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setIsAuthenticated(true);
      } catch (error) {
        if (!refreshToken) {
          setIsAuthenticated(false);
          return;
        }

        try {
          // Tenta renovar o token usando o refresh token
          const response = await axios.post('http://localhost:8080/api/v1/auth/refresh', {
            refreshToken
          });

          const { 
            access_token, 
            refresh_token,
            access_token_expires_in,
            refresh_token_expires_in
          } = response.data;

          // Atualiza os cookies com os novos tokens
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

          setIsAuthenticated(true);
          console.log('✅ Token renovado com sucesso!');
        } catch (refreshError) {
          console.log('❌ Falha ao renovar o token.');
          setIsAuthenticated(false);
          // Limpa os cookies expirados
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    Cookies.set('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken);
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