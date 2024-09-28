import React from 'react';
import { useDrag } from 'react-dnd';
import Card from './Card';

function DraggableCard({ card, onPlayCard }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card },
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
        cursor: 'move',
        width: '60px', // Fixed width for the card
      }}
    >
      <Card card={card} />
    </div>
  );
}

export default DraggableCard;