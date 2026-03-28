from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    hashed_password = Column(String)
    plaid_access_token = Column(String, nullable=True)  # Should be encrypted
    plaid_item_id = Column(String, nullable=True)
    last_sync = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    transactions = relationship("Transaction", back_populates="user")
    scores = relationship("Score", back_populates="user")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plaid_transaction_id = Column(String, unique=True, index=True)
    amount = Column(Float)
    date = Column(DateTime)
    name = Column(String)
    category = Column(String)  # Plaid category
    resilience_category = Column(String, nullable=True)  # Our NLP category
    merchant_name = Column(String, nullable=True)
    is_income = Column(Boolean, default=False)
    raw_data = Column(Text)  # JSON dump of raw Plaid data

    # Relationships
    user = relationship("User", back_populates="transactions")

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score_value = Column(Integer)  # 0-1000
    decision = Column(String)  # Approve, Review, Reject
    calculated_at = Column(DateTime, default=datetime.utcnow)
    version = Column(String, default="1.0.0")
    explanation = Column(Text)  # Markdown or JSON summary of decision

    # Relationships
    user = relationship("User", back_populates="scores")

class ProcessingLog(Base):
    __tablename__ = "processing_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String)  # SYNC, NLP, SCORING
    status = Column(String)  # SUCCESS, FAILURE
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    code = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
