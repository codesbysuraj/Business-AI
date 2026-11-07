"""
BusinessOS AI — LangGraph Nodes (Intent Detection + Agent Routing)
"""
import json
from typing import Any

from src.ai.graph.state import GraphState
from src.core.config import settings


async def detect_intent(state: GraphState) -> GraphState:
    """Detect the intent of the user's query and route to the appropriate agent."""
    query = state["query"].lower()

    # Rule-based intent detection (fast, no API call needed)
    intent_keywords = {
        "inventory": ["inventory", "stock", "low stock", "restock", "warehouse", "quantity", "items in stock"],
        "sales": ["sales", "revenue", "sold", "orders", "sell", "how much did", "income", "earnings", "profit"],
        "customer": ["customer", "buyer", "client", "spending", "purchase history", "top customer", "highest spending"],
        "document": ["document", "policy", "return policy", "gst", "invoice", "uploaded", "file", "pdf"],
        "marketing": ["promotion", "marketing", "instagram", "social media", "campaign", "advertise", "post"],
        "forecast": ["forecast", "predict", "next month", "next week", "trend", "future", "projection"],
        "churn": ["churn", "risk", "leaving", "inactive", "at risk", "losing", "retention"],
    }

    detected_intent = "general"
    max_matches = 0

    for intent, keywords in intent_keywords.items():
        matches = sum(1 for kw in keywords if kw in query)
        if matches > max_matches:
            max_matches = matches
            detected_intent = intent

    state["intent"] = detected_intent
    state["agent"] = detected_intent

    return state


def route_to_agent(state: GraphState) -> str:
    """Route to the appropriate agent based on detected intent."""
    intent = state.get("intent", "general")

    agent_map = {
        "inventory": "inventory_agent",
        "sales": "sales_agent",
        "customer": "customer_agent",
        "document": "document_agent",
        "marketing": "marketing_agent",
        "forecast": "forecast_agent",
        "churn": "churn_agent",
    }

    return agent_map.get(intent, "general_agent")
