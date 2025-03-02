const express = require('express');
const Voter = require('../models/Voter');
const router = express.Router();

// Route to add a new voter
router.post('/add', async (req, res) => {
  try {
    const { name, department, year, email } = req.body;

    // Check if all fields are provided
    if (!name || !department || !year || !email) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if the voter already exists (email must be unique)
    const existingVoter = await Voter.findOne({ email });
    if (existingVoter) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Create a new voter
    const newVoter = new Voter({ name, department, year, email });

    // Save the voter to the database
    await newVoter.save();
    res.status(201).json({ message: 'Voter added successfully!', voter: newVoter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not add voter.' });
  }
});

// Route to check if a voter has already voted
router.get('/voted/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Check if the voter exists
    const voter = await Voter.findOne({ email });
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found.' });
    }

    // Return whether the voter has voted or not
    res.status(200).json({ voted: voter.voted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not check voting status.' });
  }
});

module.exports = router;
