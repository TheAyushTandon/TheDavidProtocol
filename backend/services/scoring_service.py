from typing import List, Dict, Any
from datetime import datetime
import pandas as pd
import numpy as np
import joblib
import os

class ScoringService:
    _lr_model = None
    _xgb_model = None
    _models_loaded = False

    @classmethod
    def load_models(cls):
        """Loads models from the models directory if they exist."""
        if cls._models_loaded:
            return

        models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
        lr_path = os.path.join(models_dir, 'logistic_resilience_v1.joblib')
        xgb_path = os.path.join(models_dir, 'xgboost_resilience_v1.joblib')

        try:
            if os.path.exists(lr_path):
                cls._lr_model = joblib.load(lr_path)
            if os.path.exists(xgb_path):
                cls._xgb_model = joblib.load(xgb_path)
            cls._models_loaded = True
            print("ML models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}. Falling back to Rule-based scoring.")

    @staticmethod
    def calculate_resilience_score(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates a Resilience Score (0-1000) using a hybrid approach:
        1. Feature Engineering
        2. ML Model Prediction (if available)
        3. Rule-based Adjustments (Fallback/Refinement)
        """
        if not transactions:
            return {"score": 0, "decision": "REJECT", "explanation": "No transaction data found."}

        # Ensure models are loaded
        ScoringService.load_models()

        df = pd.DataFrame(transactions)
        
        # --- 1. Feature Engineering ---
        total_income = df[df['category'] == 'INCOME']['amount'].sum()
        total_rent = df[df['category'] == 'RENT']['amount'].abs().sum()
        total_savings = df[df['category'] == 'SAVINGS']['amount'].abs().sum()
        
        rent_ratio = total_rent / total_income if total_income > 0 else 1
        savings_rate = total_savings / total_income if total_income > 0 else 0
        
        # --- 2. ML Prediction ---
        ml_score_base = 500  # Default base
        
        if ScoringService._lr_model or ScoringService._xgb_model:
            # Prepare features for model
            features = pd.DataFrame([{
                'income': total_income,
                'rent': total_rent,
                'savings': total_savings,
                'credit_utilization': 0.3 # Placeholder for now
            }])
            
            try:
                # Use Logistic Regression for explainability by default
                if ScoringService._lr_model:
                    prob = ScoringService._lr_model.predict_proba(features)[0][1]
                    ml_score_base = int(prob * 1000)
            except Exception as e:
                print(f"Prediction error: {e}")

        # --- 3. Rule-based Refinement ---
        # We apply rules on top of ML or as pure fallback
        score = ml_score_base
        
        # Penalty for high rent ratio
        if rent_ratio > 0.4: score -= 100
        elif rent_ratio < 0.2: score += 50
        
        # Bonus for high savings
        if savings_rate > 0.15: score += 100
        
        # Final Score Capping
        score = max(0, min(1000, score))
        
        decision = "APPROVE" if score > 750 else ("REVIEW" if score > 550 else "REJECT")
        
        explanation = f"Resilience Score: {score}. "
        explanation += f"Income: ${total_income:.2f}, Savings Rate: {savings_rate*100:.1f}%. "
        explanation += f"Rent represents {rent_ratio*100:.1f}% of monthly income."
        
        return {
            "score": score,
            "decision": decision,
            "explanation": explanation
        }
