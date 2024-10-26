import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Game rooms storage
    const gameRooms = new Map();

    io.on('connection', (socket) => {
      console.log('Client connected');
      let playerRoom = null;
      let playerId = null;

      socket.on('joinGame', (data) => {
        let room = null;
        // Find available room or create new one
        for (const [, gameRoom] of gameRooms) {
          if (gameRoom.players.length < 2 && gameRoom.status === 'waiting') {
            room = gameRoom;
            break;
          }
        }

        if (!room) {
          room = {
            id: Math.random().toString(36).substr(2, 9),
            players: [],
            status: 'waiting'
          };
          gameRooms.set(room.id, room);
        }

        playerId = Math.random().toString(36).substr(2, 9);
        room.players.push({
          id: playerId,
          socketId: socket.id,
          name: data.playerName
        });
        playerRoom = room;

        socket.join(room.id);
        socket.emit('gameJoined', {
          roomId: room.id,
          playerId: playerId,
          playerNumber: room.players.length
        });

        if (room.players.length === 2) {
          room.status = 'playing';
          io.to(room.id).emit('gameStarted', {
            players: room.players
          });
        }
      });

      socket.on('cardSelected', (data) => {
        if (playerRoom) {
          io.to(playerRoom.id).emit('cardSelected', {
            ...data,
            playerId
          });
        }
      });

      socket.on('dealCards', (data) => {
        if (playerRoom) {
          socket.to(playerRoom.id).emit('cardsDealt', data);
        }
      });

      socket.on('playCard', (data) => {
        if (playerRoom) {
          io.to(playerRoom.id).emit('cardPlayed', {
            ...data,
            playerId
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (playerRoom) {
          playerRoom.players = playerRoom.players.filter(p => p.id !== playerId);
          if (playerRoom.players.length === 0) {
            gameRooms.delete(playerRoom.id);
          } else {
            io.to(playerRoom.id).emit('playerDisconnected', { playerId });
          }
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default ioHandler;