"""
BusinessOS AI — Customers Router
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from prisma import Prisma

from src.core.database import get_db
from src.core.security import get_current_user
from src.customers.schemas import CustomerCreate, CustomerUpdate, CustomerResponse, CustomerListResponse
from src.customers.service import create_customer, get_customers, get_customer_by_id, update_customer, delete_customer

router = APIRouter()


@router.get("", response_model=CustomerListResponse)
async def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return await get_customers(db, current_user.business_id, page, page_size, search)


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def add_customer(
    data: CustomerCreate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    customer = await create_customer(db, data, current_user.business_id)
    return CustomerResponse.model_validate(customer.model_dump())


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: int,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    customer = await get_customer_by_id(db, customer_id, current_user.business_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return CustomerResponse.model_validate(customer.model_dump())


@router.put("/{customer_id}", response_model=CustomerResponse)
async def edit_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    customer = await update_customer(db, customer_id, current_user.business_id, data)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return CustomerResponse.model_validate(customer.model_dump())


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_customer(
    customer_id: int,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if not await delete_customer(db, customer_id, current_user.business_id):
        raise HTTPException(status_code=404, detail="Customer not found")
