import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [teams, setTeams] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    battingTeam: '',
    bowlingTeam: '',
    city: '',
    target: '',
    score: '',
    overs: '',
    wickets: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchTeams();
    fetchCities();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/teams`);
      setTeams(response.data.teams);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`);
      setCities(response.data.cities);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        battingTeam: formData.battingTeam,
        bowlingTeam: formData.bowlingTeam,
        city: formData.city,
        target: parseFloat(formData.target),
        score: parseFloat(formData.score),
        overs: parseFloat(formData.overs),
        wickets: parseInt(formData.wickets)
      });

      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      battingTeam: '',
      bowlingTeam: '',
      city: '',
      target: '',
      score: '',
      overs: '',
      wickets: ''
    });
    setPrediction(null);
    setError('');
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🏏 IPL Win Predictor</h1>
          <p>Predict match outcomes using Machine Learning</p>
        </header>

        <div className="main-content">
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-row">
              <div className="form-group">
                <label>Batting Team</label>
                <select
                  name="battingTeam"
                  value={formData.battingTeam}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select batting team</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bowling Team</label>
                <select
                  name="bowlingTeam"
                  value={formData.bowlingTeam}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select bowling team</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Host City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select host city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Target</label>
              <input
                type="number"
                name="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="Enter target score"
                min="0"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Score</label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  placeholder="Current score"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Overs Completed</label>
                <input
                  type="number"
                  name="overs"
                  value={formData.overs}
                  onChange={handleChange}
                  placeholder="Overs"
                  min="0"
                  max="20"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Wickets Lost</label>
                <input
                  type="number"
                  name="wickets"
                  value={formData.wickets}
                  onChange={handleChange}
                  placeholder="Wickets"
                  min="0"
                  max="10"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Probability'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>

          {prediction && (
            <div className="prediction-result">
              <h2>Match Prediction</h2>
              <div className="result-cards">
                <div className="result-card win">
                  <h3>{prediction.batting_team}</h3>
                  <div className="probability">{prediction.win_probability}%</div>
                  <p className="label">Win Probability</p>
                </div>
                <div className="result-card loss">
                  <h3>{prediction.bowling_team}</h3>
                  <div className="probability">{prediction.loss_probability}%</div>
                  <p className="label">Win Probability</p>
                </div>
              </div>
              <div className="match-stats">
                <div className="stat">
                  <span className="stat-label">Runs Required:</span>
                  <span className="stat-value">{prediction.runs_left}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Balls Remaining:</span>
                  <span className="stat-value">{prediction.balls_left}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Current Run Rate:</span>
                  <span className="stat-value">{prediction.current_run_rate}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Required Run Rate:</span>
                  <span className="stat-value">{prediction.required_run_rate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="footer">
          <p>Built with React, Node.js, Express, MongoDB & Python ML</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
