from pydantic import BaseModel
from typing import List, Optional


# --- Post Schemas ---
class PostBase(BaseModel):
    title: str
    body: str


class PostCreate(PostBase):
    user_id: int


class PostResponse(PostBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# --- User Schemas ---
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    posts: List[PostResponse] = []  # Включаємо пости у відповідь юзера

    class Config:
        from_attributes = True
