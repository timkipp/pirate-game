const mongoose = require('mongoose');

const currentRunSchema = new mongoose.Schema({
  gold: Number,
  provisions: Number,
  moral: Number,
  crew: Number,
  activeCardID: Number,
  score: Number
}, { _id: false });

const itemInventorySchema = new mongoose.Schema({
  itemId: String,
  itemQuantity: Number
}, { _id: false });

const captainSchema = new mongoose.Schema({
  captainID: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  highScore: { type: Number, default: 0 },
  currentRun: {
      gold: Number,
      provisions: Number,
      moral: Number,
      crew: Number,
      activeCardID: Number,
      score: Number
  },
  itemInventory: [{itemId: String, itemQuantity: Number}],
  captains: [String]
});

module.exports = mongoose.model('User', userSchema);