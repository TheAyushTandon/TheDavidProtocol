from typing import List, Dict, Any
from datetime import datetime
import pandas as pd
import numpy as np
import joblib
import os

class ScoringService:
    _v2_model = None
    _v2_scaler = None
    _models_loaded = False

    @classmethod
    def load_models(cls):
        """Loads V2 models from the models directory."""
        if cls._models_loaded:
            return

        models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
        model_path = os.path.join(models_dir, 'resilience_v2.joblib')
        scaler_path = os.path.join(models_dir, 'scaler_v2.joblib')

        try:
            if os.path.exists(model_path):
                cls._v2_model = joblib.load(model_path)
            if os.path.exists(scaler_path):
                cls._v2_scaler = joblib.load(scaler_path)
            cls._models_loaded = True
            print("✅ Resilience V2 Model and Scaler loaded.")
        except Exception as e:
            print(f"Error loading V2 models: {e}. Falling back to Rule-based scoring.")

    @staticmethod
    def calculate_resilience_score(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates the Optimized Equis Resilience Score (300-850) based on 4 pillars.
        """
        if not transactions:
            return {"score": 300, "decision": "REJECT", "explanation": "No data.", "total_inflow": 0, "total_outflow": 0, "burn_velocity": "0x", "tips": []}

        df = pd.DataFrame(transactions)
        
        # --- 1. Basic Metrics ---
        total_inflow = df[df['amount'] > 0]['amount'].sum()
        total_outflow = df[df['amount'] < 0]['amount'].abs().sum()
        max_deposit = df[df['amount'] > 0]['amount'].max() if not df[df['amount'] > 0].empty else 0
        
        if total_inflow == 0:
            return {"score": 300, "decision": "REJECT", "explanation": "No inflow.", "total_inflow": 0, "total_outflow": float(total_outflow), "burn_velocity": "2.0x", "tips": []}

        # --- 2. Calculate Pillars ---
        
        # A. Retained Balance (W_balance: 40 pts)
        savings_rate = (total_inflow - total_outflow) / total_inflow
        w_balance = min(max(savings_rate / 0.20, 0), 1) * 40

        # B. Priority Management (W_priority: 20 pts)
        priority_spend = df[df['category'].isin(['RENT', 'UTILITIES'])]['amount'].abs().sum()
        priority_burden = priority_spend / total_inflow
        # Safe harbor <= 0.40, penalized 0.40 -> 0.70
        w_priority = min(max((0.70 - priority_burden) / 0.30, 0), 1) * 20
        if priority_burden <= 0.40: w_priority = 20

        # C. Payment Consistency (W_consistency: 30 pts)
        priority_df = df[df['category'].isin(['RENT', 'UTILITIES'])]
        if not priority_df.empty:
            mu = priority_df['amount'].abs().mean()
            sigma = priority_df['amount'].abs().std() if len(priority_df) > 1 else 0
            volatility = sigma / mu if mu > 0 else 0
            w_consistency = max(1 - (max(volatility - 0.10, 0) / 0.40), 0) * 30
        else:
            w_consistency = 15

        # D. Luxury Capacity (W_luxury: 10 pts)
        luxury_spend = df[df['category'] == 'LUXURY']['amount'].abs().sum()
        luxury_burden = luxury_spend / total_inflow
        w_luxury = 10 if 0.20 <= luxury_burden <= 0.30 else ( (luxury_burden/0.20)*10 if luxury_burden < 0.20 else max(10 - ((luxury_burden-0.30)/0.2)*10, 0) )

        # E. Income Buffer Bonus (Up to 10 pts)
        # Reward high-income stability (Monthly > 1M INR)
        monthly_inflow = total_inflow / 12
        income_bonus = min((monthly_inflow / 1000000) * 10, 10) if monthly_inflow > 500000 else 0

        # --- 3. Final Aggregation ---
        total_p_score = w_balance + w_priority + w_consistency + w_luxury + income_bonus
        # Map 0-100+ to 0-1000
        resilience_score = min(int(total_p_score * 10), 1000)
        
        burn_vel_num = total_outflow / total_inflow
        burn_velocity = f"{burn_vel_num:.2f}x"
        
        explanation = f"Pillars: Balance({w_balance:.1f}), Priority({w_priority:.1f}), Consistency({w_consistency:.1f}), Luxury({w_luxury:.1f}), Buffer({income_bonus:.1f}). "
        explanation += f"Score of {resilience_score} reflects a {savings_rate*100:.1f}% savings rate against a ₹{monthly_inflow:,.0f} monthly inflow."

        return {
            "score": resilience_score,
            "decision": "APPROVE" if resilience_score > 750 else "REVIEW",
            "explanation": explanation,
            "total_inflow": int(total_inflow / 12),
            "total_outflow": int(total_outflow / 12),
            "burn_velocity": burn_velocity,
            "max_deposit": float(max_deposit),
            "tips": []
        }
