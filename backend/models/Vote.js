const mongoose = require('mongoose');

// Define the schema for storing vote details
const voteSchema = new mongoose.Schema({
  voterEmail: {
    type: String,
    required: true,
    unique: true // Ensures that a voter can only vote once
  },
  candidateNumber: {
    type: Number,
    required: true
  }
});

// Create the model from the schema
const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
