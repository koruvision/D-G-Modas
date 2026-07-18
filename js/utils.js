export const formatBRL = (value) =>
  Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export const debounce = (fn, ms = 220) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const getParam = (key) => new URLSearchParams(window.location.search).get(key);

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

export const starsHtml = (rating = 5) => {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
};

export const icon = (name, cls = "icon") => {
  const paths = {
    home: '<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/>',
    grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
    spark: '<path d="M12 3l1.2 5.2L18 12l-4.8 1.8L12 21l-1.2-7.2L6 12l4.8-3.8L12 3z"/>',
    dress: '<path d="M9 4h6l2 4-3 2v10H10V10L7 8l2-4z"/>',
    shirt: '<path d="M8 5l4-2 4 2 3 2-2 3h-2v9H9V10H7L5 7l3-2z"/>',
    child: '<circle cx="12" cy="7" r="3"/><path d="M6 20c1.5-4 3.5-6 6-6s4.5 2 6 6"/>',
    chat: '<path d="M5 5h14v10H8l-3 3V5z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.2-3.2"/>',
    heart: '<path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20z"/>',
    compare: '<path d="M6 6h5v12H6zM13 10h5v8h-5z"/>',
    bag: '<path d="M6 8h12l-1 11H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    user: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20c1.4-3.4 3.8-5 7-5s5.6 1.6 7 5"/>',
    truck: '<path d="M3 7h11v10H3z"/><path d="M14 10h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z"/>',
    refresh: '<path d="M4 12a8 8 0 0 1 13.5-5.8M20 12a8 8 0 0 1-13.5 5.8"/><path d="M18 3v5h-5M6 21v-5h5"/>',
    tag: '<path d="M3 12l9-9h6v6l-9 9-6-6z"/><circle cx="16" cy="8" r="1.2"/>',
    star: '<path d="M12 3l2.4 5 5.6.8-4 4 1 5.6L12 16.5 6.9 18.4l1-5.6-4-4 5.6-.8L12 3z"/>',
    gift: '<rect x="4" y="9" width="16" height="11"/><path d="M12 9v11M4 13h16M12 9c-2-3-5-3-5-1s2 2 5 1c3 1 5 0 5-1s-3-2-5 1z"/>',
    check: '<path d="M5 12l5 5L19 7"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    map: '<path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z"/><path d="M9 4v14M15 6v14"/>',
    phone: '<path d="M7 3h3l1 4-2 1a12 12 0 0 0 5 5l1-2 4 1v3a2 2 0 0 1-2 2A14 14 0 0 1 5 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="6" width="18" height="12"/><path d="M3 7l9 7 9-7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    alert: '<path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4M12 16.5h.01"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };
  const d = paths[name] || paths.info;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${d}</svg>`;
};
