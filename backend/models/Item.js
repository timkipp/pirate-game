const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemID: { type: String, required: true, unique: true },
  price: String,
  name: String,
  description: String,
  resourceAffected: String,
  resourceShift: Number
});

module.exports = mongoose.model('Item', itemSchema);