import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './Card';
import { User } from 'lucide-react';

function DroppableTable({ 
  cards = [], 
  player1Home = [], 
  player2Home = [], 
  dealingPhase,
  isPlayer1,
  onCardSelect,
  selectedCards = [],
  deckCards = []
}) {
  const [, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const tableRect = document.getElementById('table').getBoundingClientRect();
      return {
        x: offset.x - tableRect.left,
        y: offset.y - tableRect.top,
      };
    },
  }));

  // Calculate positions for the deck display
  const getDeckPosition = (index, total) => {
    const baseOffset = 0.3;
    const maxSpread = 50; // Maximum spread of cards in pixels
    const spread = Math.min(maxSpread, total * baseOffset);
    return {
      x: index * (spread / total),
      y: index * baseOffset,
      z: -index
    };
  };

  // Get message for current phase
  const getPhaseMessage = () => {
    switch (dealingPhase) {
      case 'selecting':
        return isPlayer1 
          ? `Select 4 cards to place face-up (${selectedCards.length}/4)`
          : "Player 1 is selecting initial cards...";
      case 'dealing':
        return "Dealing cards...";
      case 'watching_selection':
        return `Player 1 is selecting cards (${selectedCards.length}/4)`;
      default:
        return "";
    }
  };

  return (
    <div
      id="table"
      ref={drop}
      style={{
        width: '100%',
        height: '500px',
        border: '20px solid #8B4513',
        borderRadius: '50px',
        position: 'relative',
        backgroundColor: '#35654d',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}
    >
      {/* Table pattern */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: `
          radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.2) 100%),
          repeating-linear-gradient(45deg, #2d5a44 0px, #2d5a44 2px, #35654d 2px, #35654d 20px)
        `,
        opacity: '0.7',
      }} />

      {/* Phase Message */}
      {dealingPhase !== 'playing' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '10px',
          zIndex: 100,
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          {getPhaseMessage()}
        </div>
      )}

      {/* Dealer Avatar */}
      {dealingPhase !== 'playing' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          zIndex: 100,
          border: '3px solid #ffd700'
        }}>
          <User size={40} color="white" />
        </div>
      )}

      {/* Interactive Deck Display */}
      {(dealingPhase === 'selecting' || dealingPhase === 'watching_selection') && (
        <div style={{
          position: 'absolute',
          left: '50px',
          top: '50%',
          transform: 'translateY(-50%)',
          perspective: '1000px',
          width: '150px',
          height: '200px'
        }}>
          {deckCards.filter(card => !card.used).map((card, index, array) => {
            const { x, y, z } = getDeckPosition(index, array.length);
            return (
              <div
                key={card.id}
                onClick={() => isPlayer1 && dealingPhase === 'selecting' && onCardSelect(deckCards.indexOf(card))}
                style={{
                  position: 'absolute',
                  width: '100px',
                  height: '140px',
                  backgroundColor: '#34495e',
                  border: '2px solid white',
                  borderRadius: '10px',
                  transform: `translate(${x}px, ${y}px) translateZ(${z}px)`,
                  cursor: isPlayer1 && dealingPhase === 'selecting' ? 'pointer' : 'default',
                  transition: 'transform 0.3s ease',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  background: 'linear-gradient(45deg, #2c3e50 25%, #34495e 25%, #34495e 50%, #2c3e50 50%, #2c3e50 75%, #34495e 75%, #34495e)',
                  backgroundSize: '20px 20px'
                }}
                onMouseEnter={e => {
                  if (isPlayer1 && dealingPhase === 'selecting') {
                    e.currentTarget.style.transform = `translate(${x}px, ${y}px) translateZ(${z}px) scale(1.1)`;
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (isPlayer1 && dealingPhase === 'selecting') {
                    e.currentTarget.style.transform = `translate(${x}px, ${y}px) translateZ(${z}px)`;
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {/* Selected and Played Cards */}
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          style={{
            position: 'absolute',
            left: card.x,
            top: card.y,
            transform: `translate(-50%, -50%) ${card.isSelected ? 'scale(1.1)' : ''}`,
            transition: 'all 0.5s ease',
            zIndex: card.isSelected ? 20 + index : 10 + index,
            boxShadow: card.isSelected 
              ? '0 0 20px rgba(255,215,0,0.5)' 
              : '0 2px 5px rgba(0,0,0,0.2)',
          }}
        />
      ))}

      {/* Player Homes */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#ffd700',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        Player 1 Home: {player1Home.length}
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: '#ffd700',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        Player 2 Home: {player2Home.length}
      </div>
    </div>
  );
}

export default DroppableTable;