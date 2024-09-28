import React from 'react';

function Deck({ cardsLeft }) {
  return (
    <div className="deck">
      <p>Cards left: {cardsLeft}</p>
    </div>
  );
}

export default Deck;