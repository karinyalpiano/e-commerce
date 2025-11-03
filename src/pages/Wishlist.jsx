import { Link } from 'react-router-dom'
import { useFavs } from '../context/FavoritesContext.jsx'
import { currency } from '../utils/format.js'

export default function Wishlist() {
  const { favs } = useFavs()

  return (
    <section className="page">
      <h2>Favoritos</h2>
      {favs.length === 0 ? (
        <div className="empty"><p>Nenhum favorito ainda.</p></div>
      ) : (
        <div className="grid">
          {favs.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="card fav-card">
              <img src={p.image} alt={p.title} className="card-img" />
              <div className="card-body">
                <h3 className="card-title">{p.title}</h3>
                <p className="card-price">{currency(p.price)}</p>
                <span className="muted">Ver detalhes</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
