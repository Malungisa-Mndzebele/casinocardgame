// src/components/RulesPage.js
import React from 'react';

function RulesPage({ onBack }) {
  return (
    <div className="rules-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div className="rules-content" style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Game Rules</h1>
        
        <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
          <h2>Objective</h2>
          <p>Score the most points by capturing cards from the table using matching cards from your hand.</p>
          
          <h2 style={{ marginTop: '20px' }}>Setup</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Each player is dealt 12 cards</li>
            <li>Four cards are placed face-up on the table</li>
            <li>The remaining cards form the draw pile</li>
          </ul>
          
          <h2 style={{ marginTop: '20px' }}>Gameplay</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li>On your turn, you must play one card from your hand</li>
            <li>You can either:
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>Capture a card of the same rank</li>
                <li>Capture a combination of cards that sum to your card's value</li>
                <li>Place your card on the table if no capture is possible</li>
              </ul>
            </li>
            <li>Face cards (J, Q, K) can only capture cards of the same rank</li>
            <li>Aces can be used as 1 or 14</li>
          </ul>
          
          <h2 style={{ marginTop: '20px' }}>Scoring</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Most cards: 3 points</li>
            <li>Most spades: 2 points</li>
            <li>10of diamonds: 2 points</li>
            <li>2of spades: 1 point</li>
            <li>Each ace: 1 point</li>
          </ul>
        </div>

        <button
          onClick={onBack}
          style={{
            padding: '15px 30px',
            fontSize: '1.1em',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 8px rgba(0,0,0,0.3)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default RulesPage;