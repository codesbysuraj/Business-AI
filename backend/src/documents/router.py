"""
BusinessOS AI — Documents Router (Prisma)
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.documents.schemas import DocumentResponse, DocumentListResponse
from src.documents.service import save_document, get_documents, delete_document

router = APIRouter()


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    doc_type: str = Form("general"),
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Upload a document for RAG processing."""
    content = await file.read()
    text_content = ""

    # Extract text based on file type
    if file.filename.endswith(".pdf"):
        try:
            from pypdf import PdfReader
            import io
            reader = PdfReader(io.BytesIO(content))
            text_content = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception:
            text_content = content.decode("utf-8", errors="ignore")
    else:
        text_content = content.decode("utf-8", errors="ignore")

    doc = await save_document(
        db=db,
        filename=file.filename,
        content=text_content,
        doc_type=doc_type,
        file_size=len(content),
        business_id=current_user.business_id,
        user_id=current_user.id,
    )
    return DocumentResponse.model_validate(doc.model_dump())


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return await get_documents(db, current_user.business_id)


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_document(
    doc_id: int,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if not await delete_document(db, doc_id, current_user.business_id):
        raise HTTPException(status_code=404, detail="Document not found")
