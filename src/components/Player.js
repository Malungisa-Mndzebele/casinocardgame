import React from 'react';
import DraggableCard from './DraggableCard';

function Player({ player, isCurrentPlayer, onPlayCard, onCaptureCards }) {
  return (
    <div className={`player ${isCurrentPlayer ? 'current-player' : ''}`} style={{
      backgroundColor: isCurrentPlayer ? '#f0f0f0' : '#e0e0e0',
      padding: '10px',
      borderRadius: '10px',
      marginBottom: '20px',
    }}>
      <h2>{player.name}</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        padding: '10px 0',
      }}>
        {player.hand.map((card, index) => (
          <div key={index} style={{ marginRight: '10px', flex: '0 0 auto' }}>
            <DraggableCard
              card={card}
              onPlayCard={onPlayCard}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        Cards in home: {player.home.length}
      </div>
    </div>
  );
}

export default Player;