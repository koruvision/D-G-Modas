import { icon, debounce } from "../utils.js";
import { loadProducts, filterProducts } from "../services/products.js";
import { searchHistory } from "../store/search.js";
import { formatBRL } from "../utils.js";

export async function initSearch() {
  const modal = document.getElementById("searchModal");
  if (!modal) return;

  const openBtns = document.querySelectorAll("[data-open-search]");
  const input = modal.querySelector("#searchInput");
  const results = modal.querySelector("#searchResults");
  const products = await loadProducts();
  const popular = products.filter((p) => p.popular).slice(0, 4);

  const render = (list, title) => {
    if (!list.length) {
      results.innerHTML = `<div class="empty-state"><p>Nenhum produto encontrado</p></div>`;
      return;
    }
    results.innerHTML = `
      <p class="search-title">${title}</p>
      <ul class="search-list">
        ${list
          .map((p) => {
            const img = p.variants[0]?.images[0];
            const price = p.salePrice ?? p.price;
            return `<li>
              <a href="produto.html?slug=${encodeURIComponent(p.slug)}">
                <img src="${img}" alt="" width="48" height="64" />
                <span>
                  <strong>${p.name}</strong>
                  <small>${formatBRL(price)}</small>
                </span>
              </a>
            </li>`;
          })
          .join("")}
      </ul>`;
  };

  const showDefault = () => {
    const hist = searchHistory.get();
    results.innerHTML = `
      ${
        hist.length
          ? `<p class="search-title">Histórico</p>
        <div class="chip-row">${hist.map((h) => `<button type="button" class="chip" data-hist="${h}">${h}</button>`).join("")}</div>`
          : ""
      }
      <p class="search-title">Populares</p>
      <ul class="search-list">
        ${popular
          .map(
            (p) => `<li><a href="produto.html?slug=${encodeURIComponent(p.slug)}"><img src="${p.variants[0].images[0]}" alt="" width="48" height="64" /><span><strong>${p.name}</strong><small>${formatBRL(p.salePrice ?? p.price)}</small></span></a></li>`
          )
          .join("")}
      </ul>`;
    results.querySelectorAll("[data-hist]").forEach((btn) => {
      btn.addEventListener("click", () => {
        input.value = btn.dataset.hist;
        input.dispatchEvent(new Event("input"));
      });
    });
  };

  const onInput = debounce(() => {
    const q = input.value.trim();
    if (!q) {
      showDefault();
      return;
    }
    const list = filterProducts(products, { q }).slice(0, 8);
    render(list, "Sugestões");
  }, 180);

  openBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      modal.classList.add("is-open");
      document.body.classList.add("modal-open");
      showDefault();
      setTimeout(() => input.focus(), 50);
    })
  );

  modal.querySelectorAll("[data-close-search]").forEach((el) =>
    el.addEventListener("click", () => {
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
    })
  );

  input?.addEventListener("input", onInput);
  modal.querySelector("#searchForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    searchHistory.add(q);
    window.location.href = `catalogo.html?q=${encodeURIComponent(q)}`;
  });
}

export { icon };
