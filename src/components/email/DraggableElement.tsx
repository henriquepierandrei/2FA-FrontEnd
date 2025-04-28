import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeading, 
  faFont, 
  faImage, 
  faGripLines, 
  faColumns 
} from '@fortawesome/free-solid-svg-icons';

interface DraggableElementProps {
  type: 'header' | 'text' | 'image' | 'divider' | 'column2';
  onAdd: () => void;
}

const icons = {
  header: faHeading,
  text: faFont,
  image: faImage,
  divider: faGripLines,
  column2: faColumns,
} as const;

export const DraggableElement: React.FC<DraggableElementProps> = ({ type, onAdd }) => {
  return (
    <div className="draggable-element" onClick={onAdd}>
      <FontAwesomeIcon icon={icons[type]} />
      <span>{type}</span>
    </div>
  );
};