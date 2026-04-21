import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database import get_db, Base

# 1. Створюємо окрему базу в пам'яті для тестів
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Створюємо таблиці в тестовій БД
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    # Очищуємо базу перед кожним тестом
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_read_users():
    # Тепер база працює, і ми очікуємо порожній список (200 OK)
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json() == []

def test_read_posts():
    response = client.get("/posts")
    assert response.status_code == 200
    assert response.json() == []

def test_sync_endpoint_exists():
    # Перевіряємо доступність ендпоінту синхронізації
    # (Примітка: цей тест може впасти без інтернету, тому краще мокати httpx)
    response = client.post("/sync")
    assert response.status_code in [200, 400]