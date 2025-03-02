router.post('/candidates', async (req, res) => {
  try {
    console.log("📥 Received request body:", req.body); // ✅ Log request body

    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({ message: '❌ Name and department are required.' });
    }

    // Find the highest number assigned so far and increment it
    const lastCandidate = await Candidate.findOne().sort({ number: -1 });
    const newNumber = lastCandidate ? lastCandidate.number + 1 : 1;

    const candidate = new Candidate({ name, department, number: newNumber });

    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    console.error("🚨 Error adding candidate:", error.message);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "❌ Candidate number already exists. Please try again." });
    }

    res.status(500).json({ message: '❌ Error adding candidate', error: error.message });
  }
});
