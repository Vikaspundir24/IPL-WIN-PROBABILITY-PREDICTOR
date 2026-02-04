# IPL Win Predictor

A web app that predicts IPL cricket match outcomes using machine learning.

## What It Does

Enter the current match situation (teams playing, current score, overs bowled, wickets fallen) and get the win probability for both teams.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **ML Service**: Python + Flask + scikit-learn
- **Database**: MongoDB (optional)

## How to Run Locally

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)

### Installation

**1. Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in backend folder:
```
PORT=3001
ML_SERVICE_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/ipl-predictor
```

**2. ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
```

**3. Frontend:**
```bash
cd frontend
npm install
```

Create a `.env` file in frontend folder:
```
REACT_APP_API_URL=http://localhost:3001/api
```

### Running the App

Open 3 terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - ML Service:**
```bash
cd ml-service
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

Open http://localhost:3000 in your browser.

## How It Works

1. User enters match details in React frontend
2. Frontend sends request to Node.js backend
3. Backend calls Python Flask ML service
4. ML model predicts win probability
5. Results displayed to user

## ML Model

- Trained on IPL match data from 2017-2024
- Uses Logistic Regression
- Features: batting team, bowling team, venue, current run rate, required run rate, wickets, runs remaining
- Accuracy: ~80%

## Project Structure
```
ipl-predictor/
├── backend/          # Node.js API
├── frontend/         # React app
└── ml-service/       # Python ML service
```

## Challenges I Faced

- Getting the ML model to load properly in Flask
- CORS issues between frontend and backend
- Feature engineering for the model
- Managing state in React for form inputs

## Future Improvements

- Add player statistics
- Live match updates
- Better UI/UX
- Mobile responsive design
- Add charts for probability visualization

## Screenshots

[Add screenshots here after deployment]

## Live Demo

[Add live URL after deployment]

---

Made by Vikas Pundir