from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from db.base import get_db
from db.models import User, OTP
from pydantic import BaseModel, EmailStr
from typing import Optional
from services.otp_service import generate_otp_code, send_otp_email, verify_otp

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    age: int
    gender: str

class OTPVerify(BaseModel):
    email: str
    code: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # 1. Check existing
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Prepare Data
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        age=user_in.age,
        gender=user_in.gender,
        hashed_password=user_in.password,
        is_active=False
    )
    
    # 3. Generate OTP within transaction
    code = generate_otp_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Add to DB
    db.add(new_user)
    
    # Delete old OTPs if they exist
    db.query(OTP).filter(OTP.email == user_in.email).delete()
    db_otp = OTP(email=user_in.email, code=code, expires_at=expires_at)
    db.add(db_otp)
    
    # Single Transaction Commit
    db.commit()
    db.refresh(new_user)
    
    # 4. Background Email Task
    background_tasks.add_task(send_otp_email, user_in.email, code)
        
    return new_user

@router.post("/verify-otp")
def verify_user_otp(otp_in: OTPVerify, db: Session = Depends(get_db)):
    # Consolidated verify logic for speed
    db_otp = db.query(OTP).filter(
        OTP.email == otp_in.email, 
        OTP.code == otp_in.code,
        OTP.expires_at > datetime.utcnow()
    ).first()
    
    if db_otp:
        user = db.query(User).filter(User.email == otp_in.email).first()
        if user:
            user.is_active = True
            db.delete(db_otp)
            db.commit()
            return {"message": "OTP Verified successfully. Account activated."}
            
@router.post("/login", response_model=UserResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    # 1. Fetch user
    user = db.query(User).filter(User.email == login_in.email).first()
    
    # 2. Check credentials (using plain text placeholder as requested in previous turns)
    if not user or user.hashed_password != login_in.password:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # 3. Check activation status
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account not activated. Please verify the security code sent to your email.")
        
    return user

@router.get("/me", response_model=UserResponse)
def get_me(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
