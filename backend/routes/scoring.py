from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.base import get_db
from db.models import User, Transaction, Score, ProcessingLog
from services.plaid_service import PlaidService
from services.nlp_service import NLPService
from services.scoring_service import ScoringService
from datetime import datetime, timedelta
import json

router = APIRouter()

@router.post("/process/{user_id}")
async def process_scoring_pipeline(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.plaid_access_token:
        raise HTTPException(status_code=400, detail="User not found or Plaid not linked")
    
    # 1. Fetch Transactions (Last 90 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    try:
        transactions_data = await PlaidService.get_transactions(user.plaid_access_token, start_date, end_date)
        plaid_transactions = transactions_data.get('transactions', [])
    except Exception as e:
        log = ProcessingLog(user_id=user_id, event_type="SYNC", status="FAILURE", message=str(e))
        db.add(log)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Plaid Sync Error: {e}")

    # 2. Process & Categorize
    processed_transactions = []
    for t in plaid_transactions:
        # Check if already in DB
        existing = db.query(Transaction).filter(Transaction.plaid_transaction_id == t['transaction_id']).first()
        if existing:
            processed_transactions.append({
                "name": existing.name,
                "amount": existing.amount,
                "category": existing.resilience_category
            })
            continue

        category = await NLPService.process_transaction(t)
        
        new_t = Transaction(
            user_id=user_id,
            plaid_transaction_id=t['transaction_id'],
            amount=t['amount'],
            date=datetime.strptime(t['date'], '%Y-%m-%d'),
            name=t['name'],
            resilience_category=category,
            raw_data=json.dumps(t)
        )
        db.add(new_t)
        processed_transactions.append({
            "name": t['name'],
            "amount": t['amount'],
            "category": category
        })
    
    db.commit()

    # 3. Calculate Score
    results = ScoringService.calculate_resilience_score(processed_transactions)
    
    # Update local results for more details if needed by frontend
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
