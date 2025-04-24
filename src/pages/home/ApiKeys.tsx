import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTrash, faCopy, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './ApiKeys.css';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

const ApiKeys = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get('/api/v1/api-keys');
      setKeys(response.data);
    } catch (err) {
      setError('Falha ao carregar as chaves API');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      setError('O nome da chave é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/v1/api-keys', { name: newKeyName });
      setKeys([...keys, response.data]);
      setSuccess('Chave API criada com sucesso!');
      setNewKeyName('');
      setIsCreating(false);
    } catch (err) {
      setError('Erro ao criar a chave API');
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta chave API?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/v1/api-keys/${id}`);
      setKeys(keys.filter(key => key.id !== id));
      setSuccess('Chave API excluída com sucesso!');
    } catch (err) {
      setError('Erro ao excluir a chave API');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setSuccess('Chave copiada para a área de transferência!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="api-keys-container">
      <div className="page-header">
        <h1>Gerenciamento de Chaves API</h1>
        <button 
          className="create-key-btn"
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <FontAwesomeIcon icon={faPlus} />
          Nova Chave API
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {isCreating && (
        <div className="create-key-form">
          <input
            type="text"
            placeholder="Nome da chave API"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => setIsCreating(false)}>
              Cancelar
            </button>
            <button className="confirm-btn" onClick={createApiKey}>
              Criar Chave
            </button>
          </div>
        </div>
      )}

      <div className="keys-grid">
        {keys.map(key => (
          <div key={key.id} className="key-card">
            <div className="key-header">
              <FontAwesomeIcon icon={faKey} className="key-icon" />
              <h3>{key.name}</h3>
            </div>
            <div className="key-content">
              <div className="key-value">
                <code>{key.key}</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(key.key)}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
              <div className="key-info">
                <span>Criada em: {new Date(key.createdAt).toLocaleDateString()}</span>
                {key.lastUsed && (
                  <span>Último uso: {new Date(key.lastUsed).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <button 
              className="delete-btn"
              onClick={() => deleteApiKey(key.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiKeys;