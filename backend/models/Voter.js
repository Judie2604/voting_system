const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  name: String,
  department: String,
  year: String,
  email: { type: String, unique: true },  // Ensure one vote per email
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
});

module.exports = mongoose.model('Voter', VoterSchema);
