"""
BusinessOS AI — Dashboard Router
"""
from fastapi import APIRouter, Depends, Query
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.dashboard.service import get_dashboard_stats, get_sales_chart_data, get_recent_orders

router = APIRouter()


@router.get("/stats")
async def dashboard_stats(
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get dashboard overview statistics."""
    return await get_dashboard_stats(db, current_user.business_id)


@router.get("/charts/sales")
async def sales_chart(
    days: int = Query(30, ge=7, le=365),
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get sales trend chart data."""
    return await get_sales_chart_data(db, current_user.business_id, days)


@router.get("/recent-orders")
async def recent_orders(
    limit: int = Query(10, ge=1, le=50),
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get recent orders for dashboard."""
    return await get_recent_orders(db, current_user.business_id, limit)
