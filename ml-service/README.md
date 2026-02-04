# ML Service - Model Setup

## ⚠️ IMPORTANT: Add Your Model File

This directory needs the trained machine learning model file to work.

### Required File

**File Name:** `pipe.pkl`

**Location:** Place it in this directory (`ml-service/pipe.pkl`)

### If You Don't Have the Model File

You have several options:

#### Option 1: Use Your Existing Model
If you already have a trained model from your original Streamlit app, simply copy the `pipe.pkl` file to this directory.

#### Option 2: Train a New Model
Use the provided Jupyter notebook (`Untitled.ipynb` from your uploads) to train a new model. The notebook should:
1. Load IPL match data
2. Preprocess the data
3. Train a classification model
4. Save the pipeline as `pipe.pkl`

#### Option 3: Create a Sample Model (For Testing)
If you just want to test the app structure, you can create a dummy model:

```python
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# This is just a placeholder - replace with your actual model
# Your actual model should be trained on real IPL data

# Sample code to create a basic pipeline structure
# (You should use your actual trained model instead)

# Note: This won't give accurate predictions!
# It's only for testing the app structure
```

### Model Requirements

Your `pipe.pkl` file should be a scikit-learn pipeline that:

1. **Accepts** these input features:
   - `batting_team` (string)
   - `bowling_team` (string)
   - `city` (string)
   - `runs_left` (float)
   - `balls_left` (float)
   - `wickets` (int)
   - `total_runs_x` (float)
   - `crr` (float) - current run rate
   - `rrr` (float) - required run rate

2. **Provides** predictions via:
   - `predict_proba(input_df)` method
   - Returns probability array: `[[loss_prob, win_prob]]`

### Verify Model is Loaded

After adding `pipe.pkl`, start the ML service:

```bash
python app.py
```

You should see:
```
Model loaded successfully!
```

If you see "Model not found" warning, check:
- File is named exactly `pipe.pkl`
- File is in the `ml-service/` directory
- File has read permissions

### Testing the Model

Once the service is running, you can test it:

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

You should get a JSON response with predictions.

## Need Help?

- Make sure you have the original `pipe.pkl` from your Streamlit app
- If you need to retrain the model, use the Jupyter notebook
- The model file should be a pickled scikit-learn pipeline

---

**Remember:** The app will run without the model, but predictions won't work until you add `pipe.pkl`!
