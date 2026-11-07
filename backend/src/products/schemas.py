"""
BusinessOS AI — Product Schemas
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float
    cost: float = 0
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    initial_stock: int = 0
    low_stock_threshold: int = 10


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    description: Optional[str] = None
    price: float
    cost: float
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    business_id: int
    is_active: bool
    image_url: Optional[str] = None
    stock_quantity: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    page_size: int
