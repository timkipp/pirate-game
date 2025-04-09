const express = require('express');
const cors = require('cors');
const GameState = require('./GameState');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

let gameState = new GameState('user123');

// Endpoint to get current game state
app.get('/game-state', (req, res) => {
    res.json(gameState);
});

// Endpoint to update resources
app.post('/update-resource', (req, res) => {
    const { resource, value } = req.body;
    gameState.setResource(resource, value);
    res.json(gameState);
});

// Endpoint to set market currency
app.post('/set-market-currency', (req, res) => {
    const { value } = req.body;
    gameState.setMarketCurrency(value);
    res.json(gameState);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});