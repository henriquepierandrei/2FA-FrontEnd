import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Account.css';
import { api } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface UserProfile {
  username: string;
  email: string;
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
      setLoading(true);
      const response = await api.get('/report/get/account/profile');
      setProfile(response.data);
      // Update form data with current username
      setFormData(prev => ({
        ...prev,
        username: response.data.username || ''
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Falha ao carregar perfil');
        console.error('Error fetching profile:', err.response?.data);
      } else {
        setError('Falha ao carregar perfil');
        console.error('Unexpected error:', err);
      }
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
    
    // Validate passwords in frontend only
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        setError('A nova senha deve ter pelo menos 8 caracteres');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
    }

    try {
      setLoading(true);
      // Only send oldPassword and newPassword to backend
      await api.put('/auth/update/password', {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Senha atualizada com sucesso!');
      setIsEditing(false);
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao atualizar senha');
      } else {
        setError('Erro ao atualizar perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  

  if (loading && !profile) {
    return <LoadingSpinner />;
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
                  <FontAwesomeIcon icon={faUser} style={{marginRight: "10px"}}/>
                  Nome do Usuário
                </label>
                <input
                  type="text"
                  style={{color: 'gray'}}
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} style={{marginRight: "10px"}}/>
                  Email
                </label>
                <input
                  type="email"
                  style={{color: 'gray'}}
                  value={profile?.email}
                  disabled
                />
              </div>
              
              {isEditing && (
                <>
                  <div className="form-group">
                    <label>
                      <FontAwesomeIcon icon={faLock} style={{marginRight: "10px"}}/>
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
                      <FontAwesomeIcon icon={faLock} style={{marginRight: "10px"}}/>
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
                      <FontAwesomeIcon icon={faLock} style={{marginRight: "10px"}}/>
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
                      <FontAwesomeIcon icon={faSave} style={{marginRight: "10px"}}/>
                      Salvar
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;