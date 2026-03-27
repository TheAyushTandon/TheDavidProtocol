from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./david_protocol.db")

# Create SQLAlchemy engine
# SQLite-specific: connect_args={"check_same_thread": False}
# PostgreSQL/Cloud: Might need sslmode=require
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
elif DATABASE_URL.startswith("postgresql"):
    # Typical cloud DBs (Supabase, Render) often need SSL
    if "?" not in DATABASE_URL:
        DATABASE_URL += "?sslmode=require"
    engine = create_engine(DATABASE_URL)
else:
    engine = create_engine(DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
