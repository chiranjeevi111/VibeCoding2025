const express = require('express');
const router = express.Router();
const { DiscussionTopic, User } = require('../db');

// Create a new discussion topic
router.post('/', async (req, res) => {
  try {
    const { title, category, anonymous, name, tags } = req.body;

    // Create or find user (simple flow)
    const user = await User.create({ name: name || 'Anonymous', anonymous: !!anonymous });

    const topic = await DiscussionTopic.create({
      title,
      category,
      tags: (tags || []).join ? (tags || []).join(',') : (tags || ''),
      creatorId: user.id,
    });

    const topicWithCreator = await DiscussionTopic.findByPk(topic.id, { include: ['creator'] });
    res.json(topicWithCreator);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// Get topics, optional category filter and simple tag relevance sort
router.get('/', async (req, res) => {
  try {
    const { category, tags } = req.query; // tags comma-separated
    const where = {};
    if (category) where.category = category;

    const topics = await DiscussionTopic.findAll({ where, include: ['creator'], order: [['createdAt', 'DESC']] });

    // Basic interest matching: if tags provided, boost topics that share tags
    if (tags) {
      const desired = tags.split(',').map(t => t.trim().toLowerCase());
      const scored = topics.map(t => {
        const topicTags = (t.tags || '').split(',').map(x => x.trim().toLowerCase());
        const score = topicTags.reduce((s, tg) => s + (desired.includes(tg) ? 1 : 0), 0);
        return { topic: t, score };
      });
      scored.sort((a, b) => b.score - a.score || new Date(b.topic.createdAt) - new Date(a.topic.createdAt));
      return res.json(scored.map(s => s.topic));
    }

    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

module.exports = router;
