"""
BusinessOS AI — Auth Router
"""
from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.auth.schemas import UserCreate, UserLogin, UserResponse, TokenResponse
from src.auth.service import register_user, authenticate_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: Prisma = Depends(get_db)):
    """Register a new user with a business."""
    try:
        result = await register_user(db, data)
        return TokenResponse(
            access_token=result["token"],
            user=UserResponse.model_validate(result["user"].model_dump()),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: Prisma = Depends(get_db)):
    """Authenticate and return a JWT token."""
    try:
        result = await authenticate_user(db, data.email, data.password)
        return TokenResponse(
            access_token=result["token"],
            user=UserResponse.model_validate(result["user"].model_dump()),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    """Get the current authenticated user."""
    return UserResponse.model_validate(current_user.model_dump())
