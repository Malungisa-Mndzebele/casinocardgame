import React, { useState } from 'react';
import './App.css';

function App() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clickCount, setClickCount] = useState(0);

  const moveButton = () => {
    const newX = Math.random() * (window.innerWidth - 200);
    const newY = Math.random() * (window.innerHeight - 50);
    setPosition({ x: newX, y: newY });
    setClickCount(prevCount => prevCount + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        {clickCount === 3 && (
          <div className="message">You are already playing.</div>
        )}
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