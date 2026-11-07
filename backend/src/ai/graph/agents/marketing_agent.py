"""
BusinessOS AI — Marketing Agent (Prisma)
"""
from src.ai.graph.state import GraphState
from src.core.config import settings
from src.core.database import db


async def marketing_agent(state: GraphState) -> GraphState:
    """Generate marketing content using business data and LLM."""
    business_id = state["business_id"]

    tools_called = ["generate_marketing_post"]

    try:
        business = await db.business.find_unique(where={"id": business_id})
        business_name = business.name if business else "Your Business"

        products = await db.product.find_many(
            where={"business_id": business_id, "is_active": True},
            take=5
        )

        product_names = ", ".join(p.name for p in products) if products else "various products"

        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=settings.gemini_api_key,
                temperature=0.8,
            )

            prompt = f"""You are a creative marketing expert for {business_name}.
            Products: {product_names}

            User Request: {state['query']}

            Create engaging marketing content. Include:
            - Catchy headline
            - Compelling body text
            - Call to action
            - Relevant hashtags
            - Emoji for engagement

            Format with markdown for readability."""

            response = await llm.ainvoke(prompt)
            state["response"] = response.content
        except Exception:
            state["response"] = f"""🎯 **Marketing Post for {business_name}**

✨ Check out our amazing {product_names}!

🔥 Limited time offers available now! Don't miss out on these incredible deals.

👉 Visit us today and experience the difference!

#Business #Sale #ShopNow #{business_name.replace(' ', '')}"""

    except Exception as e:
        state["response"] = f"I encountered an error generating marketing content: {str(e)}"
        state["error"] = str(e)

    state["tools_called"] = tools_called
    return state
