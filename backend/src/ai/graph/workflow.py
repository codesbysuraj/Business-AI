"""
BusinessOS AI — LangGraph Main Workflow
"""
from langgraph.graph import StateGraph, END

from src.ai.graph.state import GraphState
from src.ai.graph.nodes import detect_intent, route_to_agent
from src.ai.graph.agents.inventory_agent import inventory_agent
from src.ai.graph.agents.sales_agent import sales_agent
from src.ai.graph.agents.customer_agent import customer_agent
from src.ai.graph.agents.document_agent import document_agent
from src.ai.graph.agents.marketing_agent import marketing_agent
from src.ai.graph.agents.forecast_agent import forecast_agent
from src.ai.graph.agents.general_agent import general_agent

from prisma import Prisma


def build_graph() -> StateGraph:
    """Build the LangGraph workflow."""
    graph = StateGraph(GraphState)

    # Add nodes
    graph.add_node("detect_intent", detect_intent)
    graph.add_node("inventory_agent", inventory_agent)
    graph.add_node("sales_agent", sales_agent)
    graph.add_node("customer_agent", customer_agent)
    graph.add_node("document_agent", document_agent)
    graph.add_node("marketing_agent", marketing_agent)
    graph.add_node("forecast_agent", forecast_agent)
    graph.add_node("general_agent", general_agent)

    # Set entry point
    graph.set_entry_point("detect_intent")

    # Conditional routing from intent detection
    graph.add_conditional_edges(
        "detect_intent",
        route_to_agent,
        {
            "inventory_agent": "inventory_agent",
            "sales_agent": "sales_agent",
            "customer_agent": "customer_agent",
            "document_agent": "document_agent",
            "marketing_agent": "marketing_agent",
            "forecast_agent": "forecast_agent",
            "general_agent": "general_agent",
        },
    )

    # All agents terminate after execution
    graph.add_edge("inventory_agent", END)
    graph.add_edge("sales_agent", END)
    graph.add_edge("customer_agent", END)
    graph.add_edge("document_agent", END)
    graph.add_edge("marketing_agent", END)
    graph.add_edge("forecast_agent", END)
    graph.add_edge("general_agent", END)

    return graph


# Compile the graph
workflow = build_graph().compile()


async def process_query(
    query: str,
    user_id: int,
    business_id: int,
) -> dict:
    """Process a user query through the LangGraph workflow."""
    # (db is now imported globally by agents directly from src.core.database)

    initial_state: GraphState = {
        "query": query,
        "user_id": user_id,
        "business_id": business_id,
        "intent": "",
        "agent": "",
        "tools_called": [],
        "tool_results": [],
        "response": "",
        "data": None,
        "error": None,
    }

    # Run the graph
    result = await workflow.ainvoke(initial_state)

    return {
        "response": result.get("response", "I'm sorry, I couldn't process your request."),
        "agent": result.get("agent", "general"),
        "tools_called": result.get("tools_called", []),
        "data": result.get("data"),
    }
