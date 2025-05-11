const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
  captainID: { type: String, required: true, unique: true },
  price: String,
  name: String,
  description: String,
  modifier: String,
  goldStart: Number,
  provisionStart: Number,
  moraleStart: Number,
  crewStart: Number
});

module.exports = mongoose.model('Captain', captainSchema);