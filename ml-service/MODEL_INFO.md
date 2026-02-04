# ML Service - Model Information

## ✅ Model Included!

The trained ML model `pipe.pkl` is **already included** in this directory!

## 📊 Model Details

- **Model Type**: Logistic Regression with OneHotEncoder
- **Training Accuracy**: 80.88%
- **Testing Accuracy**: 80.51%
- **Dataset**: IPL matches from 2017 onwards
- **Total Training Samples**: 64,470 match situations

## 🎯 Model Features

### Input Features (9 features):
1. **batting_team** (categorical) - Team chasing the target
2. **bowling_team** (categorical) - Team defending
3. **city** (categorical) - Match venue
4. **runs_left** (numeric) - Runs needed to win
5. **balls_left** (numeric) - Balls remaining
6. **wickets** (numeric) - Wickets in hand (10 - wickets lost)
7. **total_runs_x** (numeric) - Target score
8. **crr** (numeric) - Current run rate
9. **rrr** (numeric) - Required run rate

### Output:
- Win probability (0-100%)
- Loss probability (0-100%)

## 🏏 Supported Teams

- Sunrisers Hyderabad
- Mumbai Indians
- Royal Challengers Bangalore
- Kolkata Knight Riders
- Kings XI Punjab
- Chennai Super Kings
- Rajasthan Royals
- Delhi Capitals

## 🔄 Retraining the Model

If you want to retrain with updated data:

```bash
# Make sure you have the datasets in ../data/
python train_model.py
```

This will create a new `pipe.pkl` file.

## 📈 Sample Prediction

**Input:**
- Batting: Mumbai Indians
- Bowling: Chennai Super Kings
- City: Mumbai
- Target: 180
- Current Score: 95
- Overs: 12
- Wickets Lost: 3

**Calculated Features:**
- Runs Left: 85
- Balls Left: 48
- Wickets in Hand: 7
- CRR: 7.92
- RRR: 10.63

**Prediction:**
- Win Probability: ~9-10%
- Loss Probability: ~90-91%

(This makes sense - Mumbai needs 85 runs from 48 balls at 10.63 RR, which is quite difficult!)

## 🧪 Testing the Model

Start the Flask service:

```bash
python app.py
```

Test with curl:

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "batting_team": "Mumbai Indians",
    "bowling_team": "Chennai Super Kings",
    "city": "Mumbai",
    "target": 180,
    "score": 95,
    "overs": 12,
    "wickets": 3
  }'
```

## 📊 Dataset Information

The model was trained on:
- **matches.csv**: Match-level data (756 matches)
- **deliveries.csv**: Ball-by-ball data (179,078 deliveries)
- **Seasons**: IPL 2017 and onwards

Datasets are included in the `../data/` folder for reference.

## 🔧 Model Pipeline

```
Input Data
    ↓
OneHotEncoder (for categorical features: teams, city)
    ↓
Logistic Regression Classifier
    ↓
Probability Predictions
```

## ✅ Model Ready to Use!

No additional setup needed - just run `python app.py` and the model will load automatically!
