import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { TemplateElement } from './types';
import './StyleEditor.css';

interface StyleEditorProps {
  element: TemplateElement;
  onUpdate: (styles: any) => void;
  onClose: () => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({
  element,
  onUpdate,
  onClose
}) => {
  return (
    <div className="style-editor">
      <div className="editor-header">
        <h3>Editar Estilos</h3>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="editor-content">
        {/* Text Styles */}
        {['header', 'text', 'button'].includes(element.type) && (
          <>
            <div className="style-group">
              <label>Cor do Texto</label>
              <input
                type="color"
                value={element.styles.color || '#000000'}
                onChange={(e) => onUpdate({ color: e.target.value })}
              />
            </div>

            <div className="style-group">
              <label>Tamanho da Fonte</label>
              <select
                value={element.styles.fontSize}
                onChange={(e) => onUpdate({ fontSize: e.target.value })}
              >
                <option value="14px">Pequeno</option>
                <option value="16px">Médio</option>
                <option value="20px">Grande</option>
                <option value="24px">Título</option>
                <option value="32px">Destaque</option>
              </select>
            </div>

            <div className="style-group">
              <label>Alinhamento</label>
              <div className="alignment-buttons">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    className={`align-btn ${element.styles.textAlign === align ? 'active' : ''}`}
                    onClick={() => onUpdate({ textAlign: align })}
                  >
                    <FontAwesomeIcon icon={
                      align === 'left' ? faAlignLeft :
                      align === 'center' ? faAlignCenter :
                      faAlignRight
                    } />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Button Styles */}
        {element.type === 'button' && (
          <>
            <div className="style-group">
              <label>Cor do Botão</label>
              <input
                type="color"
                value={element.styles.buttonColor || '#6db33f'}
                onChange={(e) => onUpdate({ buttonColor: e.target.value })}
              />
            </div>

            <div className="style-group">
              <label>Link do Botão</label>
              <input
                type="url"
                value={element.styles.buttonLink || ''}
                onChange={(e) => onUpdate({ buttonLink: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {/* Image Styles */}
        {element.type === 'image' && (
          <>
            <div className="style-group">
              <label>URL da Imagem</label>
              <input
                type="url"
                value={element.styles.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="style-group">
              <label>Texto Alternativo</label>
              <input
                type="text"
                value={element.styles.imageAlt || ''}
                onChange={(e) => onUpdate({ imageAlt: e.target.value })}
                placeholder="Descrição da imagem..."
              />
            </div>
          </>
        )}

        {/* Column Styles */}
        {element.type === 'columns' && (
          <div className="style-group">
            <label>Layout de Colunas</label>
            <select
              value={element.styles.columnLayout}
              onChange={(e) => onUpdate({ columnLayout: e.target.value })}
            >
              <option value="2">2 Colunas</option>
              <option value="3">3 Colunas</option>
              <option value="4">4 Colunas</option>
            </select>
          </div>
        )}

        {/* Common Styles */}
        <div className="style-group">
          <label>Padding</label>
          <input
            type="text"
            value={element.styles.padding || ''}
            onChange={(e) => onUpdate({ padding: e.target.value })}
            placeholder="15px"
          />
        </div>

        <div className="style-group">
          <label>Margin</label>
          <input
            type="text"
            value={element.styles.margin || ''}
            onChange={(e) => onUpdate({ margin: e.target.value })}
            placeholder="10px"
          />
        </div>

        <div className="style-group">
          <label>Cor de Fundo</label>
          <input
            type="color"
            value={element.styles.backgroundColor || '#ffffff'}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};