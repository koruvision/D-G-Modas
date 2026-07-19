import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "../components/Icon.jsx";
import { useUi } from "../hooks/useUi.jsx";
import { useCart } from "../hooks/useCart.jsx";
import { useConfig } from "../hooks/useConfig.js";
import { formatBRL, assetUrl } from "../lib/utils.js";

export function Header() {
  const cfg = useConfig();
  const ui = useUi();
  const { count } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [isSolid, setIsSolid] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);

  const promoMessages = useMemo(() => {
    const freeMin = cfg ? formatBRL(cfg.freeShippingMin) : "R$ 299,00";
    const installments = cfg?.installments ?? 3;
    return [
      {
        icon: "truck",
        node: (
          <>
            Frete grátis acima de {freeMin} · Cupom <strong>BEMVINDA5</strong>
          </>
        ),
      },
      {
        icon: "gift",
        node: (
          <>
            Frete grátis na <strong>primeira compra</strong>
          </>
        ),
      },
      {
        icon: "tag",
        node: (
          <>
            Cupons · <strong>BEMVINDA5</strong> · DESCONTO10
          </>
        ),
      },
      {
        icon: "card",
        node: (
          <>
            Pix, cartão e boleto · até <strong>{installments}x</strong>
          </>
        ),
      },
      {
        icon: "refresh",
        node: <>Troca em até 7 dias</>,
      },
    ];
  }, [cfg]);

  useEffect(() => {
    const onScroll = () => setIsSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (promoMessages.length < 2) return undefined;
    const id = window.setInterval(() => {
      setPromoIndex((i) => (i + 1) % promoMessages.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [promoMessages.length]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);
    if (!isOpen) setMegaOpen(false);
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const wa = cfg ? `https://wa.me/${cfg.whatsapp}` : "#";
  const currentPromo = promoMessages[promoIndex] || promoMessages[0];

  return (
    <header className={`site-header ${isSolid ? "is-solid" : ""} ${isOpen ? "is-open" : ""}`.trim()}>
      <div className="header__top" aria-live="polite">
        <p key={promoIndex} className="header__top-msg">
          <Icon name={currentPromo.icon} />
          {currentPromo.node}
        </p>
      </div>
      <div className="header__main">
        <div className="header__side header__side--left">
          <button
            type="button"
            className="icon-btn header__mobile-toggle"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            <Icon name={isOpen ? "close" : "menu"} />
          </button>
          <Link className="header__brand" to="/" onClick={closeMenu}>
            <span className="brand-logo">
              <img
                src={assetUrl("assets/logo-header-sm.webp")}
                alt="DG Modas"
                width="52"
                height="52"
                decoding="async"
                fetchPriority="high"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = assetUrl("assets/logo-dg-modas-sm.webp");
                }}
              />
            </span>
            <span className="header__brand-text">DG Modas</span>
          </Link>
        </div>

        <div
          className={`header__nav-shell ${isOpen ? "is-open" : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMenu();
          }}
        >
          <nav className="header__nav" aria-label="Principal">
            <NavLink className="nav-item" to="/" onClick={closeMenu} end>
              <Icon name="home" />
              <span>Home</span>
            </NavLink>
            <div className={`nav-item nav-item--mega ${megaOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="nav-item__btn"
                aria-expanded={megaOpen}
                onClick={() => setMegaOpen((v) => !v)}
              >
                <Icon name="grid" />
                <span>Coleção</span>
              </button>
              <div className="mega-menu">
                <Link to="/catalogo?categoria=feminino" onClick={closeMenu}>
                  <Icon name="dress" />
                  <span>Feminino</span>
                </Link>
                <Link to="/catalogo?categoria=masculino" onClick={closeMenu}>
                  <Icon name="shirt" />
                  <span>Masculino</span>
                </Link>
                <Link to="/catalogo?categoria=infantil" onClick={closeMenu}>
                  <Icon name="child" />
                  <span>Infantil</span>
                </Link>
                <Link to="/catalogo" onClick={closeMenu}>
                  <Icon name="spark" />
                  <span>Ver tudo</span>
                </Link>
              </div>
            </div>
            <Link className="nav-item" to="/catalogo?availability=new" onClick={closeMenu}>
              <Icon name="spark" />
              <span>Novidades</span>
            </Link>
            <Link className="nav-item nav-item--desktop-only" to="/catalogo?categoria=feminino" onClick={closeMenu}>
              <Icon name="dress" />
              <span>Vestidos</span>
            </Link>
            <Link className="nav-item" to="/favoritos" onClick={closeMenu}>
              <Icon name="heart" />
              <span>Favoritos</span>
            </Link>
            <Link className="nav-item" to="/comparar" onClick={closeMenu}>
              <Icon name="compare" />
              <span>Comparar</span>
            </Link>
            <Link className="nav-item" to="/#sobre" onClick={closeMenu}>
              <Icon name="info" />
              <span>Sobre</span>
            </Link>
            <a className="nav-item" href={wa} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              <Icon name="chat" />
              <span>Contato</span>
            </a>
          </nav>
        </div>

        <div className="header__side header__side--right">
          <button type="button" className="icon-btn" aria-label="Buscar" onClick={ui.openSearch}>
            <Icon name="search" />
          </button>
          <Link className="icon-btn header__icon--desktop" to="/favoritos" aria-label="Favoritos">
            <Icon name="heart" />
            <span className="badge-count" hidden={ui.favCount === 0}>
              {ui.favCount}
            </span>
          </Link>
          <Link className="icon-btn header__icon--desktop" to="/comparar" aria-label="Comparar">
            <Icon name="compare" />
            <span className="badge-count" hidden={ui.cmpCount === 0}>
              {ui.cmpCount}
            </span>
          </Link>
          <button type="button" className="icon-btn" aria-label="Carrinho" onClick={ui.openCart}>
            <Icon name="bag" />
            <span className="badge-count" hidden={count === 0}>
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
