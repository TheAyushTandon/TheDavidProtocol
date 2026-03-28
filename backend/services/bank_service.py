import csv
import os
import json
from datetime import datetime
from sqlalchemy.orm import Session
from db.models import Transaction, User

# Fixed mapping of phone numbers to CSV files for demonstration
PHONE_CSV_MAPPING = {
    "+911111111111": "backend/data/user_transactions.csv",
    "+912222222222": "backend/data/coworker1_transactions.csv",
    "+913333333333": "backend/data/coworker2_transactions.csv"
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
                # Check if transaction exists
                trans_id = f"{phone_number}_{row['date']}_{row['name']}_{row['amount']}"
                existing = db.query(Transaction).filter(Transaction.transaction_id == trans_id).first()
                if not existing:
                    # Convert date string to datetime object
                    try:
                        date_obj = datetime.strptime(row['date'], '%Y-%m-%d')
                    except ValueError:
                        date_obj = datetime.utcnow()

                    new_trans = Transaction(
                        user_id=user_id,
                        transaction_id=trans_id,
                        amount=float(row['amount']),
                        date=date_obj,
                        name=row['name'],
                        category=row.get('category', 'General'),
                        merchant_name=row.get('merchant_name', row['name']),
                        is_income=row.get('is_income', 'false').lower() == 'true',
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
