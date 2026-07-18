import { boot } from "../app.js";
import { loadProducts } from "../services/products.js";
import { productCardHtml } from "../ui/product-card.js";
import { icon } from "../utils.js";
import { loadConfig } from "../services/checkout.js";

async function initHome() {
  const products = await loadProducts();
  const cfg = await loadConfig();

  const bestsellers = products.filter((p) => p.badge === "bestseller" || p.popular);
  const news = products.filter((p) => p.badge === "new").concat(products.filter((p) => p.category === "feminino")).slice(0, 12);
  const sale = products.filter((p) => p.salePrice || p.badge === "sale").concat(products).slice(0, 10);
  const bestList = (bestsellers.length >= 4 ? bestsellers : products).slice(0, 12);

  mountProductCarousel("homeBestsellers", bestList);
  mountProductCarousel("homeNews", news.length >= 4 ? news : products.slice(0, 12));
  mountProductCarousel("homeSale", sale.length >= 4 ? sale : products.slice(5, 15));

  const plusKeys = new Set(["customers", "orders", "reviews"]);
  document.querySelectorAll("[data-stat]").forEach((el) => {
    const key = el.dataset.stat;
    if (cfg.stats[key] == null) return;
    const formatted = Number(cfg.stats[key]).toLocaleString("pt-BR");
    const withPlus = plusKeys.has(key) && el.closest(".stats-row");
    el.textContent = withPlus ? `+${formatted}` : formatted;
  });

  const wa = `https://wa.me/${cfg.whatsapp}`;
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = wa;
  });

  ["feminino", "masculino", "infantil"].forEach((cat) => {
    const el = document.querySelector(`[data-cat-count="${cat}"]`);
    if (el) el.textContent = `${products.filter((p) => p.category === cat).length} peças`;
  });

  initHeroBannerCarousel();
  initHomeAnimations();
}

function initHeroBannerCarousel() {
  const slides = [...document.querySelectorAll("[data-hero-slide]")];
  const dotsRoot = document.getElementById("heroDots");
  const prev = document.getElementById("heroPrev");
  const next = document.getElementById("heroNext");
  const root = document.getElementById("topo");
  if (slides.length < 2) return;

  let index = 0;
  let timer = null;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (dotsRoot) {
    dotsRoot.innerHTML = slides
      .map((_, i) => `<button type="button" aria-label="Banner ${i + 1}" data-dot="${i}"></button>`)
      .join("");
  }

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
    dotsRoot?.querySelectorAll("button").forEach((b, n) => b.classList.toggle("is-active", n === index));
  };

  const start = () => {
    if (reduce) return;
    stop();
    timer = setInterval(() => go(index + 1), 4800);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  prev?.addEventListener("click", () => {
    go(index - 1);
    start();
  });
  next?.addEventListener("click", () => {
    go(index + 1);
    start();
  });
  dotsRoot?.querySelectorAll("[data-dot]").forEach((btn) => {
    btn.addEventListener("click", () => {
      go(Number(btn.dataset.dot));
      start();
    });
  });

  root?.addEventListener("mouseenter", stop);
  root?.addEventListener("mouseleave", start);

  go(0);
  start();
}

function mountProductCarousel(id, list) {
  const root = document.getElementById(id);
  if (!root || !list.length) return;

  const cards = list.map(productCardHtml).join("");
  root.innerHTML = `
    <button type="button" class="product-carousel__nav product-carousel__nav--prev" aria-label="Anterior">${icon("chevron")}</button>
    <div class="product-carousel__viewport">
      <div class="product-carousel__track">
        ${cards}
        ${cards}
      </div>
    </div>
    <button type="button" class="product-carousel__nav product-carousel__nav--next" aria-label="Próximo">${icon("chevron")}</button>
  `;

  initInfiniteCarousel(root);
}

function initInfiniteCarousel(root) {
  const track = root.querySelector(".product-carousel__track");
  const viewport = root.querySelector(".product-carousel__viewport");
  const prev = root.querySelector(".product-carousel__nav--prev");
  const next = root.querySelector(".product-carousel__nav--next");
  if (!track || !viewport) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;
  let locked = false;

  const stepWidth = () => {
    const card = track.querySelector(".product-card");
    if (!card) return 280;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "20") || 20;
    return card.getBoundingClientRect().width + gap;
  };

  const halfCount = () => Math.floor(track.children.length / 2);

  const goTo = (i, animate = true) => {
    index = i;
    track.style.transition = animate ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    track.style.transform = `translate3d(${-index * stepWidth()}px, 0, 0)`;
  };

  const advance = (dir = 1) => {
    if (locked) return;
    locked = true;
    goTo(index + dir, true);
  };

  track.addEventListener("transitionend", () => {
    const half = halfCount();
    if (index >= half) {
      goTo(index - half, false);
    } else if (index < 0) {
      goTo(index + half, false);
    }
    locked = false;
  });

  const start = () => {
    if (reduce) return;
    stop();
    timer = setInterval(() => advance(1), 3200);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  prev?.addEventListener("click", () => {
    advance(-1);
    start();
  });
  next?.addEventListener("click", () => {
    advance(1);
    start();
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  window.addEventListener(
    "resize",
    () => {
      goTo(index, false);
    },
    { passive: true }
  );

  goTo(0, false);
  start();
}

function initHomeAnimations() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal-lux");

  const showAll = () => {
    reveals.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  };

  if (typeof window.gsap === "undefined" || reduce) {
    showAll();
    return;
  }

  if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

  const active = document.querySelector(".hero-banner.is-active .hero-banner__content");
  if (active) {
    window.gsap.fromTo(
      active.children,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.15 }
    );
  }

  reveals.forEach((el) => {
    window.gsap.fromTo(
      el,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      }
    );
  });

  // Fallback: never leave sections invisible
  window.setTimeout(() => {
    reveals.forEach((el) => {
      if (getComputedStyle(el).opacity === "0") {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }, 1200);
}

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
        <input id="searchInput" type="search" placeholder="Buscar produtos, categorias…" autocomplete="off" />
        <button type="button" class="icon-btn" data-close-search aria-label="Fechar">${icon("close")}</button>
      </form>
      <div id="searchResults" class="search-modal__results"></div>
    </div>`;
  document.body.appendChild(el);
}

ensureSearchModal();
boot(initHome);
