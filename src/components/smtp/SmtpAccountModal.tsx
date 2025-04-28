import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import './SmtpAccountModal.css';

interface SmtpAccount {
  host: string;
  port: number;
  username: string;
  password: string;
  smtpAuth: boolean;
  smtpStarttls: boolean;
}

interface SmtpAccountModalProps {
  account: SmtpAccount | null;
  onClose: () => void;
  onSave: (account: Partial<SmtpAccount>) => Promise<void>;
}

const SmtpAccountModal: React.FC<SmtpAccountModalProps> = ({
  account,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    username: '',
    password: '',
    smtpAuth: true,
    smtpStarttls: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setFormData({
        ...account,
        password: '' // Don't show existing password
      });
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('Falha ao salvar conta SMTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2>{account ? 'Editar Conta SMTP' : 'Nova Conta SMTP'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="host">Host</label>
            <input
              id="host"
              type="text"
              value={formData.host}
              onChange={e => setFormData(prev => ({
                ...prev,
                host: e.target.value
              }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="port">Porta</label>
            <input
              id="port"
              type="number"
              value={formData.port}
              onChange={e => setFormData(prev => ({
                ...prev,
                port: parseInt(e.target.value)
              }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="email"
              value={formData.username}
              onChange={e => setFormData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              required={!account}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                style={{ marginRight: '5px' }}
                checked={formData.smtpAuth}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  smtpAuth: e.target.checked
                }))}
              />
              Autenticação SMTP
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                style={{ marginRight: '5px' }}
                checked={formData.smtpStarttls}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  smtpStarttls: e.target.checked
                }))}
              />
              STARTTLS
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading} className='delete-key-btn'>
              Cancelar
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmtpAccountModal;