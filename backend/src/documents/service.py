"""
BusinessOS AI — Document Service (Prisma)
"""
import uuid
from prisma import Prisma

from src.documents.schemas import DocumentResponse


async def save_document(
    db: Prisma,
    filename: str,
    content: str,
    doc_type: str,
    file_size: int,
    business_id: int,
    user_id: int,
):
    """Save a document record to the database."""
    stored_filename = f"{uuid.uuid4().hex}_{filename}"
    doc = await db.document.create(
        data={
            "filename": stored_filename,
            "original_filename": filename,
            "content": content,
            "doc_type": doc_type,
            "file_size": file_size,
            "business_id": business_id,
            "uploaded_by": user_id,
        }
    )
    return doc


async def get_documents(db: Prisma, business_id: int) -> dict:
    """Get all documents for a business."""
    docs = await db.document.find_many(
        where={"business_id": business_id},
        order={"created_at": "desc"}
    )

    return {
        "documents": [DocumentResponse.model_validate(d.model_dump()) for d in docs],
        "total": len(docs),
    }


async def delete_document(db: Prisma, doc_id: int, business_id: int) -> bool:
    """Delete a document."""
    doc = await db.document.find_first(
        where={"id": doc_id, "business_id": business_id}
    )
    if not doc:
        return False
    await db.document.delete(where={"id": doc_id})
    return True
