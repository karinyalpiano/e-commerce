import { createContext, useContext, useEffect, useState } from 'react'
import { getJSON, setJSON } from '../utils/storage.js'

const FavsContext = createContext(null)
const FAVS_KEY = 'app_favs_v1'

export function FavoritesProvider({ children }) {
  const [favs, setFavs] = useState(() => getJSON(FAVS_KEY, []))
  useEffect(() => { setJSON(FAVS_KEY, favs) }, [favs])

  function toggleFav(product) {
    setFavs(prev => {
      const exists = prev.some(p => p.id === product.id)
      return exists
        ? prev.filter(p => p.id !== product.id)
        : [...prev, { id: product.id, title: product.title, image: product.image, price: product.price }]
    })
  }

  function isFav(id) { return favs.some(p => p.id === id) }

  return <FavsContext.Provider value={{ favs, toggleFav, isFav }}>{children}</FavsContext.Provider>
}

export function useFavs() {
  const ctx = useContext(FavsContext)
  if (!ctx) throw new Error('useFavs must be used inside FavoritesProvider')
  return ctx
}
