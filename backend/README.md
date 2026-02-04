# Backend - Node.js/Express API

REST API server for IPL Win Predictor application.

## Overview

This Express.js server provides:
- RESTful API endpoints for frontend
- Integration with Python ML service
- MongoDB connection for storing predictions
- CORS enabled for frontend communication

## Installation

```bash
npm install
```

## Configuration

Create `.env` file (or copy from `.env.example`):

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ipl-predictor
ML_SERVICE_URL=http://localhost:5000
```

## Running

```bash
# Development
npm start

# With auto-reload (if you add nodemon)
npm run dev
```

## API Endpoints

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

### GET /api/teams
Get list of IPL teams

**Response:**
```json
{
  "teams": [
    "Chennai Super Kings",
    "Delhi Capitals",
    ...
  ]
}
```

### GET /api/cities
Get list of match cities

**Response:**
```json
{
  "cities": [
    "Ahmedabad",
    "Bangalore",
    ...
  ]
}
```

### POST /api/predict
Get match prediction

**Request:**
```json
{
  "battingTeam": "Mumbai Indians",
  "bowlingTeam": "Chennai Super Kings",
  "city": "Mumbai",
  "target": 180,
  "score": 95,
  "overs": 12,
  "wickets": 3
}
```

**Response:**
```json
{
  "batting_team": "Mumbai Indians",
  "bowling_team": "Chennai Super Kings",
  "win_probability": 65.5,
  "loss_probability": 34.5,
  "runs_left": 85,
  "balls_left": 48,
  "current_run_rate": 7.92,
  "required_run_rate": 10.63
}
```

### GET /api/history
Get prediction history (requires MongoDB)

**Response:**
```json
{
  "predictions": [...]
}
```

## Dependencies

- **express**: Web framework
- **cors**: Enable CORS
- **mongoose**: MongoDB ODM
- **axios**: HTTP client for ML service
- **dotenv**: Environment variables

## MongoDB

MongoDB is optional. The app works without it, but prediction history won't be saved.

To use MongoDB:
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env`
3. Restart the server

## Testing

Test the API using curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Get teams
curl http://localhost:3001/api/teams

# Make prediction
curl -X POST http://localhost:3001/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "battingTeam": "Mumbai Indians",
    "bowlingTeam": "Chennai Super Kings",
    "city": "Mumbai",
    "target": 180,
    "score": 95,
    "overs": 12,
    "wickets": 3
  }'
```

## Error Handling

All endpoints include error handling:
- 400: Bad request (validation errors)
- 500: Server error (ML service down, etc.)

## Development

To add new endpoints:
1. Add route in `server.js`
2. Implement handler function
3. Test with curl or Postman
4. Update frontend to call new endpoint
