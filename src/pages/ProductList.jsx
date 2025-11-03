import { useEffect, useMemo, useState } from 'react'
import { fetchCategories, fetchProducts } from '../api/products.js'
import ProductCard from '../components/ProductCard.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('relevance')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const [prods, cats] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ])
        setProducts(prods)
        setCategories(cats)
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    let data = [...products]
    if (category) data = data.filter(p => p.category === category)
    if (search) data = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    const min = Number(priceMin) || 0; const max = Number(priceMax) || Infinity; data = data.filter(p => p.price >= min && p.price <= max)

    if (sort === 'price-asc') data.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') data.sort((a, b) => b.price - a.price)
    if (sort === 'alpha') data.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'rating-desc') data.sort((a,b) => (b.rating?.rate||0) - (a.rating?.rate||0))
    if (sort === 'rating-asc') data.sort((a,b) => (a.rating?.rate||0) - (b.rating?.rate||0))

    return data
  }, [products, category, search, sort])

  if (loading) return (
  <section className="page">
    <Breadcrumbs items={[{ label: 'Produtos' }]} />
      <h2>Produtos</h2>
    <div className="grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card skeleton">
          <div className="card-img"></div>
          <div className="card-body">
            <div className="skeleton-line w-80"></div>
            <div className="skeleton-line w-40"></div>
            <div className="skeleton-btn"></div>
          </div>
        </div>
      ))}
    </div>
  </section>
)
  if (error) return <p className="error">{error}</p>

  return (
    <section className="page">
      <Breadcrumbs items={[{ label: 'Produtos' }]} />
      <h2>Produtos</h2>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Buscar por título…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="relevance">Ordenar: relevância</option>
          <option value="price-asc">Preço: menor → maior</option>
          <option value="price-desc">Preço: maior → menor</option>
          <option value="alpha">Alfabética</option>
          <option value="rating-desc">Avaliação: maior → menor</option>
          <option value="rating-asc">Avaliação: menor → maior</option>
        </select>
      
        <div className="price-range">
          <input type="number" min="0" step="1" placeholder="Preço mín." value={priceMin} onChange={e => setPriceMin(e.target.value)} />
          <input type="number" min="0" step="1" placeholder="Preço máx." value={priceMax} onChange={e => setPriceMax(e.target.value)} />
        </div>
      </div>

      <div className="grid">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
