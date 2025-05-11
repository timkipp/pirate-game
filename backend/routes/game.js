// backend/routes/game.js
const express = require('express');
const router = express.Router();
const GameState = require('../GameState');

// POST /api/game/complete
// Finalizes a game session: calculates score and updates highScore if needed
router.post('/complete', async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: 'Missing userName in request body.' });
  }

  try {
    const gameState = new GameState(userName);
    await gameState.loadUserData();

    const score = gameState.calculateCurrentScore();
    await gameState.setScore(score); // This will update highScore if score > current highScore

    res.status(200).json({ 
      message: 'Game complete — score saved.', 
      score, 
      highScore: gameState.highScore 
    });
  } catch (err) {
    console.error('Error completing game:', err);
    res.status(500).json({ message: 'Error completing game.' });
  }
});

module.exports = router;