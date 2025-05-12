// backend/convertCsvToJson.js
const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('cards.csv') // Make sure this matches your actual filename
  .pipe(csv())
  .on('data', (row) => {
    // Debugging: Log the raw ID value to check if there are any unexpected characters
    console.log('Raw ID value:', row['id']);

    let id = row['id'];

    if (!id || isNaN(id.trim())) {
      console.log('Missing or invalid ID for row:', row);
      id = null; // Set to null if invalid or missing
    } else {
      id = Number(id.trim()); // Convert to number after trimming
    }

    const card = {
      id: id,
      title: row['title'],
      description: row['description'],
      type: row['type'],
      difficulty: Number(row['difficulty']),
      choices: {
        A: {
          action_taken: row['action_taken_A'],
          good_result_chance: row['good_result_chance_A'],
          good_result: {
            gold_effect: Number(row['gold_effect_A_good']),
            provisions_effect: Number(row['provisions_effect_A_good']),
            morale_effect: Number(row['morale_effect_A_good']),
            crew_effect: Number(row['crew_effect_A_good']),
          },
          bad_result: {
            gold_effect: Number(row['gold_effect_A_bad']),
            provisions_effect: Number(row['provisions_effect_A_bad']),
            morale_effect: Number(row['morale_effect_A_bad']),
            crew_effect: Number(row['crew_effect_A_bad']),
          }
        },
        B: {
          action_taken: row['action_taken_B'],
          good_result_chance: row['good_result_chance_B'],
          good_result: {
            gold_effect: Number(row['gold_effect_B_good']),
            provisions_effect: Number(row['provisions_effect_B_good']),
            morale_effect: Number(row['morale_effect_B_good']),
            crew_effect: Number(row['crew_effect_B_good']),
          },
          bad_result: {
            gold_effect: Number(row['gold_effect_B_bad']),
            provisions_effect: Number(row['provisions_effect_B_bad']),
            morale_effect: Number(row['morale_effect_B_bad']),
            crew_effect: Number(row['crew_effect_B_bad']),
          }
        }
      }
    };

    results.push(card);
  })
  .on('end', () => {
    fs.writeFileSync('cards.json', JSON.stringify(results, null, 2));
    console.log('CSV successfully converted to cards.json');
  })
  .on('error', (err) => {
    console.error('Error processing CSV:', err);
  });