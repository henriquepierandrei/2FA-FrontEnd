import { useState } from 'react';
import './Login.css';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="login-container">
      
      <div className="login-card">
        <div className="login-header">
          <h2>Acesse sua conta</h2>
          <p>Ou <a href="#" className="signup-link">cadastre-se gratuitamente</a></p>
        </div>
        
        <form className="login-form">
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
              <a href="#" className="forgot-password">Esqueceu a senha?</a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
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