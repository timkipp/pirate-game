const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
  captainID: { type: String, required: true, unique: true },
  price: String,
  name: String,
  description: String,
  modifier: String,
  goldStart: Number,
  provisionsStart: Number,
  moralStart: Number,
  crewStart: Number
});

module.exports = mongoose.model('Captain', captainSchema);