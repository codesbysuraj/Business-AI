"""
BusinessOS AI — Database Engine & Session Management
"""
from prisma import Prisma

# Global Prisma instance
db = Prisma()


# Dependency injection for routes
async def get_db() -> Prisma:
    """Yield the database instance."""
    yield db
