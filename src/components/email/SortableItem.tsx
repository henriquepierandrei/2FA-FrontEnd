import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  element: {
    id: string;
    type: 'header' | 'text' | 'image' | 'divider' | 'column2';
    content: string;
  };
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, element, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="template-element">
        <input
          type="text"
          value={element.content}
          onChange={(e) => onEdit(id, e.target.value)}
        />
        <button onClick={() => onDelete(id)}>Excluir</button>
      </div>
    </div>
  );
};