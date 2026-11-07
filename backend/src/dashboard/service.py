"""
BusinessOS AI — Dashboard Service (Prisma)
"""
from datetime import datetime, timezone, timedelta

from prisma import Prisma


async def get_dashboard_stats(db: Prisma, business_id: int) -> dict:
    """Get aggregated dashboard statistics."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = today_start.replace(day=1)

    # Today's revenue
    today_agg = await db.sale.aggregate(
        where={
            "business_id": business_id,
            "status": "COMPLETED",
            "created_at": {"gte": today_start}
        },
        _sum={"total_amount": True}
    )
    today_revenue = today_agg.sum.get("total_amount") or 0.0

    # Monthly revenue
    month_agg = await db.sale.aggregate(
        where={
            "business_id": business_id,
            "status": "COMPLETED",
            "created_at": {"gte": month_start}
        },
        _sum={"total_amount": True}
    )
    monthly_revenue = month_agg.sum.get("total_amount") or 0.0

    # Product count
    product_count = await db.product.count(
        where={"business_id": business_id, "is_active": True}
    )

    # Customer count
    customer_count = await db.customer.count(
        where={"business_id": business_id}
    )

    # Total inventory
    inv_agg = await db.inventory.aggregate(
        where={"business_id": business_id},
        _sum={"quantity": True}
    )
    inventory_count = inv_agg.sum.get("quantity") or 0

    # Low stock items
    # In Prisma, comparing two fields in the same row directly isn't natively supported in standard `where`,
    # so we can use query_raw or fetch and filter. Since inventory size is usually manageable, query_raw is best:
    low_stock_query = "SELECT COUNT(*) as cnt FROM inventory WHERE business_id = $1 AND quantity <= low_stock_threshold"
    low_stock_res = await db.query_raw(low_stock_query, business_id)
    low_stock_count = int(low_stock_res[0]["cnt"]) if low_stock_res else 0

    # Total orders
    total_orders = await db.sale.count(
        where={"business_id": business_id}
    )

    return {
        "today_revenue": float(today_revenue),
        "monthly_revenue": float(monthly_revenue),
        "product_count": product_count,
        "customer_count": customer_count,
        "inventory_count": int(inventory_count),
        "low_stock_count": low_stock_count,
        "total_orders": total_orders,
    }


async def get_sales_chart_data(db: Prisma, business_id: int, days: int = 30) -> list:
    """Get daily sales data for chart visualization."""
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=days)

    query = '''
        SELECT 
            DATE(created_at) as date,
            SUM(total_amount) as revenue,
            COUNT(id) as orders
        FROM sales
        WHERE business_id = $1 AND status = 'COMPLETED' AND created_at >= $2
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    '''
    
    result = await db.query_raw(query, business_id, start_date)

    return [
        {"date": str(row["date"]), "revenue": float(row["revenue"]), "orders": row["orders"]}
        for row in result
    ]


async def get_recent_orders(db: Prisma, business_id: int, limit: int = 10) -> list:
    """Get recent orders for dashboard."""
    sales = await db.sale.find_many(
        where={"business_id": business_id},
        include={"customer": True},
        order={"created_at": "desc"},
        take=limit
    )

    return [
        {
            "id": s.id,
            "customer_name": s.customer.name if s.customer else "Walk-in",
            "total_amount": s.total_amount,
            "status": s.status,
            "created_at": s.created_at.isoformat(),
        }
        for s in sales
    ]
