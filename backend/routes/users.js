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
        console.log("Initializing run for user:", userName);
        console.log("Captain data:", captain);
        console.log("Item shift data:", itemShift);

        // Initialize currentRun with captain stats
        user.currentRun = {
            gold: Math.max(0, Math.min(100, captain.goldStart ?? 10)),
            provisions: Math.max(0, Math.min(100, captain.provisionStart ?? 10)),
            morale: Math.max(0, Math.min(100, captain.moraleStart ?? 10)),
            crew: Math.max(0, Math.min(100, captain.crewStart ?? 10)),
            score: 0,
        };

        // Apply itemShift to the appropriate resource
        if (itemShift.shiftName) {
          for(var i = 0; i < user.itemInventory.length; i++){
            if(itemShift.itemID === user.itemInventory[i].itemId){
              user.itemInventory[i].itemQuantity = user.itemInventory[i].itemQuantity - 1;
            }
          }
            const resource = itemShift.shiftName.toLowerCase(); // Ensure lowercase for consistency
            if (user.currentRun[resource] !== undefined) {
                user.currentRun[resource] = Math.max(
                    0,
                    Math.min(100, user.currentRun[resource] + itemShift.shiftAmount)
                );
                console.log(`Applied item effect: +${itemShift.shiftAmount} to ${resource}`);
            } else {
                console.warn(`Invalid resource name in itemShift: ${itemShift.shiftName}`);
            }
        }

        await user.save();
        res.status(201).json({ message: "Run initialized", currentRun: user.currentRun });
    } catch (err) {
        console.error("Error initializing run:", err);
        res.status(400).json({ message: err.message });
    }
});

// POST update highScore
router.post('/highscore', async (req, res) => {
    const { userName, score } = req.body;

    try {
        const user = await User.findOne({ userName: userName });
        console.log("Setting highscore for user:", userName);
        console.log("Highscore value is:", score);

        user.highScore = score;

        await user.save();
        res.status(201).json({ message: "Highscore updated", highScore: user.highScore });
    } catch (err) {
        console.error("Error initializing run:", err);
        res.status(400).json({ message: err.message });
    }
});

// POST add market currency to user
router.post('/addcurrency', async (req, res) => {
    const { userName, value } = req.body;

    try {
        const user = await User.findOne({ userName: userName });
        console.log("Adding market currency to user:", userName);
        console.log("Market currency added:", value);

        user.marketCurrency = user.marketCurrency + value;

        await user.save();
        res.status(201).json({ message: "market currency added", marketCurrency: user.marketCurrency });
    } catch (err) {
        console.error("Error adding market currency:", err);
        res.status(400).json({ message: err.message });
    }
});

// POST add item to user.
router.post('/additem', async (req, res) => {
  const {userName, item } = req.body;
  console.log("Item received:", item);
  try {
    // Find the user.
    const user = await User.findOne({ userName: userName });
    console.log("Adding item to user: ", userName);
    // Check if the item already exists in the user's inventory.
    for(var i = 0; i < user.itemInventory.length; i++){
      if(item.itemId === user.itemInventory[i].itemId){
        user.itemInventory[i].itemQuantity = user.itemInventory[i].itemQuantity + 1;

        await user.save();

        console.log("Item added/updated: ", item.itemId);
        res.status(201).json({ message: "item added", item: item});
        return;
      }
    }
    
    user.itemInventory.push(item);

    await user.save();

    console.log("Item added/updated: ", item.name);
    res.status(201).json({ message: "item added", item: item});
  } catch (err) {
    console.error("Error adding item: ", err);
    res.status(400).json({ message: err.message });
  }
});

// POST add captain to user.
router.post('/addcaptain', async (req, res) => {
  const {userName, captain } = req.body;
  try {
    const user = await User.findOne({ userName: userName });
    console.log("Adding captain to user: ", userName);
    user.captains.push(captain.captainID);
    await user.save();
    console.log("Captain added: ", captain.name);
    res.status(201).json({ message: "captain added", captain: captain});
  } catch (err) {
    console.error("Error adding captain: ", err);
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