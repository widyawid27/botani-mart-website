import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Catalog() {
  const [sp, setSp] = useSearchParams()
  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)
  const [retry, setRetry] = useState(0)
  const q = sp.get('q') || '', category = sp.get('category') || '', sort = sp.get('sort') || '', max = sp.get('max') || ''
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }
  useEffect(() => { getCategories().then(setCats).catch(() => {}) }, [])
  useEffect(() => {
    setLoading(true); setErr(false)
    const t = setTimeout(() => getProducts({ q, category, sort, max_price: max }).then(setItems).catch(() => setErr(true)).finally(() => setLoading(false)), 250)
    return () => clearTimeout(t)
  }, [q, category, sort, max, retry])
  const sel = 'border rounded-lg px-3 py-2 bg-white'
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Katalog Produk</h1>
      <div className="flex flex-col md:flex-row gap-3">
        <input value={q} onChange={e => set('q', e.target.value)} placeholder="Cari produk…" className="flex-1 border rounded-lg px-4 py-2 bg-white" />
        <select value={category} onChange={e => set('category', e.target.value)} className={sel}>
          <option value="">Semua kategori</option>{cats.map(c => <option key={c}>{c}</option>)}</select>
        <select value={max} onChange={e => set('max', e.target.value)} className={sel}>
          <option value="">Semua harga</option><option value="25000">Hingga Rp25.000</option><option value="50000">Hingga Rp50.000</option><option value="100000">Hingga Rp100.000</option></select>
        <select value={sort} onChange={e => set('sort', e.target.value)} className={sel}>
          <option value="">Nama A-Z</option><option value="price_asc">Harga terendah</option><option value="price_desc">Harga tertinggi</option></select>
      </div>
      {loading ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">{[...Array(8)].map((_, i) => <div key={i} className="h-60 rounded-xl bg-stone-200 animate-pulse" />)}</div>
        : err ? <p className="mt-8 text-red-700">Gagal memuat produk. <button className="underline" onClick={() => setRetry(retry + 1)}>Coba lagi</button></p>
        : items.length === 0 ? <p className="mt-8 text-stone-500">Produk tidak ditemukan.</p>
        : <><p className="mt-4 text-sm text-stone-500">{items.length} produk</p><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">{items.map(p => <ProductCard key={p.slug} p={p} />)}</div></>}
    </div>
  )
}
