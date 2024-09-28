import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './Card';

function DroppableTable({ cards = [], player1Home = [], player2Home = [] }) {
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

  const homeStyle = {
    width: '100px',
    height: '150px',
    border: '2px dashed #ffd700',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffd700',
    fontSize: '14px',
    position: 'absolute',
    zIndex: 1,
  };

  const dealerStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    zIndex: 2,
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
      
      {/* Player 1 Home */}
      <div style={{...homeStyle, top: '20px', left: '20px'}}>
        Player 1 Home
        <br />
        {player1Home?.length || 0} cards
      </div>

      {/* Player 2 Home */}
      <div style={{...homeStyle, bottom: '20px', right: '20px'}}>
        Player 2 Home
        <br />
        {player2Home?.length || 0} cards
      </div>

      {/* Dealer */}
      <div style={dealerStyle}>
        Dealer
      </div>

      {cards.map((card, index) => (
        <Card
          key={index}
          card={card}
          style={{
            position: 'absolute',
            left: card.x,
            top: card.y,
            zIndex: '2',
          }}
        />
      ))}
    </div>
  );
}

export default DroppableTable;