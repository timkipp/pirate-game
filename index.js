const GameState = require('./GameState');
const Card = require('./Card'); // Assuming Card.js is handled separately
const Marketplace = require('./Marketplace'); // Assuming Marketplace.js is handled separately

// Example usage
const gameState = new GameState();
const marketplace = new Marketplace();

// Add items and captains to the marketplace
marketplace.addItem({ id: 1, cost: 50, boost: { gold: 10, food: 5 } });
marketplace.addCaptain({ id: 1, unlockCost: 100, startingGold: 50, startingFood: 50, startingMorale: 50, startingCrewSize: 50 });

// Set initial market currency
gameState.setMarketCurrency(200);

// Unlock a captain
marketplace.unlockCaptain(1, gameState);

// Create a card and apply a choice
const card = new Card(1, 'Pirate Attack', 'A fierce battle with pirates.', 'Combat', 3, [
    {
        choiceA: {
            goodResultChance: 70,
            resourcesAffected: [
                { name: 'gold', shiftGood: 20, shiftBad: -10 },
                { name: 'morale', shiftGood: 10, shiftBad: -5 }
            ]
        },
        choiceB: {
            goodResultChance: 50,
            resourcesAffected: [
                { name: 'food', shiftGood: 15, shiftBad: -10 },
                { name: 'crewSize', shiftGood: 5, shiftBad: -5 }
            ]
        }
    }
]);

card.applyChoice(card.choices[0].choiceA, gameState);

console.log(gameState.resources);
console.log('Market Currency:', gameState.getMarketCurrency());