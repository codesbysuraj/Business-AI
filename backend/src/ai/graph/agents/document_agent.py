"""
BusinessOS AI — Document Agent (RAG) (Prisma)
"""
from src.ai.graph.state import GraphState
from src.core.config import settings
from src.core.database import db


async def document_agent(state: GraphState) -> GraphState:
    """Handle document-related queries using RAG pipeline."""
    business_id = state["business_id"]

    tools_called = ["retrieve_documents"]

    try:
        # Get all documents for this business
        documents = await db.document.find_many(
            where={"business_id": business_id}
        )

        if not documents:
            state["response"] = "📄 No documents have been uploaded yet. Please upload business documents (policies, invoices, catalogs) through the Documents page to enable document-based Q&A."
            state["tools_called"] = tools_called
            return state

        # Simple text search across documents (FAISS integration in Phase 4)
        query = state["query"].lower()
        relevant_chunks = []
        for doc in documents:
            if doc.content:
                # Simple relevance check
                paragraphs = doc.content.split("\n\n")
                for para in paragraphs:
                    if any(word in para.lower() for word in query.split() if len(word) > 3):
                        relevant_chunks.append({
                            "source": doc.original_filename,
                            "content": para[:500],
                        })

        if not relevant_chunks:
            relevant_chunks = [{"source": doc.original_filename, "content": (doc.content or "")[:500]} for doc in documents[:3]]

        context = "\n\n---\n\n".join(
            f"**Source: {chunk['source']}**\n{chunk['content']}"
            for chunk in relevant_chunks[:5]
        )

        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=settings.gemini_api_key,
                temperature=0.3,
            )

            prompt = f"""You are BusinessOS AI. Answer the user's question using ONLY the following document context.
            If the answer is not in the context, say so clearly.

            **Document Context:**
            {context}

            **User Question:** {state['query']}

            Provide a clear, well-formatted answer with markdown. Cite the source document."""

            response = await llm.ainvoke(prompt)
            state["response"] = response.content
        except Exception:
            state["response"] = f"📄 **Retrieved from documents:**\n\n{context}"

        state["data"] = {"documents_searched": len(documents), "chunks_found": len(relevant_chunks)}

    except Exception as e:
        state["response"] = f"I encountered an error searching documents: {str(e)}"
        state["error"] = str(e)

    state["tools_called"] = tools_called
    return state
