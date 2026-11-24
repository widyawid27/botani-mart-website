const BASE = import.meta.env.VITE_API_URL || '/api'
const j = (u, o) => fetch(BASE + u, o).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
export const getProducts = (p = {}) =>
  j('/products?' + new URLSearchParams(Object.entries(p).filter(([, v]) => v)))
export const getProduct = s => j('/products/' + s)
export const getCategories = () => j('/categories')
// Satu-satunya titik kontak chatbot dengan backend; kontrak: {reply, products[], placeholder}
export const sendChat = (message, history) =>
  j('/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, history }) })
export const rp = n => 'Rp' + n.toLocaleString('id-ID')
