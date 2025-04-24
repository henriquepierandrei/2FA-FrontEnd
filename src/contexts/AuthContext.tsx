import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { parseCookies, setCookie } from "nookies";
import axios from 'axios';
import {isTokenExpired} from '../api/api'



// Contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Função para verificar a autenticação
  useEffect(() => {
    console.log("🔄 Verificando autenticação...");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = parseCookies()["accessToken"];
  
    if (!token) {
      console.log("❌ Nenhum token encontrado. Usuário não autenticado.");
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
  
    if (isTokenExpired(token)) {
      console.log("⏳ Token expirado. Tentando renovar...");
  
      try {
        const refreshToken = parseCookies()["refreshToken"];
        if (!refreshToken) throw new Error("Refresh token não encontrado");
  
        const response = await axios.post("http://localhost:8080/api/v1/auth/refresh", {
          refreshToken,
        });
  
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
  
        // Atualiza os cookies com os novos tokens
        setCookie(null, "accessToken", newAccessToken, { maxAge: 30 * 24 * 60 * 60, path: "/" });
        setCookie(null, "refreshToken", newRefreshToken, { maxAge: 30 * 24 * 60 * 60, path: "/" });
  
        console.log("✅ Token renovado. Usuário autenticado.");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Erro ao renovar o token:", error);
        logout();
      }
    } else {
      console.log("✅ Token válido! Usuário autenticado.");
      setIsAuthenticated(true);
    }
  
    setIsLoading(false);
  };
  

  // Função de login
  const login = async (token: string) => {
    // Salva o token no cookie
    setCookie(null, "accessToken", token, {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: "/",
      secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
      sameSite: "lax", // Política de segurança
    });
  
    console.log("🔑 Token salvo:", token);
  
    // Aguarda um pequeno atraso para garantir que o cookie seja salvo
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    // Verifica se o cookie foi salvo corretamente
    const savedToken = parseCookies()["accessToken"];
    console.log("📌 Cookie salvo:", savedToken);
  
    // Atualiza o estado de autenticação
    if (savedToken) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      console.error("❌ Erro: Cookie não foi salvo corretamente.");
    }
  };

  // Função de logout
  const logout = () => {
    setIsAuthenticated(false);
    setCookie(null, "accessToken", "", {
      maxAge: -1, // Remove o cookie
      path: "/",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};