from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.base import get_db
from ..db.models import User
from ..services.plaid_service import PlaidService
from pydantic import BaseModel

router = APIRouter()

class TokenExchange(BaseModel):
    public_token: str
    user_id: int

@router.post("/create_link_token")
async def create_link_token(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        response = await PlaidService.create_link_token(str(user_id))
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/exchange_public_token")
async def exchange_public_token(exchange: TokenExchange, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == exchange.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        response = await PlaidService.exchange_public_token(exchange.public_token)
        # Store access token securely (should be encrypted)
        user.plaid_access_token = response['access_token']
        user.plaid_item_id = response['item_id']
        db.commit()
        return {"status": "success", "item_id": response['item_id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
