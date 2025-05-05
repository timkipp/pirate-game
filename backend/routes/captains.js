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

module.exports = router;