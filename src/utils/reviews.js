import { getJSON, setJSON } from './storage.js'

const KEY = 'app_reviews_v1'

export function getReviews(productId) {
  const all = getJSON(KEY, {})
  return all[productId] || []
}

export function addReview(productId, review) {
  const all = getJSON(KEY, {})
  const arr = all[productId] || []
  arr.unshift({ ...review, date: new Date().toISOString() })
  all[productId] = arr
  setJSON(KEY, all)
  return arr
}

export function averageRating(productId) {
  const arr = getReviews(productId)
  if (!arr.length) return 0
  const sum = arr.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / arr.length
}
