import { boot } from "../app.js";
import { compare } from "../store/compare.js";
import { loadProducts } from "../services/products.js";
import { formatBRL, icon } from "../utils.js";

function ensureSearchModal() {
  if (document.getElementById("searchModal")) return;
  const el = document.createElement("div");
  el.id = "searchModal";
  el.className = "search-modal";
  el.innerHTML = `
    <div class="search-modal__overlay" data-close-search></div>
    <div class="search-modal__panel">
      <form id="searchForm" class="search-modal__form">
        ${icon("search")}<input id="searchInput" type="search" />
        <button type="button" class="icon-btn" data-close-search>${icon("close")}</button>
      </form>
      <div id="searchResults"></div>
    </div>`;
  document.body.appendChild(el);
}

async function init() {
  const ids = compare.get();
  const all = await loadProducts();
  const list = ids.map((id) => all.find((p) => p.id === id)).filter(Boolean);
  const root = document.getElementById("compareRoot");
  if (!root) return;

  if (list.length < 2) {
    root.innerHTML = `<div class="empty-state">${icon("compare")}<p>Selecione ao menos 2 produtos para comparar</p><a class="btn btn--wine" href="catalogo.html">Ir ao catálogo</a></div>`;
    return;
  }

  const rows = [
    { label: "Produto", fn: (p) => `<img src="${p.variants[0].images[0]}" alt="" /><strong>${p.name}</strong>` },
    { label: "Preço", fn: (p) => formatBRL(p.salePrice ?? p.price) },
    { label: "Categoria", fn: (p) => p.category },
    { label: "Material", fn: (p) => p.specs.material || "—" },
    { label: "Cuidados", fn: (p) => p.specs.cuidado || "—" },
    { label: "Dimensões", fn: (p) => p.dimensions },
    { label: "Benefícios", fn: (p) => p.benefits.join(", ") },
    { label: "Diferenciais", fn: (p) => (p.features || []).join(", ") || "—" },
    { label: "Garantia", fn: (p) => p.guarantee },
    {
      label: "",
      fn: (p) =>
        `<a class="btn btn--wine btn--sm" href="produto.html?slug=${encodeURIComponent(p.slug)}">Ver produto</a>
         <button type="button" class="btn btn--ghost btn--sm" data-remove-cmp="${p.id}">Remover</button>`,
    },
  ];

  root.innerHTML = `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <tbody>
          ${rows
            .map(
              (r) =>
                `<tr><th>${r.label}</th>${list.map((p) => `<td>${r.fn(p)}</td>`).join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <button type="button" class="btn btn--ghost" id="clearCompare">Limpar comparação</button>`;

  root.querySelectorAll("[data-remove-cmp]").forEach((btn) =>
    btn.addEventListener("click", () => {
      compare.toggle(btn.dataset.removeCmp);
      init();
    })
  );
  root.querySelector("#clearCompare")?.addEventListener("click", () => {
    compare.clear();
    init();
  });
}

ensureSearchModal();
boot(init);
