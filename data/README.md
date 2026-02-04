# IPL Dataset

## 📊 Included Files

- **matches.csv** - Match-level information (756 matches)
- **deliveries.csv** - Ball-by-ball delivery data (179,078 deliveries)

## 📝 Dataset Description

### matches.csv
Contains information about each IPL match:
- Match ID, season, date
- Teams, venue, city
- Toss winner and decision
- Match result and winner
- Player of the match

### deliveries.csv
Contains ball-by-ball data for each match:
- Match ID, inning, over, ball
- Batting team, bowling team
- Batsman, bowler
- Runs scored
- Wickets taken
- Extras

## 🎯 Usage

These datasets were used to train the ML model (`pipe.pkl`) in the `ml-service/` directory.

The training script (`ml-service/train_model.py`) processes these files to:
1. Calculate match targets
2. Create second-innings situations
3. Calculate derived features (CRR, RRR, etc.)
4. Train the prediction model

## 🔄 Retraining

To retrain the model with these datasets:

```bash
cd ../ml-service
python train_model.py
```

## 📈 Dataset Statistics

- **Total Matches**: 756
- **Total Deliveries**: 179,078
- **Seasons Covered**: IPL 2017 onwards
- **Teams**: 8 main IPL teams
- **Training Samples Generated**: 64,470 match situations

## 🏏 Teams Included

1. Sunrisers Hyderabad
2. Mumbai Indians
3. Royal Challengers Bangalore
4. Kolkata Knight Riders
5. Kings XI Punjab
6. Chennai Super Kings
7. Rajasthan Royals
8. Delhi Capitals (formerly Delhi Daredevils)

## 📜 Data Source

Standard IPL ball-by-ball dataset commonly used for cricket analytics projects.

## ⚠️ Note

These datasets are for training and reference only. The pre-trained model (`pipe.pkl`) is already included in the project, so you don't need to retrain unless you want to experiment with different algorithms or updated data.
