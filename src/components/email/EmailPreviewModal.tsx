import {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMobileScreen, faDesktop, faCopy } from '@fortawesome/free-solid-svg-icons';
import './EmailPreviewModal.css';

interface EmailPreviewModalProps {
  html: string;
  onClose: () => void;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ html, onClose }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    alert('HTML copiado para a área de transferência!');
  };

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <div className="preview-controls">
            <button
              className={`view-toggle ${viewMode === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewMode('desktop')}
            >
              <FontAwesomeIcon icon={faDesktop} /> Desktop
            </button>
            <button
              className={`view-toggle ${viewMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewMode('mobile')}
            >
              <FontAwesomeIcon icon={faMobileScreen} /> Mobile
            </button>
          </div>
          <button className="copy-html" onClick={copyHtml}>
            <FontAwesomeIcon icon={faCopy} /> Copiar HTML
          </button>
          <button className="close-preview" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={`preview-content ${viewMode}`}>
          <div 
            className="email-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;