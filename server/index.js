// server/index.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});
const { v4: uuidv4 } = require('uuid');

// Game rooms storage
const gameRooms = new Map();

function createGameRoom(maxPlayers) {
  return {
    id: uuidv4(),
    players: [],
    maxPlayers: maxPlayers, // store maxPlayers in room
    gameState: null,
    deck: [],
    table: [],
    currentPlayer: 0,
    status: 'waiting' // waiting, playing, ended
  };
}

function broadcastToRoom(room, message) {
  room.players.forEach(player => {
    player.socket.emit(message.type, message.data);
  });
}

io.on('connection', (socket) => {
  let playerRoom = null;
  let playerId = null;

  socket.on('joinGame', (data) => {
    // Find an available room or create a new one
    const requestedMaxPlayers = parseInt(data.maxPlayers) || 2;
    let room = null;
    for (const [, gameRoom] of gameRooms) {
      if (
        gameRoom.status === 'waiting' &&
        gameRoom.players.length < gameRoom.maxPlayers &&
        gameRoom.maxPlayers === requestedMaxPlayers
      ) {
        room = gameRoom;
        break;
      }
    }

    if (!room) {
      room = createGameRoom(requestedMaxPlayers);
      gameRooms.set(room.id, room);
    }

    playerId = uuidv4();
    const player = {
      id: playerId,
      socket: socket,
      name: null // Initialize name as null
    };

    room.players.push(player);
    playerRoom = room;

    // Send room info back to player and request name
    socket.emit('gameJoined', {
      roomId: room.id,
      playerId: playerId,
      playerNumber: room.players.length,
      needsName: true,
      maxPlayers: room.maxPlayers
    });
  });

  socket.on('setPlayerName', (data) => {
    if (playerRoom) {
      const player = playerRoom.players.find(p => p.id === playerId);
      if (player) {
        player.name = data.name;
        
        // Notify all players about the name update
        broadcastToRoom(playerRoom, {
          type: 'playerNameUpdated',
          data: {
            playerId: playerId,
            name: data.name
          }
        });

        // Check if all players have names and room is full
        if (
          playerRoom.players.length === playerRoom.maxPlayers &&
          playerRoom.players.every(p => p.name !== null)
        ) {
          playerRoom.status = 'playing';
          broadcastToRoom(playerRoom, {
            type: 'gameStarted',
            data: {
              players: playerRoom.players.map(p => ({ id: p.id, name: p.name })),
              maxPlayers: playerRoom.maxPlayers
            }
          });
        }
      }
    }
  });

  socket.on('playCard', (data) => {
    if (playerRoom && playerRoom.status === 'playing') {
      broadcastToRoom(playerRoom, {
        type: 'cardPlayed',
        data: {
          playerId: playerId,
          card: data.card,
          position: data.position
        }
      });
    }
  });

  socket.on('captureCards', (data) => {
    if (playerRoom && playerRoom.status === 'playing') {
      broadcastToRoom(playerRoom, {
        type: 'cardsCaptured',
        data: {
          playerId: playerId,
          cards: data.cards
        }
      });
    }
  });

  socket.on('disconnect', () => {
    if (playerRoom) {
      // Remove player from room
      playerRoom.players = playerRoom.players.filter(p => p.id !== playerId);
      
      // Notify other player about disconnection
      broadcastToRoom(playerRoom, {
        type: 'playerDisconnected',
        data: {
          playerId: playerId
        }
      });

      // Reset room if no players left
      if (playerRoom.players.length === 0) {
        gameRooms.delete(playerRoom.id);
      }
    }
  });
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});