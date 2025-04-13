const mongoose = require('mongoose');
const connectDB = require('./db');
const Card = require('./models/Card');

const run = async () => {
  await connectDB();
  const cards = await Card.find({});
  console.log('Raw cards:', JSON.stringify(cards, null, 2));
  mongoose.connection.close();
};

run();