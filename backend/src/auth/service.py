"""
BusinessOS AI — Auth Service (Prisma)
"""
from prisma import Prisma

from src.auth.schemas import UserCreate
from src.core.security import hash_password, verify_password, create_access_token


async def register_user(db: Prisma, data: UserCreate) -> dict:
    """Register a new user and create their business."""
    # Check if user exists
    existing = await db.user.find_unique(where={"email": data.email})
    if existing:
        raise ValueError("Email already registered")

    # Create user and business
    user = await db.user.create(
        data={
            "email": data.email,
            "password_hash": hash_password(data.password),
            "name": data.name,
            "business": {
                "create": {
                    "name": data.business_name,
                    "description": f"{data.business_name} - Powered by BusinessOS AI",
                    "owner_id": 0
                }
            }
        },
        include={"business": True}
    )

    # Update business owner
    if user.business:
        await db.business.update(
            where={"id": user.business.id},
            data={"owner_id": user.id}
        )

    # Generate token
    token = create_access_token(data={"sub": str(user.id)})

    return {"user": user, "token": token}


async def authenticate_user(db: Prisma, email: str, password: str) -> dict:
    """Authenticate a user and return a token."""
    user = await db.user.find_unique(where={"email": email})

    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password")

    token = create_access_token(data={"sub": str(user.id)})
    return {"user": user, "token": token}
