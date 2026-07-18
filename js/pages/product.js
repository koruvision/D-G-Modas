import { boot } from "../app.js";
import { getProductBySlug, loadProducts } from "../services/products.js";
import { getParam, formatBRL, installments, icon, stockIcon, stockLabel, totalStock, productPrice, starsHtml } from "../utils.js";
import { cart } from "../store/cart.js";
import { toast } from "../ui/toast.js";
import { openCart } from "../ui/drawer-cart.js";
import { productCardHtml } from "../ui/product-card.js";
import { favorites } from "../store/favorites.js";
import { compare } from "../store/compare.js";

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
        <input id="searchInput" type="search" placeholder="Buscar…" autocomplete="off" />
        <button type="button" class="icon-btn" data-close-search>${icon("close")}</button>
      </form>
      <div id="searchResults" class="search-modal__results"></div>
    </div>`;
  document.body.appendChild(el);
}

async function initProduct() {
  const slug = getParam("slug");
  const root = document.getElementById("pdpRoot");
  if (!slug || !root) {
    if (root) root.innerHTML = `<div class="empty-state"><p>Produto não encontrado</p><a class="btn btn--wine" href="catalogo.html">Voltar ao catálogo</a></div>`;
    return;
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    root.innerHTML = `<div class="empty-state"><p>Produto não encontrado</p><a class="btn btn--wine" href="catalogo.html">Ver catálogo</a></div>`;
    return;
  }

  document.title = `${product.name} — DG Modas`;
  let variantIdx = 0;
  let size = Object.keys(product.variants[0].sizes).find((s) => product.variants[0].sizes[s] > 0) || Object.keys(product.variants[0].sizes)[0];
  let imgIdx = 0;
  const allProducts = await loadProducts();
  const related = product.related.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

  const render = () => {
    const variant = product.variants[variantIdx];
    const price = productPrice(product, variant);
    const qty = variant.sizes[size] || 0;
    const status = qty === 0 ? "unavailable" : variant.stockStatus;
    const images = variant.images;

    root.innerHTML = `
      <div class="pdp">
        <div class="pdp__gallery">
          <div class="pdp__main-img" id="zoomWrap">
            <img id="mainImg" src="${images[imgIdx]}?v=img-2" alt="${product.name}" onerror="this.onerror=null;this.src='assets/logo-dg-modas.png'" />
          </div>
          <div class="pdp__thumbs">
            ${images.map((src, i) => `<button type="button" class="pdp__thumb ${i === imgIdx ? "is-active" : ""}" data-img="${i}"><img src="${src}?v=img-2" alt="" onerror="this.onerror=null;this.src='assets/logo-dg-modas.png'" /></button>`).join("")}
          </div>
        </div>
        <div class="pdp__info">
          <p class="eyebrow">${icon("tag")} ${product.category} · ${variant.sku}</p>
          <h1>${product.name}</h1>
          <div class="pdp__rating">${starsHtml(5)} <span>${product.reviews.length} avaliações</span></div>
          <div class="pdp__price">
            ${product.salePrice ? `<span class="price-old">${formatBRL(product.price)}</span>` : ""}
            <span class="price">${formatBRL(price)}</span>
          </div>
          <p class="pdp__installment">${installments(price)}</p>
          <p class="pdp__stock stock stock--${status}">${icon(stockIcon(status))} ${stockLabel(status, totalStock(variant.sizes))}</p>
          <p class="pdp__desc">${product.description}</p>

          <div class="pdp__option">
            <span>Cor: <strong>${variant.color}</strong></span>
            <div class="swatch-row">
              ${product.variants
                .map(
                  (v, i) =>
                    `<button type="button" class="swatch swatch--btn ${i === variantIdx ? "is-active" : ""}" style="--swatch:${v.hex}" data-variant="${i}" title="${v.color}" aria-label="${v.color}"></button>`
                )
                .join("")}
            </div>
          </div>

          <div class="pdp__option">
            <span>Tamanho</span>
            <div class="size-row">
              ${Object.entries(variant.sizes)
                .map(
                  ([s, q]) =>
                    `<button type="button" class="size-btn ${s === size ? "is-active" : ""}" data-size="${s}" ${q === 0 ? "disabled" : ""}>${s}</button>`
                )
                .join("")}
            </div>
          </div>

          <div class="pdp__actions">
            <button type="button" class="btn btn--wine" id="addCart" ${status === "unavailable" ? "disabled" : ""}>${icon("bag")} Adicionar ao carrinho</button>
            <button type="button" class="btn btn--outline-gold" id="buyNow" ${status === "unavailable" ? "disabled" : ""}>Pedir agora</button>
            <button type="button" class="icon-btn" data-fav="${product.id}" aria-pressed="${favorites.has(product.id)}">${icon("heart")}</button>
            <button type="button" class="icon-btn" data-compare="${product.id}" aria-pressed="${compare.has(product.id)}">${icon("compare")}</button>
          </div>

          <ul class="pdp__benefits">
            ${product.benefits.map((b) => `<li>${icon("check")} ${b}</li>`).join("")}
          </ul>
          <p class="pdp__meta">${icon("truck")} Prazo estimado: ${product.deliveryDays[0]}–${product.deliveryDays[1]} dias · ${icon("shield")} ${product.guarantee}</p>
        </div>
      </div>

      <section class="pdp-section">
        <h2>${icon("info")} Descrição completa</h2>
        <p>${product.longDescription}</p>
      </section>

      <section class="pdp-section">
        <h2>${icon("grid")} Especificações</h2>
        <table class="specs-table">
          ${Object.entries(product.specs)
            .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
            .join("")}
          <tr><th>Dimensões</th><td>${product.dimensions}</td></tr>
          <tr><th>SKU</th><td>${variant.sku}</td></tr>
          <tr><th>Referência</th><td>${product.skuBase}</td></tr>
        </table>
      </section>

      <section class="pdp-section">
        <h2>${icon("star")} Avaliações</h2>
        <div class="reviews">
          ${product.reviews
            .map(
              (r) => `
            <article class="review-card">
              <div class="review-card__head">
                <strong>${r.name}</strong>
                ${r.verified ? `<span class="verified">${icon("check")} Verificado</span>` : ""}
                <span class="review-card__date">${r.date}</span>
              </div>
              <div class="stars">${starsHtml(r.rating)}</div>
              <p>${r.text}</p>
            </article>`
            )
            .join("")}
        </div>
      </section>

      <section class="pdp-section">
        <h2>${icon("chat")} Perguntas frequentes</h2>
        <div class="faq">
          ${product.faq
            .map(
              (f) => `
            <details>
              <summary>${icon("info")} ${f.q}</summary>
              <p>${f.a}</p>
            </details>`
            )
            .join("")}
        </div>
      </section>

      <section class="pdp-section">
        <h2>${icon("spark")} Quem comprou também gostou</h2>
        <div class="product-grid" id="relatedGrid">${related.map(productCardHtml).join("")}</div>
      </section>
    `;

    // zoom
    const wrap = root.querySelector("#zoomWrap");
    const mainImg = root.querySelector("#mainImg");
    wrap?.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
      mainImg.style.transform = "scale(1.6)";
    });
    wrap?.addEventListener("mouseleave", () => {
      mainImg.style.transform = "scale(1)";
    });

    root.querySelectorAll("[data-img]").forEach((btn) =>
      btn.addEventListener("click", () => {
        imgIdx = Number(btn.dataset.img);
        render();
      })
    );
    root.querySelectorAll("[data-variant]").forEach((btn) =>
      btn.addEventListener("click", () => {
        variantIdx = Number(btn.dataset.variant);
        imgIdx = 0;
        const v = product.variants[variantIdx];
        size = Object.keys(v.sizes).find((s) => v.sizes[s] > 0) || Object.keys(v.sizes)[0];
        render();
      })
    );
    root.querySelectorAll("[data-size]").forEach((btn) =>
      btn.addEventListener("click", () => {
        size = btn.dataset.size;
        render();
      })
    );

    const add = async (open) => {
      const v = product.variants[variantIdx];
      if (!v.sizes[size]) {
        toast("Tamanho indisponível", "error");
        return;
      }
      cart.add({
        productId: product.id,
        variantId: v.id,
        name: product.name,
        color: v.color,
        size,
        sku: v.sku,
        price,
        image: v.images[0],
        qty: 1,
      });
      toast("Adicionado ao carrinho", "success");
      if (open) await openCart();
    };

    root.querySelector("#addCart")?.addEventListener("click", () => add(true));
    root.querySelector("#buyNow")?.addEventListener("click", async () => {
      await add(false);
      window.location.href = "checkout.html";
    });
  };

  render();
}

ensureSearchModal();
boot(initProduct);
