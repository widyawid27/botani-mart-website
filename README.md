# Botani Mart

Katalog & informasi produk pertanian. React + Vite + Tailwind v4 | FastAPI | MongoDB.

## Menjalankan (VS Code, 3 terminal)
1. `docker compose up -d` (MongoDB; atau MongoDB lokal/Atlas via env `MONGO_URL`)
2. Backend: `cd backend && python -m venv .venv && source .venv/bin/activate` (Windows: `.venv\Scripts\activate`) lalu `pip install -r requirements.txt && uvicorn app.main:app --reload` → http://localhost:8000/docs
3. Frontend: `cd frontend && npm install && npm run dev` → http://localhost:5173

Data contoh otomatis dimasukkan saat backend pertama kali jalan (`backend/app/seed.py`).

## Sitemap
`/` Beranda · `/produk` Katalog (cari, filter kategori, urutkan) · `/produk/:slug` Detail · `/tentang` Profil · `/asisten` Chatbot

## API
`GET /api/products?q=&category=&min_price=&max_price=&sort=` · `GET /api/products/{slug}` · `GET /api/categories` · `POST /api/chat`

## Integrasi AI Assistant nanti (tanpa membangun ulang)
- UI chat (`pages/Chat.jsx`) hanya memanggil `POST /api/chat` dengan kontrak `{message, history}` → `{reply, products: [slug], placeholder}`.
- Seluruh logika AI ada di `backend/app/ai.py`. Ganti `PlaceholderAssistant` dengan implementasi LLM (mis. Claude API + pencarian produk di MongoDB sebagai konteks) dan kembalikan di `get_assistant()`.
- Field `products` siap dipakai untuk menampilkan kartu rekomendasi di chat.

## Pengujian
Backend: `cd backend && pip install -r requirements-dev.txt && pytest` (memakai MongoDB tiruan, tanpa perlu Mongo berjalan).
Frontend: `cd frontend && npm run build`.

## Deploy ke Vercel
Satu repo, satu proyek: frontend (Vite) dilayani sebagai situs statis, backend FastAPI berjalan sebagai Python Serverless Function (`api/index.py`). `vercel.json` sudah mengatur build dan rewrite.
1. Push folder ini ke GitHub.
2. Di vercel.com: **Add New > Project**, pilih repo. Framework Preset: **Other**, Root Directory: root repo (biarkan build/install default; `vercel.json` yang dipakai).
3. (Opsional) **Settings > Environment Variables**: `MONGO_URL` (MongoDB Atlas, izinkan akses 0.0.0.0/0 untuk Vercel) dan `DB_NAME`. Tanpa `MONGO_URL`, API memakai data contoh di memori sehingga situs tetap berfungsi.
4. Deploy. Cek `https://<domain>/api/health`: `storage` bernilai `mongodb` atau `memory`.

Variabel `VITE_API_URL` hanya perlu jika backend dihosting di domain lain.
