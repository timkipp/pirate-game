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

// GET a user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.query.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST initialize a run
router.post('/initRun', async (req, res) => {
  const { userName, captain, itemShift } = req.body;

  try {
    const user = await User.findOne({ userName: userName });
    
    user.currentRun = {
      gold: captain.goldStart,
      provisions: captain.provisionStart,
      morale: captain.moraleStart,
      crew: captain.crewStart,
      score: 0
    };

    if(itemShift.shiftName != ""){
      user.currentRun[itemShift.shiftName] = user.currentRun[itemShift.shiftName] + itemShift.shiftAmount;
    }
  
    await user.save();
    res.status(201).json({ message: "Run initialized" });
  } catch (err) {
    res.status(400).json({ message: err.message });
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