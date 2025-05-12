const mongoose = require('mongoose');

// Get the appropriate Mongo URI depending on the environment (local or remote)
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_REMOTE : process.env.MONGO_URI_LOCAL;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB; // Export the connectDB function