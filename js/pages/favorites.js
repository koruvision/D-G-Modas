import { boot } from "../app.js";
import { favorites } from "../store/favorites.js";
import { loadProducts } from "../services/products.js";
import { productCardHtml } from "../ui/product-card.js";
import { icon } from "../utils.js";

function ensureSearchModal() {
  if (document.getElementById("searchModal")) return;
  const el = document.createElement("div");
  el.id = "searchModal";
  el.className = "search-modal";
  el.innerHTML = `
    <div class="search-modal__overlay" data-close-search></div>
    <div class="search-modal__panel">
      <form id="searchForm" class="search-modal__form">
        ${icon("search")}<input id="searchInput" type="search" placeholder="Buscar…" />
        <button type="button" class="icon-btn" data-close-search>${icon("close")}</button>
      </form>
      <div id="searchResults"></div>
    </div>`;
  document.body.appendChild(el);
}

async function init() {
  const ids = favorites.get();
  const all = await loadProducts();
  const list = ids.map((id) => all.find((p) => p.id === id)).filter(Boolean);
  const root = document.getElementById("favGrid");
  if (!root) return;
  if (!list.length) {
    root.innerHTML = `<div class="empty-state">${icon("heart")}<p>Nenhum favorito ainda</p><a class="btn btn--wine" href="catalogo.html">Explorar catálogo</a></div>`;
    return;
  }
  root.innerHTML = list.map(productCardHtml).join("");
}

ensureSearchModal();
boot(init);
