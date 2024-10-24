// server/index.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

// Game rooms storage
const gameRooms = new Map();

function createGameRoom() {
  return {
    id: uuidv4(),
    players: [],
    gameState: null,
    deck: [],
    table: [],
    currentPlayer: 0,
    status: 'waiting' // waiting, playing, ended
  };
}

function broadcastToRoom(room, message) {
  room.players.forEach(player => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', (ws) => {
  let playerRoom = null;
  let playerId = null;

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'JOIN_GAME':
        // Find an available room or create a new one
        let room = null;
        for (const [, gameRoom] of gameRooms) {
          if (gameRoom.players.length < 2 && gameRoom.status === 'waiting') {
            room = gameRoom;
            break;
          }
        }

        if (!room) {
          room = createGameRoom();
          gameRooms.set(room.id, room);
        }

        playerId = uuidv4();
        const player = {
          id: playerId,
          ws: ws,
          name: data.playerName || `Player ${room.players.length + 1}`
        };

        room.players.push(player);
        playerRoom = room;

        // Send room info back to player
        ws.send(JSON.stringify({
          type: 'GAME_JOINED',
          roomId: room.id,
          playerId: playerId,
          playerNumber: room.players.length
        }));

        // If room is full, start the game
        if (room.players.length === 2) {
          room.status = 'playing';
          broadcastToRoom(room, {
            type: 'GAME_STARTED',
            players: room.players.map(p => ({ id: p.id, name: p.name }))
          });
        }
        break;

      case 'PLAY_CARD':
        if (playerRoom && playerRoom.status === 'playing') {
          broadcastToRoom(playerRoom, {
            type: 'CARD_PLAYED',
            playerId: playerId,
            card: data.card,
            position: data.position
          });
        }
        break;

      case 'CAPTURE_CARDS':
        if (playerRoom && playerRoom.status === 'playing') {
          broadcastToRoom(playerRoom, {
            type: 'CARDS_CAPTURED',
            playerId: playerId,
            cards: data.cards
          });
        }
        break;
    }
  });

  ws.on('close', () => {
    if (playerRoom) {
      // Remove player from room
      playerRoom.players = playerRoom.players.filter(p => p.id !== playerId);
      
      // Notify other player about disconnection
      broadcastToRoom(playerRoom, {
        type: 'PLAYER_DISCONNECTED',
        playerId: playerId
      });

      // Reset room if no players left
      if (playerRoom.players.length === 0) {
        gameRooms.delete(playerRoom.id);
      }
    }
  });
});