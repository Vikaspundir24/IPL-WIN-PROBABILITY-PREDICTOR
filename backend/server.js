const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Optional - for storing prediction history)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl-predictor';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection optional:', err.message));

// Prediction Schema (Optional - to store history)
const predictionSchema = new mongoose.Schema({
  battingTeam: String,
  bowlingTeam: String,
  city: String,
  target: Number,
  score: Number,
  overs: Number,
  wickets: Number,
  winProbability: Number,
  lossProbability: Number,
  createdAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model('Prediction', predictionSchema);

// Python ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.get('/api/teams', (req, res) => {
  const teams = [
    'Sunrisers Hyderabad',
    'Mumbai Indians',
    'Royal Challengers Bangalore',
    'Kolkata Knight Riders',
    'Kings XI Punjab',
    'Chennai Super Kings',
    'Rajasthan Royals',
    'Delhi Capitals'
  ];
  res.json({ teams: teams.sort() });
});

app.get('/api/cities', (req, res) => {
  const cities = [
    'Hyderabad', 'Bangalore', 'Mumbai', 'Indore', 'Kolkata', 'Delhi',
    'Chandigarh', 'Jaipur', 'Chennai', 'Cape Town', 'Port Elizabeth',
    'Durban', 'Centurion', 'East London', 'Johannesburg', 'Kimberley',
    'Bloemfontein', 'Ahmedabad', 'Cuttack', 'Nagpur', 'Dharamsala',
    'Visakhapatnam', 'Pune', 'Raipur', 'Ranchi', 'Abu Dhabi',
    'Sharjah', 'Mohali', 'Bengaluru'
  ];
  res.json({ cities: cities.sort() });
});

app.post('/api/predict', async (req, res) => {
  try {
    const { battingTeam, bowlingTeam, city, target, score, overs, wickets } = req.body;

    // Validate input
    if (!battingTeam || !bowlingTeam || !city || target === undefined || 
        score === undefined || overs === undefined || wickets === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (battingTeam === bowlingTeam) {
      return res.status(400).json({ error: 'Batting and bowling teams must be different' });
    }

    // Call Python ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      batting_team: battingTeam,
      bowling_team: bowlingTeam,
      city: city,
      target: target,
      score: score,
      overs: overs,
      wickets: wickets
    });

    const result = mlResponse.data;

    // Save to database (optional)
    try {
      const prediction = new Prediction({
        battingTeam,
        bowlingTeam,
        city,
        target,
        score,
        overs,
        wickets,
        winProbability: result.win_probability,
        lossProbability: result.loss_probability
      });
      await prediction.save();
    } catch (dbError) {
      console.log('Database save skipped:', dbError.message);
    }

    res.json(result);
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ 
      error: 'Prediction failed',
      message: error.response?.data?.error || error.message
    });
  }
});

// Get prediction history (optional)
app.get('/api/history', async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
