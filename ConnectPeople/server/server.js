// Express server bootstrap
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser());

// API routes
const { router: authRouter } = require('./routes/auth');
app.use('/api/auth', authRouter);
app.use('/api/topics', require('./routes/topics'));
app.use('/api/join', require('./routes/join'));
app.use('/api/chat', require('./routes/chat'));

// serve a simple health route
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

async function start() {
  await sequelize.sync();
  const server = app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

  // Start websocket server
  require('./websocket')(server);
}

start().catch(err => {
  console.error('Failed to start server', err);
});
