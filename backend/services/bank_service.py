import csv
import os
import json
from datetime import datetime
from sqlalchemy.orm import Session
from db.models import Transaction, User
from services.nlp_service import NLPService

# Fixed mapping of phone numbers to CSV files for demonstration
PHONE_CSV_MAPPING = {
    "+918439655313": "data/8439655313_transactions.csv",
    "+91-8439655313": "data/8439655313_transactions.csv",
    "8439655313": "data/8439655313_transactions.csv",
    "8178810191": "data/8178810191_transactions.csv",
    "9109460397": "data/9109460397_transactions.csv"
}

class BankService:
    @staticmethod
    def is_valid_phone(phone_number: str) -> bool:
        return phone_number in PHONE_CSV_MAPPING

    @staticmethod
    async def sync_transactions(user_id: int, phone_number: str, db: Session):
        csv_path = PHONE_CSV_MAPPING.get(phone_number)
        if not csv_path or not os.path.exists(csv_path):
            # Create a mock CSV if it doesn't exist yet for demonstration
            BankService._create_mock_csv(csv_path)
        
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Normalize keys (Kaggle dataset uses Title Case)
                date_val = row.get('Date') or row.get('date')
                name_val = row.get('Description') or row.get('name')
                amount_val = float(row.get('Amount') or row.get('amount') or 0)
                category_val = row.get('Category') or row.get('category') or "OTHER"
                trans_type = row.get('TransactionType') or row.get('transaction_type')
                
                # If it's a Debit, make sure the amount is negative for our internal logic
                if trans_type and trans_type.lower() == 'debit' and amount_val > 0:
                    amount_val = -amount_val
                elif trans_type and trans_type.lower() == 'credit' and amount_val < 0:
                    amount_val = abs(amount_val)

                trans_id = f"{phone_number}_{date_val}_{name_val}_{amount_val}"
                existing = db.query(Transaction).filter(Transaction.transaction_id == trans_id).first()
                if not existing:
                    try:
                        # Try different date formats
                        if '-' in date_val:
                            # 01-01-2025
                            date_obj = datetime.strptime(date_val, '%d-%m-%p' if len(date_val.split('-')) > 3 else '%d-%m-%Y')
                        else:
                            date_obj = datetime.utcnow()
                    except:
                        date_obj = datetime.utcnow()

                    new_trans = Transaction(
                        user_id=user_id,
                        transaction_id=trans_id,
                        amount=float(amount_val),
                        date=date_obj,
                        name=name_val,
                        category=category_val,
                        merchant_name=name_val,
                        is_income=amount_val > 0,
                        resilience_category=NLPService.categorize_transaction(name_val, amount_val),
                        raw_data=json.dumps(row)
                    )
                    db.add(new_trans)
            
            # Update user's last search
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.last_sync = datetime.utcnow()
            
            db.commit()

    @staticmethod
    def _create_mock_csv(path: str):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, mode='w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['date', 'name', 'amount', 'category', 'merchant_name', 'is_income'])
            writer.writerow(['2024-03-01', 'Salary credit', '50000.00', 'Income', 'Company Inc', 'true'])
            writer.writerow(['2024-03-05', 'Starbucks Coffee', '15.50', 'Food', 'Starbucks', 'false'])
            writer.writerow(['2024-03-10', 'Amazon Shopping', '120.00', 'Shopping', 'Amazon', 'false'])
            writer.writerow(['2024-03-15', 'Netflix Subscription', '15.99', 'Entertainment', 'Netflix', 'false'])
            writer.writerow(['2024-03-20', 'Shell Gas', '45.00', 'Travel', 'Shell', 'false'])
