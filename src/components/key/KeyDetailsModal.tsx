import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faKey, faCopy } from '@fortawesome/free-solid-svg-icons';
import './KeyDetailsModal.css';

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

interface KeyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyData: KeyGenerationResponse | null;
  onCopy: (text: string) => void;
}

const KeyDetailsModal: React.FC<KeyDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  keyData,
  onCopy 
}) => {
  if (!isOpen || !keyData) {
    return null;
  }

  console.log('Modal Render:', { isOpen, keyData }); // Debug log

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* ...existing modal content... */}
      </div>
    </div>
  );
};

export default KeyDetailsModal;