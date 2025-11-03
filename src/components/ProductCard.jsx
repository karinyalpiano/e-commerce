import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useFavs } from '../context/FavoritesContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { currency } from '../utils/format.js'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  // Context pode não existir caso não esteja envolvido; protegemos aqui
  let fav = false
  let toggleFavSafe = null
  try {
    const favCtx = useFavs()
    fav = typeof favCtx?.isFav === 'function' ? favCtx.isFav(product.id) : false
    toggleFavSafe = favCtx?.toggleFav
  } catch (_) {
    // sem provider, seguimos sem favoritos
  }

  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    setLoading(true)
    try {
      addToCart(product)
      toast('Adicionado ao carrinho', { type: 'success' })
    } finally {
      setTimeout(() => setLoading(false), 300)
    }
  }

  function handleToggleFav() {
    if (typeof toggleFavSafe === 'function') {
      const wasFav = fav
      toggleFavSafe(product)
      toast(wasFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos', { type: 'info' })
    }
  }

  return (
    <div className="card" style={{ position:'relative' }}>
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} className="card-img" />
      </Link>

      <button
        className="fav-btn"
        title="Favoritar"
        onClick={handleToggleFav}
        aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {fav ? '❤️' : '🤍'}
      </button>

      <div className="card-body">
        <Link to={`/product/${product.id}`} className="card-title linklike" title={product.title}>
          {product.title}
        </Link>
        <div className="rating">
          {'★'.repeat(Math.round(product.rating?.rate || 0))}
          {'☆'.repeat(5 - Math.round(product.rating?.rate || 0))}
          <span className="muted"> ({product.rating?.count || 0})</span>
        </div>
        <p className="card-price">{currency(product.price)}</p>
        <button className="btn" onClick={handleAdd} disabled={loading} aria-busy={loading}>
          {loading ? 'Adicionando…' : 'Adicionar'}
        </button>
      </div>
    </div>
  )
}
