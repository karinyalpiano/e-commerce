const BASE_URL = "https://fakestoreapi.com";

// Fallbacks simples para quando a API estiver fora/sem rede
const fallbackProducts = [
  { id: 1, title: "Mochila Fjallraven", price: 109.95, description: "Mochila resistente e leve", category: "men's clothing", image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", rating: { rate: 3.9, count: 120 } },
  { id: 2, title: "Camisa Raglan", price: 22.3, description: "Camisa manga 3/4", category: "men's clothing", image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_UL640_QL65_ML3_.jpg", rating: { rate: 4.1, count: 259 } },
  { id: 3, title: "Jaqueta Algodão", price: 55.99, description: "Jaqueta versátil", category: "men's clothing", image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg", rating: { rate: 4.7, count: 500 } }
];

const fallbackCategories = ["men's clothing", "jewelery", "electronics", "women's clothing"];

// Fetch com timeout usando AbortController (compatível com navegadores modernos)
async function safeFetch(url, options = {}, { timeout = 7000 } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (_) {
    return null;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchProducts() {
  const data = await safeFetch(`${BASE_URL}/products`);
  return Array.isArray(data) && data.length ? data : fallbackProducts;
}

export async function fetchCategories() {
  const data = await safeFetch(`${BASE_URL}/products/categories`);
  return Array.isArray(data) && data.length ? data : fallbackCategories;
}

export async function fetchProduct(id) {
  const data = await safeFetch(`${BASE_URL}/products/${id}`);
  if (data && data.id) return data;
  const nid = Number(id) || 1;
  return fallbackProducts.find(p => p.id === nid) || fallbackProducts[0];
}
