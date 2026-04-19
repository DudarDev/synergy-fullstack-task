from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# URL для підключення до локальної бази даних у Docker
# We use psycopg2 as the driver explicitly
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5432/synergy_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency для отримання сесії бази даних (Dependency Injection!)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()