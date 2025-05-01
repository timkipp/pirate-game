const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Export the model
module.exports = mongoose.model('User', UserSchema);