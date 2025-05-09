const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// POST /signup - Create a new user with a hashed password
router.post('/signup', async (req, res) => {
    const { userName, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        userName,
        password: hashedPassword,
        highScore: 0,
        currentRun: { gold: 0, provisions: 0, morale: 0, crew: 0, score: 0 },
        itemInventory: [{"itemId": "001", "itemQuantity": 2}, {"itemId": "003", "itemQuantity": 1}, {"itemId": "006", "itemQuantity": 5}],
        captains: ["001", "003"]
      });
  
      const savedUser = await newUser.save();
      // Send back the saved user data
      res.status(201).json({
        userName: savedUser.userName,
        highScore: savedUser.highScore,
        currentRun: savedUser.currentRun,
        itemInventory: savedUser.itemInventory,
        captains: savedUser.captains
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// POST /login - Authenticate a user
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({
      userName: user.userName,
      highScore: user.highScore,
      currentRun: user.currentRun,
      itemInventory: user.itemInventory,
      captains: user.captains
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;