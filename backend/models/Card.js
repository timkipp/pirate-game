const mongoose = require('mongoose');

// Define the schema for the inner "result" objects (for good and bad results)
const resultSchema = new mongoose.Schema({
  gold_effect: { type: Number, default: 0 },
  provisions_effect: { type: Number, default: 0 },
  morale_effect: { type: Number, default: 0 },
  crew_effect: { type: Number, default: 0 }
});

// Define the schema for each choice (A, B)
const choiceSchema = new mongoose.Schema({
  action_taken: String,
  good_result_chance: String,
  good_result: resultSchema,
  bad_result: resultSchema
});

// Define the main card schema
const cardSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  difficulty: { type: Number, required: true },
  choices: {
    A: choiceSchema,
    B: choiceSchema
  }
});

// Create the model based on the schema
const Card = mongoose.model('Card', cardSchema);

module.exports = Card;