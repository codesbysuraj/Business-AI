"""
BusinessOS AI — FastAPI Application Factory
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.core.database import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events."""
    # Startup: Connect to Prisma
    await db.connect()
    yield
    # Shutdown: Disconnect Prisma
    await db.disconnect()


app = FastAPI(
    title="BusinessOS AI",
    description="AI-powered Operating System for Small Businesses",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────
from src.auth.router import router as auth_router
from src.products.router import router as products_router
from src.inventory.router import router as inventory_router
from src.customers.router import router as customers_router
from src.sales.router import router as sales_router
from src.dashboard.router import router as dashboard_router
from src.documents.router import router as documents_router
from src.ai.router import router as ai_router
from src.ai.churn.router import router as churn_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products_router, prefix="/api/products", tags=["Products"])
app.include_router(inventory_router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(customers_router, prefix="/api/customers", tags=["Customers"])
app.include_router(sales_router, prefix="/api/sales", tags=["Sales"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(documents_router, prefix="/api/documents", tags=["Documents"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI Assistant"])
app.include_router(churn_router, prefix="/api/churn", tags=["Churn Prediction"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "BusinessOS AI"}
