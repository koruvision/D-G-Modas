import { boot } from "../app.js";
import { loadProducts, filterProducts, uniqueColors, uniqueSizes } from "../services/products.js";
import { productCardHtml, skeletonCards } from "../ui/product-card.js";
import { getParam, icon } from "../utils.js";

function ensureSearchModal() {
  if (document.getElementById("searchModal")) return;
  const el = document.createElement("div");
  el.id = "searchModal";
  el.className = "search-modal";
  el.innerHTML = `
    <div class="search-modal__overlay" data-close-search></div>
    <div class="search-modal__panel" role="dialog" aria-label="Busca">
      <form id="searchForm" class="search-modal__form">
        ${icon("search")}
        <input id="searchInput" type="search" placeholder="Buscar produtos…" autocomplete="off" />
        <button type="button" class="icon-btn" data-close-search aria-label="Fechar">${icon("close")}</button>
      </form>
      <div id="searchResults" class="search-modal__results"></div>
    </div>`;
  document.body.appendChild(el);
}

async function initCatalog() {
  const grid = document.getElementById("catalogGrid");
  const countEl = document.getElementById("catalogCount");
  if (grid) grid.innerHTML = skeletonCards(8);

  const products = await loadProducts();
  const filters = {
    category: getParam("categoria") || "all",
    q: getParam("q") || "",
    color: "",
    size: "",
    availability: getParam("availability") || "",
    minPrice: null,
    maxPrice: null,
    sort: "popular",
  };

  const colorSel = document.getElementById("filterColor");
  const sizeSel = document.getElementById("filterSize");
  uniqueColors(products).forEach(({ color, hex }) => {
    const opt = document.createElement("option");
    opt.value = color;
    opt.textContent = color;
    opt.style.background = hex;
    colorSel?.appendChild(opt);
  });
  uniqueSizes(products).forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    sizeSel?.appendChild(opt);
  });

  if (filters.category !== "all") {
    const catSel = document.getElementById("filterCategory");
    if (catSel) catSel.value = filters.category;
  }
  if (filters.q) {
    const qInput = document.getElementById("filterQ");
    if (qInput) qInput.value = filters.q;
  }
  if (filters.availability) {
    const a = document.getElementById("filterAvail");
    if (a) a.value = filters.availability;
  }

  const render = () => {
    const list = filterProducts(products, filters);
    if (countEl) countEl.textContent = `${list.length} produto${list.length !== 1 ? "s" : ""}`;
    if (grid) {
      grid.innerHTML = list.length
        ? list.map(productCardHtml).join("")
        : `<div class="empty-state">${icon("search")}<p>Nenhum produto com esses filtros</p><button type="button" class="btn btn--wine" id="clearFilters">Limpar filtros</button></div>`;
      grid.querySelector("#clearFilters")?.addEventListener("click", () => {
        filters.category = "all";
        filters.q = "";
        filters.color = "";
        filters.size = "";
        filters.availability = "";
        filters.minPrice = null;
        filters.maxPrice = null;
        document.getElementById("filterCategory").value = "all";
        document.getElementById("filterQ").value = "";
        document.getElementById("filterColor").value = "";
        document.getElementById("filterSize").value = "";
        document.getElementById("filterAvail").value = "";
        document.getElementById("filterMin").value = "";
        document.getElementById("filterMax").value = "";
        render();
      });
    }
  };

  const bind = (id, key, transform = (v) => v) => {
    document.getElementById(id)?.addEventListener("change", (e) => {
      filters[key] = transform(e.target.value);
      render();
    });
    document.getElementById(id)?.addEventListener("input", (e) => {
      if (id === "filterQ" || id === "filterMin" || id === "filterMax") {
        filters[key] = transform(e.target.value);
        render();
      }
    });
  };

  bind("filterCategory", "category");
  bind("filterQ", "q");
  bind("filterColor", "color");
  bind("filterSize", "size");
  bind("filterAvail", "availability");
  bind("filterSort", "sort");
  bind("filterMin", "minPrice", (v) => (v === "" ? null : Number(v)));
  bind("filterMax", "maxPrice", (v) => (v === "" ? null : Number(v)));

  render();
}

ensureSearchModal();
boot(initCatalog);
