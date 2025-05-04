// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path if needed

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    highScore: req.body.highScore || 0,
    currentRun: req.body.currentRun,
    itemInventory: req.body.itemInventory,
    captains: req.body.captains
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;