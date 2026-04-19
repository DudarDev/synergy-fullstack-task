import httpx
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Створюємо таблиці в базі даних (якщо їх ще немає)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Synergy Task API")

@app.post("/sync", summary="Завантажити дані з dummyjson.com")
async def sync_data(db: Session = Depends(get_db)):
    """
    Цей ендпоінт робить запити до зовнішнього API та зберігає дані в PostgreSQL.
    """
    async with httpx.AsyncClient() as client:
        # Стягуємо юзерів та пости з DummyJSON
        users_resp = await client.get("https://dummyjson.com/users?limit=15")
        posts_resp = await client.get("https://dummyjson.com/posts?limit=15")

        if users_resp.status_code != 200 or posts_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Помилка при отриманні даних з DummyJSON")

        users_data = users_resp.json().get("users", [])
        posts_data = posts_resp.json().get("posts", [])

        # 1. Зберігаємо користувачів
        for u in users_data:
            existing_user = db.query(models.User).filter(models.User.email == u["email"]).first()
            if not existing_user:
                db_user = models.User(
                    id=u["id"], # Зберігаємо оригінальний ID для зв'язку
                    first_name=u["firstName"],
                    last_name=u["lastName"],
                    email=u["email"]
                )
                db.add(db_user)
        db.commit()

        # 2. Зберігаємо пости (і прив'язуємо їх до користувачів)
        for p in posts_data:
            existing_post = db.query(models.Post).filter(models.Post.id == p["id"]).first()
            if not existing_post:
                # Перевіряємо, чи існує автор цього поста в нашій базі
                user_exists = db.query(models.User).filter(models.User.id == p["userId"]).first()
                if user_exists:
                    db_post = models.Post(
                        id=p["id"],
                        title=p["title"],
                        body=p["body"],
                        user_id=p["userId"]
                    )
                    db.add(db_post)
        db.commit()

    return {"message": "Дані успішно синхронізовано з DummyJSON!"}

# --- CRUD Ендпоінти ---

@app.get("/users", response_model=List[schemas.UserResponse], summary="Отримати всіх користувачів")
def get_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # Завдяки schemas.UserResponse, FastAPI автоматично підтягне пости юзера!
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.get("/posts", response_model=List[schemas.PostResponse], summary="Отримати всі пости")
def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.Post).offset(skip).limit(limit).all()