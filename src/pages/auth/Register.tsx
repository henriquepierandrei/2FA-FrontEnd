import React, { useState } from 'react';
import './Register.css'; // Importando o arquivo CSS

function Register() {
  // Estado inicial do formulário com apenas os campos necessários
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Adicione estes dois estados
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Estados para controle da interface
  const [isLoading, setIsLoading] = useState(false); // Controla o estado de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagens de erro
  const [success, setSuccess] = useState<string | null>(null); // Mensagens de sucesso

  // Função que lida com as mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  

  // Função que processa o envio do formulário
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const { email, username, password } = formData;

    // Validação dos campos obrigatórios
    if (!email || !password || !username) {
        setError('Todos os campos são obrigatórios');
        return;
    }

    setIsLoading(true); // Inicia o estado de carregamento

    try {
        // Faz a requisição para a API de registro
        // const response = await axios.post("http://localhost:8080/api/v1/auth/register", {
        //     email,
        //     username,
        //     password
        // });

        setSuccess('Registro realizado com sucesso!');
        setError(null);
    } catch (err: any) {
        // Tratamento de erros da API
        setError(err.response?.data?.message || 'Erro ao realizar registro');
        setSuccess(null);
    } finally {
        setIsLoading(false); // Finaliza o estado de carregamento
    }
  };

  // Tipando o parâmetro 'e'
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (formData.password !== formData.confirmPassword) {
  //     alert("As senhas não coincidem!");
  //     return;
  //   }
    
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     console.log('Registro com:', formData);
  //     // Implementar lógica real
  //   }, 1500);
  // };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Crie sua conta</h2>
          <p>Já tem uma conta? <a href="/login" className="login-link">Faça login</a></p>
        </div>

        {/* Mensagem de erro ou sucesso */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nome de usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Seu nome de usuário"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
              >
                {passwordVisible ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirme a senha</label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={confirmPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
              >
                {confirmPasswordVisible ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="terms-privacy">
            <input type="checkbox" id="agree-terms" required />
            <label htmlFor="agree-terms">
              Eu concordo com os <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`register-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Processando...</span>
              </>
            ) : (
              <span>Criar conta</span>
            )}
          </button>

          <div className="social-register">
            <p>Ou registre-se com</p>
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

export default Register;