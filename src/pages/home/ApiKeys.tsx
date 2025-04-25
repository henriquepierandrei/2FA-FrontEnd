import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTrash, faCopy, faPlus } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api-route';
import axios from 'axios';
import './ApiKeys.css';
import DeleteKeyModal from '../../components/DeleteKeyModal';

interface ApiKey {
  id: string;
  createdAt: string; // Format: "DD/MM/YYYY HH:mm:ss"
  lastUsedAt: string; // Format: "DD/MM/YYYY HH:mm:ss"
}

const ApiKeys = () => {
  const [key, setKey] = useState<ApiKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const response = await api.get('/key/get');
      setKey(response.data);
      console.log(response.data.createdAt);
    } catch (err) {
      setError('Falha ao carregar a chave API');
    } finally {
      setLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (!window.confirm('Gerar uma nova chave irá invalidar a chave atual. Deseja continuar?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/v1/key/generate');
      setKey(response.data);
      setSuccess('Nova chave API gerada com sucesso!');
    } catch (err) {
      setError('Erro ao gerar nova chave API');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setSuccess('Chave copiada para a área de transferência!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const deleteKey = async (password: string) => {
    if (!password) {
      setDeleteError('Senha é obrigatória');
      return;
    }

    try {
      setLoading(true);
      await api.delete('/key/delete', {
        data: { password }
      });
      setKey(null);
      setSuccess('Chave API excluída com sucesso');
      setIsDeleteModalOpen(false);
      setDeleteError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setDeleteError('Senha incorreta');
      } else {
        setDeleteError('Erro ao excluir a chave API');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="api-keys-container">
      <div className="page-header">
        <h1>Chave API</h1>
        <button 
          className="create-key-btn"
          onClick={generateNewKey}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faKey} />
          Gerar Nova Chave
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {key ? (
        <div className="key-card">
          <div className="key-header">
            <FontAwesomeIcon icon={faKey} className="key-icon" />
            <h3 className='h3-key-info'>Sua Chave API</h3>
          </div>
          <div className="key-content">
            <div className="key-info">
              <span>Criada em: {key.createdAt}</span>
              {key.lastUsedAt && (
                <span>Último uso: {key.lastUsedAt}</span>
              )}
            </div>
            <div className="key-value">
              <code>ID: {key.id}</code>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(key.id)}
                title="Copiar chave"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            <p className='p-info-key'>A Key só pode ser visualizada no momento da geração, depois disso é impossível visualizá-la novamente!</p>
          </div>
          <div className="key-actions">
            <button 
              className="delete-key-btn"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
              Excluir Chave
            </button>
          </div>
        </div>
      ) : (
        <div className="no-key">
          <p>Você ainda não possui uma chave API.</p>
          <button 
            className="create-key-btn"
            onClick={generateNewKey}
            disabled={loading}
          >
            Gerar Chave
          </button>
        </div>
      )}

      <DeleteKeyModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteError(null);
        }}
        onConfirm={deleteKey}
        error={deleteError}
      />
    </div>
  );
};

export default ApiKeys;