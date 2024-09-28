import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Deck from './components/Deck';
import Player from './components/Player';
import DroppableTable from './components/DroppableTable';

function App() {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [table, setTable] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameState, setGameState] = useState('setup');
  const [tableCards, setTableCards] = useState([]);

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }

    return shuffle(deck);
  };

  const initializeGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setPlayers([
      { id: 0, hand: [], home: [], score: 0, name: "Player 1" },
      { id: 1, hand: [], home: [], score: 0, name: "Computer" }
    ]);
    setTable([]);
    setCurrentPlayer(0);
    setGameState('setup');
  };

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startGame = () => {
    const newDeck = [...deck];
    const tableCut = newDeck.splice(0, 4);
    setTable(tableCut);

    const player1Hand = newDeck.splice(0, 12);
    const player2Hand = newDeck.splice(0, 12);

    setPlayers([
      { ...players[0], hand: player1Hand },
      { ...players[1], hand: player2Hand }
    ]);

    setDeck(newDeck);
    setGameState('playing');
  };

  const playCard = (playerId, card, dropResult) => {
    if (playerId !== currentPlayer || gameState !== 'playing') return;

    const newPlayers = [...players];
    const playerHand = newPlayers[playerId].hand;
    const cardIndex = playerHand.findIndex(c => c.suit === card.suit && c.value === card.value);
    
    if (cardIndex !== -1) {
      const [playedCard] = playerHand.splice(cardIndex, 1);
      const newTableCards = [...tableCards, { ...playedCard, x: dropResult.x, y: dropResult.y }];

      setPlayers(newPlayers);
      setTableCards(newTableCards);
      setCurrentPlayer(currentPlayer === 0 ? 1 : 0);

      if (playerHand.length === 0) {
        if (deck.length > 0) {
          dealRemainingCards();
        } else {
          endGame();
        }
      }
    }
  };

  const dealRemainingCards = () => {
    const newDeck = [...deck];
    const newPlayers = players.map(player => ({
      ...player,
      hand: [...player.hand, ...newDeck.splice(0, 12)]
    }));

    setPlayers(newPlayers);
    setDeck(newDeck);
  };

  const endGame = () => {
    // Implement scoring logic here
    setGameState('endgame');
  };

  const captureCards = (playerId, cardsToCapture) => {
    const newPlayers = [...players];
    newPlayers[playerId].home = [...newPlayers[playerId].home, ...cardsToCapture];
    setPlayers(newPlayers);
    
    // Remove captured cards from the table
    const newTable = table.filter(card => !cardsToCapture.includes(card));
    setTable(newTable);
  };

  return (
    
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Card Game</h1>
        {gameState === 'setup' && (
          <button onClick={startGame}>Start Game</button>
        )}
        {gameState === 'playing' && (
          <div className="game-board">
            <Player 
              player={players[0]} 
              isCurrentPlayer={currentPlayer === 0}
              onPlayCard={(card, dropResult) => playCard(0, card, dropResult)}
              onCaptureCards={(cardsToCapture) => captureCards(0, cardsToCapture)}
            />
            <DroppableTable cards={tableCards} />
            <Player 
              player={players[1]} 
              isCurrentPlayer={currentPlayer === 1}
              onPlayCard={(card, dropResult) => playCard(1, card, dropResult)}
              onCaptureCards={(cardsToCapture) => captureCards(1, cardsToCapture)}
            />
            <Deck cardsLeft={deck.length} />
          </div>
        )}
        {gameState === 'endgame' && (
          <div>
            <h2>Game Over</h2>
            {/* Display final scores here */}
            <button onClick={initializeGame}>Play Again</button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;