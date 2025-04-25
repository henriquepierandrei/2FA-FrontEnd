import React, { useState } from 'react';
import './DeleteKeyModal.css';

interface DeleteKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  error?: string | null;
}

const DeleteKeyModal = ({ isOpen, onClose, onConfirm, error }: DeleteKeyModalProps) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(password);
      setPassword('');
      onClose();
    } catch (err) {
      // Error will be handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="modal-content">
        <h2>Confirmar Exclusão</h2>
        <p>Digite sua senha para confirmar a exclusão da chave API:</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="delete-key-btn"
              disabled={!password || isSubmitting}
            >
              {isSubmitting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteKeyModal;