"""
BusinessOS AI — Inventory Schemas
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class StockUpdate(BaseModel):
    quantity: int
    low_stock_threshold: Optional[int] = None


class InventoryResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    quantity: int
    low_stock_threshold: int
    is_low_stock: bool = False
    last_restocked: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InventoryListResponse(BaseModel):
    items: List[InventoryResponse]
    total: int
    low_stock_count: int
