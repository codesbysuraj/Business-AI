"""
BusinessOS AI — Forecast Agent (Prisma)
"""
from datetime import datetime
from src.ai.graph.state import GraphState
from src.core.config import settings
from src.core.database import db


async def forecast_agent(state: GraphState) -> GraphState:
    """Handle sales forecasting queries with simple ML predictions."""
    business_id = state["business_id"]

    tools_called = ["forecast_sales"]

    try:
        # Get historical monthly sales via query_raw (works natively in Postgres)
        query = '''
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                SUM(total_amount) as revenue,
                COUNT(id) as orders
            FROM sales
            WHERE business_id = $1 AND status = 'COMPLETED'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month ASC
        '''
        
        monthly_data = await db.query_raw(query, business_id)

        if len(monthly_data) < 2:
            state["response"] = "📊 Not enough historical data for forecasting. Please record more sales data (at least 2 months) to enable predictions."
            state["tools_called"] = tools_called
            return state

        revenues = [float(row["revenue"]) for row in monthly_data]
        avg_revenue = sum(revenues) / len(revenues)
        trend = (revenues[-1] - revenues[0]) / len(revenues) if len(revenues) > 1 else 0

        # Simple forecast
        next_month_forecast = revenues[-1] + trend
        next_week_forecast = next_month_forecast / 4

        confidence = min(85, 50 + len(monthly_data) * 5)

        forecast_summary = f"""📊 **Sales Forecast**

**Historical Data:** {len(monthly_data)} months analyzed

**Predictions:**
- **Next Week**: ₹{next_week_forecast:,.2f}
- **Next Month**: ₹{next_month_forecast:,.2f}

**Trend:** {"📈 Upward" if trend > 0 else "📉 Downward" if trend < 0 else "➡️ Stable"}
**Monthly Trend**: ₹{abs(trend):,.2f} {"increase" if trend > 0 else "decrease"} per month
**Average Monthly Revenue**: ₹{avg_revenue:,.2f}
**Confidence Level**: {confidence}%

*Note: Forecasts are based on historical trends. Actual results may vary.*"""

        tool_data = {
            "next_week_forecast": round(next_week_forecast, 2),
            "next_month_forecast": round(next_month_forecast, 2),
            "trend": round(trend, 2),
            "confidence": confidence,
            "historical_months": len(monthly_data),
            "monthly_revenues": [{"month": str(row["month"]), "revenue": float(row["revenue"])} for row in monthly_data],
        }

        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=settings.gemini_api_key,
                temperature=0.3,
            )

            prompt = f"""You are BusinessOS AI, a business intelligence assistant.
            Explain the sales forecast to the user using this data:

            {forecast_summary}

            User Question: {state['query']}

            Provide clear insights and actionable recommendations based on the forecast."""

            response = await llm.ainvoke(prompt)
            state["response"] = response.content
        except Exception:
            state["response"] = forecast_summary

        state["data"] = tool_data

    except Exception as e:
        state["response"] = f"I encountered an error generating forecasts: {str(e)}"
        state["error"] = str(e)

    state["tools_called"] = tools_called
    return state
