"""
BusinessOS AI — LangGraph State Definition
"""
from typing import TypedDict, Optional, List, Any


class GraphState(TypedDict):
    """State that flows through the LangGraph workflow."""
    query: str
    user_id: int
    business_id: int
    intent: str
    agent: str
    tools_called: List[str]
    tool_results: List[Any]
    response: str
    data: Optional[Any]
    error: Optional[str]
