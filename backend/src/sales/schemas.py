"""
BusinessOS AI — Sales Schemas
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    items: List[SaleItemCreate]
    notes: Optional[str] = None


class SaleItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    unit_price: float
    total: float

    class Config:
        from_attributes = True


class SaleResponse(BaseModel):
    id: int
    customer_id: Optional[int] = None
    customer_name: Optional[str] = None
    total_amount: float
    status: str
    notes: Optional[str] = None
    items: List[SaleItemResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class SaleListResponse(BaseModel):
    sales: List[SaleResponse]
    total: int
    page: int
    page_size: int


class RevenueReport(BaseModel):
    today_revenue: float
    this_week_revenue: float
    this_month_revenue: float
    total_revenue: float
    total_orders: int
    avg_order_value: float
