// Load environment variables
require('dotenv').config();

//handled path earlier to allow inputs to utilize it
const path = require('path');

// Imports
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const GameState = require('./GameState');

// Import routes
const captainRoutes = require('./routes/captains');
const itemRoutes = require('./routes/items');
const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const leaderboardRouter = require('./routes/leaderboard');


// App setup
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Leaderboard route
app.use('/api/leaderboard', leaderboardRouter);

// Game state instance (in-memory, not tied to DB)
let gameState = new GameState('user123');

// --- Routes ---

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use imported route files for captains, items, cards, and users
app.use('/api/captains', captainRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Game state routes
app.get('/game-state', (req, res) => {
  res.json(gameState);
});

app.post('/update-resource', (req, res) => {
  const { resource, value } = req.body;
  gameState.setResource(resource, value);
  res.json(gameState);
});

app.post('/set-market-currency', (req, res) => {
  const { value } = req.body;
  gameState.setMarketCurrency(value);
  res.json(gameState);
});

// Route to initialize game state for a user
app.post('/api/game-state/init', async (req, res) => {
    const { userID } = req.body;
    const gameState = new GameState(userID);
    try {
        await gameState.loadUserData();
        res.json({ message: 'Game state initialized', resources: gameState.resources, score: gameState.score });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing game state', error: error.message });
    }
});

// Route to update a resource
app.post('/api/game-state/resource', async (req, res) => {
    const { userID, resource, value } = req.body;
    const gameState = new GameState(userID);
    try {
        await gameState.loadUserData();
        await gameState.setResource(resource, value);
        res.json({ message: 'Resource updated', resources: gameState.resources });
    } catch (error) {
        res.status(500).json({ message: 'Error updating resource', error: error.message });
    }
});

// Route to set captain
app.post('/api/game-state/captain', async (req, res) => {
    const { userID, captain } = req.body;
    const gameState = new GameState(userID);
    try {
        await gameState.loadUserData();
        await gameState.setCaptain(captain);
        res.json({ message: 'Captain updated', captain: gameState.captain });
    } catch (error) {
        res.status(500).json({ message: 'Error updating captain', error: error.message });
    }
});

// Route to set score
app.post('/api/game-state/score', async (req, res) => {
    const { userID, updatedScore } = req.body;
    const gameState = new GameState(userID);
    try {
        await gameState.loadUserData();
        await gameState.setScore(updatedScore);
        res.json({ message: 'Score updated', score: gameState.updatedScore });
    } catch (error) {
        res.status(500).json({ message: 'Error updating score', error: error.message });
    }
});

// Route to apply a stat boost
app.post('/api/game-state/boost', async (req, res) => {
    const { userID, boost } = req.body;
    const gameState = new GameState(userID);
    try {
        await gameState.loadUserData();
        await gameState.applyStatBoost(boost);
        res.json({ message: 'Stat boost applied', resources: gameState.resources });
    } catch (error) {
        res.status(500).json({ message: 'Error applying stat boost', error: error.message });
    }
});

// Route to check if the game is lost
app.get('/api/game-state/lost', async (req, res) => {
    const { userID } = req.query;
    const gameState = new GameState(userID);
    try {
        await gameState.loadUserData();
        res.json({ lost: gameState.lost });
    } catch (error) {
        res.status(500).json({ message: 'Error checking game state', error: error.message });
    }
});

// Route to fetch all cards
app.get('/api/cards', async (req, res) => {
    try {
        const cards = require('./database/cards.json'); // Adjust the path if needed
        res.json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Error fetching cards' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});