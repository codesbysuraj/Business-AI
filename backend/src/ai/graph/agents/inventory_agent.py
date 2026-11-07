"""
BusinessOS AI — Inventory Agent (Prisma)
"""
from src.ai.graph.state import GraphState
from src.core.config import settings
from src.core.database import db


async def inventory_agent(state: GraphState) -> GraphState:
    """Handle inventory-related queries using real database data."""
    business_id = state["business_id"]
    query = state["query"].lower()

    tools_called = []
    tool_data = {}

    try:
        # Get inventory summary
        items = await db.inventory.find_many(
            where={"business_id": business_id},
            include={"product": True},
            order={"quantity": "asc"}
        )
        tools_called.append("get_inventory")

        total_items = len(items)
        total_stock = sum(i.quantity for i in items)
        low_stock_items = [i for i in items if i.quantity <= i.low_stock_threshold]

        # Build context for LLM
        inventory_summary = f"📦 **Inventory Summary**\n\n"
        inventory_summary += f"- **Total Products**: {total_items}\n"
        inventory_summary += f"- **Total Stock Units**: {total_stock}\n"
        inventory_summary += f"- **Low Stock Items**: {len(low_stock_items)}\n\n"

        if "low" in query or "out of" in query or "restock" in query:
            if low_stock_items:
                inventory_summary += "🔴 **Low Stock Alert:**\n\n"
                for item in low_stock_items[:10]:
                    name = item.product.name if item.product else "Unknown"
                    inventory_summary += f"- **{name}**: {item.quantity} units (threshold: {item.low_stock_threshold})\n"
            else:
                inventory_summary += "✅ All items are well-stocked!"
        else:
            inventory_summary += "**Top Items by Stock:**\n\n"
            sorted_items = sorted(items, key=lambda x: x.quantity, reverse=True)
            for item in sorted_items[:10]:
                name = item.product.name if item.product else "Unknown"
                status = "🔴" if item.quantity <= item.low_stock_threshold else "🟢"
                inventory_summary += f"- {status} **{name}**: {item.quantity} units\n"

        tool_data = {
            "total_products": total_items,
            "total_stock": total_stock,
            "low_stock_count": len(low_stock_items),
            "low_stock_items": [
                {"name": i.product.name if i.product else "Unknown", "quantity": i.quantity, "threshold": i.low_stock_threshold}
                for i in low_stock_items
            ],
        }

        # Generate response using LLM if available, otherwise use formatted data
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=settings.gemini_api_key,
                temperature=0.3,
            )

            prompt = f"""You are BusinessOS AI, an intelligent business assistant. 
            Answer the user's question about inventory using this real data:

            {inventory_summary}

            User Question: {state['query']}

            Provide a helpful, concise answer. Use the data above, don't make up numbers.
            Format your response nicely with markdown."""

            response = await llm.ainvoke(prompt)
            state["response"] = response.content

        except Exception:
            state["response"] = inventory_summary

    except Exception as e:
        state["response"] = f"I encountered an error accessing inventory data: {str(e)}"
        state["error"] = str(e)

    state["tools_called"] = tools_called
    state["data"] = tool_data
    return state
