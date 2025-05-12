const mongoose = require('../db'); // Import MongoDB connection
const Card = require('../models/Card'); // Import Card model
const { Parser } = require('json2csv'); // Import json2csv library
const fs = require('fs');

// Function to export the cards collection to CSV
async function exportCardsToCSV() {
  try {
    console.log('Fetching cards from the database...');
    const cards = await Card.find(); // Fetch all the cards from the database

    // If no cards were found, log and exit early
    if (cards.length === 0) {
      console.log('No cards found in the database.');
      return;
    }

    console.log(`Found ${cards.length} cards. Converting to CSV...`);

    // Transform the MongoDB data to a plain JavaScript object
    const cardsData = cards.map(card => {
      return {
        id: card.id,
        title: card.title,
        description: card.description,
        type: card.type,
        difficulty: card.difficulty,
        action_taken_A: card.choices.A.action_taken,
        good_result_chance_A: card.choices.A.good_result_chance,
        gold_effect_A_good: card.choices.A.good_result.gold_effect,
        provisions_effect_A_good: card.choices.A.good_result.provisions_effect,
        morale_effect_A_good: card.choices.A.good_result.morale_effect,
        crew_effect_A_good: card.choices.A.good_result.crew_effect,
        gold_effect_A_bad: card.choices.A.bad_result.gold_effect,
        provisions_effect_A_bad: card.choices.A.bad_result.provisions_effect,
        morale_effect_A_bad: card.choices.A.bad_result.morale_effect,
        crew_effect_A_bad: card.choices.A.bad_result.crew_effect,
        action_taken_B: card.choices.B.action_taken,
        good_result_chance_B: card.choices.B.good_result_chance,
        gold_effect_B_good: card.choices.B.good_result.gold_effect,
        provisions_effect_B_good: card.choices.B.good_result.provisions_effect,
        morale_effect_B_good: card.choices.B.good_result.morale_effect,
        crew_effect_B_good: card.choices.B.good_result.crew_effect,
        gold_effect_B_bad: card.choices.B.bad_result.gold_effect,
        provisions_effect_B_bad: card.choices.B.bad_result.provisions_effect,
        morale_effect_B_bad: card.choices.B.bad_result.morale_effect,
        crew_effect_B_bad: card.choices.B.bad_result.crew_effect
      };
    });

    // Convert the data to CSV
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(cardsData);

    // Write the CSV data to a file
    fs.writeFileSync('cards_export.csv', csvData);

    console.log('Cards data exported to cards_export.csv');
  } catch (err) {
    console.error('Error exporting data:', err);
  }

  // Disconnect from MongoDB when done
  mongoose.connection.close(); // Use connection.close() for better compatibility
}

// Run the export function
exportCardsToCSV();