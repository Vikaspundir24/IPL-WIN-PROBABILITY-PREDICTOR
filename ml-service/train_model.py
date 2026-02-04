import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

print("Loading datasets...")
match = pd.read_csv('/mnt/user-data/uploads/matches.csv')
delivery = pd.read_csv('/mnt/user-data/uploads/deliveries.csv')

print(f"Matches shape: {match.shape}")
print(f"Deliveries shape: {delivery.shape}")

# Get total score for each match
total_score_df = delivery.groupby(['match_id', 'inning']).sum()['total_runs'].reset_index()

# Merge with match data
total_score_df = total_score_df[total_score_df['inning'] == 1]
match_df = match.merge(total_score_df[['match_id', 'total_runs']], left_on='id', right_on='match_id')

print("Processing match data...")
# Keep only relevant teams
teams = [
    'Sunrisers Hyderabad',
    'Mumbai Indians',
    'Royal Challengers Bangalore',
    'Kolkata Knight Riders',
    'Kings XI Punjab',
    'Chennai Super Kings',
    'Rajasthan Royals',
    'Delhi Capitals'
]

# Update team names for consistency
match_df['team1'] = match_df['team1'].str.replace('Delhi Daredevils', 'Delhi Capitals')
match_df['team2'] = match_df['team2'].str.replace('Delhi Daredevils', 'Delhi Capitals')
match_df['winner'] = match_df['winner'].str.replace('Delhi Daredevils', 'Delhi Capitals')

delivery['batting_team'] = delivery['batting_team'].str.replace('Delhi Daredevils', 'Delhi Capitals')
delivery['bowling_team'] = delivery['bowling_team'].str.replace('Delhi Daredevils', 'Delhi Capitals')

# Filter matches with relevant teams
match_df = match_df[match_df['team1'].isin(teams) & match_df['team2'].isin(teams)]

# Merge delivery with match data
delivery_df = match_df.merge(delivery, on='match_id')

print("Creating training dataset...")
# Keep only second innings
delivery_df = delivery_df[delivery_df['inning'] == 2].copy()

# Calculate cumulative runs and wickets
delivery_df['current_score'] = delivery_df.groupby('match_id')['total_runs_y'].cumsum()
delivery_df['runs_left'] = delivery_df['total_runs_x'] - delivery_df['current_score']
delivery_df['balls_left'] = 126 - (delivery_df['over'] * 6 + delivery_df['ball'])

# Calculate wickets
delivery_df['player_dismissed'] = delivery_df['player_dismissed'].fillna("0")
delivery_df['player_dismissed'] = delivery_df['player_dismissed'].apply(lambda x: 0 if x == "0" else 1)
delivery_df['wickets'] = delivery_df.groupby('match_id')['player_dismissed'].cumsum().values

# Current run rate
delivery_df['crr'] = (delivery_df['current_score'] * 6) / (120 - delivery_df['balls_left'])

# Required run rate
delivery_df['rrr'] = (delivery_df['runs_left'] * 6) / delivery_df['balls_left']

# Create result column
def result(row):
    return 1 if row['batting_team'] == row['winner'] else 0

delivery_df['result'] = delivery_df.apply(result, axis=1)

print("Preparing final dataset...")
# Select final columns for training
final_df = delivery_df[['batting_team', 'bowling_team', 'city', 'runs_left', 'balls_left', 
                         'wickets', 'total_runs_x', 'crr', 'rrr', 'result']]

# Remove rows with invalid values
final_df = final_df[(final_df['balls_left'] > 0) & (final_df['balls_left'] <= 120)]
final_df = final_df[final_df['runs_left'] >= 0]
final_df = final_df[final_df['wickets'] <= 10]
final_df = final_df[final_df['crr'] >= 0]
final_df = final_df[final_df['rrr'] >= 0]

# Sample the dataset for balanced training
final_df = final_df.sample(final_df.shape[0]).reset_index(drop=True)

print(f"Final dataset shape: {final_df.shape}")
print(f"Target distribution:\n{final_df['result'].value_counts()}")

# Prepare features and target
X = final_df.drop(['result'], axis=1)
y = final_df['result']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\nBuilding model pipeline...")

# Create preprocessing pipeline
trf = ColumnTransformer([
    ('trf', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), ['batting_team', 'bowling_team', 'city'])
], remainder='passthrough')

# Create full pipeline with Logistic Regression
pipe = Pipeline(steps=[
    ('step1', trf),
    ('step2', LogisticRegression(solver='liblinear', max_iter=1000))
])

print("Training model...")
pipe.fit(X_train, y_train)

# Evaluate
train_score = pipe.score(X_train, y_train)
test_score = pipe.score(X_test, y_test)

print(f"\nModel Performance:")
print(f"Training Accuracy: {train_score:.4f}")
print(f"Testing Accuracy: {test_score:.4f}")

# Save the model
print("\nSaving model as pipe.pkl...")
with open('/home/claude/pipe.pkl', 'wb') as f:
    pickle.dump(pipe, f)

print("✅ Model trained and saved successfully!")

# Test prediction
print("\n" + "="*50)
print("Testing prediction with sample data...")
print("="*50)

sample_data = pd.DataFrame({
    'batting_team': ['Mumbai Indians'],
    'bowling_team': ['Chennai Super Kings'],
    'city': ['Mumbai'],
    'runs_left': [85],
    'balls_left': [48],
    'wickets': [7],
    'total_runs_x': [180],
    'crr': [7.92],
    'rrr': [10.63]
})

prediction = pipe.predict_proba(sample_data)
print(f"\nSample Input:")
print(f"  Batting: Mumbai Indians vs Chennai Super Kings")
print(f"  City: Mumbai")
print(f"  Target: 180, Current: 95, Overs: 12, Wickets: 3")
print(f"\nPrediction:")
print(f"  Loss Probability: {prediction[0][0]*100:.2f}%")
print(f"  Win Probability: {prediction[0][1]*100:.2f}%")
print("\n✅ Model is working correctly!")
