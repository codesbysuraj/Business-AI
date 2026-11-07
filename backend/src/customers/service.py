"""
BusinessOS AI — Customer Service (Prisma)
"""
from typing import Optional
from prisma import Prisma

from src.customers.schemas import CustomerCreate, CustomerUpdate, CustomerResponse


async def create_customer(db: Prisma, data: CustomerCreate, business_id: int):
    """Create a new customer."""
    customer = await db.customer.create(
        data={
            "name": data.name,
            "email": data.email,
            "phone": data.phone,
            "address": data.address,
            "business_id": business_id,
        }
    )
    return customer


async def get_customers(
    db: Prisma,
    business_id: int,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
) -> dict:
    """Get paginated customers with optional search."""
    where_clause = {"business_id": business_id}

    if search:
        where_clause["OR"] = [
            {"name": {"contains": search, "mode": "insensitive"}},
            {"email": {"contains": search, "mode": "insensitive"}},
            {"phone": {"contains": search, "mode": "insensitive"}},
        ]

    total = await db.customer.count(where=where_clause)

    customers = await db.customer.find_many(
        where=where_clause,
        skip=(page - 1) * page_size,
        take=page_size,
        order={"total_spending": "desc"}
    )

    return {
        "customers": [CustomerResponse.model_validate(c.model_dump()) for c in customers],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


async def get_customer_by_id(db: Prisma, customer_id: int, business_id: int):
    """Get a single customer."""
    customer = await db.customer.find_first(
        where={
            "id": customer_id,
            "business_id": business_id
        }
    )
    return customer


async def update_customer(db: Prisma, customer_id: int, business_id: int, data: CustomerUpdate):
    """Update a customer."""
    customer = await get_customer_by_id(db, customer_id, business_id)
    if not customer:
        return None
        
    update_data = data.model_dump(exclude_unset=True)
    updated_customer = await db.customer.update(
        where={"id": customer_id},
        data=update_data
    )
    return updated_customer


async def delete_customer(db: Prisma, customer_id: int, business_id: int) -> bool:
    """Delete a customer."""
    customer = await get_customer_by_id(db, customer_id, business_id)
    if not customer:
        return False
    await db.customer.delete(where={"id": customer_id})
    return True


async def get_top_customers(db: Prisma, business_id: int, limit: int = 5):
    """Get top customers by spending."""
    customers = await db.customer.find_many(
        where={"business_id": business_id},
        order={"total_spending": "desc"},
        take=limit
    )
    return customers
