from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from db.base import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up on shutdown if needed

# Load environment variables
load_dotenv()

app = FastAPI(
    title="David Protocol API",
    description="Backend for generating Financial Resilience Scores using bank data and AI.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "message": "David Protocol Backend is running.",
        "version": "1.0.0"
    }

from routes import auth, plaid, scoring

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(plaid.router, prefix="/plaid", tags=["Plaid"])
app.include_router(scoring.router, prefix="/scoring", tags=["Scoring"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
