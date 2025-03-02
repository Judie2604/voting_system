const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  votes: { type: Number, default: 0 },
  number: { type: Number, unique: true },
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
