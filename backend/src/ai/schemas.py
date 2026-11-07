"""
BusinessOS AI — AI Schemas
"""
from typing import Optional, List, Any

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    message: str
    agent_used: str = "general"
    tools_called: List[str] = []
    data: Optional[Any] = None
