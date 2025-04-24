import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

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
      const response = await axios.post<TokenResponse>(
        "http://localhost:8080/api/v1/auth/login",
        { email, password }
      );

      const { 
        access_token, 
        refresh_token, 
        access_token_expires_in, 
        refresh_token_expires_in 
      } = response.data;

      // Converter expirações de segundos para dias
      const accessTokenExpiresInDays = access_token_expires_in / (24 * 60 * 60);
      const refreshTokenExpiresInDays = refresh_token_expires_in / (24 * 60 * 60);

      // Salvar tokens em cookies seguros
      Cookies.set('accessToken', access_token, {
        expires: accessTokenExpiresInDays,
        secure: true,
        sameSite: 'strict'
      });

      Cookies.set('refreshToken', refresh_token, {
        expires: refreshTokenExpiresInDays,
        secure: true,
        sameSite: 'strict'
      });

      // Update authentication state using context
      login(access_token, refresh_token);

      // Salvar email em cookie se "lembrar-me" estiver marcado
      if (rememberMe) {
        Cookies.set('rememberedEmail', email, { expires: 30 });
      } else {
        Cookies.remove('rememberedEmail');
      }

      setSuccess("Login bem sucedido!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Erro no login:", err);
      setError("Credenciais inválidas. Verifique seu email e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Atualize o JSX do formulário para incluir o onSubmit e o botão de mostrar senha
  return (
    <div className="login-container">
      <div className="login-card">
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

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;