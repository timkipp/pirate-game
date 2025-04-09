const GameState = require('./GameState');

// Example usage
const userID = 'user123'; // Example user ID
const gameState = new GameState(userID);

// Initialize with a captain
const defaultCaptain = {
    startingGold: 50,
    startingFood: 50,
    startingMorale: 50,
    startingCrewSize: 50
};
gameState.setCaptain(defaultCaptain);

// Example of applying a stat boost from a purchased item
const purchasedItemBoost = {
    gold: 10,
    food: 5
};
gameState.applyStatBoost(purchasedItemBoost);

// Example of setting and getting market currency
gameState.setMarketCurrency(200);
console.log('Market Currency:', gameState.getMarketCurrency());

// Example of getting and setting resources
console.log('Gold:', gameState.getResource('gold'));
gameState.setResource('gold', 80);
console.log('Updated Gold:', gameState.getResource('gold'));

console.log('Current Resources:', gameState.resources);