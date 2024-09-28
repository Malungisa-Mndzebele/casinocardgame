import React from 'react';

function Card({ card, style }) {
  const getSuitColor = (suit) => {
    switch(suit) {
      case '♥':
      case '♦':
        return 'red';
      case '♠':
      case '♣':
        return 'black';
      default:
        return 'black';
    }
  };

  const getBackgroundColor = (suit) => {
    switch(suit) {
      case '♥': return '#ffcccb'; // Light red
      case '♦': return '#ffd700'; // Gold
      case '♠': return '#add8e6'; // Light blue
      case '♣': return '#90ee90'; // Light green
      default: return 'white';
    }
  };

  return (
    <div style={{
      ...style,
      width: '60px',
      height: '90px',
      border: '2px solid #333',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: getBackgroundColor(card.suit),
      color: getSuitColor(card.suit),
      fontSize: '18px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      userSelect: 'none',
    }}>
      {card.value}{card.suit}
    </div>
  );
}

export default Card;