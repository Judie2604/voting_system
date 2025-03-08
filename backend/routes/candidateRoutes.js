const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Add a new candidate
router.post('/add', async (req, res) => {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    res.json({ success: true, message: 'Candidate added!' });
});

// Get all candidates
router.get('/all', async (req, res) => {
    const candidates = await Candidate.find();
    res.json(candidates);
});

// Delete a candidate
router.delete('/delete/:id', async (req, res) => {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Candidate deleted!' });
});

module.exports = router;
