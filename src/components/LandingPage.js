// src/components/LandingPage.js
import React, { useState } from 'react';

function LandingPage({ onStartGame, onShowRules }) {
  const [selectedPlayers, setSelectedPlayers] = useState(2);

  return (
    <div className="landing-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white',
      textAlign: 'center'
    }}>
      <div className="content" style={{
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '40px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h1 style={{
          fontSize: '3em',
          marginBottom: '20px',
          fontFamily: "'Times New Roman', serif",
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Casino Card Game
        </h1>
        
        <p style={{
          fontSize: '1.2em',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Challenge your friends in this classic card game of strategy and skill!
        </p>

        <div className="player-selection" style={{
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <h2 style={{ fontSize: '1.4em', marginBottom: '10px' }}>Select Number of Players</h2>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setSelectedPlayers(num)}
                style={{
                  padding: '10px 20px',
                  fontSize: '1.1em',
                  backgroundColor: selectedPlayers === num ? '#4CAF50' : 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '60px'
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-buttons" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => onStartGame(selectedPlayers)}
            style={{
              padding: '15px 40px',
              fontSize: '1.2em',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              width: '200px',
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
            Start {selectedPlayers}-Player Game
          </button>
          
          <button
            onClick={onShowRules}
            style={{
              padding: '15px 40px',
              fontSize: '1.2em',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              width: '200px',
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
            Game Rules
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;