import { formatBRL, icon, productPrice, installments, stockLabel, totalStock } from "../utils.js";
import { favorites } from "../store/favorites.js";
import { compare } from "../store/compare.js";

export function productCardHtml(p) {
  const price = p.salePrice ?? p.price;
  const raw = p.variants[0]?.images[0] || "assets/logo-dg-modas.png";
  const img = `${raw}?v=img-2`;
  const fav = favorites.has(p.id);
  const cmp = compare.has(p.id);
  const badge =
    p.badge === "sale"
      ? `<span class="badge badge--sale">${icon("tag", "icon icon--badge")} Oferta</span>`
      : p.badge === "new"
        ? `<span class="badge badge--new">${icon("spark", "icon icon--badge")} Novo</span>`
        : p.badge === "bestseller"
          ? `<span class="badge badge--hot">${icon("star", "icon icon--badge")} Mais vendido</span>`
          : p.salePrice
            ? `<span class="badge badge--sale">${icon("zap", "icon icon--badge")} Promoção</span>`
            : "";

  return `
  <article class="product-card" data-product-id="${p.id}">
    <div class="product-card__media">
      <a href="produto.html?slug=${encodeURIComponent(p.slug)}">
        <img src="${img}" alt="${p.name}" loading="lazy" width="600" height="800" onerror="this.onerror=null;this.src='assets/logo-dg-modas.png'" />
      </a>
      ${badge}
      <div class="product-card__quick">
        <button type="button" class="icon-btn" data-fav="${p.id}" aria-label="Favoritar" aria-pressed="${fav}">${icon("heart")}</button>
        <button type="button" class="icon-btn" data-compare="${p.id}" aria-label="Comparar" aria-pressed="${cmp}">${icon("compare")}</button>
      </div>
    </div>
    <div class="product-card__body">
      <p class="product-card__cat">${p.category}</p>
      <h3><a href="produto.html?slug=${encodeURIComponent(p.slug)}">${p.name}</a></h3>
      <div class="product-card__price">
        ${p.salePrice ? `<span class="price-old">${formatBRL(p.price)}</span>` : ""}
        <span class="price">${formatBRL(price)}</span>
      </div>
      <p class="product-card__installment">${installments(price)}</p>
      <div class="product-card__swatches">
        ${p.variants
          .slice(0, 4)
          .map((v) => `<span class="swatch" style="--swatch:${v.hex}" title="${v.color}"></span>`)
          .join("")}
      </div>
      <a class="btn btn--wine btn--sm" href="produto.html?slug=${encodeURIComponent(p.slug)}">Quero este produto</a>
    </div>
  </article>`;
}

export function skeletonCards(n = 8) {
  return Array.from({ length: n })
    .map(
      () => `
    <div class="product-card skeleton-card">
      <div class="skeleton skeleton--media"></div>
      <div class="skeleton skeleton--line"></div>
      <div class="skeleton skeleton--line short"></div>
    </div>`
    )
    .join("");
}

export { productPrice, stockLabel, totalStock, formatBRL };
