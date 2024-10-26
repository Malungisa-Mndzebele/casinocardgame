import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: [
          'https://casinocardgame.vercel.app',
          'http://localhost:3000'
        ],
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type']
      },
      transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
      console.log('Client connected');
      
      socket.on('joinGame', (data) => {
        console.log('Player joining:', data);
        socket.emit('gameJoined', {
          playerNumber: io.engine.clientsCount,
          playerName: data.playerName
        });

        if (io.engine.clientsCount === 2) {
          io.emit('gameStarted', {
            players: Array.from(io.sockets.sockets).map((socket, index) => ({
              id: index + 1,
              name: `Player ${index + 1}`
            }))
          });
        }
      });

      socket.on('cardSelected', (data) => {
        socket.broadcast.emit('cardSelected', data);
      });

      socket.on('dealingStarted', (data) => {
        socket.broadcast.emit('dealingStarted', data);
      });

      socket.on('handsDealt', (data) => {
        socket.broadcast.emit('handsDealt', data);
      });

      socket.on('cardPlayed', (data) => {
        socket.broadcast.emit('cardPlayed', data);
      });

      socket.on('cardsCaptered', (data) => {
        socket.broadcast.emit('cardsCaptered', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        socket.broadcast.emit('playerDisconnected');
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

export default SocketHandler;