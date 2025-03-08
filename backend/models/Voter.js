const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
    name: String,
    department: String,
    year: String
});

module.exports = mongoose.model('Voter', VoterSchema);
