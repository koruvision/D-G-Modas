import { Link } from "react-router-dom";
import { Icon } from "../components/Icon.jsx";
import { useConfig } from "../hooks/useConfig.js";
import { formatBRL, assetUrl } from "../lib/utils.js";

export function Footer() {
  const cfg = useConfig();
  const wa = cfg ? `https://wa.me/${cfg.whatsapp}` : "#";
  const year = new Date().getFullYear();
  const freeMin = cfg ? formatBRL(cfg.freeShippingMin) : "R$ 299,00";

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="brand-logo">
            <img
              src={assetUrl("assets/logo-header-sm.webp")}
              alt="DG Modas"
              width="88"
              height="88"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = assetUrl("assets/logo-dg-modas-sm.webp");
              }}
            />
          </span>
          <p className="footer__tagline">
            Elegância que traduz sua essência. Moda feminina, masculina e infantil com acabamento premium e
            atendimento personalizado.
          </p>
        </div>
        <div className="footer__col">
          <h4>
            <Icon name="grid" /> Loja
          </h4>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/catalogo?categoria=feminino">Feminino</Link>
          <Link to="/catalogo?categoria=masculino">Masculino</Link>
          <Link to="/catalogo?categoria=infantil">Infantil</Link>
          <Link to="/favoritos">Favoritos</Link>
        </div>
        <div className="footer__col">
          <h4>
            <Icon name="chat" /> Atendimento
          </h4>
          <a href={wa} target="_blank" rel="noopener noreferrer">
            <Icon name="phone" /> WhatsApp
          </a>
          {cfg && (
            <a href={cfg.instagram} target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" /> Instagram
            </a>
          )}
          {cfg && (
            <a href={`mailto:${cfg.email}`}>
              <Icon name="mail" /> {cfg.email}
            </a>
          )}
          {cfg && (
            <p>
              <Icon name="map" /> {cfg.address}
              <br />
              {cfg.city}
            </p>
          )}
        </div>
        <div className="footer__col">
          <h4>
            <Icon name="shield" /> Confiança
          </h4>
          <p>Compra assistida via WhatsApp</p>
          <p>Troca em até 7 dias</p>
          <p>Garantia de 90 dias</p>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos de Uso</Link>
          <a className="btn btn--gold btn--sm" href={wa} target="_blank" rel="noopener noreferrer">
            Falar com especialista
          </a>
        </div>
      </div>
      <div className="footer__payments">
        <p>Formas de pagamento</p>
        <ul>
          <li>
            <Icon name="pix" /> Pix
          </li>
          <li>
            <Icon name="card" /> Cartão{cfg?.installments ? ` até ${cfg.installments}x` : ""}
          </li>
          <li>
            <Icon name="boleto" /> Boleto
          </li>
          <li>
            <Icon name="truck" /> Frete grátis acima de {freeMin}
          </li>
          <li>
            <Icon name="tag" /> Cupom BEMVINDA5
          </li>
        </ul>
      </div>
      <div className="footer__bottom">
        <p>
          &copy; {year} DG Modas. Todos os direitos reservados. ·{" "}
          <Link to="/privacidade">Privacidade</Link> · <Link to="/termos">Termos</Link>
        </p>
      </div>
    </footer>
  );
}
