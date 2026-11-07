"""
BusinessOS AI — General Agent (Fallback)
"""
from src.ai.graph.state import GraphState
from src.core.config import settings


async def general_agent(state: GraphState) -> GraphState:
    """Handle general queries that don't fit specific agent categories."""
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0.5,
        )

        prompt = f"""You are BusinessOS AI, an intelligent business assistant.
        You help business owners manage their products, inventory, sales, and customers.

        Available capabilities:
        - Inventory management and stock alerts
        - Sales analytics and revenue tracking
        - Customer insights and spending analysis
        - Document search (RAG-powered)
        - Marketing content generation
        - Sales forecasting
        - Customer churn prediction

        User Question: {state['query']}

        Provide a helpful response. If the question relates to a specific module,
        suggest the user ask more specifically so you can provide data-driven answers.
        Format with markdown."""

        response = await llm.ainvoke(prompt)
        state["response"] = response.content

    except Exception as e:
        state["response"] = f"""👋 **Welcome to BusinessOS AI!**

I can help you with:
- 📦 **Inventory** — "Which products are low in stock?"
- 💰 **Sales** — "How much did I sell today?"
- 👥 **Customers** — "Who is my top customer?"
- 📄 **Documents** — "What is our return policy?"
- 🎯 **Marketing** — "Generate an Instagram promotion"
- 📊 **Forecasting** — "Forecast next month's sales"
- ⚠️ **Churn** — "Show high-risk customers"

Ask me anything about your business!"""

    state["agent"] = "general"
    state["tools_called"] = []
    return state
