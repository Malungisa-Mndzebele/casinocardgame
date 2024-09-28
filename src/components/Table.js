import React from 'react';

function Table({ cards }) {
  return (
    <div className="table">
      <h3>Table</h3>
      <div className="table-cards">
        {cards.map((card, index) => (
          <span key={index} className="card">
            {card.value}{card.suit}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Table;