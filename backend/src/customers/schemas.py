"""
BusinessOS AI — Customer Schemas
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class CustomerCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    total_spending: float
    purchase_count: int
    avg_order_value: float
    last_purchase: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    customers: List[CustomerResponse]
    total: int
    page: int
    page_size: int
