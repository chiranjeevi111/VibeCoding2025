// Socket.IO websocket integration. Each discussion topic is a room; messages are saved to DB.
const { Server } = require('socket.io');
const { ChatMessage, User } = require('./db');

module.exports = function (httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', socket => {
    console.log('ws connected', socket.id);

    socket.on('joinTopic', ({ topicId, user }) => {
      const room = `topic_${topicId}`;
      socket.join(room);
      socket.room = room;
      socket.topicId = topicId;
      socket.user = user;
    });

    socket.on('leaveTopic', () => {
      if (socket.room) socket.leave(socket.room);
    });

    socket.on('message', async ({ content }) => {
      try {
        // save user if provided
        let author = null;
        if (socket.user) {
          author = await User.create({ name: socket.user.name || 'Anonymous', anonymous: !!socket.user.anonymous });
        } else {
          author = await User.create({ name: 'Anonymous', anonymous: true });
        }

        const msg = await ChatMessage.create({ content, topicId: socket.topicId, authorId: author.id });

        // emit to room
        io.to(socket.room).emit('message', {
          id: msg.id,
          content: msg.content,
          author: { id: author.id, name: author.name, anonymous: author.anonymous },
          createdAt: msg.createdAt,
        });
      } catch (err) {
        console.error('ws message error', err);
      }
    });

    socket.on('disconnect', () => {
      // cleanup if needed
    });
  });
};
