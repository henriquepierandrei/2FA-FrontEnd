import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';
import axios from 'axios';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<TokenResponse>("https://twofaspring-latest.onrender.com/api/v1/auth/login", {
        email,
        password
      });

      const { 
        access_token, 
        refresh_token, 
        access_token_expires_in, 
        refresh_token_expires_in 
      } = response.data;

      // Calculate expiration dates
      const accessTokenExpiry = new Date(Date.now() + access_token_expires_in * 1000);
      const refreshTokenExpiry = new Date(Date.now() + refresh_token_expires_in * 1000);

      // Set cookies with proper expiration
      Cookies.set('accessToken', access_token, {
        expires: accessTokenExpiry,
        secure: true,
        sameSite: 'strict'
      });

      Cookies.set('refreshToken', refresh_token, {
        expires: refreshTokenExpiry,
        secure: true,
        sameSite: 'strict'
      });

      // Save email if remember me is checked
      if (rememberMe) {
        Cookies.set('rememberedEmail', email, { 
          expires: 30,
          secure: true,
          sameSite: 'strict'
        });
      } else {
        Cookies.remove('rememberedEmail');
      }

      // Update auth context
      login(response.data);

      setSuccess("Login bem sucedido!");
      navigate("/smtp"); // Redirect to SMTP page instead of dashboard

    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.message || "Credenciais inválidas. Verifique seu email e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = Cookies.get('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Atualize o JSX do formulário para incluir o onSubmit e o botão de mostrar senha
  return (
    <div className="login-container">
      <div className="login-card">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
        <div className="login-header">
          <h2>Acesse sua conta</h2>
          <p>Ou <a href="/register" className="signup-link">cadastre-se gratuitamente</a></p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Senha</label>
              <button 
                type="button" 
                className="show-password-button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="remember-me">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Lembrar de mim</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`login-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span className="lock-icon"></span>
                <span>Entrar</span>
              </>
            )}
          </button>
          
          <div className="social-login">
            <p>Ou continue com</p>
            <div className="social-buttons">
              <button type="button" className="google-button">
                <span className="google-icon"></span>
                Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;