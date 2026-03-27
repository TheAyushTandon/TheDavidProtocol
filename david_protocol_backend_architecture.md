# 🚀 David Protocol — Backend System Design

## 🧠 Overview
A cost-efficient, explainable AI system to generate a **Financial Resilience Score** using bank transaction data.

---

## 🔷 Architecture Flow

```
Client (Frontend later)
        ↓
   FastAPI Backend
        ↓
[1] Plaid Data Ingestion
        ↓
[2] Data Cleaning Layer
        ↓
[3] Transaction Categorization (NLP)
        ↓
[4] Feature Engineering
        ↓
[5] Scoring Engine (ML Models)
        ↓
[6] Decision + Explainability
        ↓
   Database + Logs
```

---

## 🧩 Module 1: Data Ingestion (Plaid)

- Use Plaid API to fetch:
  - Transactions
  - Account balances
- Store raw data in database

---

## 🧩 Module 2: Data Cleaning

- Normalize transaction text
- Remove noise (UPI tags, IDs)
- Standardize merchant names

---

## 🧩 Module 3: NLP Categorization

### Pipeline:
1. Rule-based (free, fast)
2. ML model (scikit-learn)
3. Gemini fallback (only low-confidence)

---

## 🧩 Module 4: Feature Engineering

- Income consistency
- Spending variance
- Savings ratio
- Cash flow trends

---

## 🧩 Module 5: Scoring Models

### Primary:
- Logistic Regression (interpretable)

### Secondary:
- Decision Tree (rules)

### Optional:
- XGBoost (higher accuracy)

---

## 🧩 Module 6: Decision Engine

| Score | Decision |
|------|---------|
| >750 | Approve |
| 600-750 | Review |
| <600 | Reject |

---

## 🧩 Module 7: Explainability

- Store features used
- Store model output
- Provide reason codes

---

## 🧩 Database Tables

- Users
- Transactions
- Categorized Transactions
- Features
- Scores
- Logs

---

## ⚡ FastAPI Structure

```
backend/
 ├── main.py
 ├── routes/
 ├── services/
 ├── models/
 ├── utils/
 └── db/
```

---

## 💸 Cost Optimization

- Use rules first
- Gemini only fallback
- ML runs locally

---

## ⚠️ Edge Cases

- No income → use balance trends
- Gig workers → irregular pattern handling
- Sparse data → fallback rules

---

## 🔥 Final Stack

- FastAPI
- scikit-learn
- XGBoost
- Plaid API
- Gemini API
