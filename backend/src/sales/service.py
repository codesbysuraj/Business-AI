"""
BusinessOS AI — Sales Service (Prisma)
"""
from datetime import datetime, timezone, timedelta
from typing import Optional

from prisma import Prisma

from src.sales.schemas import SaleCreate, SaleResponse, SaleItemResponse, RevenueReport


async def create_sale(db: Prisma, data: SaleCreate, business_id: int):
    """Create a new sale with items and update inventory/customer stats."""
    total_amount = sum(item.quantity * item.unit_price for item in data.items)

    sale_items_data = []
    for item in data.items:
        sale_items_data.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total": item.quantity * item.unit_price
        })

    # Create the sale and its items
    sale = await db.sale.create(
        data={
            "customer_id": data.customer_id,
            "total_amount": total_amount,
            "status": "COMPLETED",
            "notes": data.notes,
            "business_id": business_id,
            "items": {
                "create": sale_items_data
            }
        },
        include={"items": True}
    )

    # Decrease inventory manually for each item
    for item in data.items:
        inventory = await db.inventory.find_unique(where={"product_id": item.product_id})
        if inventory and inventory.business_id == business_id:
            await db.inventory.update(
                where={"id": inventory.id},
                data={"quantity": max(0, inventory.quantity - item.quantity)}
            )

    # Update customer stats
    if data.customer_id:
        customer = await db.customer.find_unique(where={"id": data.customer_id})
        if customer:
            new_total = customer.total_spending + total_amount
            new_count = customer.purchase_count + 1
            await db.customer.update(
                where={"id": customer.id},
                data={
                    "total_spending": new_total,
                    "purchase_count": new_count,
                    "avg_order_value": new_total / new_count,
                    "last_purchase": datetime.now(timezone.utc)
                }
            )

    return sale


async def get_sales(
    db: Prisma,
    business_id: int,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    """Get paginated sales."""
    where_clause = {"business_id": business_id}

    total = await db.sale.count(where=where_clause)

    sales = await db.sale.find_many(
        where=where_clause,
        include={
            "items": {"include": {"product": True}},
            "customer": True
        },
        skip=(page - 1) * page_size,
        take=page_size,
        order={"created_at": "desc"}
    )

    sale_responses = []
    for s in sales:
        sale_responses.append(SaleResponse(
            id=s.id,
            customer_id=s.customer_id,
            customer_name=s.customer.name if s.customer else None,
            total_amount=s.total_amount,
            status=s.status,
            notes=s.notes,
            items=[
                SaleItemResponse(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=item.product.name if item.product else None,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    total=item.total,
                )
                for item in (s.items or [])
            ],
            created_at=s.created_at,
        ))

    return {"sales": sale_responses, "total": total, "page": page, "page_size": page_size}


async def get_revenue_report(db: Prisma, business_id: int) -> RevenueReport:
    """Get revenue analytics."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=today_start.weekday())
    month_start = today_start.replace(day=1)

    # Today
    today_agg = await db.sale.aggregate(
        where={
            "business_id": business_id,
            "status": "COMPLETED",
            "created_at": {"gte": today_start}
        },
        _sum={"total_amount": True}
    )
    today_revenue = today_agg.sum.get("total_amount") or 0.0

    # This week
    week_agg = await db.sale.aggregate(
        where={
            "business_id": business_id,
            "status": "COMPLETED",
            "created_at": {"gte": week_start}
        },
        _sum={"total_amount": True}
    )
    week_revenue = week_agg.sum.get("total_amount") or 0.0

    # This month
    month_agg = await db.sale.aggregate(
        where={
            "business_id": business_id,
            "status": "COMPLETED",
            "created_at": {"gte": month_start}
        },
        _sum={"total_amount": True}
    )
    month_revenue = month_agg.sum.get("total_amount") or 0.0

    # Total
    total_agg = await db.sale.aggregate(
        where={
            "business_id": business_id,
            "status": "COMPLETED"
        },
        _sum={"total_amount": True},
        _count={"id": True}
    )
    total_revenue = total_agg.sum.get("total_amount") or 0.0
    total_orders = total_agg.count.get("id") or 0

    avg_order = total_revenue / total_orders if total_orders > 0 else 0

    return RevenueReport(
        today_revenue=today_revenue,
        this_week_revenue=week_revenue,
        this_month_revenue=month_revenue,
        total_revenue=total_revenue,
        total_orders=total_orders,
        avg_order_value=avg_order,
    )
