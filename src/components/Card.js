import React from 'react';

function Card({ card, style = {}, isHighlighted }) {
  const getSuitColor = (suit) => {
    return ['♥', '♦'].includes(suit) ? '#DC3545' : '#212529';
  };

  const getSuitSymbol = (suit) => {
    switch (suit) {
      case '♠': return '♠';
      case '♥': return '♥';
      case '♦': return '♦';
      case '♣': return '♣';
      default: return suit;
    }
  };

  const getBackgroundColor = (suit) => {
    switch (suit) {
      case '♠': return 'linear-gradient(135deg, #fff, #e8f0fe)';
      case '♥': return 'linear-gradient(135deg, #fff, #fee8e8)';
      case '♦': return 'linear-gradient(135deg, #fff, #fff8e8)';
      case '♣': return 'linear-gradient(135deg, #fff, #e8fee8)';
      default: return 'white';
    }
  };

  const valueMap = {
    'A': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    'J': 'J',
    'Q': 'Q',
    'K': 'K'
  };

  return (
    <div style={{
      width: '60px',
      height: '90px',
      backgroundColor: 'white',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '5px',
      boxSizing: 'border-box',
      background: getBackgroundColor(card.suit),
      border: `2px solid ${isHighlighted ? '#ffd700' : '#ddd'}`,
      boxShadow: isHighlighted 
        ? '0 0 10px rgba(255,215,0,0.5)' 
        : '0 2px 5px rgba(0,0,0,0.1)',
      cursor: 'default',
      userSelect: 'none',
      position: 'relative',
      transition: 'all 0.2s ease',
      ...style
    }}>
      {/* Top value and suit */}
      <div style={{ 
        color: getSuitColor(card.suit),
        fontSize: '14px',
        lineHeight: '1',
        textAlign: 'left'
      }}>
        <div>{valueMap[card.value]}</div>
        <div>{getSuitSymbol(card.suit)}</div>
      </div>

      {/* Center suit */}
      <div style={{
        fontSize: '24px',
        color: getSuitColor(card.suit),
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        {getSuitSymbol(card.suit)}
      </div>

      {/* Bottom value and suit (inverted) */}
      <div style={{ 
        color: getSuitColor(card.suit),
        fontSize: '14px',
        lineHeight: '1',
        textAlign: 'right',
        transform: 'rotate(180deg)'
      }}>
        <div>{valueMap[card.value]}</div>
        <div>{getSuitSymbol(card.suit)}</div>
      </div>

      {/* Highlight overlay for selected cards */}
      {isHighlighted && (
        <div style={{
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          border: '2px solid #ffd700',
          borderRadius: '8px',
          pointerEvents: 'none',
          animation: 'pulse 1.5s infinite'
        }} />
      )}

      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255,215,0,0.4); }
            70% { box-shadow: 0 0 0 10px rgba(255,215,0,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,215,0,0); }
          }
        `}
      </style>
    </div>
  );
}

export default Card;