from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from . import store
from .ai import get_assistant

app = FastAPI(title="Botani Mart API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/api/health")
async def health():
    return {"ok": True, "storage": "mongodb" if store.get_db() is not None else "memory"}


@app.get("/api/categories")
async def categories():
    return await store.categories()


@app.get("/api/products")
async def products(q: str | None = None, category: str | None = None,
                   min_price: int | None = None, max_price: int | None = None, sort: str | None = None):
    return await store.list_products(q, category, min_price, max_price, sort)


@app.get("/api/products/{slug}")
async def product(slug: str):
    p = await store.get_product(slug)
    if not p:
        raise HTTPException(404, "Produk tidak ditemukan")
    return p


class ChatIn(BaseModel):
    message: str
    history: list[dict] = []


@app.post("/api/chat")
async def chat(body: ChatIn):
    return await get_assistant().reply(body.message, body.history, store.get_db())
