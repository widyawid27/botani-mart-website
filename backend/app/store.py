"""Lapisan data: MongoDB bila MONGO_URL diset, jika tidak memakai data seed di memori
(agar deploy pertama di Vercel langsung jalan tanpa database)."""
import os, re
from .seed import PRODUCTS

_db = None
_seeded = False


def get_db():
    global _db
    if _db is None and os.getenv("MONGO_URL"):
        from motor.motor_asyncio import AsyncIOMotorClient
        _db = AsyncIOMotorClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=5000)[os.getenv("DB_NAME", "botanimart")]
    return _db


def set_db(db):  # dipakai tes
    global _db, _seeded
    _db, _seeded = db, False


async def _ready():
    global _seeded
    db = get_db()
    if db is not None and not _seeded:
        try:
            await db.products.create_index("slug", unique=True)
            if await db.products.count_documents({}) == 0:
                await db.products.insert_many([dict(p) for p in PRODUCTS], ordered=False)
        except Exception:
            pass  # seed bersamaan dari instance lain
        _seeded = True
    return db


async def categories():
    db = await _ready()
    return await db.products.distinct("category") if db is not None else sorted({p["category"] for p in PRODUCTS})


async def list_products(q=None, category=None, min_price=None, max_price=None, sort=None):
    db = await _ready()
    key, rev = {"price_asc": ("price", False), "price_desc": ("price", True)}.get(sort, ("name", False))
    if db is None:
        ql = (q or "").lower()
        items = [p for p in PRODUCTS
                 if (not ql or ql in (p["name"] + p["short"] + p["description"]).lower())
                 and (not category or p["category"] == category)
                 and (not min_price or p["price"] >= min_price)
                 and (not max_price or p["price"] <= max_price)]
        return sorted(items, key=lambda p: p[key], reverse=rev)
    f = {}
    if q:
        rx = {"$regex": re.escape(q), "$options": "i"}
        f["$or"] = [{"name": rx}, {"short": rx}, {"description": rx}]
    if category: f["category"] = category
    price = {}
    if min_price: price["$gte"] = min_price
    if max_price: price["$lte"] = max_price
    if price: f["price"] = price
    return await db.products.find(f, {"_id": 0}).sort(key, -1 if rev else 1).to_list(200)


async def get_product(slug):
    db = await _ready()
    if db is None:
        return next((p for p in PRODUCTS if p["slug"] == slug), None)
    return await db.products.find_one({"slug": slug}, {"_id": 0})
