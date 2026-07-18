import { Link } from "react-router-dom";
import { Icon } from "./Icon.jsx";
import { useUi } from "../hooks/useUi.jsx";
import { formatBRL, installments } from "../lib/utils.js";

export function ProductCard({ product }) {
  const ui = useUi();
  const price = product.salePrice ?? product.price;
  const raw = product.variants[0]?.images?.[0] || "/assets/logo-dg-modas.png";
  const img = raw.startsWith("/") ? raw : `/${raw}`;
  const isFav = ui.hasFav(product.id);
  const isCmp = ui.hasCmp(product.id);
  const href = `/produto/${product.slug}`;

  const badge =
    product.badge === "sale" ? (
      <span className="badge badge--sale">
        <Icon name="tag" className="icon icon--badge" /> Oferta
      </span>
    ) : product.badge === "new" ? (
      <span className="badge badge--new">
        <Icon name="spark" className="icon icon--badge" /> Novo
      </span>
    ) : product.badge === "bestseller" ? (
      <span className="badge badge--hot">
        <Icon name="star" className="icon icon--badge" /> Mais vendido
      </span>
    ) : product.salePrice ? (
      <span className="badge badge--sale">
        <Icon name="zap" className="icon icon--badge" /> Promoção
      </span>
    ) : null;

  return (
    <article className="product-card reveal-lux">
      <div className="product-card__media">
        <Link to={href}>
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            width="600"
            height="800"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/logo-dg-modas.png";
            }}
          />
        </Link>
        {badge}
        <div className="product-card__quick">
          <button
            type="button"
            className="icon-btn"
            aria-label="Favoritar"
            aria-pressed={isFav}
            onClick={() => ui.toggleFav(product.id)}
          >
            <Icon name="heart" />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Comparar"
            aria-pressed={isCmp}
            onClick={() => ui.toggleCompare(product.id)}
          >
            <Icon name="compare" />
          </button>
        </div>
      </div>
      <div className="product-card__body">
        <p className="product-card__cat">{product.category}</p>
        <h3>
          <Link to={href}>{product.name}</Link>
        </h3>
        <div className="product-card__price">
          {product.salePrice ? <span className="price-old">{formatBRL(product.price)}</span> : null}
          <span className="price">{formatBRL(price)}</span>
        </div>
        <p className="product-card__installment">{installments(price)}</p>
        <div className="product-card__swatches">
          {product.variants.slice(0, 4).map((v) => (
            <span key={v.id} className="swatch" style={{ "--swatch": v.hex }} title={v.color} />
          ))}
        </div>
        <Link className="btn btn--wine btn--sm" to={href}>
          Quero este produto
        </Link>
      </div>
    </article>
  );
}
