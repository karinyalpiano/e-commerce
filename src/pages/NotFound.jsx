import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page">
      <h2>Página não encontrada</h2>
      <div className="empty">
        <p>O endereço acessado não existe.</p>
        <Link to="/" className="btn">Voltar para a home</Link>
      </div>
    </section>
  )
}
