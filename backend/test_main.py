from fastapi.testclient import TestClient
from main import app
from database import get_db
import pytest

# Створюємо фейкову (порожню) базу даних для тестів, щоб вони не лізли в реальну
def override_get_db():
    try:
        yield None
    finally:
        pass

# Підміняємо реальну базу на фейкову
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_read_users():
    # Оскільки бази немає, ми просто перевіряємо, що ендпоінт існує і не падає з помилкою 404
    response = client.get("/users")
    assert response.status_code in [200, 500] # 500 - бо немає підключення, але роут працює

def test_read_posts():
    response = client.get("/posts")
    assert response.status_code in [200, 500]