from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.base import get_db
from db.models import User, Transaction, Score, ProcessingLog
from services.bank_service import BankService
from services.nlp_service import NLPService
from services.scoring_service import ScoringService
from datetime import datetime, timedelta
import json

router = APIRouter()

@router.post("/process/{user_id}")
async def process_scoring_pipeline(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.phone_number:
        raise HTTPException(status_code=400, detail="User not found or phone number not linked")
    
    # 1. Get Transactions from DB (Already synced via BankService in /bank/connect)
    db_transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    
    if not db_transactions:
        # If none in DB, try one last sync
        await BankService.sync_transactions(user_id, user.phone_number, db)
        db_transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    if not db_transactions:
        raise HTTPException(status_code=400, detail="No transaction data found for this phone number.")

    # 2. Process & Categorize with NLP if not already done
    processed_transactions = []
    for t in db_transactions:
        if not t.resilience_category:
            # Prepare row for NLP (simulating Plaid structure it expected)
            t_data = json.loads(t.raw_data) if t.raw_data else {"name": t.name, "amount": t.amount}
            category = await NLPService.process_transaction(t_data)
            t.resilience_category = category
            db.add(t)
        
        processed_transactions.append({
            "name": t.name,
            "amount": t.amount,
            "category": t.resilience_category
        })
    
    db.commit()

    # 3. Calculate Score
    results = ScoringService.calculate_resilience_score(processed_transactions)
    
    results['calculated_at'] = datetime.utcnow().isoformat()
    
    new_score = Score(
        user_id=user_id,
        score_value=results['score'],
        decision=results['decision'],
        explanation=results['explanation']
    )
    db.add(new_score)
    db.commit()

    return results

@router.get("/status/{user_id}")
async def get_latest_score(user_id: int, db: Session = Depends(get_db)):
    score = db.query(Score).filter(Score.user_id == user_id).order_by(Score.calculated_at.desc()).first()
    if not score:
        raise HTTPException(status_code=404, detail="No score found for user")
    return {
        "score": score.score_value,
        "decision": score.decision,
        "explanation": score.explanation,
        "calculated_at": score.calculated_at
    }
