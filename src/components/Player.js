import React from 'react';
import DraggableCard from './DraggableCard';

function Player({ 
  player, 
  isCurrentPlayer, 
  onPlayCard 
}) {
  const renderHand = () => {
    // Calculate the spread of cards based on hand size
    const totalCards = player.hand.length;
    const maxSpread = Math.min(totalCards * 30, 300); // Maximum spread width
    
    return player.hand.map((card, index) => {
      // Calculate position and rotation for each card
      const offset = totalCards > 1 
        ? (maxSpread / (totalCards - 1)) * index - (maxSpread / 2)
        : 0;
      const rotation = offset / 10; // Slight rotation based on position

      return (
        <div 
          key={card.id} 
          style={{
            position: 'absolute',
            left: '50%',
            transform: `translateX(${offset}px) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
            zIndex: index,
            marginTop: Math.abs(offset) * 0.2, // Slight vertical arc
          }}
        >
          <DraggableCard
            card={card}
            onPlayCard={onPlayCard}
            isPlayable={isCurrentPlayer}
          />
        </div>
      );
    });
  };

  return (
    <div className={`player ${isCurrentPlayer ? 'current-player' : ''}`} style={{
      position: 'relative',
      padding: '20px',
      margin: '10px',
      backgroundColor: isCurrentPlayer ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: '15px',
      transition: 'background-color 0.3s ease',
      border: isCurrentPlayer ? '2px solid #4CAF50' : '2px solid transparent',
      minHeight: '160px'
    }}>
      {/* Player Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{
          fontWeight: 'bold',
          color: isCurrentPlayer ? '#4CAF50' : '#666'
        }}>
          {player.name}
          {isCurrentPlayer && (
            <span style={{
              marginLeft: '10px',
              fontSize: '0.9em',
              color: '#4CAF50'
            }}>
              Your Turn
            </span>
          )}
        </div>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#ffd700',
          padding: '4px 8px',
          borderRadius: '5px',
          fontSize: '0.9em'
        }}>
          Score: {player.score}
        </div>
      </div>

      {/* Cards Container */}
      <div style={{
        position: 'relative',
        height: '100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {renderHand()}
      </div>

      {/* Home Pile */}
      <div style={{
        position: 'absolute',
        right: '10px',
        bottom: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#ffd700',
        padding: '4px 8px',
        borderRadius: '5px',
        fontSize: '0.9em'
      }}>
        Cards in home: {player.home.length}
      </div>
    </div>
  );
}

export default Player;