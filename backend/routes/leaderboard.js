// backend/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const GameState = require('../GameState');

// GET /api/leaderboard - Return users sorted by high score
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ highScore: -1 });

    const leaderboard = users.map(u => ({
      userName: u.userName,
      highScore: u.highScore || 0
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Failed to load leaderboard:', err);
    res.status(500).json({ message: 'Could not load leaderboard.' });
  }
});

// POST /api/leaderboard/submit - Submit a score and update if it’s a new high score
router.post('/submit', async (req, res) => {
  const { userName } = req.body;
  if (!userName) {
    return res.status(400).json({ message: 'userName is required.' });
  }

  try {
    const gameState = new GameState(userName);
    await gameState.loadUserData();
    const result = await gameState.submitScoreIfHigh();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error submitting score:', err);
    res.status(500).json({ message: 'Failed to submit score.' });
  }
});

module.exports = router;
