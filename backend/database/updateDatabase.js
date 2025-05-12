require('dotenv').config();
const connectDB = require('../db'); // Import MongoDB connection function
const Card = require('../models/Card'); // Import Card model
const fs = require('fs');
const mongoose = require('mongoose'); // Ensure Mongoose is required for disconnect

// Read the cards.json file
const cardsData = JSON.parse(fs.readFileSync('cards.json', 'utf-8'));

// Function to update or insert cards into the database
async function updateDatabase() {
  // Wait for DB connection to establish
  await connectDB();

  for (const cardData of cardsData) {
    console.log(`Processing card with id: ${cardData.id}`); // Log the card id to debug

    if (!cardData.id) {
      console.error(`Card with missing id:`, cardData); // Log if any card is missing an id
      continue; // Skip the card if no id exists
    }

    try {
      // Check if the card already exists by its id
      const existingCard = await Card.findOne({ id: cardData.id });

      if (existingCard) {
        // If the card exists, update it
        await Card.updateOne({ id: cardData.id }, cardData);
        console.log(`Card with id ${cardData.id} updated.`);
      } else {
        // If the card doesn't exist, insert a new card
        const newCard = new Card(cardData);
        await newCard.save();
        console.log(`Card with id ${cardData.id} inserted.`);
      }
    } catch (err) {
      console.error(`Error updating/inserting card with id ${cardData.id}:`, err);
    }
  }

  // Disconnect from MongoDB when done
  mongoose.disconnect();
}

// Run the update function
updateDatabase().then(() => {
  console.log('Database update complete.');
}).catch((err) => {
  console.error('Error updating the database:', err);
});