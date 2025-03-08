const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');

// Voting logic
router.post('/vote', async (req, res) => {
    const { name, department, year, candidateId } = req.body;

    // Check if voter already voted
    const existingVoter = await Voter.findOne({ name, department, year });
    if (existingVoter) {
        return res.json({ success: false, message: 'Already voted' });
    }

    // Save new voter
    const voter = new Voter({ name, department, year });
    await voter.save();

    // Increment candidate votes
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    res.json({ success: true, message: 'Vote cast successfully!' });
});

module.exports = router;
