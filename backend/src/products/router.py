"""
BusinessOS AI — Products Router (Prisma)
"""
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.products.schemas import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse
from src.products.service import (
    create_category,
    get_categories,
    create_product,
    get_products,
    get_product_by_id,
    update_product,
    delete_product,
)

router = APIRouter()


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_new_category(
    data: CategoryCreate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Create a new product category."""
    category = await create_category(db, data.name, data.description, current_user.business_id)
    return CategoryResponse.model_validate(category.model_dump())


@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get all categories for the business."""
    categories = await get_categories(db, current_user.business_id)
    return [CategoryResponse.model_validate(c.model_dump()) for c in categories]


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_new_product(
    data: ProductCreate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Create a new product."""
    product = await create_product(db, data, current_user.business_id)
    return ProductResponse(
        id=product.id,
        name=product.name,
        sku=product.sku,
        description=product.description,
        price=product.price,
        cost=product.cost,
        category_id=product.category_id,
        category_name=None,
        business_id=product.business_id,
        is_active=product.is_active,
        image_url=product.image_url,
        stock_quantity=data.initial_stock,
        created_at=product.created_at,
        updated_at=product.updated_at,
    )


@router.get("", response_model=dict)
async def list_products(
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get paginated products."""
    return await get_products(db, current_user.business_id, page, page_size, search, category_id)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get a product by ID."""
    product = await get_product_by_id(db, product_id, current_user.business_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    return ProductResponse(
        id=product.id,
        name=product.name,
        sku=product.sku,
        description=product.description,
        price=product.price,
        cost=product.cost,
        category_id=product.category_id,
        category_name=product.category.name if product.category else None,
        business_id=product.business_id,
        is_active=product.is_active,
        image_url=product.image_url,
        stock_quantity=product.inventory.quantity if product.inventory else 0,
        created_at=product.created_at,
        updated_at=product.updated_at,
    )


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_existing_product(
    product_id: int,
    data: ProductUpdate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Update a product."""
    product = await update_product(db, product_id, current_user.business_id, data)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        
    return ProductResponse(
        id=product.id,
        name=product.name,
        sku=product.sku,
        description=product.description,
        price=product.price,
        cost=product.cost,
        category_id=product.category_id,
        category_name=product.category.name if product.category else None,
        business_id=product.business_id,
        is_active=product.is_active,
        image_url=product.image_url,
        stock_quantity=product.inventory.quantity if product.inventory else 0,
        created_at=product.created_at,
        updated_at=product.updated_at,
    )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_product(
    product_id: int,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Delete a product."""
    success = await delete_product(db, product_id, current_user.business_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return None
