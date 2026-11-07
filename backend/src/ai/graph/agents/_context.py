"""
BusinessOS AI — Agent Context (Shared DB session for agents)
"""
from sqlalchemy.ext.asyncio import AsyncSession

# Module-level variable to hold the current DB session
# Set by the workflow before graph execution
current_db: AsyncSession = None
