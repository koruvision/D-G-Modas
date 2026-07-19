import { Link } from "react-router-dom";
import { Icon } from "./Icon.jsx";
import { useUi } from "../hooks/useUi.jsx";
import { useCart } from "../hooks/useCart.jsx";
import { formatBRL, installments, assetUrl } from "../lib/utils.js";

function firstAvailable(product) {
  for (const variant of product.variants || []) {
    const size = Object.keys(variant.sizes || {}).find((s) => variant.sizes[s] > 0);
    if (size) return { variant, size };
  }
  const variant = product.variants?.[0];
  if (!variant) return null;
  const size = Object.keys(variant.sizes || {})[0];
  return size ? { variant, size } : null;
}

export function ProductCard({ product, priority = false }) {
  const ui = useUi();
  const { add } = useCart();
  const price = product.salePrice ?? product.price;
  const raw = product.variants[0]?.images?.[0] || "assets/logo-dg-modas.webp";
  const img = assetUrl(raw);
  const fallback = assetUrl("assets/logo-dg-modas.webp");
  const isFav = ui.hasFav(product.id);
  const isCmp = ui.hasCmp(product.id);
  const href = `/produto/${product.slug}`;
  const pick = firstAvailable(product);
  const canAdd = Boolean(pick);

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

  const onAddCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!pick) {
      ui.toast("Produto indisponível", "error");
      return;
    }
    const { variant, size } = pick;
    add({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      color: variant.color,
      size,
      sku: variant.sku,
      price,
      image: variant.images?.[0],
      qty: 1,
    });
    ui.toast("Adicionado ao carrinho", "success");
    ui.openCart();
  };

  return (
    <article className="product-card reveal-lux">
      <div className="product-card__media">
        <Link to={href}>
          <img
            src={img}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
            width="600"
            height="800"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
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
        <button type="button" className="btn btn--wine btn--sm" disabled={!canAdd} onClick={onAddCart}>
          <Icon name="bag" /> Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}
