"""
BusinessOS AI — AI Router (Chat + WebSocket Streaming)
"""
import json

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from prisma import Prisma

from src.core.database import get_db, db
from src.core.security import get_current_user


router = APIRouter()


@router.post("/chat")
async def chat(
    request: dict,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Process a chat message through the LangGraph workflow."""
    from src.ai.graph.workflow import process_query

    # current_user returns a Prisma model User
    result = await process_query(
        query=request.get("message", ""),
        user_id=current_user.id,
        business_id=current_user.business_id,
    )

    return {
        "message": result["response"],
        "agent_used": result.get("agent", "general"),
        "tools_called": result.get("tools_called", []),
        "data": result.get("data"),
    }


@router.websocket("/stream")
async def websocket_chat(websocket: WebSocket):
    """WebSocket endpoint for streaming AI responses."""
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            query = message_data.get("message", "")
            user_id = message_data.get("user_id", 1)
            business_id = message_data.get("business_id", 1)

            try:
                from src.ai.graph.workflow import process_query

                # Send processing indicator
                await websocket.send_json({
                    "type": "status",
                    "content": "Processing your query...",
                })

                result = await process_query(
                    query=query,
                    user_id=user_id,
                    business_id=business_id,
                )

                # Send the response
                await websocket.send_json({
                    "type": "response",
                    "content": result["response"],
                    "agent": result.get("agent", "general"),
                    "tools_called": result.get("tools_called", []),
                    "data": result.get("data"),
                })

            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "content": f"Sorry, I encountered an error: {str(e)}",
                })

    except WebSocketDisconnect:
        pass


@router.get("/history")
async def chat_history(
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get chat history for the current user."""
    
    chats = await db.aichat.find_many(
        where={
            "user_id": current_user.id
        },
        order={
            "updated_at": "desc"
        },
        take=20
    )

    return [
        {
            "id": chat.id,
            "title": chat.title,
            "messages": json.loads(chat.messages) if chat.messages else [],
            "created_at": chat.created_at.isoformat(),
            "updated_at": chat.updated_at.isoformat(),
        }
        for chat in chats
    ]
