import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPlus, faPencilAlt, faTrash, faSync } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api-route';
import './SmtpAccounts.css';
import SmtpAccountModal from '../../components/smtp/SmtpAccountModal';

interface SmtpAccount {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  smtpAuth: boolean;
  smtpStarttls: boolean;
  hasAvailable: boolean;
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
      if (account.id) {
        await api.put(`/smtp/accounts/${account.id}`, account);
      } else {
        await api.post('/smtp/accounts', account);
      }
      fetchAccounts();
      setIsModalOpen(false);
    } catch (err) {
      setError('Falha ao salvar conta SMTP');
    }
  };

    function handleDeleteAccount(id: string): void {
        throw new Error('Function not implemented.');
    }

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

      {loading ? (
        <div className="loading">Carregando...</div>
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
                <div className="info-row">
                  <span>Disponível:</span>
                  <strong className={account.hasAvailable ? 'available' : 'unavailable'}>
                    {account.hasAvailable ? 'Sim' : 'Não'}
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