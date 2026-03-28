from sqlalchemy.orm import Session
from db.base import engine
from db.models import User

with Session(engine) as session:
    users = session.query(User).all()
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f"ID: {u.id}, Email: {u.email}, Active: {u.is_active}")
