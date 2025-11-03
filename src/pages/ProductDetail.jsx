import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProduct, fetchProducts } from '../api/products.js'
import { useCart } from '../context/CartContext.jsx'
import { useFavs } from '../context/FavoritesContext.jsx'
import { currency } from '../utils/format.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { getReviews, addReview, averageRating } from '../utils/reviews.js'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()
  let isFav = null, toggleFav = null
  try {
    const favCtx = useFavs()
    isFav = favCtx?.isFav
    toggleFav = favCtx?.toggleFav
  } catch (_) {}

  const [allProducts, setAllProducts] = useState([])

  // Reviews
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await fetchProduct(id)
        setP(data)
        setReviews(getReviews(String(id)))
        const list = await fetchProducts()
        setAllProducts(list)
      } catch (e) {
        setError(e.message || 'Erro ao carregar produto')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <section className="page"><p className="loading">Carregando…</p></section>
  if (error) return <section className="page"><p className="error">{error}</p></section>
  if (!p) return null

  const fav = useMemo(() => (typeof isFav === 'function' ? isFav(p.id) : false), [isFav, p?.id])
  const localAvg = averageRating(String(id))
  const displayRating = Math.round(((p.rating?.rate || 0) + localAvg) / (localAvg ? 2 : 1))

  const recs = allProducts.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4)

  function onAddReview(e) {
    e.preventDefault()
    const arr = addReview(String(id), { rating: Number(rating), comment })
    setReviews(arr)
    setRating(5)
    setComment('')
  }

  return (
    <section className="page">
      <Breadcrumbs items={[{ label: 'Produtos', to: '/' }, { label: p.title }]} />
      <div className="product-detail">
        <div className="product-media">
          <img src={p.image} alt={p.title} />
        </div>
        <div className="product-info">
          <h2>{p.title}</h2>
          <div className="rating">
            {'★'.repeat(displayRating)}{'☆'.repeat(5 - displayRating)} <span className="muted">({p.rating?.count || 0})</span>
          </div>
          <p className="desc">{p.description}</p>
          <div className="price">{currency(p.price)}</div>

          <div className="row">
            <label>Quantidade
              <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)||1))} />
            </label>
          </div>

          <div className="row actions">
            <button className="btn" onClick={() => addToCart(p, qty)}>Adicionar ao carrinho</button>
            <button className="btn-secondary" onClick={() => typeof toggleFav === 'function' && toggleFav(p)}>{fav ? "Remover dos favoritos" : "Favoritar ❤️"}</button>
          </div>
        </div>
      </div>

      <div className="order-card" style={{marginTop:16}}>
        <h3>Avaliações</h3>
        <form onSubmit={onAddReview} className="form" style={{marginTop:10}}>
          <div className="grid-2">
            <label>Nota
              <select value={rating} onChange={e => setRating(e.target.value)}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </label>
            <label>Comentário
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Escreva sua opinião..." />
            </label>
          </div>
          <button className="btn btn-outline" type="submit">Enviar avaliação</button>
        </form>

        {reviews.length === 0 ? (
          <p className="muted" style={{marginTop:8}}>Seja o primeiro a avaliar.</p>
        ) : (
          <ul className="orders" style={{marginTop:10}}>
            {reviews.map((r, idx) => (
              <li key={idx} className="order">
                <div className="rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <div style={{marginTop:6}}>{r.comment}</div>
                <div className="muted">{new Date(r.date).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {recs.length > 0 && (
        <div style={{marginTop:16}}>
          <h3>Você também pode gostar</h3>
          <div className="grid" style={{marginTop:10}}>
            {recs.map(r => <ProductCard key={r.id} product={r} />)}
          </div>
        </div>
      )}
    </section>
  )
}
