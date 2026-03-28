from sqlalchemy import create_engine
from db.base import Base
import os

db_path = "david_protocol.db"
if os.path.exists(db_path):
    print("Found old db, backing it up")
    os.rename(db_path, db_path + ".bak")

engine = create_engine("sqlite:///./david_protocol.db")

# Import models to register them
from db.models import *

Base.metadata.create_all(bind=engine)
print("Database schema recreated successfully.")
