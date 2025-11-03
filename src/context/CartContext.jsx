import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getJSON, setJSON } from '../utils/storage.js'

const CartContext = createContext(null)

const CART_KEY = 'app_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getJSON(CART_KEY, []))

  useEffect(() => {
    setJSON(CART_KEY, items)
  }, [items])

  function addToCart(product, qty = 1) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
        return copy
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: qty
      }]
    })
  }

  function decrementItem(id) {
    setItems(prev => prev.flatMap(i => {
      if (i.id !== id) return [i]
      if (i.quantity <= 1) return []
      return [{ ...i, quantity: i.quantity - 1 }]
    }))
  }

  function removeFromCart(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const count = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items])
  const total = useMemo(() => items.reduce((acc, i) => acc + i.price * i.quantity, 0), [items])

  function addBundleToCart(bundleItems = []) {
    bundleItems.forEach(b => addToCart(b, b.quantity || 1))
  }

  const value = { items, addToCart, addBundleToCart, decrementItem, removeFromCart, clearCart, count, total }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
