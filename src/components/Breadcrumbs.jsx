import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/">Home</Link></li>
        {items.map((it, i) => (
          <li key={i} className={i === items.length - 1 ? 'current' : ''}>
            {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
