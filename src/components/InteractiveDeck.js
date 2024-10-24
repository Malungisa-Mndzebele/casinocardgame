// src/components/InteractiveDeck.js
import React, { useState } from 'react';

function InteractiveDeck({ onCardSelect, cardsSelected, maxSelections }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cardStack = Array(52).fill(null).map((_, index) => ({
    id: index,
    offset: index * 0.3,
  }));

  return (
    <div style={{
      position: 'relative',
      width: '300px',
      height: '400px',
      margin: '0 auto',
      perspective: '1000px'
    }}>
      {cardStack.map((card, index) => (
        <div
          key={card.id}
          onClick={() => {
            if (cardsSelected < maxSelections) {
              onCardSelect(index);
            }
          }}
          style={{
            position: 'absolute',
            width: '100px',
            height: '140px',
            backgroundColor: hoveredIndex === index ? '#2c3e50' : '#34495e',
            border: '2px solid #fff',
            borderRadius: '10px',
            transform: `
              translateZ(${-card.offset}px) 
              translateY(${card.offset}px)
              ${hoveredIndex === index ? 'scale(1.1)' : ''}
            `,
            transition: 'transform 0.3s ease',
            cursor: cardsSelected < maxSelections ? 'pointer' : 'default',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div style={{
            backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, #2c3e50 25%, #2c3e50 50%, #1a1a1a 50%, #1a1a1a 75%, #2c3e50 75%, #2c3e50 100%)',
            backgroundSize: '20px 20px',
            width: '100%',
            height: '100%',
            borderRadius: '8px'
          }} />
        </div>
      ))}
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        textAlign: 'center'
      }}>
        Selected: {cardsSelected} / {maxSelections}
      </div>
    </div>
  );
}

export default InteractiveDeck;