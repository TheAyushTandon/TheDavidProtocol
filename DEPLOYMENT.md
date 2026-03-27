# 🚢 David Protocol — Deployment & Hosting Guide

This project is built for high-performance scale and serverless deployment. It is optimized for **Render**, **Railway**, or **Google Cloud Run**.

## 🏗️ 1. Prepare Your Environment
Before deploying, ensure your `backend/.env` is fully populated:

1. **Neon PostgreSQL**: Create a project on [Neon.tech](https://neon.tech/) and get the `DATABASE_URL`.
2. **Plaid Integration**: Get your `PLAID_CLIENT_ID` and `69c640c0fd37e2000d972e2c` and `bca8283960ce79cbf3171925973b0b` from the Plaid Dashboard.
3. **Gemini AI**: Get your `AIzaSyALjSt7E2AGXYCVUiO2eTJKpNz5E4eNRiA` from [Google AI Studio](https://aistudio.google.com/).
4. **Secret Keys**: Generate these using:
   ```bash
   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```

---

## 🚀 2. Deploy to Render (Recommended)
This repo includes a `render.yaml` file for **One-Click Deployment**.

1. **Connect GitHub**: Connect your repository at `https://github.com/TheAyushTandon/David-Protocol.git` to Render.
2. **Auto-provision**: Render will detect `render.yaml` and automatically set up:
   - **FastAPI Web Service**
   - **PostgreSQL Database** (If you aren't using Neon)
3. **Environment Variables**: Add all keys from your `.env` to the Render Dashboard's "Environment" section.

---

## 🐳 3. Deploy via Docker
If you prefer fixed containers, use the included `backend/Dockerfile`:

1. **Build**:
   ```bash
   docker build -t david-protocol-backend ./backend
   ```
2. **Run**:
   ```bash
   docker run -p 8000:8000 --env-file ./backend/.env david-protocol-backend
   ```

---

## 📈 4. Post-Deployment
Once the backend is live at `https://your-app.onrender.com`:
1. Use the `/docs` endpoint to verify the API.
2. Ensure `PLAID_ENV` is set to `sandbox` for testing or `development` for real data.
3. **ML Check**: Verify that your `.joblib` models are correctly loaded by checking the server logs on startup.

---
👉 **[Go back to README](file:///d:/PROJECTS/stellaris%20hackathon/README.md)**
