require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Card = require('./models/Card'); // Import the Card model

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Route to get all cards from MongoDB
app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find(); // Fetch all cards from the MongoDB cards collection
    res.json(cards); // Send the cards as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});