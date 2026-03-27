# 🧠 David Protocol — ML Architecture & Integration Guide

Welcome to the ML side of the David Protocol! This document explains how the backend consumes machine learning models and how you can integrate your trained models into the pipeline.

## 🔷 System Overview

The David Protocol generates a **Financial Resilience Score** (0-1000). The backend handles data ingestion (Plaid) and categorization (NLP), then hands off a set of aggregated features to your models to get a base score.

## 📊 Data & Feature Pipeline

Before the model is called, the raw transaction data goes through two layers:

1.  **NLP Categorization**: (`backend/services/nlp_service.py`)
    Translates raw transaction names into standard categories: `INCOME`, `RENT`, `UTILITIES`, `FOOD`, `SUBSCRIPTION`, `SHOPPING`, `DEBT`, `SAVINGS`, `OTHER`.
2.  **Aggregation**: (`backend/services/scoring_service.py`)
    Groups transactions over the last 90 days into features.

### 📥 Model Input (Features)
Your model must accept a `pandas.DataFrame` with the following columns:

| Feature | Description |
| :--- | :--- |
| `income` | Floating point sum of all `INCOME` transactions. |
| `rent` | Floating point absolute sum of all `RENT` transactions. |
| `savings` | Floating point absolute sum of all `SAVINGS` transactions. |
| `credit_utilization` | Float placeholder (currently defaulting to 0.3). |

### 📤 Model Output
- **Type**: Probability of "High Resilience".
- **Range**: `0.0` to `1.0`.
- **Note**: The backend multiplies this by 1000 to get the base `ml_score_base`.

---

## 🛠️ How to Integrate Your Models

The backend is built to load models automatically from the `backend/models/` folder.

### 1. Save Your Models
Use `joblib` to serialize your models. Name them exactly as follows:
- **Logistic Regression**: `logistic_resilience_v1.joblib`
- **XGBoost**: `xgboost_resilience_v1.joblib`

**Example Python code:**
```python
import joblib
joblib.dump(your_model, 'backend/models/xgboost_resilience_v1.joblib')
```

### 2. File Location
Place the files in:
`David-Protocol/backend/models/`

### 3. Dependencies
The backend already includes the following in `requirements.txt`:
- `scikit-learn`
- `xgboost`
- `pandas`
- `joblib`

---

## 🏎️ Deployment & Workflow

1.  **Local Training**: Train your models using the `backend/scripts/train_models.py` as a template for data generation.
2.  **Refine Scripts**: You can modify `backend/scripts/train_models.py` to use your actual datasets.
3.  **Push to GitHub**: Once you push your `.joblib` files to the `backend/models/` folder, the next deployment (on Render/Railway) will automatically pick them up and load them into memory.

## ⚠️ Robustness & Fail-safes
The `ScoringService` has a **Hybrid Logic**:
- If your ML model is found, it uses it for the base score.
- If the model is missing (or fails), it falls back to a **Rule-based system** to ensure the website stays functional.
- It then applies "common sense" rules (like penalties for >40% rent ratio) on top of the ML score to ensure stability.

---
**Happy Modeling! 🚀**
