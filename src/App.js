// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Deck from './components/Deck';
import Player from './components/Player';
import DroppableTable from './components/DroppableTable';
import LandingPage from './components/LandingPage';
import RulesPage from './components/RulesPage';
import io from 'socket.io-client';

// Utility function to create and shuffle a deck
const createFullDeck = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];

  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({
        id: `${suit}-${value}`,
        suit,
        value,
        used: false
      });
    });
  });

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

function App() {
  // View state
  const [currentView, setCurrentView] = useState('landing');

  // Game state
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState('connecting');
  const [playerNumber, setPlayerNumber] = useState(null);
  const [players, setPlayers] = useState([
    { id: 0, hand: [], home: [], score: 0, name: "Waiting for Player 1..." },
    { id: 1, hand: [], home: [], score: 0, name: "Waiting for Player 2..." }
  ]);
  const [tableCards, setTableCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [error, setError] = useState(null);

  // Deck state
  const [deck, setDeck] = useState([]);
  const [deckCount, setDeckCount] = useState(52);

  // Dealing phase states
  const [dealingPhase, setDealingPhase] = useState('waiting');
  const [selectedInitialCards, setSelectedInitialCards] = useState(0);

  // Initialize deck when game starts
  useEffect(() => {
    if (gameState === 'playing' && playerNumber === 1) {
      const newDeck = createFullDeck();
      setDeck(newDeck);
      ws.emit('eventName', {
        type: 'DECK_INITIALIZED',
        deck: newDeck
      });
    }
  }, [gameState, playerNumber, ws]);

  // Navigation handlers
  const handleStartGame = () => {
    setCurrentView('game');
    initializeWebSocket();
  };

  const handleShowRules = () => {
    setCurrentView('rules');
  };

  const handleBackToMenu = () => {
    setCurrentView('landing');
    if (ws) {
      ws.close();
    }
    resetGameState();
  };

  // Reset game state
  const resetGameState = () => {
    setGameState('connecting');
    setPlayerNumber(null);
    setPlayers([
      { id: 0, hand: [], home: [], score: 0, name: "Waiting for Player 1..." },
      { id: 1, hand: [], home: [], score: 0, name: "Waiting for Player 2..." }
    ]);
    setTableCards([]);
    setCurrentPlayer(0);
    setDeckCount(52);
    setError(null);
    setDealingPhase('waiting');
    setSelectedInitialCards(0);
    setDeck([]);
  };

  const initializeWebSocket = () => {
    const socket = io({
      path: '/api/socket',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
  
    socket.on('connect', () => {
      console.log('Connected to server');
      setGameState('joining');
      socket.emit('joinGame', {
        playerName: `Player ${Math.floor(Math.random() * 1000)}`
      });
    });
  
    socket.on('gameJoined', (data) => {
      setPlayerNumber(data.playerNumber);
      setGameState('waiting');
      setPlayers(prev => {
        const newPlayers = [...prev];
        newPlayers[data.playerNumber - 1] = {
          ...newPlayers[data.playerNumber - 1],
          id: data.playerNumber,
          name: `Player ${data.playerNumber}`
        };
        return newPlayers;
      });
    });
  
    socket.on('gameStarted', (data) => {
      setPlayers(data.players.map(p => ({
        ...p,
        hand: [],
        home: [],
        score: 0
      })));
      setGameState('playing');
      setDealingPhase(playerNumber === 1 ? 'selecting' : 'watching_selection');
    });
  
    socket.on('cardSelected', (data) => {
      if (playerNumber !== 1) {
        setDeck(data.remainingDeck);
        setDeckCount(data.deckCount);
        setSelectedInitialCards(data.selectedCount);
        setTableCards(data.allCards);
      }
    });
  
    socket.on('dealingStarted', (data) => {
      setDealingPhase('dealing');
      setTimeout(() => {
        if (playerNumber === 1) {
          socket.emit('dealingComplete', {
            finalCards: data.finalCards
          });
        }
      }, 6000);
    });
  
    socket.on('handsDealt', (data) => {
      setDeck(data.remainingDeck);
      setDeckCount(data.deckCount);
      setPlayers(prev => prev.map(player => ({
        ...player,
        hand: data.hands[player.id] || []
      })));
      setDealingPhase('playing');
    });
  
    socket.on('cardPlayed', (data) => {
      setTableCards(prev => [...prev, {
        ...data.card,
        x: data.position.x,
        y: data.position.y
      }]);
      setCurrentPlayer(curr => curr === 0 ? 1 : 0);
      
      setPlayers(prev => prev.map(player => {
        if (player.id === data.playerId) {
          return {
            ...player,
            hand: player.hand.filter(c => 
              c.id !== data.card.id
            )
          };
        }
        return player;
      }));
  
      setDeck(prev => prev.map(card => 
        card.id === data.card.id ? { ...card, used: true } : card
      ));
      setDeckCount(prev => prev - 1);
    });
  
    socket.on('cardsCaptered', (data) => {
      setPlayers(prev => prev.map(player => {
        if (player.id === data.playerId) {
          return {
            ...player,
            home: [...player.home, ...data.cards],
            score: player.score + data.cards.length
          };
        }
        return player;
      }));
      setTableCards(prev => 
        prev.filter(card => 
          !data.cards.some(c => c.id === card.id)
        )
      );
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setGameState('disconnected');
    });
  
    socket.on('playerDisconnected', () => {
      setGameState('opponent_disconnected');
      setError('Your opponent has disconnected from the game.');
    });
  
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setError('Connection error occurred. Please try refreshing the page.');
      setGameState('error');
    });
  
    setWs(socket);
  };

  // Handle card selection
  const handleInitialCardSelection = (cardIndex) => {
    if (selectedInitialCards < 4) {
      const selectedCard = deck[cardIndex];
      
      // Check if card is already used
      if (selectedCard.used) {
        return;
      }

      const newCount = selectedInitialCards + 1;
      setSelectedInitialCards(newCount);

      // Mark card as used
      const newDeck = [...deck];
      newDeck[cardIndex] = { ...selectedCard, used: true };
      setDeck(newDeck);
      
      // Calculate card position
      const cardPosition = {
        x: 200 + (selectedInitialCards * 120),
        y: 250
      };

      const cardForTable = {
        ...selectedCard,
        x: cardPosition.x,
        y: cardPosition.y,
        isSelected: true,
        selectedAt: Date.now()
      };

      const newTableCards = [...tableCards, cardForTable];
      setTableCards(newTableCards);
      setDeckCount(prev => prev - 1);

      // Notify other player
      ws.emit('eventName', {
        type: 'CARD_SELECTED',
        cardIndex,
        selectedCount: newCount,
        selectedCard: cardForTable,
        allCards: newTableCards,
        remainingDeck: newDeck,
        deckCount: deckCount - 1,
        playerNumber: playerNumber
      });

      if (newCount === 4) {
        setTimeout(() => {
          setDealingPhase('dealing');
          dealInitialHands(newDeck);
        }, 1000);
      }
    }
  };

  // Deal initial hands
  const dealInitialHands = (currentDeck) => {
    const hands = { 1: [], 2: [] };
    const newDeck = [...currentDeck];
    let unusedCards = newDeck.filter(card => !card.used);

    // Deal 12 cards to each player
    for (let i = 0; i < 24; i++) {
      const playerNum = i < 12 ? 1 : 2;
      const card = unusedCards[i];
      if (card) {
        hands[playerNum].push(card);
        const cardIndex = newDeck.findIndex(c => c.id === card.id);
        newDeck[cardIndex] = { ...card, used: true };
      }
    }

    setDeck(newDeck);
    setDeckCount(prev => prev - 24);

    ws.emit('eventName', {
      type: 'HANDS_DEALT',
      hands,
      remainingDeck: newDeck,
      deckCount: deckCount - 24
    });
  };

// Replace the handleMessage function with:
const handleMessage = useCallback((event) => {
  // Instead of setting ws.onmessage, set up individual event listeners
  if (ws) {
    ws.on('gameJoined', (data) => {
      setPlayerNumber(data.playerNumber);
      setGameState('waiting');
      setPlayers(prev => {
        const newPlayers = [...prev];
        newPlayers[data.playerNumber - 1] = {
          ...newPlayers[data.playerNumber - 1],
          id: data.playerNumber,
          name: `Player ${data.playerNumber}`
        };
        return newPlayers;
      });
    });

    ws.on('gameStarted', (data) => {
      setPlayers(data.players.map(p => ({
        ...p,
        hand: [],
        home: [],
        score: 0
      })));
      setGameState('playing');
      setDealingPhase(playerNumber === 1 ? 'selecting' : 'watching_selection');
    });

    // Add similar listeners for other events...
  }
}, [playerNumber, ws]);

// Set up message handler
useEffect(() => {
  if (ws) {
    ws.onmessage = handleMessage;
  }
}, [ws, handleMessage]);

// Handle playing a card
const playCard = useCallback((playerNum, card, dropResult) => {
  if (ws && gameState === 'playing' && dealingPhase === 'playing' && 
      playerNum === playerNumber && currentPlayer === playerNum) {
    try {
      // Verify card hasn't been used
      const cardInDeck = deck.find(c => c.id === card.id);
      if (cardInDeck && !cardInDeck.used) {
        ws.emit('eventName', {
          type: 'PLAY_CARD',
          card,
          position: {
            x: dropResult.x,
            y: dropResult.y
          }
        });
      }
    } catch (error) {
      console.error('Error sending play card message:', error);
      setError('Failed to play card. Please try again.');
    }
  }
}, [ws, gameState, dealingPhase, playerNumber, currentPlayer, deck]);

// Render game content
const renderGameContent = () => {
  if (gameState === 'connecting') {
    return <div>Connecting to server...</div>;
  }

  if (gameState === 'waiting') {
    return (
      <div>
        <div>Waiting for opponent...</div>
        <div>You are {players[playerNumber - 1]?.name}</div>
      </div>
    );
  }

  if (gameState === 'error' || gameState === 'opponent_disconnected') {
    return (
      <div>
        <div>{gameState === 'error' ? 'Connection error' : 'Opponent disconnected'}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          {gameState === 'error' ? 'Retry Connection' : 'Find New Game'}
        </button>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="game-board">
        <Player 
          player={players[playerNumber === 1 ? 1 : 0]}
          isCurrentPlayer={currentPlayer === (playerNumber === 1 ? 1 : 0)}
          onPlayCard={(card, dropResult) => playCard(playerNumber === 1 ? 1 : 0, card, dropResult)}
        />
        <DroppableTable 
          cards={tableCards}
          player1Home={players[0]?.home || []}
          player2Home={players[1]?.home || []}
          dealingPhase={dealingPhase}
          isPlayer1={playerNumber === 1}
          onCardSelect={handleInitialCardSelection}
          selectedCards={tableCards}
          deckCards={deck}
        />
        <Player 
          player={players[playerNumber === 1 ? 0 : 1]}
          isCurrentPlayer={currentPlayer === (playerNumber === 1 ? 0 : 1)}
          onPlayCard={(card, dropResult) => playCard(playerNumber === 1 ? 0 : 1, card, dropResult)}
        />
        <Deck cardsLeft={deckCount} />
      </div>
    );
  }

  return null;
};

// Main render
return (
  <div className="App">
    {currentView === 'landing' && (
      <LandingPage 
        onStartGame={handleStartGame}
        onShowRules={handleShowRules}
      />
    )}

    {currentView === 'rules' && (
      <RulesPage onBack={handleBackToMenu} />
    )}

    {currentView === 'game' && (
      <DndProvider backend={HTML5Backend}>
        <div className="game-view">
          <div className="game-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}>
            <h1>Casino Card Game</h1>
            <button
              onClick={handleBackToMenu}
              style={{
                padding: '8px 16px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Back to Menu
            </button>
          </div>

          {error && (
            <div className="error-message" style={{
              color: 'red',
              padding: '10px',
              margin: '10px 0',
              backgroundColor: '#fff3f3',
              borderRadius: '5px'
            }}>
              {error}
            </div>
          )}

          {renderGameContent()}
        </div>
      </DndProvider>
    )}
  </div>
);
}

export default App;