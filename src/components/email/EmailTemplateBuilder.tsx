import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeading,
  faImage,
  faFont,
  faLink,
  faPalette,
  faGripLines,
  faColumns,
  faEye,
  faCopy,
  faSquare as faButton,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { TemplateElement } from './types';

const ELEMENT_TYPES = [
  { 
    type: 'header' as const, 
    icon: faHeading, 
    label: 'Título',
    defaultStyles: {
      fontSize: '24px',
      color: '#333333',
      textAlign: 'center' as const,
      padding: '20px'
    }
  },
  { 
    type: 'text' as const, 
    icon: faFont, 
    label: 'Texto',
    defaultStyles: {
      fontSize: '16px',
      color: '#666666',
      textAlign: 'left' as const,
      padding: '15px'
    }
  },
  { 
    type: 'image' as const, 
    icon: faImage, 
    label: 'Imagem',
    defaultStyles: {
      padding: '10px',
      textAlign: 'center' as const
    }
  },
  { 
    type: 'button' as const, 
    icon: faButton, 
    label: 'Botão',
    defaultStyles: {
      buttonColor: '#6db33f',
      color: '#ffffff',
      padding: '15px 30px',
      textAlign: 'center' as const
    }
  },
  { 
    type: 'divider' as const, 
    icon: faGripLines, 
    label: 'Divisor',
    defaultStyles: {
      padding: '10px',
      backgroundColor: '#eeeeee'
    }
  },
  { 
    type: 'columns' as const, 
    icon: faColumns, 
    label: 'Colunas',
    defaultStyles: {
      columnLayout: '2' as const,
      padding: '15px',
      backgroundColor: 'transparent'
    }
  }
] as const;

const EmailTemplateBuilder: React.FC = () => {
  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<TemplateElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Update handleAddElement function
  const handleAddElement = (type: TemplateElement['type']) => {
    const elementType = ELEMENT_TYPES.find(et => et.type === type);
    if (!elementType) return;

    const newElement: TemplateElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: type === 'header' ? 'Novo Título' : 
               type === 'text' ? 'Digite seu texto aqui' :
               type === 'button' ? 'Clique aqui' : '',
      styles: elementType.defaultStyles as TemplateElement['styles']
    };

    setElements(prev => [...prev, newElement]);
  };

  const handleUpdateElement = (id: string, updates: Partial<TemplateElement>) => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const handleDeleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  const renderElement = (element: TemplateElement) => {
    const styles = {
      ...element.styles,
      backgroundColor: element.styles.backgroundColor || 'transparent'
    };

    switch (element.type) {
      case 'header':
        return <h1 style={styles}>{element.content}</h1>;
      case 'text':
        return <p style={styles}>{element.content}</p>;
      case 'button':
        return (
          <button 
            style={{
              ...styles,
              backgroundColor: element.styles.buttonColor,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {element.content}
          </button>
        );
      case 'image':
        return (
          <img 
            src={element.styles.imageUrl || 'https://via.placeholder.com/400x200'} 
            alt={element.styles.imageAlt || 'Preview'} 
            style={styles}
          />
        );
      case 'divider':
        return <hr style={styles} />;
      case 'columns':
        return (
          <div 
            style={{
              ...styles,
              display: 'grid',
              gridTemplateColumns: `repeat(${element.styles.columnLayout || 2}, 1fr)`,
              gap: '20px'
            }}
          >
            {Array(Number(element.styles.columnLayout || 2))
              .fill(null)
              .map((_, i) => (
                <div key={i} style={{ padding: '10px' }}>
                  Coluna {i + 1}
                </div>
              ))
            }
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="email-builder">
      <div className="elements-panel">
        <h3>Elementos</h3>
        <div className="element-list">
          {ELEMENT_TYPES.map(element => (
            <div 
              key={element.type}
              className="element-item"
              onClick={() => handleAddElement(element.type)}
            >
              <FontAwesomeIcon icon={element.icon} />
              <span>{element.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="template-panel">
        <div className="template-container">
          {elements.map(element => (
            <div 
              key={element.id}
              className={`template-element ${selectedElement?.id === element.id ? 'selected' : ''}`}
              onClick={() => setSelectedElement(element)}
            >
              {renderElement(element)}
              <div className="element-controls">
                <button 
                  className="control-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteElement(element.id);
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
                <button 
                  className="control-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteElement(element.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedElement && (
        <div className="style-editor">
          <h3>Editar Elemento</h3>
          {['header', 'text', 'button'].includes(selectedElement.type) && (
            <div className="style-group">
              <label>Conteúdo</label>
              <input
                type="text"
                value={selectedElement.content}
                onChange={(e) => handleUpdateElement(selectedElement.id, {
                  content: e.target.value
                })}
              />
            </div>
          )}
          
          <div className="style-group">
            <label>Cor do Texto</label>
            <input
              type="color"
              value={selectedElement.styles.color || '#000000'}
              onChange={(e) => handleUpdateElement(selectedElement.id, {
                styles: { ...selectedElement.styles, color: e.target.value }
              })}
            />
          </div>

          <div className="style-group">
            <label>Cor de Fundo</label>
            <input
              type="color"
              value={selectedElement.styles.backgroundColor || '#ffffff'}
              onChange={(e) => handleUpdateElement(selectedElement.id, {
                styles: { ...selectedElement.styles, backgroundColor: e.target.value }
              })}
            />
          </div>

          {selectedElement.type === 'button' && (
            <div className="style-group">
              <label>Link do Botão</label>
              <input
                type="url"
                value={selectedElement.styles.buttonLink || ''}
                onChange={(e) => handleUpdateElement(selectedElement.id, {
                  styles: { ...selectedElement.styles, buttonLink: e.target.value }
                })}
              />
            </div>
          )}
        </div>
      )}

      <button 
        className="preview-btn"
        onClick={() => setShowPreview(true)}
      >
        <FontAwesomeIcon icon={faEye} /> Visualizar
      </button>
    </div>
  );
};

export default EmailTemplateBuilder;