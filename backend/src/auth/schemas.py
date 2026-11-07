"""
BusinessOS AI — Auth Schemas
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    business_name: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    business_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BusinessResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
