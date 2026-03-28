from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.base import get_db
from db.models import User
from pydantic import BaseModel
from services.bank_service import BankService

router = APIRouter()

class PhoneConnection(BaseModel):
    phone_number: str
    user_id: int

@router.post("/connect")
async def connect_bank(connection: PhoneConnection, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == connection.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the phone number is recognized (mapped to a CSV)
    if not BankService.is_valid_phone(connection.phone_number):
        raise HTTPException(status_code=400, detail="Phone number not recognized. Please use one of the approved phone numbers.")
    
    try:
        # Link the phone number and sync initial data
        user.phone_number = connection.phone_number
        db.commit()
        
        # Load transactions from the associated CSV
        await BankService.sync_transactions(user.id, connection.phone_number, db)
        
        return {
            "status": "success",
            "message": "Bank account linked successfully via phone number mapping.",
            "phone_number": connection.phone_number
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
