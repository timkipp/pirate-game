// backend/routes/leaderboard.js

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();

// points to backend/users.json
const usersFilePath = path.join(__dirname, '..', 'users.json');

/**
 * GET /api/leaderboard
 * → reads all users, sorts by highScore desc, 
 *    and returns [{ userName, highScore }, …]
 */
router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(raw);

    // sort descending by highScore
    users.sort((a, b) => (b.highScore || 0) - (a.highScore || 0));

    // map to only the necessary fields
    const leaderboard = users.map(u => ({
      userName:  u.userName,
      highScore: u.highScore || 0
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Failed to load leaderboard:', err);
    res.status(500).json({ message: 'Could not load leaderboard.' });
  }
});

module.exports = router;
