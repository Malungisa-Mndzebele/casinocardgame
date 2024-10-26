import { Server } from 'socket.io';

if (!global.io) {
  global.io = new Server({
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
}

export default function SocketHandler(req, res) {
  if (!global.io) {
    console.log('Socket server not initialized');
    res.status(500).json({ error: 'Socket server not initialized' });
    return;
  }

  // Set up socket event handlers if they haven't been set up yet
  if (!global.io.listenerCount('connection')) {
    global.io.on('connection', (socket) => {
      console.log('Client connected');
      
      socket.on('joinGame', (data) => {
        // Your existing JOIN_GAME logic
        socket.emit('gameJoined', {
          playerNumber: global.io.engine.clientsCount,
          // ... other data
        });
      });

      socket.on('cardSelected', (data) => {
        socket.broadcast.emit('cardUpdated', data);
      });

      socket.on('handsDealt', (data) => {
        socket.broadcast.emit('receiveHands', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        socket.broadcast.emit('playerDisconnected');
      });
    });
  }

  res.status(200).json({ message: 'Socket server running' });
}

export const config = {
  api: {
    bodyParser: false
  }
};