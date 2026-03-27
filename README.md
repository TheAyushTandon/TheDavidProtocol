# 🚀 The David Protocol

The **David Protocol** is an AI-driven financial resilience platform. It uses bank transaction data (via Plaid) to generate a "Resilience Score," providing users with insights into their financial stability and health.

## 🌟 Key Features
- **Plaid Integration**: Secure, real-time transaction fetching.
- **AI-Powered Categorization**: Hybrid NLP system using Rule-engines and **Gemini 1.5 Flash**.
- **ML Scoring Engine**: Modular architecture supporting **Logistic Regression** and **XGBoost** for resilience predictions.
- **Cloud Architecture**: Powered by **FastAPI** and **Neon (Serverless PostgreSQL)**.

---

## 🏗️ Project Structure
```text
backend/
├── main.py            # API Entry Point
├── routes/            # API Endpoints (Auth, Plaid, Scoring)
├── services/          # Business Logic (NLP, Scoring Engine)
├── db/                # Neon PostgreSQL Models
├── models/            # ML Artifacts (.joblib files)
└── scripts/           # Utility scripts (Training, etc.)
```

## 🧠 ML & AI Logic
For detailed information on how to train, integrate, and interpret the machine learning models, please refer to:
👉 **[ML Architecture & Integration Guide](file:///d:/PROJECTS/stellaris%20hackathon/ML_ARCHITECTURE.md)**

---

## 🛠️ Setup & Local Development
1. **Initialize Environment**:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. **Configure .env**:
   Copy `.env.example` to `.env` and fill in your keys (Plaid, Gemini, Neon).
3. **Run Server**:
   ```bash
   uvicorn backend.main:app --reload
   ```

---

## 🚢 Deployment Guide
For instructions on how to host this on **Render** or **Railway**, see:
👉 **[Deployment Guide](file:///d:/PROJECTS/stellaris%20hackathon/DEPLOYMENT.md)**

## 🤝 Team Workflow
- **@TEAMMATE**: Please check `ML_ARCHITECTURE.md` for instructions on the feature set and model interface expected by the backend.
