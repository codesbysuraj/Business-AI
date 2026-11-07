"""
BusinessOS AI — Customer Agent (Prisma)
"""
from src.ai.graph.state import GraphState
from src.core.config import settings
from src.core.database import db


async def customer_agent(state: GraphState) -> GraphState:
    """Handle customer-related queries using real database data."""
    business_id = state["business_id"]

    tools_called = ["get_customers"]

    try:
        customers = await db.customer.find_many(
            where={"business_id": business_id},
            order={"total_spending": "desc"}
        )

        total_customers = len(customers)
        total_spending = sum(c.total_spending for c in customers)
        top_customers = customers[:5]

        customer_summary = f"""👥 **Customer Overview**

- **Total Customers**: {total_customers}
- **Total Customer Spending**: ₹{total_spending:,.2f}
- **Average Spending per Customer**: ₹{(total_spending / total_customers if total_customers > 0 else 0):,.2f}

**🏆 Top 5 Customers by Spending:**
"""
        for i, c in enumerate(top_customers, 1):
            customer_summary += f"\n{i}. **{c.name}** — ₹{c.total_spending:,.2f} ({c.purchase_count} purchases)"

        tool_data = {
            "total_customers": total_customers,
            "total_spending": total_spending,
            "top_customers": [
                {"name": c.name, "spending": c.total_spending, "purchases": c.purchase_count}
                for c in top_customers
            ],
        }

        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=settings.gemini_api_key,
                temperature=0.3,
            )

            prompt = f"""You are BusinessOS AI, an intelligent business assistant.
            Answer the user's question about customers using this real data:

            {customer_summary}

            User Question: {state['query']}

            Provide a helpful, concise answer using the data above. Format with markdown."""

            response = await llm.ainvoke(prompt)
            state["response"] = response.content
        except Exception:
            state["response"] = customer_summary

        state["data"] = tool_data

    except Exception as e:
        state["response"] = f"I encountered an error accessing customer data: {str(e)}"
        state["error"] = str(e)

    state["tools_called"] = tools_called
    return state
