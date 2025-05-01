import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faCopy } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/img/logo.png';
import api from '../../services/api-route';
import axios from 'axios';
import './ApiKeys.css';
import KeyGenerationModal from '../../components/key/KeyGenerationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ApiKey {
  id: string;
  createdAt: string; // Format: "DD/MM/YYYY HH:mm:ss"
  lastUsedAt: string; // Format: "DD/MM/YYYY HH:mm:ss"
}

interface KeyGenerationResponse {
  status: string;
  uuidInfo: {
    userOwnerId: string;
  };
  keyInfo: {
    key: string;
    label: string;
    active: boolean;
  };
  timeInfo: {
    createdAt: string;
    availableForNewKeyAt: string;
  };
}

const ApiKeys = () => {
  const [key, setKey] = useState<ApiKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedKeyData, setGeneratedKeyData] = useState<KeyGenerationResponse | null>(null);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const response = await api.get('/key/get');
      setKey(response.data);
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
      const response = await api.post<KeyGenerationResponse>('/key/generate');
      setGeneratedKeyData(response.data);
      // Update the key state with the new key data
      setKey({
        id: response.data.keyInfo.key,
        createdAt: new Date(response.data.timeInfo.createdAt).toLocaleString('pt-BR'),
        lastUsedAt: ''
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle API error response
        const errorMessage = err.response?.data?.message || 'Erro ao gerar nova chave API';
        setError(errorMessage);
        console.error('Error generating key:', err.response?.data);
      } else {
        // Handle unexpected errors
        setError('Erro inesperado ao gerar chave');
        console.error('Unexpected error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setSuccess('Chave copiada para a área de transferência!');
    setTimeout(() => setSuccess(null), 3000);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="api-keys-container">
      <div className="page-header">
        <h1 className='div-logo' ><img src={Logo} alt="" width={50}/>Chave API</h1>
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

      {generatedKeyData && (
        <KeyGenerationModal
          keyData={generatedKeyData}
          onClose={() => setGeneratedKeyData(null)}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
};

export default ApiKeys;