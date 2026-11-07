"""
BusinessOS AI — Sales Agent (Prisma)
"""
from datetime import datetime, timezone, timedelta

from src.ai.graph.state import GraphState
from src.core.config import settings
from src.core.database import db


async def sales_agent(state: GraphState) -> GraphState:
    """Handle sales-related queries using real database data."""
    business_id = state["business_id"]
    query = state["query"].lower()

    tools_called = ["get_sales"]
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=today_start.weekday())
    month_start = today_start.replace(day=1)

    try:
        # Today's sales
        today_agg = await db.sale.aggregate(
            where={
                "business_id": business_id,
                "status": "COMPLETED",
                "created_at": {"gte": today_start}
            },
            _sum={"total_amount": True},
            _count={"id": True}
        )
        today_revenue = today_agg.sum.get("total_amount") or 0.0
        today_orders = today_agg.count.get("id") or 0

        # This week
        week_agg = await db.sale.aggregate(
            where={
                "business_id": business_id,
                "status": "COMPLETED",
                "created_at": {"gte": week_start}
            },
            _sum={"total_amount": True},
            _count={"id": True}
        )
        week_revenue = week_agg.sum.get("total_amount") or 0.0
        week_orders = week_agg.count.get("id") or 0

        # This month
        month_agg = await db.sale.aggregate(
            where={
                "business_id": business_id,
                "status": "COMPLETED",
                "created_at": {"gte": month_start}
            },
            _sum={"total_amount": True},
            _count={"id": True}
        )
        month_revenue = month_agg.sum.get("total_amount") or 0.0
        month_orders = month_agg.count.get("id") or 0

        # Total
        total_agg = await db.sale.aggregate(
            where={
                "business_id": business_id,
                "status": "COMPLETED"
            },
            _sum={"total_amount": True},
            _count={"id": True}
        )
        total_revenue = total_agg.sum.get("total_amount") or 0.0
        total_orders = total_agg.count.get("id") or 0

        sales_summary = f"""💰 **Sales Summary**

- **Today**: ₹{today_revenue:,.2f} ({today_orders} orders)
- **This Week**: ₹{week_revenue:,.2f} ({week_orders} orders)
- **This Month**: ₹{month_revenue:,.2f} ({month_orders} orders)
- **All Time**: ₹{total_revenue:,.2f} ({total_orders} orders)
- **Avg Order Value**: ₹{(total_revenue / total_orders if total_orders > 0 else 0):,.2f}"""

        tool_data = {
            "today_revenue": today_revenue,
            "week_revenue": week_revenue,
            "month_revenue": month_revenue,
            "total_revenue": total_revenue,
            "today_orders": today_orders,
            "total_orders": total_orders,
        }

        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=settings.gemini_api_key,
                temperature=0.3,
            )

            prompt = f"""You are BusinessOS AI, an intelligent business assistant.
            Answer the user's question about sales using this real data:

            {sales_summary}

            User Question: {state['query']}

            Provide a helpful, concise answer using the data above. Format with markdown."""

            response = await llm.ainvoke(prompt)
            state["response"] = response.content
        except Exception:
            state["response"] = sales_summary

        state["data"] = tool_data

    except Exception as e:
        state["response"] = f"I encountered an error accessing sales data: {str(e)}"
        state["error"] = str(e)

    state["tools_called"] = tools_called
    return state
