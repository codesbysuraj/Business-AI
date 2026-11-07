"""
BusinessOS AI — Inventory Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.inventory.schemas import InventoryListResponse, InventoryResponse, StockUpdate
from src.inventory.service import get_inventory, update_stock

router = APIRouter()


@router.get("", response_model=InventoryListResponse)
async def list_inventory(
    low_stock_only: bool = Query(False),
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get all inventory items, optionally filtered to low-stock only."""
    return await get_inventory(db, current_user.business_id, low_stock_only)


@router.put("/{product_id}", response_model=InventoryResponse)
async def update_product_stock(
    product_id: int,
    data: StockUpdate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Update stock quantity for a product."""
    inventory = await update_stock(db, product_id, current_user.business_id, data)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory record not found")
    return InventoryResponse(
        id=inventory.id,
        product_id=inventory.product_id,
        product_name=inventory.product.name if inventory.product else None,
        product_sku=inventory.product.sku if inventory.product else None,
        quantity=inventory.quantity,
        low_stock_threshold=inventory.low_stock_threshold,
        is_low_stock=inventory.quantity <= inventory.low_stock_threshold,
        last_restocked=inventory.last_restocked,
        updated_at=inventory.updated_at,
    )
