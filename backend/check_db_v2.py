from sqlalchemy.orm import Session
from db.base import engine, Base
from db.models import User

# Ensure tables exist
Base.metadata.create_all(bind=engine)

with Session(engine) as session:
    users = session.query(User).all()
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f"ID: {u.id}, Email: {u.email}, Active: {u.is_active}")
