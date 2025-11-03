export const TAX_RATE = 0.10

export const SHIPPING_OPTIONS = [
  { id: 'economy', label: 'Econômico (5–8 dias)', daysMin: 5, daysMax: 8 },
  { id: 'express', label: 'Expresso (2–3 dias)', daysMin: 2, daysMax: 3 },
]

export function getShippingCost(subtotal, shippingId) {
  if (shippingId === 'express') return 25
  // Econômico: grátis a partir de $100, caso contrário $15
  return subtotal >= 100 ? 0 : 15
}

export function normalizeCoupon(code) {
  if (!code) return null
  const c = String(code).trim().toUpperCase()
  if (c === 'PRESTEK10') return { code: c, type: 'percent', value: 10 }
  if (c === 'BEMVINDO5') return { code: c, type: 'fixed', value: 5 }
  if (c === 'FRETEGRATIS') return { code: c, type: 'shipping', value: 100 } // 100% do frete
  return null
}

export function computeSummary(items, coupon, shippingId) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const shipping = getShippingCost(subtotal, shippingId)
  let discount = 0
  if (coupon) {
    if (coupon.type === 'percent') discount = (coupon.value / 100) * subtotal
    if (coupon.type === 'fixed') discount = coupon.value
    if (coupon.type === 'shipping') discount = Math.min(shipping, shipping) // cobre frete
  }
  const taxedBase = Math.max(0, subtotal - discount) + shipping
  const tax = TAX_RATE * taxedBase
  const total = Math.max(0, taxedBase + tax)
  return {
    subtotal, shipping, discount, tax, total
  }
}

export function estimateDelivery(daysMin, daysMax) {
  const now = new Date()
  const start = new Date(now); start.setDate(now.getDate() + daysMin)
  const end = new Date(now); end.setDate(now.getDate() + daysMax)
  return { start: start.toISOString(), end: end.toISOString() }
}
