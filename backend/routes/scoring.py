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

    # 3. Calculate Score on ALL processed transactions
    results = ScoringService.calculate_resilience_score(processed_transactions)
    
    # 4. Generate Gemini Summary/Tips (Sampled to prevent timeout)
    sample_for_summary = processed_transactions[:100]
    
    try:
        gemini_summary = await NLPService.generate_financial_summary(sample_for_summary, results['score'], results['burn_velocity'])
        results.update(gemini_summary)
    except Exception as e:
        print(f"Gemini Summary Timeout Fallback: {e}")
        results.update({
            "stability_index": "B",
            "account_status": "VERIFIED",
            "tips": ["Building your financial buffer...", "Maintain consistent deposits.", "Watch luxury spending."]
        })
    
    results['calculated_at'] = datetime.utcnow().isoformat()
    
    new_score = Score(
        user_id=user_id,
        score_value=results['score'],
        decision=results['decision'],
        explanation=results['explanation'],
    )
    db.add(new_score)
    db.commit()

    # Include user info for dashboard
    results["user"] = {
        "full_name": user.full_name,
        "phone_number": user.phone_number,
        "email": user.email
    }

    return results

@router.get("/status/{user_id}")
async def get_latest_score(user_id: int, db: Session = Depends(get_db)):
    score = db.query(Score).filter(Score.user_id == user_id).order_by(Score.calculated_at.desc()).first()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not score:
        raise HTTPException(status_code=404, detail="No score found for user")
    
    # 1. Fetch ALL transactions for the calculation
    all_db_transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    all_processed = [{"name": t.name, "amount": t.amount, "category": t.resilience_category} for t in all_db_transactions]
    
    # 2. Calculate TRUE score from full data
    results = ScoringService.calculate_resilience_score(all_processed)
    
    # 3. Sample for AI Summary (Gemini) to prevent timeouts
    sample_processed = all_processed[:100] # Use first 100 for summary
    
    try:
        gemini_summary = await NLPService.generate_financial_summary(sample_processed, results['score'], results['burn_velocity'])
    except Exception as e:
        print(f"Gemini Timeout/Error fallback: {e}")
        burn_val = float(results["burn_velocity"].replace('x', ''))
        gemini_summary = {
            "stability_index": "A+" if burn_val < 0.4 else "B",
            "account_status": "OPTIMIZED" if burn_val < 0.4 else "HEALTHY",
            "tips": ["Consistency is key to scoring.", "Monitor your debt-to-income ratio.", "Build liquid reserves."]
        }
    
    return {
        "score": results["score"],
        "decision": results["decision"],
        "explanation": results["explanation"],
        "calculated_at": results.get("calculated_at", datetime.utcnow().isoformat()),
        "total_inflow": results["total_inflow"],
        "total_outflow": results["total_outflow"],
        "stability_index": gemini_summary.get("stability_index", "B"),
        "burn_velocity": results["burn_velocity"],
        "account_status": gemini_summary.get("account_status", "VERIFIED"),
        "tips": gemini_summary.get("tips", []),
        "user": {
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "email": user.email
        }
    }
