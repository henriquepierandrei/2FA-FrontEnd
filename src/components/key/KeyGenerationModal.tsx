import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faKey, faCopy } from '@fortawesome/free-solid-svg-icons';
import './KeyGenerationModal.css';

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

interface KeyGenerationModalProps {
  keyData: KeyGenerationResponse;
  onClose: () => void;
  onCopy: (text: string) => void;
}

const KeyGenerationModal: React.FC<KeyGenerationModalProps> = ({ keyData, onClose, onCopy }) => {
  const handleClose = () => {
    onClose();
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="key-generation-overlay">
      <div className="key-generation-modal">
        <button className="close-button" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="modal-header">
          <FontAwesomeIcon icon={faKey} className="key-icon" />
          <h2>Chave API Gerada com Sucesso</h2>
        </div>

        <div className="key-info">
          <div className="info-section">
            <h3>Sua Nova Chave</h3>
            <div className="key-value">
              <code>{keyData.keyInfo.key}</code>
              <button 
                onClick={() => onCopy(keyData.keyInfo.key)}
                className="copy-button"
                title="Copiar chave"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            <p className="key-label">{keyData.keyInfo.label}</p>
          </div>

          <div className="info-section">
            <h3>Informações de Tempo</h3>
            <p>Criada em: {formatDate(keyData.timeInfo.createdAt)}</p>
            <p>Próxima geração disponível em: {formatDate(keyData.timeInfo.availableForNewKeyAt)}</p>
          </div>

          <div className="warning-box">
            <strong>Atenção!</strong>
            <p>Copie e guarde esta chave em um local seguro. 
            Você não poderá visualizá-la novamente após fechar esta janela.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="confirm-button"
            onClick={handleClose}
          >
            Entendi e Copiei a Chave
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyGenerationModal;