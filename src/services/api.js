import { publicUrl } from "../lib/utils.js";

let coupons = null;
let shipping = null;
let config = null;
let productsCache = null;

export async function loadConfig() {
  if (config) return config;
  const res = await fetch(publicUrl("data/config.json"));
  config = await res.json();
  return config;
}

export async function loadCoupons() {
  if (coupons) return coupons;
  const res = await fetch(publicUrl("data/coupons.json"));
  coupons = await res.json();
  return coupons;
}

export async function loadShipping() {
  if (shipping) return shipping;
  const res = await fetch(publicUrl("data/shipping.json"));
  shipping = await res.json();
  return shipping;
}

export async function loadProducts() {
  if (productsCache) return productsCache;
  const res = await fetch(publicUrl("data/products.json"));
  productsCache = await res.json();
  return productsCache;
}

export async function getProductBySlug(slug) {
  const all = await loadProducts();
  return all.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function findCoupon(code) {
  const list = await loadCoupons();
  const found = list.find((c) => c.code.toUpperCase() === String(code || "").toUpperCase());
  if (!found) return { ok: false, error: "Cupom inválido" };
  if (new Date(found.validUntil) < new Date()) return { ok: false, error: "Cupom expirado" };
  return { ok: true, coupon: found };
}

export async function estimateShipping(cep, shippingId) {
  const options = await loadShipping();
  const option = options.find((o) => o.id === shippingId) || options[1];
  const digits = String(cep || "").replace(/\D/g, "");
  let multiplier = 1;
  if (digits.length >= 8) {
    const region = Number(digits.slice(0, 2));
    if (region >= 1 && region <= 19) multiplier = 0.85;
    else if (region >= 80) multiplier = 1.25;
  }
  return { ...option, price: Math.round(option.price * multiplier * 100) / 100 };
}

export async function computeTotals(cartData) {
  const cfg = await loadConfig();
  const options = await loadShipping();
  const subtotal = cartData.items.reduce((a, i) => a + i.price * i.qty, 0);
  let discount = 0;
  let freeShipping = false;
  let couponMeta = null;

  if (cartData.coupon) {
    const result = await findCoupon(cartData.coupon);
    if (result.ok) {
      couponMeta = result.coupon;
      if (subtotal >= result.coupon.minSubtotal) {
        if (result.coupon.type === "percent") discount = (subtotal * result.coupon.value) / 100;
        if (result.coupon.type === "fixed") discount = result.coupon.value;
        if (result.coupon.freeShipping) freeShipping = true;
      }
    }
  }

  if (subtotal >= cfg.freeShippingMin) freeShipping = true;

  const shipOpt = options.find((o) => o.id === cartData.shippingId) || options[1];
  let shippingPrice = freeShipping && shipOpt.id !== "retirada" ? 0 : shipOpt.price;
  const cep = cartData.address?.cep;
  if (cep && shipOpt.id !== "retirada") {
    const est = await estimateShipping(cep, shipOpt.id);
    shippingPrice = freeShipping ? 0 : est.price;
  }

  let giftPrice = 0;
  if (cartData.gift?.enabled && cartData.gift?.wrap) giftPrice = cfg.giftWrapPrice;

  const total = Math.max(0, subtotal - discount + shippingPrice + giftPrice);
  return { subtotal, discount, shippingPrice, giftPrice, total, freeShipping, couponMeta, shipOpt };
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
  if (filters.minPrice != null && filters.minPrice !== "") {
    list = list.filter((p) => (p.salePrice ?? p.price) >= Number(filters.minPrice));
  }
  if (filters.maxPrice != null && filters.maxPrice !== "") {
    list = list.filter((p) => (p.salePrice ?? p.price) <= Number(filters.maxPrice));
  }

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case "price-desc":
      list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      break;
    case "newest":
      list.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
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
