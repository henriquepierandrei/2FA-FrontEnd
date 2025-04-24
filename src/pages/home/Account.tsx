import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faSave,
  faShield
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Account.css';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  is2FAEnabled: boolean;
}

const Account = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/v1/account/profile');
      setProfile(response.data);
      setFormData(prev => ({ ...prev, name: response.data.name }));
    } catch (err) {
      setError('Falha ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await axios.put('/api/v1/account/profile', {
        name: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const toggle2FA = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/v1/account/2fa/${profile?.is2FAEnabled ? 'disable' : 'enable'}`);
      fetchProfile();
      setSuccess(`2FA ${profile?.is2FAEnabled ? 'desativado' : 'ativado'} com sucesso!`);
    } catch (err) {
      setError('Erro ao alterar configuração 2FA');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="account-container">
      <div className="page-header">
        <h1>Configurações da Conta</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="account-grid">
        <div className="profile-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faUser} className="header-icon" />
            <h2>Perfil</h2>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  Nome do Usuário
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email}
                  disabled
                />
              </div>
              
              {isEditing && (
                <>
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faLock} />
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faLock} />
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faLock} />
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="form-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="save-btn">
                      <FontAwesomeIcon icon={faSave} />
                      Salvar
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="security-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faShield} className="header-icon" />
            <h2>Segurança</h2>
          </div>
          <div className="card-content">
            <div className="security-item">
              <div className="security-info">
                <h3>Autenticação em Duas Etapas (2FA)</h3>
                <p>
                  {profile?.is2FAEnabled 
                    ? 'A autenticação em duas etapas está ativada.'
                    : 'Ative a autenticação em duas etapas para maior segurança.'}
                </p>
              </div>
              <button
                className={`toggle-2fa-btn ${profile?.is2FAEnabled ? 'enabled' : ''}`}
                onClick={toggle2FA}
              >
                {profile?.is2FAEnabled ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;