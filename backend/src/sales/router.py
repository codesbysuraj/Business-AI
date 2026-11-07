"""
BusinessOS AI — Sales Router
"""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.sales.schemas import SaleCreate, SaleResponse, SaleListResponse, RevenueReport
from src.sales.service import create_sale, get_sales, get_revenue_report

router = APIRouter()


@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
async def create_new_sale(
    data: SaleCreate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Create a new sale."""
    sale = await create_sale(db, data, current_user.business_id)
    # create_sale already returns a Prisma Model with relationships, but no customer_name
    # I'll just map it explicitly to SaleResponse here if needed, or let Pydantic handle it.
    customer_name = None
    if sale.customer:
        customer_name = sale.customer.name
        
    from src.sales.schemas import SaleItemResponse
    items = []
    if sale.items:
        for i in sale.items:
            items.append(SaleItemResponse(
                id=i.id,
                product_id=i.product_id,
                product_name=None, # product isn't included in create_sale return
                quantity=i.quantity,
                unit_price=i.unit_price,
                total=i.total,
            ))
            
    return SaleResponse(
        id=sale.id,
        customer_id=sale.customer_id,
        customer_name=customer_name,
        total_amount=sale.total_amount,
        status=sale.status,
        notes=sale.notes,
        items=items,
        created_at=sale.created_at,
    )


@router.get("", response_model=SaleListResponse)
async def list_sales(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get paginated sales."""
    return await get_sales(db, current_user.business_id, page, page_size)


@router.get("/report", response_model=RevenueReport)
async def revenue_report(
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get revenue report and analytics."""
    return await get_revenue_report(db, current_user.business_id)
