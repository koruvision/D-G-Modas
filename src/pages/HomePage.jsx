import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon.jsx";
import { ProductCarousel } from "../components/ProductCarousel.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useConfig } from "../hooks/useConfig.js";
import { formatBRL, assetUrl } from "../lib/utils.js";

const HERO_SLIDES = [
  {
    eyebrow: "Coleção Atelier",
    title: "Elegância que",
    script: "traduz sua essência",
    price: null,
    offer: "Peças exclusivas em alfaiataria leve e caimento perfeito",
    image: assetUrl("assets/banner-hero-1.webp"),
    href: "/catalogo?categoria=feminino",
  },
  {
    eyebrow: "Nova Temporada",
    title: "Estilo que",
    script: "veste confiança",
    price: null,
    offer: "Camisaria masculina premium com acabamento impecável",
    image: assetUrl("assets/banner-hero-2.webp"),
    href: "/catalogo?categoria=masculino",
  },
  {
    eyebrow: "Oferta Especial",
    title: "Promoções com",
    script: "até 30% off",
    price: null,
    offer: "Aproveite peças selecionadas por tempo limitado",
    image: assetUrl("assets/banner-hero-3.webp"),
    href: "/catalogo?availability=sale",
  },
];

const FEATURES = [
  {
    icon: "shield",
    title: "Compra Segura",
    text: "Atendimento assistido via WhatsApp do início ao fim, sem burocracia.",
    bg: assetUrl("assets/trust-compra-segura.webp"),
  },
  {
    icon: "truck",
    title: "Entrega Rápida",
    text: "Envio para todo o Brasil com prazos claros e rastreio completo.",
    bg: assetUrl("assets/trust-entrega-rapida.webp"),
  },
  {
    icon: "refresh",
    title: "Troca Facilitada",
    text: "Até 7 dias para trocar sem complicação, com etiquetas originais.",
    bg: assetUrl("assets/trust-troca-facilitada.webp"),
  },
  {
    icon: "chat",
    title: "Atendimento VIP",
    text: "Consultoria de estilo personalizada para cada cliente DG Modas.",
    bg: assetUrl("assets/trust-atendimento-vip.webp"),
  },
];

const TESTIMONIALS = [
  {
    name: "Ana Clara",
    text: "Peças impecáveis, tecido premium e caimento perfeito. Já é minha loja de confiança.",
    avatar: assetUrl("assets/review-ana-clara.webp"),
  },
  {
    name: "Mariana Lopes",
    text: "Atendimento pelo WhatsApp super atencioso, me ajudaram a escolher o tamanho ideal.",
    avatar: assetUrl("assets/review-mariana-lopes.webp"),
  },
  {
    name: "Rafael Souza",
    text: "Camisaria de altíssima qualidade e entrega rápida. Recomendo demais a DG Modas.",
    avatar: assetUrl("assets/review-rafael-souza.webp"),
  },
];

const CATEGORIES = [
  { key: "feminino", title: "Feminino", desc: "Vestidos, conjuntos e alfaiataria leve", image: assetUrl("assets/cat-feminino.webp") },
  { key: "masculino", title: "Masculino", desc: "Camisaria premium e polos exclusivas", image: assetUrl("assets/cat-masculino.webp") },
  { key: "infantil", title: "Infantil", desc: "Conforto e estilo para os pequenos", image: assetUrl("assets/cat-infantil.webp") },
];

function useHeroCarousel(length) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const rootRef = useRef(null);

  const goTo = (i) => setIndex(((i % length) + length) % length);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || length < 2) return;
    const start = () => {
      stop();
      timerRef.current = setInterval(() => setIndex((i) => (i + 1) % length), 5600);
    };
    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // Atrasa o autoplay para não causar CLS durante a medição de LCP
    const boot = window.setTimeout(start, 7000);
    const root = rootRef.current;
    root?.addEventListener("mouseenter", stop);
    root?.addEventListener("mouseleave", start);
    return () => {
      window.clearTimeout(boot);
      stop();
      root?.removeEventListener("mouseenter", stop);
      root?.removeEventListener("mouseleave", start);
    };
  }, [length]);

  return { index, goTo, rootRef };
}

export function HomePage() {
  const { products } = useProducts();
  const cfg = useConfig();
  const hero = useHeroCarousel(HERO_SLIDES.length);

  const bestsellers = useMemo(() => {
    const list = products.filter((p) => p.badge === "bestseller" || p.popular);
    return (list.length >= 4 ? list : products).slice(0, 12);
  }, [products]);

  const news = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const p of products.filter((x) => x.badge === "new").concat(products.filter((x) => x.category === "feminino"))) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      list.push(p);
      if (list.length >= 12) break;
    }
    return list.length >= 4 ? list : products.slice(0, 12);
  }, [products]);

  const sale = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const p of products.filter((x) => x.salePrice || x.badge === "sale").concat(products)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      list.push(p);
      if (list.length >= 10) break;
    }
    return list.length >= 4 ? list : products.slice(5, 15);
  }, [products]);

  const catCount = (cat) => products.filter((p) => p.category === cat).length;

  const stats = cfg?.stats || {};
  const plusKeys = new Set(["customers", "orders", "reviews"]);
  const statList = [
    { key: "customers", label: "Clientes atendidas", icon: "user" },
    { key: "orders", label: "Pedidos entregues", icon: "truck" },
    { key: "rating", label: "Avaliação média", icon: "star" },
    { key: "reviews", label: "Avaliações", icon: "chat" },
  ];

  const wa = cfg ? `https://wa.me/${cfg.whatsapp}` : "#";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const content = hero.rootRef.current?.querySelector(".hero-banner.is-active .hero-banner__content");
    if (!content) return undefined;
    if (hero.index === 0 && !content.dataset.heroCycled) {
      content.dataset.heroCycled = "1";
      return undefined;
    }
    content.dataset.heroCycled = "1";
    let cancelled = false;
    let tween = null;
    import("../lib/gsapSetup.js").then(({ gsap }) => {
      if (cancelled) return;
      tween = gsap.fromTo(
        content.children,
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.09, ease: "power3.out" }
      );
    });
    return () => {
      cancelled = true;
      tween?.kill?.();
      [...content.children].forEach((el) => {
        el.style.opacity = "";
        el.style.visibility = "";
        el.style.transform = "";
      });
    };
  }, [hero.index]);

  return (
    <>
      {/* HERO */}
      <div className="hero-banners" id="topo" ref={hero.rootRef}>
        <div className="hero-banners__track">
          {HERO_SLIDES.map((slide, i) => (
            <div key={slide.href} className={`hero-banner ${i === hero.index ? "is-active" : ""}`}>
              {(i === hero.index || i === 0) && (
                <img
                  src={slide.image}
                  alt=""
                  width="1600"
                  height="900"
                  decoding="async"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "low"}
                />
              )}
              <div className="hero-banner__veil" />
              <div className="hero-banner__content">
                <p className="hero-banner__eyebrow">
                  <Icon name="spark" className="icon icon--eyebrow" />
                  {slide.eyebrow}
                </p>
                {i === 0 ? (
                  <h1>
                    {slide.title} <span className="script">{slide.script}</span>
                  </h1>
                ) : (
                  <h2>
                    {slide.title} <span className="script">{slide.script}</span>
                  </h2>
                )}
                <p className="hero-banner__offer">{slide.offer}</p>
                <div className="hero-banner__actions">
                  <Link className="btn btn--gold" to={slide.href}>
                    Ver coleção
                  </Link>
                  <a className="btn btn--outline-gold" href={wa} target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="hero-banners__nav hero-banners__nav--prev"
          aria-label="Banner anterior"
          onClick={() => hero.goTo(hero.index - 1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="hero-banners__nav hero-banners__nav--next"
          aria-label="Próximo banner"
          onClick={() => hero.goTo(hero.index + 1)}
        >
          ›
        </button>
        <div className="hero-banners__dots">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.href}
              type="button"
              aria-label={`Banner ${i + 1}`}
              className={i === hero.index ? "is-active" : ""}
              onClick={() => hero.goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section section--off-white">
        <div className="container">
          <div className="section-head reveal-lux">
            <div className="section-label">
              <Icon name="grid" /> Coleção
            </div>
            <h2>
              Compre por <span className="script">categoria</span>
            </h2>
            <div className="gold-rule" />
          </div>
          <div className="cat-grid reveal-stagger">
            {CATEGORIES.map((cat) => (
              <Link key={cat.key} to={`/catalogo?categoria=${cat.key}`} className="cat-card">
                <img src={cat.image} alt={cat.title} width="800" height="1000" loading="lazy" decoding="async" />
                <div className="cat-card__body">
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                  <span className="btn btn--outline-gold btn--sm">{catCount(cat.key)} peças</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="section section--angled">
        <div className="container">
          <div className="section-head reveal-lux">
            <div className="section-label">
              <Icon name="star" /> Favoritos das clientes
            </div>
            <h2>
              Mais <span className="script">vendidos</span>
            </h2>
            <div className="gold-rule" />
          </div>
          <ProductCarousel products={bestsellers} />
        </div>
      </section>

      {/* STATS */}
      <section className="section section--wine section--stats">
        <div className="container">
          <div className="stats-row reveal-stagger">
            {statList.map((s) => {
              const raw = stats[s.key];
              if (raw == null) return null;
              const formatted = Number(raw).toLocaleString("pt-BR");
              return (
                <div key={s.key} className="stat">
                  <span className="stat__icon" aria-hidden="true">
                    <Icon name={s.icon} />
                  </span>
                  <strong>{plusKeys.has(s.key) ? `+${formatted}` : formatted}</strong>
                  <span className="stat__label">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="section section--mesh">
        <div className="container">
          <div className="section-head reveal-lux">
            <div className="section-label">
              <Icon name="spark" /> Recém-chegados
            </div>
            <h2>
              Novidades <span className="script">da semana</span>
            </h2>
            <div className="gold-rule" />
          </div>
          <ProductCarousel products={news} />
        </div>
      </section>

      {/* SOBRE */}
      <section className="section section--soft" id="sobre">
        <div className="container about-grid">
          <img
            src={assetUrl("assets/sobre-loja.webp")}
            alt="Ateliê DG Modas"
            className="reveal-lux"
            width="900"
            height="1100"
            loading="lazy"
            decoding="async"
          />
          <div className="reveal-lux">
            <div className="section-label">
              <Icon name="info" /> Nossa história
            </div>
            <h2>
              Moda com <span className="script">alma e essência</span>
            </h2>
            <p>
              A DG Modas nasceu do desejo de vestir histórias com elegância. Selecionamos cada peça com critério de
              caimento, tecido e acabamento — para que você se sinta confiante em qualquer ocasião, do dia a dia aos
              momentos mais especiais.
            </p>
            <p>
              Atendimento personalizado via WhatsApp, curadoria feminina, masculina e infantil, e um compromisso com
              a qualidade que atravessa cada detalhe da confecção.
            </p>
            <div className="section-cta-row" style={{ justifyContent: "flex-start" }}>
              <Link className="btn btn--wine" to="/catalogo">
                Explorar catálogo
              </Link>
              <a className="btn btn--ghost" href={wa} target="_blank" rel="noopener noreferrer">
                Falar com a equipe
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section section--features">
        <div className="container">
          <div className="section-head reveal-lux">
            <div className="section-label">
              <Icon name="shield" /> Por que escolher a DG Modas
            </div>
            <h2>
              Experiência <span className="script">premium</span>
            </h2>
            <div className="gold-rule" />
          </div>
          <div className="features-grid reveal-stagger">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="feature-card"
                style={{ "--feature-bg": `url(${f.bg})` }}
              >
                <div className="feature-card__overlay" />
                <div className="feature-card__content">
                  <span className="feature-card__icon">
                    <Icon name={f.icon} />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SALE */}
      <section className="section section--angled">
        <div className="container">
          <div className="section-head reveal-lux">
            <div className="section-label">
              <Icon name="zap" /> Por tempo limitado
            </div>
            <h2>
              Promoções <span className="script">selecionadas</span>
            </h2>
            <div className="gold-rule" />
          </div>
          <ProductCarousel products={sale} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section--mesh">
        <div className="container">
          <div className="section-head reveal-lux">
            <div className="section-label">
              <Icon name="chat" /> Depoimentos
            </div>
            <h2>
              O que dizem <span className="script">nossas clientes</span>
            </h2>
            <div className="gold-rule" />
          </div>
          <div className="quotes reveal-stagger">
            {TESTIMONIALS.map((t) => (
              <article key={t.name} className="quote-card">
                <div className="stars">★★★★★</div>
                <p>“{t.text}”</p>
                <div className="quote-card__author">
                  <img src={t.avatar} alt={t.name} width="64" height="64" loading="lazy" decoding="async" />
                  <h3>{t.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band" style={{ "--cta-bg": `url(${assetUrl("assets/hero-loja-sm.webp")})` }}>
        <div className="cta-band__overlay" />
        <div className="container cta-band__content reveal-lux">
          <div className="section-label">
            <Icon name="spark" /> Não perca
          </div>
          <h2>
            Vista sua <span className="script">melhor versão</span>
          </h2>
          <p>
            Cupom <strong>BEMVINDA5</strong> para novas clientes, frete grátis acima de{" "}
            {cfg ? formatBRL(cfg.freeShippingMin) : "—"} e pagamento via Pix, cartão ou boleto pelo
            WhatsApp.
          </p>
          <div className="cta-band__actions">
            <Link className="btn btn--gold" to="/catalogo">
              Ver catálogo completo
            </Link>
            <a className="btn btn--white" href={wa} target="_blank" rel="noopener noreferrer">
              <Icon name="chat" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
