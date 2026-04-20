import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Беремо URL зі змінних середовища (для Docker).
# Якщо змінної немає (запускаємо локально), використовуємо localhost як запасний варіант.
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+psycopg2://user:password@localhost:5432/synergy_db"
)

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
