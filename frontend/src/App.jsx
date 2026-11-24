import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Catalog from './pages/Catalog.jsx'
import Detail from './pages/Detail.jsx'
import Chat from './pages/Chat.jsx'

const titles = { '/': 'Botani Mart', '/produk': 'Katalog', '/tentang': 'Tentang', '/asisten': 'Asisten AI' }
const links = [['/', 'Beranda'], ['/produk', 'Katalog'], ['/tentang', 'Tentang'], ['/asisten', 'Asisten AI']]

export default function App() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0); document.title = (titles[pathname] || 'Produk') + ' | Botani Mart' }, [pathname])
  const cls = ({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-stone-600 hover:text-green-700'
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-green-700">🌿 Botani Mart</Link>
          <nav className="hidden md:flex gap-6">{links.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{t}</NavLink>)}</nav>
          <button className="md:hidden text-2xl" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
        </div>
        {open && <nav className="md:hidden flex flex-col gap-3 px-4 pb-4" onClick={() => setOpen(false)}>
          {links.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{t}</NavLink>)}</nav>}
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang" element={<About />} />
          <Route path="/produk" element={<Catalog />} />
          <Route path="/produk/:slug" element={<Detail />} />
          <Route path="/asisten" element={<Chat />} />
          <Route path="*" element={<p className="p-10 text-center">Halaman tidak ditemukan.</p>} />
        </Routes>
      </main>
      {pathname !== '/asisten' && <Link to="/asisten" className="fixed bottom-5 right-5 z-10 bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-full shadow-lg text-sm font-semibold">💬 Tanya AI</Link>}
      <footer className="bg-green-900 text-green-100 text-sm text-center py-6">© 2026 Botani Mart — Informasi & katalog produk pertanian</footer>
    </div>
  )
}
