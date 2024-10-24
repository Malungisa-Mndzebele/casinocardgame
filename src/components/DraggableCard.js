import React from 'react';
import { useDrag } from 'react-dnd';
import Card from './Card';

function DraggableCard({ 
  card, 
  onPlayCard, 
  isPlayable 
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card },
    canDrag: isPlayable,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onPlayCard(card, dropResult);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: isPlayable ? 'grab' : 'default',
        transform: `scale(${isDragging ? 1.05 : 1})`,
        transition: 'transform 0.2s ease',
      }}
    >
      <Card 
        card={card} 
        isHighlighted={isPlayable}
      />
    </div>
  );
}

export default DraggableCard;