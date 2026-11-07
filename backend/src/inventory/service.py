"""
BusinessOS AI — Inventory Service (Prisma)
"""
from datetime import datetime, timezone
from typing import Optional

from prisma import Prisma

from src.inventory.schemas import InventoryResponse, StockUpdate


async def get_inventory(
    db: Prisma,
    business_id: int,
    low_stock_only: bool = False,
) -> dict:
    """Get all inventory items for a business."""
    
    where_clause = {"business_id": business_id}
    
    # Get all matching inventory with related product
    items = await db.inventory.find_many(
        where=where_clause,
        include={"product": True},
        order={"quantity": "asc"}
    )
    
    if low_stock_only:
        items = [i for i in items if i.quantity <= i.low_stock_threshold]

    responses = []
    low_stock_count = 0
    for item in items:
        is_low = item.quantity <= item.low_stock_threshold
        if is_low:
            low_stock_count += 1
        responses.append(InventoryResponse(
            id=item.id,
            product_id=item.product_id,
            product_name=item.product.name if item.product else None,
            product_sku=item.product.sku if item.product else None,
            quantity=item.quantity,
            low_stock_threshold=item.low_stock_threshold,
            is_low_stock=is_low,
            last_restocked=item.last_restocked,
            updated_at=item.updated_at,
        ))

    return {"items": responses, "total": len(responses), "low_stock_count": low_stock_count}


async def update_stock(
    db: Prisma,
    product_id: int,
    business_id: int,
    data: StockUpdate,
):
    """Update stock quantity for a product."""
    
    inventory = await db.inventory.find_unique(
        where={"product_id": product_id},
        include={"product": True}
    )
    
    if not inventory or inventory.business_id != business_id:
        return None

    update_data = {
        "quantity": data.quantity,
        "last_restocked": datetime.now(timezone.utc)
    }
    
    if data.low_stock_threshold is not None:
        update_data["low_stock_threshold"] = data.low_stock_threshold

    updated_inventory = await db.inventory.update(
        where={"id": inventory.id},
        data=update_data,
        include={"product": True}
    )
    
    return updated_inventory
