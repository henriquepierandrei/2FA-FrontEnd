import React, { useState, useEffect, use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPlus, faPencilAlt, faTrash, faSync } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../api/api';
import './SmtpAccounts.css';
import SmtpAccountModal from './SmtpAccountModal';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

interface SmtpAccount {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  smtpAuth: boolean;
  smtpStarttls: boolean;
  sentNumber: number;
  lastUsedAt: string;
  quantitySentInInterval: number;
}

interface SmtpAccountsResponse {
  smtpAccountDtoList: SmtpAccount[];
}

const SmtpAccounts = () => {
  const [accounts, setAccounts] = useState<SmtpAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SmtpAccount | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get<SmtpAccountsResponse>('/smtp/get');
      setAccounts(response.data.smtpAccountDtoList);
    } catch (err) {
      setError('Falha ao carregar contas SMTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccount = async (account: Partial<SmtpAccount>) => {
    try {
      setLoading(true);
      setError(null);

      if (account.id) {
        // Update existing account
        await api.put(`/smtp/update?smtpAccountId=${account.id}`, {
          host: account.host,
          port: account.port,
          username: account.username,
          password: account.password, // Only sent if changed
          smtpAuth: account.smtpAuth,
          smtpStarttls: account.smtpStarttls
        });
        setSuccess('Conta SMTP atualizada com sucesso!');
      } else {
        // Create new account
        await api.post('/smtp/register', account);
        setSuccess('Conta SMTP criada com sucesso!');
      }
      
      // Refresh accounts list
      await fetchAccounts();
      setIsModalOpen(false);
      setEditingAccount(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Falha ao salvar conta SMTP');
        console.error('Error saving SMTP account:', err.response?.data);
      } else {
        setError('Erro inesperado ao salvar conta SMTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta conta SMTP?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      var response = await api.delete('/smtp/delete', {
        params: {
          smtpAccountId: id
        }
      });

      setSuccess(response.data.message || 'Conta SMTP excluída com sucesso!');
      await fetchAccounts(); // Refresh the list
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Falha ao excluir conta SMTP');
        console.error('Error deleting SMTP account:', err.response?.data);
      } else {
        setError('Erro inesperado ao excluir conta SMTP');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smtp-accounts-container">
      <div className="page-header">
        <h1>
          <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
          Contas SMTP
        </h1>
        <button 
          className="add-account-btn"
          onClick={() => {
            setEditingAccount(null);
            setIsModalOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Nova Conta
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <LoadingSpinner />  
      ) : (
        <div className="accounts-grid">
          {accounts.map(account => (
            <div key={account.id} className="account-card">
              <div className="card-header">
                <h3>{account.username}</h3>
                <div className="card-actions">
                  <button 
                    className="icon-btn edit"
                    onClick={() => {
                      setEditingAccount(account);
                      setIsModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button 
                    className="icon-btn delete"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <span>Host:</span>
                  <strong>{account.host}</strong>
                </div>
                <div className="info-row">
                  <span>Porta:</span>
                  <strong>{account.port}</strong>
                </div>
                <div className="info-row">
                  <span>Autenticação:</span>
                  <strong>{account.smtpAuth ? 'Sim' : 'Não'}</strong>
                </div>
                <div className="info-row">
                  <span>STARTTLS:</span>
                  <strong>{account.smtpStarttls ? 'Sim' : 'Não'}</strong>
                </div>
                <div className="info-row">
                  <span>Emails Enviados:</span>
                  <strong>{account.sentNumber}</strong>
                </div>
                <div className="info-row">
                  <span>Último Uso:</span>
                  <strong>
                    {new Date(account.lastUsedAt).toLocaleString('pt-BR')}
                  </strong>
                </div>
              
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <SmtpAccountModal
          account={editingAccount}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAccount(null);
          }}
          onSave={handleSaveAccount}
        />
      )}
    </div>
  );
};

export default SmtpAccounts;