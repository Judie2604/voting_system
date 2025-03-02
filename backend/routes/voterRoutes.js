const express = require('express');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');
const router = express.Router();

// Route to cast a vote
router.post('/cast', async (req, res) => {
  try {
    const { email, candidateNumber } = req.body;

    // Validate the input
    if (!email || !candidateNumber) {
      return res.status(400).json({ message: 'Email and candidate number are required.' });
    }

    // Check if the voter exists and if they have already voted
    const voter = await Voter.findOne({ email });
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found.' });
    }
    if (voter.voted) {
      return res.status(400).json({ message: 'You have already voted.' });
    }

    // Check if the candidate exists
    const candidate = await Candidate.findOne({ number: candidateNumber });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Create a new vote record
    const newVote = new Vote({ voterEmail: email, candidateNumber });

    // Save the vote to the database
    await newVote.save();

    // Update the voter's status to indicate they have voted
    voter.voted = true;
    await voter.save();

    // Increment the candidate's vote count (you'll need to update the Candidate model to track votes)
    candidate.votes = (candidate.votes || 0) + 1;
    await candidate.save();

    res.status(200).json({ message: 'Vote cast successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not cast vote.' });
  }
});

module.exports = router;
