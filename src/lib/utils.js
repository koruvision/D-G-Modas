export const formatBRL = (value) =>
  Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Prefixa paths públicos com o base do Vite (ex.: /D-G-Modas/ no GitHub Pages). */
export function publicUrl(path = "") {
  const base = import.meta.env.BASE_URL || "/";
  const clean = String(path || "").replace(/^\/+/, "");
  return `${base}${clean}`;
}

/**
 * Resolve path de asset para WebP quando aplicável (mantém favicons PNG).
 */
export function assetUrl(src, fallback = "assets/logo-dg-modas.webp") {
  if (!src) return publicUrl(fallback);
  let clean = String(src).replace(/^\//, "");
  if (!/\.(png|jpe?g|gif|webp)$/i.test(clean) && !clean.includes("/")) {
    clean = `assets/${clean}`;
  }
  if (!/^assets\//i.test(clean) && !/^https?:/i.test(clean)) {
    clean = clean.startsWith("assets/") ? clean : `assets/${clean}`;
  }
  if (/favicon|apple-touch-icon/i.test(clean)) {
    return publicUrl(clean);
  }
  clean = clean.replace(/\.(jpe?g|png|gif)$/i, ".webp");
  return publicUrl(clean);
}

export const debounce = (fn, ms = 220) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const stockIcon = (status) => {
  const map = {
    in_stock: "check",
    low: "alert",
    last_units: "zap",
    made_to_order: "spark",
    unavailable: "close",
  };
  return map[status] || "check";
};

export const stockLabel = (status, qty) => {
  const map = {
    in_stock: "Em estoque",
    low: "Baixo estoque",
    last_units: "Últimas unidades",
    made_to_order: "Sob encomenda",
    unavailable: "Indisponível",
  };
  const label = map[status] || "Em estoque";
  if (qty != null && qty > 0 && (status === "low" || status === "last_units")) {
    return `${label} (${qty} restantes)`;
  }
  return label;
};

export const totalStock = (sizes = {}) =>
  Object.values(sizes).reduce((a, b) => a + Number(b || 0), 0);

export const productPrice = (product, variant) => {
  const base = product.salePrice ?? product.price;
  return base + (variant?.priceDelta || 0);
};

export const installments = (price, n = 3) => {
  const each = price / n;
  return `ou ${n}x de ${formatBRL(each)}`;
};

export const starsText = (rating = 5) => {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
};

const PATHS = {
  home: "M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z",
  grid: null,
  spark: "M12 3l1.2 5.2L18 12l-4.8 1.8L12 21l-1.2-7.2L6 12l4.8-3.8L12 3z",
  dress: "M9 4h6l2 4-3 2v10H10V10L7 8l2-4z",
  shirt: "M8 5l4-2 4 2 3 2-2 3h-2v9H9V10H7L5 7l3-2z",
  child: null,
  chat: "M5 5h14v10H8l-3 3V5z",
  search: null,
  heart: "M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20z",
  compare: null,
  bag: null,
  user: null,
  truck: null,
  shield: "M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z",
  tag: null,
  star: "M12 3l2.4 5 5.6.8-4 4 1 5.6L12 16.5 6.9 18.4l1-5.6-4-4 5.6-.8L12 3z",
  gift: null,
  check: "M5 12l5 5L19 7",
  close: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  chevron: "M9 6l6 6-6 6",
  map: null,
  phone: null,
  mail: null,
  info: null,
  zap: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  alert: null,
  filter: "M4 6h16M7 12h10M10 18h4",
  menu: "M4 7h16M4 12h16M4 17h16",
};

export { PATHS };
