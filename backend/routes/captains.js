// backend/routes/captains.js
const express = require('express');
const router = express.Router();
const Captain = require('../models/Captain');

// GET all captains
router.get('/', async (req, res) => {
  try {
    const captains = await Captain.find();
    res.json(captains);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching captains' });
  }
});

// GET a captain by ID
router.get('/:id', async (req, res) => {
  try {
    const captain = await Captain.findOne({ captainID: req.query.id });
    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' });
    }
    res.json(captain);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching captain' });
  }
});

module.exports = router;