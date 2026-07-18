let cache = null;

export async function loadProducts() {
  if (cache) return cache;
  const res = await fetch("data/products.json");
  cache = await res.json();
  return cache;
}

export async function getProductBySlug(slug) {
  const all = await loadProducts();
  return all.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getProductById(id) {
  const all = await loadProducts();
  return all.find((p) => p.id === id) || null;
}

export function filterProducts(products, filters = {}) {
  let list = [...products];
  if (filters.category && filters.category !== "all") {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.skuBase.toLowerCase().includes(q)
    );
  }
  if (filters.color) {
    list = list.filter((p) => p.variants.some((v) => v.color === filters.color));
  }
  if (filters.size) {
    list = list.filter((p) =>
      p.variants.some((v) => Object.keys(v.sizes).includes(filters.size) && v.sizes[filters.size] > 0)
    );
  }
  if (filters.availability === "in_stock") {
    list = list.filter((p) => p.variants.some((v) => v.stockStatus !== "unavailable"));
  }
  if (filters.availability === "sale") {
    list = list.filter((p) => p.salePrice || p.badge === "sale");
  }
  if (filters.availability === "new") {
    list = list.filter((p) => p.badge === "new");
  }
  if (filters.minPrice != null) list = list.filter((p) => (p.salePrice ?? p.price) >= filters.minPrice);
  if (filters.maxPrice != null) list = list.filter((p) => (p.salePrice ?? p.price) <= filters.maxPrice);

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case "price-desc":
      list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      break;
    case "newest":
      list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      break;
    case "popular":
      list.sort((a, b) => Number(b.popular) - Number(a.popular));
      break;
    default:
      break;
  }
  return list;
}

export function uniqueColors(products) {
  const map = new Map();
  products.forEach((p) => p.variants.forEach((v) => map.set(v.color, v.hex)));
  return [...map.entries()].map(([color, hex]) => ({ color, hex }));
}

export function uniqueSizes(products) {
  const set = new Set();
  products.forEach((p) => p.variants.forEach((v) => Object.keys(v.sizes).forEach((s) => set.add(s))));
  return [...set];
}
