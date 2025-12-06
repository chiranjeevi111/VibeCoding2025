const express = require('express');
const router = express.Router();
const { DiscussionTopic } = require('../db');

// Simple join endpoint — in a real app we'd record membership; here we return topic info
router.post('/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await DiscussionTopic.findByPk(topicId);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    // For MVP, just return success and topic details
    res.json({ success: true, topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to join topic' });
  }
});

module.exports = router;
