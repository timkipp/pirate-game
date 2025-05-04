// Load environment variables
require('dotenv').config();

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


// App setup
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});