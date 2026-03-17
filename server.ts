import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
// Remove hostname binding in production so it binds to 0.0.0.0 and accepts all hosts
const app = next({ dev, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err: any) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end(`internal server error: ${err.message}\n\n${err.stack}`);
    }
  });

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Basic socket.io connection setup
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Allow user to join their own notification/message channel
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room user_${userId}`);
    });

    socket.on('send_message', (data) => {
      // data should contain { receiverId, content, senderId, etc }
      io.to(`user_${data.receiverId}`).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  server
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, 'localhost', () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
});
