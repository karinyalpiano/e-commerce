import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { getJSON, setJSON } from '../utils/storage.js'
import { SHIPPING_OPTIONS, computeSummary } from '../utils/pricing.js'
import { currency } from '../utils/format.js'
import { maskCPF, isValidCPF, maskCNPJ, isValidCNPJ, maskPhone, fetchCEP, onlyDigits } from '../utils/validators.js'
import { useToast } from '../context/ToastContext.jsx'

const ORDERS_KEY = 'app_orders_v1'

export default function Checkout() {
  const { items, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [shippingId, setShippingId] = useState(location.state?.shippingId || 'economy')
  const [coupon] = useState(location.state?.coupon || null)
  const [submitting, setSubmitting] = useState(false)
  const [pay, setPay] = useState('card') // 'card' | 'pix'
  const [pixReady, setPixReady] = useState(false)

  // form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [doc, setDoc] = useState('') // CPF/CNPJ
  const [phone, setPhone] = useState('')
  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neigh, setNeigh] = useState('')
  const [city, setCity] = useState('')
  const [uf, setUf] = useState('')

  const [cepStatus, setCepStatus] = useState('idle') // idle | loading | ok | error
  const [cepError, setCepError] = useState('')

  const summary = computeSummary(items, coupon, shippingId)

  async function handleCEP() {
    try {
      setCepStatus('loading'); setCepError('')
      const data = await fetchCEP(cep)
      setStreet(data.logradouro || ''); setNeigh(data.bairro || ''); setCity(data.localidade || ''); setUf(data.uf || '')
      setCepStatus('ok')
      toast('Endereço preenchido pelo CEP', { type: 'success' })
    } catch (e) {
      setCepStatus('error'); setCepError(e.message || 'Erro no CEP'); toast('CEP inválido ou não encontrado', { type: 'error' })
    }
  }

  function validDoc() {
    const d = onlyDigits(doc)
    if (d.length <= 11) return isValidCPF(d)
    return isValidCNPJ(d)
  }

  function maskedDoc(v) {
    const d = onlyDigits(v)
    return d.length <= 11 ? maskCPF(v) : maskCNPJ(v)
  }

  function genPixCode() {
    // Gera um código fake (não real)
    const r = Math.random().toString(36).slice(2,10).toUpperCase()
    return `00020126BR.GOV.BCB.PIX0114+5500000000005204000053039865802BR5911E-COMMERCE6009SOME CITY6212ORDER${Date.now().toString().slice(-6)}${r}6304ABCD`
  }

  const isFormValid = () => {
    return name && email && validDoc() && phone && street && number && city && uf && cepStatus !== 'loading'
  }

  function handleGeneratePix(e) {
    e.preventDefault()
    setPixReady(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    if (!isFormValid()) return alert('Preencha os dados corretamente.')
    if (pay === 'pix' && !pixReady) return alert('Gere e confirme o PIX antes de finalizar.')
    setSubmitting(true)

    const order = {
      id: `EC-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'processing',
      payment: { method: pay, status: pay === 'pix' ? 'paid' : 'paid' },
      customer: { name, email, doc, phone, address: { cep, street, number, complement, neigh, city, uf } },
      items,
      pricing: { shippingId, coupon: coupon?.code || null, ...summary }
    }
    const orders = getJSON(ORDERS_KEY, [])
    orders.unshift(order)
    setJSON(ORDERS_KEY, orders)
    clearCart()
    toast('Pedido realizado com sucesso!', { type: 'success' })
    navigate('/orders', { state: { success: true } })
  }

  if (items.length === 0) {
    return (<section className="page"><h2>Checkout</h2><p>Seu carrinho está vazio.</p></section>)
  }

  const pixCode = pixReady ? genPixCode() : null

  return (
    <section className="page">
      <h2>Checkout</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="grid-2">
          <label>Nome<input required name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" /></label>
          <label>E-mail<input required type="email" name="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@exemplo.com" /></label>
        </div>

        <div className="grid-2">
          <label>CPF/CNPJ
            <input required value={maskedDoc(doc)} onChange={e=>setDoc(e.target.value)} placeholder="000.000.000-00 / 00.000.000/0000-00" />
          </label>
          <label>Telefone
            <input required value={maskPhone(phone)} onChange={e=>setPhone(e.target.value)} placeholder="(11) 90000-0000" />
          </label>
        </div>

        <div className="grid-2">
          <label>CEP
            <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:8}}>
              <input required value={cep} onChange={e=>setCep(e.target.value)} onBlur={handleCEP} placeholder="00000-000" />
              <button className="btn btn-outline" onClick={handleCEP} aria-busy={cepStatus==='loading'} type="button">Buscar CEP</button>
            </div>
            {cepStatus==='error' && <small className="error">{cepError}</small>}
          </label>
          <label>UF<input required value={uf} onChange={e=>setUf(e.target.value)} placeholder="SP" /></label>
        </div>

        <div className="grid-2">
          <label>Rua<input required value={street} onChange={e=>setStreet(e.target.value)} placeholder="Logradouro" /></label>
          <label>Número<input required value={number} onChange={e=>setNumber(e.target.value)} placeholder="123" /></label>
        </div>
        <div className="grid-2">
          <label>Bairro<input value={neigh} onChange={e=>setNeigh(e.target.value)} placeholder="Bairro" /></label>
          <label>Complemento<input value={complement} onChange={e=>setComplement(e.target.value)} placeholder="Apto, bloco..." /></label>
        </div>

        <div className="grid-2">
          <label>Cidade<input required value={city} onChange={e=>setCity(e.target.value)} placeholder="Cidade" /></label>
          <div className="order-card">
            <h3>Resumo</h3>
            <div className="summary-lines">
              <div><span>Subtotal</span><span>{currency(summary.subtotal)}</span></div>
              <div><span>Descontos</span><span>- {currency(summary.discount)}</span></div>
              <div><span>Frete</span><span>{currency(summary.shipping)}</span></div>
              <div><span>Impostos (10%)</span><span>{currency(summary.tax)}</span></div>
              <div className="hr"></div>
              <div className="total"><span>Total</span><span>{currency(summary.total)}</span></div>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div className="label">Entrega</div>
            {SHIPPING_OPTIONS.map(opt => (
              <label key={opt.id} className={`ship-opt ${shippingId === opt.id ? 'active' : ''}`}>
                <input type="radio" name="ship" value={opt.id} checked={shippingId === opt.id} onChange={() => setShippingId(opt.id)} />
                <div className="ship-title">{opt.label}</div>
              </label>
            ))}
          </div>
          <div>
            <div className="label">Pagamento</div>
            <label className={`ship-opt ${pay==='card'?'active':''}`}>
              <input type="radio" name="pay" checked={pay==='card'} onChange={()=>setPay('card')} /> Cartão (simulado)
            </label>
            <label className={`ship-opt ${pay==='pix'?'active':''}`}>
              <input type="radio" name="pay" checked={pay==='pix'} onChange={()=>setPay('pix')} /> PIX (simulado)
            </label>

            {pay==='pix' && (
              <div className="order-card" style={{marginTop:10}}>
                <h3>PIX</h3>
                {!pixReady ? (
                  <button className="btn btn-outline" onClick={handleGeneratePix}>Gerar código PIX</button>
                ) : (
                  <div>
                    <div className="pix-box">{pixCode}</div>
                    <small className="muted">Copie e cole no seu app do banco (simulado).</small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button className="btn" type="submit" disabled={submitting}>{submitting ? "Finalizando…" : "Finalizar pedido"}</button>
      </form>
    </section>
  )
}
