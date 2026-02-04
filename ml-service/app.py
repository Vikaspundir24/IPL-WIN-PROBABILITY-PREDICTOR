from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load the ML model
MODEL_PATH = 'pipe.pkl'

try:
    pipe = pickle.load(open(MODEL_PATH, 'rb'))
    print("Model loaded successfully!")
except FileNotFoundError:
    print(f"WARNING: Model file '{MODEL_PATH}' not found. Please add your trained model.")
    pipe = None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': pipe is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if pipe is None:
            return jsonify({
                'error': 'Model not loaded. Please add pipe.pkl file to ml-service directory.'
            }), 500

        data = request.json
        
        # Extract input data
        batting_team = data.get('batting_team')
        bowling_team = data.get('bowling_team')
        city = data.get('city')
        target = float(data.get('target'))
        score = float(data.get('score'))
        overs = float(data.get('overs'))
        wickets = float(data.get('wickets'))
        
        # Calculate derived features
        runs_left = target - score
        balls_left = 120 - (overs * 6)
        wickets_left = 10 - wickets
        
        # Avoid division by zero
        if overs == 0:
            crr = 0
        else:
            crr = score / overs
            
        if balls_left == 0:
            rrr = 0
        else:
            rrr = (runs_left * 6) / balls_left
        
        # Create input DataFrame
        input_df = pd.DataFrame({
            'batting_team': [batting_team],
            'bowling_team': [bowling_team],
            'city': [city],
            'runs_left': [runs_left],
            'balls_left': [balls_left],
            'wickets': [wickets_left],
            'total_runs_x': [target],
            'crr': [crr],
            'rrr': [rrr]
        })
        
        # Make prediction
        result = pipe.predict_proba(input_df)
        loss_prob = result[0][0]
        win_prob = result[0][1]
        
        return jsonify({
            'batting_team': batting_team,
            'bowling_team': bowling_team,
            'win_probability': round(win_prob * 100, 2),
            'loss_probability': round(loss_prob * 100, 2),
            'runs_left': runs_left,
            'balls_left': balls_left,
            'current_run_rate': round(crr, 2),
            'required_run_rate': round(rrr, 2)
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
