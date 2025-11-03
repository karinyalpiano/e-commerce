import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { getJSON, setJSON } from '../utils/storage.js'
import { currency } from '../utils/format.js'
import { useCart } from '../context/CartContext.jsx'

const ORDERS_KEY = 'app_orders_v1'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const location = useLocation()
  const { addBundleToCart } = useCart()

  useEffect(() => {
    setOrders(getJSON(ORDERS_KEY, []))
  }, [])

  const filtered = useMemo(() => {
    let data = [...orders]
    if (status !== 'all') data = data.filter(o => (o.status || 'processing') === status)
    if (query) data = data.filter(o => String(o.id).toLowerCase().includes(query.toLowerCase()))
    data.sort((a,b) => sort === 'newest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date))
    return data
  }, [orders, status, sort, query])

  function updateOrderStatus(order, next) {
    const updated = orders.map(o => o.id === order.id ? { ...o, status: next } : o)
    setOrders(updated)
    const ORDERS_KEY = 'app_orders_v1'
    setJSON(ORDERS_KEY, updated)
  }

  function reorder(order) {
    addBundleToCart(order.items)
  }

  return (
    <section className="page">
      <Breadcrumbs items={[{ label: 'Pedidos' }]} />
      <h2>Pedidos</h2>
      {location.state?.success && (
        <div className="alert">Pedido realizado com sucesso! 🎉</div>
      )}

      <div className="toolbar" style={{gridTemplateColumns: '1fr 200px 200px'}}>
        <input placeholder="Buscar por ID do pedido" value={query} onChange={e => setQuery(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">Todos os status</option>
          <option value="processing">Processando</option>
          <option value="completed">Concluído</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty"><p>Nenhum pedido encontrado.</p></div>
      ) : (
        <ul className="orders">
          {filtered.map(o => (
            <li key={o.id} className="order">
              <div className="order-head">
                <div><strong>Pedido:</strong> #{o.id}</div>
                <div><strong>Data:</strong> {new Date(o.date).toLocaleString()}</div>
                <div><strong>Status:</strong> <span className={`badge ${o.status || 'processing'}`}>{o.status || 'processing'}</span></div>
                <div><strong>Total:</strong> {currency(o.pricing?.total ?? 0)}</div>
              </div>
              <div className="order-customer">
                <div><strong>Cliente:</strong> {o.customer.name}</div>
                <div><strong>Email:</strong> {o.customer.email}</div>
                <div><strong>Endereço:</strong> {o.customer.address}</div>
              </div>
              <table className="cart-table compact">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Preço</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map(i => (
                    <tr key={i.id}>
                      <td className="cart-prod">
                        <img src={i.image} alt={i.title} />
                        <span>{i.title}</span>
                      </td>
                      <td>{i.quantity}</td>
                      <td>{currency(i.price)}</td>
                      <td>{currency(i.price * i.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="timeline" style={{display:'flex', gap:10, alignItems:'center', margin:'10px 0'}}>
                {['processing','shipped','delivered'].map(s => (
                  <div key={s} className={`tl ${ (o.status||'processing')===s ? 'active' : ''}`}>{s}</div>
                ))}
              </div>

              <div className="summary-lines">
                <div><span>Subtotal</span><span>{currency(o.pricing?.subtotal ?? 0)}</span></div>
                <div><span>Descontos</span><span>- {currency(o.pricing?.discount ?? 0)}</span></div>
                <div><span>Frete</span><span>{currency(o.pricing?.shipping ?? 0)}</span></div>
                <div><span>Impostos</span><span>{currency(o.pricing?.tax ?? 0)}</span></div>
                <div className="hr"></div>
                <div className="total"><span>Total</span><span>{currency(o.pricing?.total ?? 0)}</span></div>
              </div>

              <div className="right" style={{display:'flex', gap:12}}>
                <button className="btn btn-outline" onClick={() => reorder(o)}>Repetir pedido</button>
                              <button className="btn btn-outline" onClick={() => updateOrderStatus(o, (o.status||'processing')==='processing' ? 'shipped' : 'delivered')}>
                  {(o.status||'processing')==='processing' ? 'Marcar como enviado' : 'Marcar como entregue'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
