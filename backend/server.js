require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
