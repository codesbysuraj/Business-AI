"""
BusinessOS AI — Document Schemas
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    doc_type: str
    file_size: Optional[int] = None
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]
    total: int
