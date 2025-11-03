import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { applyTheme, getTheme } from '../utils/theme.js'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { count } = useCart()
  const [theme, setTheme] = useState('dark')
  useEffect(() => { setTheme(getTheme()) }, [])

  return (
    <header className="navbar">
      <Link to="/" className="brand">e-commerce</Link>
      <nav>
        <NavLink to="/" end>Produtos</NavLink>
        <NavLink to="/orders">Pedidos</NavLink>
        <NavLink to="/wishlist">Favoritos</NavLink>
        <NavLink to="/cart">Carrinho ({count})</NavLink>
            <button
        className="btn btn-outline small"
        onClick={() => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); applyTheme(next); }}
        aria-label="Alternar tema"
        title={`Tema: ${theme === 'dark' ? 'escuro' : 'claro'}`}
      >
        {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
      </button>
      </nav>
    </header>
  )
}
