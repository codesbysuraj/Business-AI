"""
BusinessOS AI — Database Seed Script (Prisma)
Generates realistic demo data for all tables.
"""
import asyncio
import random
import sys
import os

# Make sure src is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
load_dotenv()

from prisma import Prisma
from src.core.security import hash_password


CATEGORIES = [
    ("Electronics", "Electronic gadgets and accessories"),
    ("Clothing", "Apparel and fashion items"),
    ("Home & Kitchen", "Home appliances and kitchenware"),
    ("Health & Beauty", "Personal care and wellness"),
    ("Sports & Outdoors", "Sports equipment and outdoor gear"),
]

PRODUCTS = [
    ("Wireless Earbuds Pro", "WEB-001", 2999.00, 1500.00, 0),
    ("Smart Watch Ultra", "SWU-002", 8499.00, 4200.00, 0),
    ("USB-C Hub 7-in-1", "UCH-003", 1899.00, 800.00, 0),
    ("Bluetooth Speaker", "BTS-004", 3499.00, 1700.00, 0),
    ("Phone Case Premium", "PCP-005", 799.00, 200.00, 0),
    ("Cotton T-Shirt", "CTS-006", 599.00, 200.00, 1),
    ("Denim Jeans Slim", "DJS-007", 1999.00, 800.00, 1),
    ("Running Shoes", "RSH-008", 3499.00, 1500.00, 1),
    ("Formal Shirt", "FSH-009", 1299.00, 500.00, 1),
    ("Winter Jacket", "WJK-010", 4999.00, 2200.00, 1),
    ("Air Fryer 5L", "AFR-011", 5999.00, 2800.00, 2),
    ("Stainless Steel Bottle", "SSB-012", 699.00, 250.00, 2),
    ("Non-Stick Pan Set", "NSP-013", 2499.00, 1000.00, 2),
    ("Coffee Maker", "CMK-014", 3999.00, 1800.00, 2),
    ("Vacuum Cleaner", "VCL-015", 7999.00, 3500.00, 2),
    ("Sunscreen SPF50", "SSF-016", 499.00, 150.00, 3),
    ("Hair Dryer Pro", "HDP-017", 2499.00, 1100.00, 3),
    ("Face Wash Gel", "FWG-018", 349.00, 100.00, 3),
    ("Vitamin C Serum", "VCS-019", 899.00, 300.00, 3),
    ("Protein Powder 1kg", "PPW-020", 1999.00, 900.00, 3),
    ("Yoga Mat Premium", "YMP-021", 1499.00, 600.00, 4),
    ("Resistance Bands Set", "RBS-022", 899.00, 300.00, 4),
    ("Water Bottle 1L", "WBT-023", 599.00, 200.00, 4),
    ("Camping Tent 4P", "CTN-024", 6999.00, 3200.00, 4),
    ("Fitness Tracker", "FTR-025", 4999.00, 2200.00, 4),
]

CUSTOMERS = [
    ("Rahul Sharma", "rahul@example.com", "+91 98765 43210"),
    ("Priya Patel", "priya@example.com", "+91 87654 32109"),
    ("Amit Kumar", "amit@example.com", "+91 76543 21098"),
    ("Sneha Reddy", "sneha@example.com", "+91 65432 10987"),
    ("Vikram Singh", "vikram@example.com", "+91 54321 09876"),
    ("Ananya Gupta", "ananya@example.com", "+91 43210 98765"),
    ("Rajesh Nair", "rajesh@example.com", "+91 32109 87654"),
    ("Deepika Joshi", "deepika@example.com", "+91 21098 76543"),
    ("Arjun Mehta", "arjun@example.com", "+91 10987 65432"),
    ("Kavita Iyer", "kavita@example.com", "+91 98712 34560"),
    ("Suresh Rao", "suresh@example.com", "+91 87612 34509"),
    ("Meera Desai", "meera@example.com", "+91 76512 34098"),
    ("Nikhil Verma", "nikhil@example.com", "+91 65412 30987"),
    ("Pooja Shah", "pooja@example.com", "+91 54312 09876"),
    ("Kiran Kulkarni", "kiran@example.com", "+91 43212 98765"),
]


async def seed():
    """Seed the database with demo data using Prisma."""
    db = Prisma()
    await db.connect()

    try:
        # Check if already seeded
        existing_user = await db.user.find_first(where={"email": "admin@businessos.ai"})
        if existing_user:
            print("⚠️  Database already has data. Skipping seed.")
            print("   Login: admin@businessos.ai / admin123")
            return

        print("🌱 Seeding database...")

        # Create business (owner_id will be updated after user creation)
        business = await db.business.create(
            data={
                "name": "TechMart India",
                "description": "Premium technology and lifestyle store",
                "owner_id": 0,
            }
        )

        # Create admin user
        user = await db.user.create(
            data={
                "email": "admin@businessos.ai",
                "password_hash": hash_password("admin123"),
                "name": "Admin User",
                "business_id": business.id,
            }
        )

        # Update business owner
        await db.business.update(
            where={"id": business.id},
            data={"owner_id": user.id}
        )

        # Create categories
        categories = []
        for name, desc in CATEGORIES:
            cat = await db.category.create(
                data={"name": name, "description": desc, "business_id": business.id}
            )
            categories.append(cat)
        print(f"  ✅ Created {len(categories)} categories")

        # Create products with inventory
        products = []
        for name, sku, price, cost, cat_idx in PRODUCTS:
            product = await db.product.create(
                data={
                    "name": name,
                    "sku": sku,
                    "price": price,
                    "cost": cost,
                    "category_id": categories[cat_idx].id,
                    "business_id": business.id,
                    "description": f"High quality {name.lower()} for your everyday needs.",
                    "inventory": {
                        "create": {
                            "quantity": random.randint(5, 150),
                            "low_stock_threshold": random.choice([5, 10, 15, 20]),
                            "business_id": business.id,
                        }
                    }
                }
            )
            products.append(product)
        print(f"  ✅ Created {len(products)} products with inventory")

        # Create customers
        customers = []
        for name, email, phone in CUSTOMERS:
            customer = await db.customer.create(
                data={
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "business_id": business.id,
                }
            )
            customers.append(customer)
        print(f"  ✅ Created {len(customers)} customers")

        # Create historical sales data (last 6 months)
        now = datetime.now(timezone.utc)
        total_sales = 0
        customer_totals = {c.id: {"spending": 0.0, "count": 0, "last": None} for c in customers}

        for days_ago in range(180, 0, -1):
            num_sales = random.choices([0, 1, 2, 3], weights=[20, 40, 30, 10])[0]
            for _ in range(num_sales):
                customer = random.choice(customers)
                sale_date = now - timedelta(
                    days=days_ago,
                    hours=random.randint(8, 20),
                    minutes=random.randint(0, 59)
                )

                # Pick 1–4 products
                sale_products = random.sample(products, min(random.randint(1, 4), len(products)))

                total_amount = 0.0
                items_data = []
                for p in sale_products:
                    qty = random.randint(1, 3)
                    item_total = qty * p.price
                    total_amount += item_total
                    items_data.append({
                        "product_id": p.id,
                        "quantity": qty,
                        "unit_price": p.price,
                        "total": item_total,
                    })

                await db.sale.create(
                    data={
                        "customer_id": customer.id,
                        "total_amount": total_amount,
                        "status": "COMPLETED",
                        "business_id": business.id,
                        "created_at": sale_date,
                        "items": {"create": items_data}
                    }
                )

                customer_totals[customer.id]["spending"] += total_amount
                customer_totals[customer.id]["count"] += 1
                customer_totals[customer.id]["last"] = sale_date
                total_sales += 1

        print(f"  ✅ Created {total_sales} sales over 6 months")

        # Update customer stats
        for customer in customers:
            totals = customer_totals[customer.id]
            count = totals["count"]
            spending = totals["spending"]
            if count > 0:
                await db.customer.update(
                    where={"id": customer.id},
                    data={
                        "total_spending": spending,
                        "purchase_count": count,
                        "avg_order_value": spending / count,
                        "last_purchase": totals["last"],
                    }
                )
        print("  ✅ Updated customer spending statistics")

        print("\n🎉 Database seeded successfully!")
        print(f"   Login: admin@businessos.ai / admin123")
        print(f"   Business: TechMart India")

    except Exception as e:
        print(f"❌ Seed error: {e}")
        raise
    finally:
        await db.disconnect()


if __name__ == "__main__":
    asyncio.run(seed())
