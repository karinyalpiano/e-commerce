import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
const ProductList = React.lazy(() => import('./pages/ProductList.jsx'))
const Cart = React.lazy(() => import('./pages/Cart.jsx'))
const Checkout = React.lazy(() => import('./pages/Checkout.jsx'))
const Orders = React.lazy(() => import('./pages/Orders.jsx'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail.jsx'))
const Wishlist = React.lazy(() => import('./pages/Wishlist.jsx'))
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Suspense fallback={<p className='loading'>Carregando…</p>}>
          <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  )
}
