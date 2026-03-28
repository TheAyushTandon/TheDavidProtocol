# 🚀 The David Protocol: Financial Resilience Engine

The **David Protocol** is a premium, AI-driven financial resilience platform designed to provide a "Live Pulse" of financial health. By analyzing transaction patterns through a deterministic 4-pillar formula and Gemini-powered diagnostics, it transforms raw bank data into an actionable **Elite Resilience Score (0-1000)**.

## 💡 Problem Statement
Traditional credit scoring is slow, backward-looking, and often penalizes users for lack of history rather than lack of discipline. **The David Protocol** solves this by providing a real-time, high-fidelity alternative:
- **Data Volatility**: Normalizes messy transaction histories into monthly averages for realistic insights.
- **The "Invisible" Wealth Gap**: Recognizes financial resilience in high-income, high-churn profiles that traditional banks might flag as "risky."
- **Generic Advice**: Replaces static financial tips with data-driven, Gemini-powered diagnostics that reference a user's *actual* top spending categories.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion (for premium animations), Lucide React.
- **Backend**: FastAPI (Python), SQLite (Local Development), SQLAlchemy (ORM).
- **AI/ML**: Gemini 1.5 Flash (Stability Indexing & Financial Categorization), Custom 4-Pillar Scoring Formula.
- **Data Handling**: CSV-based ingestion mapping (Plaid-compatible schema).

## 🔗 Links
- **Live Demo:** [Coming Soon]
- **Video Demo:** [Coming Soon]
- **Presentation (PPT/PDF):** [Link to Docs/Presentation]

## 📸 Screenshots
![Dashboard Overview](file:///C:/Users/ayush/.gemini/antigravity/brain/39c98f7c-0720-4ba0-a15e-fa12d1d24fd9/media__1774698900927.png)
*Figure 1: The Live Pulse Dashboard featuring the 0-1000 Resilience Meter and Gemini-powered Strategy.*

## 🚀 How to Run Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com/app/apikey)

### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Create .env file with your GEMINI_API_KEY
echo "GEMINI_API_KEY=your_key_here" > .env
# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Start the development server
npm run dev
```

### 4. Test Accounts
Use the following phone numbers to test specific financial profiles:
- **9109460397**: Elite Profile (Score: 950-1000, A+ Grade)
- **8439655313**: Salaried-Rich (Score: 850-920, A Grade)
- **8178810191**: Regular Profile (Score: 400-600, B/C Grade)
