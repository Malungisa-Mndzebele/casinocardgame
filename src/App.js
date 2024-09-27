import React, { useState } from 'react';
import './App.css';

function App() {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const moveButton = () => {
    const newX = Math.random() * (window.innerWidth - 200);
    const newY = Math.random() * (window.innerHeight - 50);
    setPosition({ x: newX, y: newY });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="game-button"
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onClick={moveButton}
        >
          Press here to play Game
        </button>
      </header>
    </div>
  );
}

export default App;
