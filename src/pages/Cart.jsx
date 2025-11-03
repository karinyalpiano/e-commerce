import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { SHIPPING_OPTIONS, computeSummary, normalizeCoupon, estimateDelivery } from '../utils/pricing.js'
import { useToast } from '../context/ToastContext.jsx'
import { currency } from '../utils/format.js'

export default function Cart() {
  const { items, addToCart, decrementItem, removeFromCart, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [shippingId, setShippingId] = useState('economy')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [applying, setApplying] = useState(false)

  const summary = useMemo(() => computeSummary(items, appliedCoupon, shippingId), [items, appliedCoupon, shippingId])
  const eta = useMemo(() => {
    const opt = SHIPPING_OPTIONS.find(s => s.id === shippingId) || SHIPPING_OPTIONS[0]
    return estimateDelivery(opt.daysMin, opt.daysMax)
  }, [shippingId])

  function applyCoupon() {
    setApplying(true)
    const c = normalizeCoupon(couponCode)
    setTimeout(() => {
      setAppliedCoupon(c)
      toast(c ? 'Cupom aplicado' : 'Cupom inválido', { type: c ? 'success' : 'error' })
      setApplying(false)
    }, 300)
  }

  const isEmpty = items.length === 0

  if (isEmpty) {
    return (
      <section className="page">
        <Breadcrumbs items={[{ label: 'Carrinho' }]} />
      <h2>Carrinho</h2>
        <div className="empty">
          <p>Seu carrinho está vazio.</p>
          <Link to="/" className="btn btn-outline">Explorar produtos</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page cart-grid">
      <Breadcrumbs items={[{ label: 'Carrinho' }]} />
      <h2>Carrinho</h2>

      <div className="cart-left">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="cart-prod">
                  <img src={item.image} alt={item.title} />
                  <span>{item.title}</span>
                </td>
                <td>
                  <div className="qty">
                    <button onClick={() => decrementItem(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item, 1)}>+</button>
                  </div>
                </td>
                <td>{currency(item.price)}</td>
                <td>{currency(item.price * item.quantity)}</td>
                <td>
                  <button className="link" onClick={() => removeFromCart(item.id)}>remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-actions">
          <button className="btn-secondary" onClick={() => { clearCart(); toast('Carrinho limpo', { type: 'info' }) }}>Limpar carrinho</button>
          <Link to="/" className="btn-outline btn">Continuar comprando</Link>
        </div>
      </div>

      <aside className="cart-right">
        <div className="order-card">
          <h3>Resumo</h3>

          <div className="shipping">
            <div className="label">Entrega</div>
            {SHIPPING_OPTIONS.map(opt => (
              <label key={opt.id} className={`ship-opt ${shippingId === opt.id ? 'active' : ''}`}>
                <input type="radio" name="shipping" value={opt.id} checked={shippingId === opt.id} onChange={() => setShippingId(opt.id)} />
                <div>
                  <div className="ship-title">{opt.label}</div>
                  <div className="ship-eta">Chegada estimada: {new Date(eta.start).toLocaleDateString()} – {new Date(eta.end).toLocaleDateString()}</div>
                </div>
                <div className="ship-price">{currency(opt.id === 'express' ? 25 : (summary.subtotal >= 100 ? 0 : 15))}</div>
              </label>
            ))}
          </div>

          <div className="coupon">
            <div className="label">Cupom</div>
            <div className="coupon-row">
              <input placeholder="PRESTEK10, BEMVINDO5, FRETEGRATIS" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
              <button className="btn btn-outline" onClick={applyCoupon} aria-busy={applying} disabled={applying}>{applying ? 'Aplicando…' : 'Aplicar'}</button>
            </div>
            {appliedCoupon ? <div className="muted">Cupom aplicado: <strong>{appliedCoupon.code}</strong></div> : <div className="muted">Dica: compras acima de $100 ganham frete econômico grátis.</div>}
          </div>

          <div className="summary-lines">
            <div><span>Subtotal</span><span>{currency(summary.subtotal)}</span></div>
            <div><span>Descontos</span><span>- {currency(summary.discount)}</span></div>
            <div><span>Frete</span><span>{currency(summary.shipping)}</span></div>
            <div><span>Impostos (10%)</span><span>{currency(summary.tax)}</span></div>
            <div className="hr"></div>
            <div className="total"><span>Total</span><span>{currency(summary.total)}</span></div>
          </div>

          <div className="right">
            <Link to="/checkout" state={{ coupon: appliedCoupon, shippingId }} className="btn">Ir para o checkout</Link>
          </div>
        </div>
      </aside>
    </section>
  )
}
