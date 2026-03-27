import pandas as pd
import numpy as np
import joblib
import os
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

def generate_synthetic_data(n_samples=1000):
    """
    Generates synthetic bank data for training the initial resilience model.
    """
    np.random.seed(42)
    
    # Features
    income = np.random.uniform(2000, 10000, n_samples)
    rent = np.random.uniform(500, 4000, n_samples)
    savings = np.random.uniform(0, 5000, n_samples)
    credit_utilization = np.random.uniform(0.1, 0.9, n_samples)
    
    # Simple target logic for resilience
    # 1: Resilient, 0: Not Resilient
    score = (income * 0.4) - (rent * 0.3) + (savings * 0.2) - (credit_utilization * 1000)
    target = (score > np.percentile(score, 40)).astype(int)
    
    data = pd.DataFrame({
        'income': income,
        'rent': rent,
        'savings': savings,
        'credit_utilization': credit_utilization,
        'target': target
    })
    
    return data

def train_and_save_models():
    print("Generating synthetic data...")
    data = generate_synthetic_data()
    
    X = data.drop('target', axis=1)
    y = data['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 1. Logistic Regression (Explainable)
    print("Training Logistic Regression...")
    lr_model = LogisticRegression()
    lr_model.fit(X_train, y_train)
    
    # 2. XGBoost (High Accuracy)
    print("Training XGBoost...")
    xgb_model = XGBClassifier()
    xgb_model.fit(X_train, y_train)
    
    # Save artifacts
    models_dir = os.path.join('backend', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(lr_model, os.path.join(models_dir, 'logistic_resilience_v1.joblib'))
    joblib.dump(xgb_model, os.path.join(models_dir, 'xgboost_resilience_v1.joblib'))
    
    print(f"Models saved successfully to {models_dir}")

if __name__ == "__main__":
    train_and_save_models()
