export function currency(v) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
  } catch {
    return `$ ${Number(v || 0).toFixed(2)}`
  }
}
