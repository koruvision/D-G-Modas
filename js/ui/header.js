import { icon } from "../utils.js";
import { favorites } from "../store/favorites.js";
import { compare } from "../store/compare.js";
import { openCart, updateBadges } from "./drawer-cart.js";
import { loadConfig } from "../services/checkout.js";

export async function mountShell() {
  const cfg = await loadConfig();
  const wa = `https://wa.me/${cfg.whatsapp}`;

  const header = document.getElementById("siteHeader");
  if (header) {
    header.innerHTML = `
      <div class="header__top">
        <p>${icon("zap")} Frete grátis acima de ${cfg.freeShippingMin.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · Cupom <strong>BEMVINDA5</strong></p>
      </div>
      <div class="header__main">
        <div class="header__side header__side--left">
          <button type="button" class="icon-btn header__mobile-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">${icon("menu")}</button>
          <a class="header__brand" href="index.html">
            <img src="assets/logo-header.png?v=4" alt="DG Modas" width="128" height="128" onerror="this.onerror=null;this.src='assets/logo-dg-modas.png?v=4'" />
            <span class="header__brand-text">DG Modas</span>
          </a>
        </div>
        <nav class="header__nav" id="navMenu" aria-label="Principal">
          <a class="nav-item" href="index.html">${icon("home")}<span>Home</span></a>
          <div class="nav-item nav-item--mega">
            <button type="button" class="nav-item__btn">${icon("grid")}<span>Coleção</span></button>
            <div class="mega-menu">
              <a href="catalogo.html?categoria=feminino">${icon("dress")}<span>Feminino</span></a>
              <a href="catalogo.html?categoria=masculino">${icon("shirt")}<span>Masculino</span></a>
              <a href="catalogo.html?categoria=infantil">${icon("child")}<span>Infantil</span></a>
              <a href="catalogo.html">${icon("spark")}<span>Ver tudo</span></a>
            </div>
          </div>
          <a class="nav-item" href="catalogo.html?availability=new">${icon("spark")}<span>Novidades</span></a>
          <a class="nav-item" href="catalogo.html?categoria=feminino">${icon("dress")}<span>Vestidos</span></a>
          <a class="nav-item" href="catalogo.html?categoria=masculino">${icon("shirt")}<span>Masculino</span></a>
          <a class="nav-item" href="index.html#sobre">${icon("info")}<span>Sobre</span></a>
          <a class="nav-item" href="${wa}" target="_blank" rel="noopener">${icon("chat")}<span>Contato</span></a>
        </nav>
        <div class="header__side header__side--right">
          <button type="button" class="icon-btn" data-open-search aria-label="Buscar">${icon("search")}</button>
          <a class="icon-btn" href="favoritos.html" aria-label="Favoritos">
            ${icon("heart")}
            <span class="badge-count" data-fav-count hidden>0</span>
          </a>
          <a class="icon-btn" href="comparar.html" aria-label="Comparar">
            ${icon("compare")}
            <span class="badge-count" data-compare-count hidden>0</span>
          </a>
          <button type="button" class="icon-btn" data-open-cart aria-label="Carrinho">
            ${icon("bag")}
            <span class="badge-count" data-cart-count hidden>0</span>
          </button>
        </div>
      </div>`;
  }

  const footer = document.getElementById("siteFooter");
  if (footer) {
    footer.innerHTML = `
      <div class="container footer__grid">
        <div class="footer__brand">
          <img src="assets/logo-header.png?v=4" alt="DG Modas" width="120" height="120" onerror="this.onerror=null;this.src='assets/logo-dg-modas.png?v=4'" />
          <p class="footer__tagline">Elegância que traduz sua essência. Moda feminina, masculina e infantil com acabamento premium e atendimento personalizado.</p>
        </div>
        <div class="footer__col">
          <h4>${icon("grid")} Loja</h4>
          <a href="catalogo.html">Catálogo</a>
          <a href="catalogo.html?categoria=feminino">Feminino</a>
          <a href="catalogo.html?categoria=masculino">Masculino</a>
          <a href="catalogo.html?categoria=infantil">Infantil</a>
          <a href="favoritos.html">Favoritos</a>
        </div>
        <div class="footer__col">
          <h4>${icon("chat")} Atendimento</h4>
          <a href="${wa}" target="_blank" rel="noopener">${icon("phone")} WhatsApp</a>
          <a href="${cfg.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a href="mailto:${cfg.email}">${icon("mail")} ${cfg.email}</a>
          <p>${icon("map")} ${cfg.address}<br/>${cfg.city}</p>
        </div>
        <div class="footer__col">
          <h4>${icon("shield")} Confiança</h4>
          <p>Compra assistida via WhatsApp</p>
          <p>Troca em até 7 dias</p>
          <p>Garantia de 90 dias</p>
          <a class="btn btn--gold btn--sm" href="${wa}" target="_blank" rel="noopener">Falar com especialista</a>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; <span id="year"></span> DG Modas. Todos os direitos reservados.</p>
      </div>`;
    const y = footer.querySelector("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  const float = document.getElementById("whatsappFloat");
  if (float) float.href = wa;

  document.querySelectorAll("[data-open-cart]").forEach((btn) => btn.addEventListener("click", openCart));

  const toggle = document.getElementById("navToggle");
  toggle?.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const onScroll = () => {
    header?.classList.toggle("is-solid", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  updateBadges();
  updateSideBadges();
}

export function updateSideBadges() {
  const fc = favorites.count();
  document.querySelectorAll("[data-fav-count]").forEach((el) => {
    el.textContent = String(fc);
    el.hidden = fc === 0;
  });
  const cc = compare.count();
  document.querySelectorAll("[data-compare-count]").forEach((el) => {
    el.textContent = String(cc);
    el.hidden = cc === 0;
  });
}
