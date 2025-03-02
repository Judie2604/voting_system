const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Candidate = require('./models/Candidate'); // Candidate model
const Voter = require('./models/Voter'); // Voter model

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000; // Allow dynamic ports for deployment

// ✅ Middleware
app.use(cors());
app.use(express.json()); // ✅ Built-in JSON parser (no need for body-parser)

// ✅ MongoDB Connection
const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  console.error("❌ MongoDB URI is missing in .env file!");
  process.exit(1);
}

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Test Route
app.get('/test', (req, res) => {
  res.send('✅ Test endpoint is working!');
});

// ✅ Get All Candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: '❌ Error fetching candidates', error });
  }
});

// ✅ Add a New Candidate
app.post('/api/addCandidate', async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({ message: "❌ Candidate name and department are required." });
    }

    const newCandidate = new Candidate({ name, department, votes: 0 });
    await newCandidate.save();

    res.status(201).json({ message: '✅ Candidate added successfully!' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error adding candidate', error });
  }
});

// ✅ Get All Voters
app.get('/api/voters', async (req, res) => {
  try {
    const voters = await Voter.find();
    res.status(200).json(voters);
  } catch (error) {
    res.status(500).json({ message: '❌ Error fetching voters', error });
  }
});

// ✅ Add a New Voter
app.post('/api/addVoter', async (req, res) => {
  try {
    const { email, name, department, year } = req.body;

    if (!email || !name || !department || !year) {
      return res.status(400).json({ message: "❌ All voter details are required." });
    }

    const newVoter = new Voter({ email, name, department, year });
    await newVoter.save();

    res.status(201).json({ message: '✅ Voter added successfully!' });
  } catch (error) {
    res.status(400).json({ message: '❌ Error adding voter', error });
  }
});

// ✅ Record a Vote
app.post('/api/vote', async (req, res) => {
  try {
    const { voterEmail, candidateId } = req.body;

    if (!voterEmail || !candidateId) {
      return res.status(400).json({ message: "❌ Voter email and candidate ID are required." });
    }

    // ❌ Check if the voter has already voted
    const existingVoter = await Voter.findOne({ email: voterEmail });
    if (existingVoter) {
      return res.status(400).json({ message: '❌ This voter has already voted.' });
    }

    // ✅ Find Candidate & Increment Votes
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: '❌ Candidate not found.' });
    }

    candidate.votes += 1; // ✅ Increment votes
    await candidate.save();

    // ✅ Register the voter in the voters list
    const newVoter = new Voter({ email: voterEmail });
    await newVoter.save();

    res.status(200).json({ message: '✅ Vote recorded successfully!' });
  } catch (error) {
    res.status(500).json({ message: '❌ Error recording vote', error });
  }
});

// ✅ Get Voting Results
app.get('/api/result', async (req, res) => {
  try {
    const candidates = await Candidate.find();

    if (candidates.length === 0) {
      return res.status(404).json({ message: "❌ No candidates found." });
    }

    const winner = candidates.reduce((prev, current) => (prev.votes > current.votes ? prev : current));

    res.status(200).json({
      winner: winner.name,
      votes: winner.votes,
      candidateId: winner._id
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Error fetching results', error });
  }
});
