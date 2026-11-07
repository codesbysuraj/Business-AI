"""
BusinessOS AI — Product Service (Prisma)
"""
from typing import Optional, List
from prisma import Prisma

from src.products.schemas import ProductCreate, ProductUpdate, ProductResponse


async def create_category(db: Prisma, name: str, description: str, business_id: int):
    """Create a new product category."""
    category = await db.category.create(
        data={
            "name": name,
            "description": description,
            "business_id": business_id
        }
    )
    return category


async def get_categories(db: Prisma, business_id: int):
    """Get all categories for a business."""
    categories = await db.category.find_many(
        where={"business_id": business_id},
        order={"name": "asc"}
    )
    return categories


async def create_product(db: Prisma, data: ProductCreate, business_id: int):
    """Create a new product with initial inventory."""
    product = await db.product.create(
        data={
            "name": data.name,
            "sku": data.sku,
            "description": data.description,
            "price": data.price,
            "cost": data.cost,
            "category_id": data.category_id,
            "business_id": business_id,
            "image_url": data.image_url,
            "inventory": {
                "create": {
                    "quantity": data.initial_stock,
                    "low_stock_threshold": data.low_stock_threshold,
                    "business_id": business_id,
                }
            }
        },
        include={"inventory": True}
    )
    return product


async def get_products(
    db: Prisma,
    business_id: int,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
) -> dict:
    """Get paginated products with optional search and category filter."""
    where_clause = {"business_id": business_id}

    if search:
        where_clause["OR"] = [
            {"name": {"contains": search, "mode": "insensitive"}},
            {"sku": {"contains": search, "mode": "insensitive"}},
            {"description": {"contains": search, "mode": "insensitive"}},
        ]
    if category_id:
        where_clause["category_id"] = category_id

    # Count total
    total = await db.product.count(where=where_clause)

    # Paginate
    products = await db.product.find_many(
        where=where_clause,
        include={"category": True, "inventory": True},
        skip=(page - 1) * page_size,
        take=page_size,
        order={"created_at": "desc"}
    )

    product_responses = []
    for p in products:
        product_responses.append(ProductResponse(
            id=p.id,
            name=p.name,
            sku=p.sku,
            description=p.description,
            price=p.price,
            cost=p.cost,
            category_id=p.category_id,
            category_name=p.category.name if p.category else None,
            business_id=p.business_id,
            is_active=p.is_active,
            image_url=p.image_url,
            stock_quantity=p.inventory.quantity if p.inventory else 0,
            created_at=p.created_at,
            updated_at=p.updated_at,
        ))

    return {"products": product_responses, "total": total, "page": page, "page_size": page_size}


async def get_product_by_id(db: Prisma, product_id: int, business_id: int):
    """Get a single product by ID."""
    product = await db.product.find_first(
        where={
            "id": product_id,
            "business_id": business_id
        },
        include={"category": True, "inventory": True}
    )
    return product


async def update_product(db: Prisma, product_id: int, business_id: int, data: ProductUpdate):
    """Update a product."""
    product = await get_product_by_id(db, product_id, business_id)
    if not product:
        return None

    update_data = data.model_dump(exclude_unset=True)
    updated_product = await db.product.update(
        where={"id": product_id},
        data=update_data,
        include={"category": True, "inventory": True}
    )
    return updated_product


async def delete_product(db: Prisma, product_id: int, business_id: int) -> bool:
    """Delete a product."""
    product = await get_product_by_id(db, product_id, business_id)
    if not product:
        return False
    await db.product.delete(where={"id": product_id})
    return True
