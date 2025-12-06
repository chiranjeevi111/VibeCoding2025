const express = require('express');
const router = express.Router();
const { ChatMessage, User } = require('../db');

// Get messages for a topic
router.get('/:topicId/messages', async (req, res) => {
  try {
    const { topicId } = req.params;
    const messages = await ChatMessage.findAll({ where: { topicId }, include: ['author'], order: [['createdAt', 'ASC']] });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
