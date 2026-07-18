import { useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../components/Icon.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useCart } from "../hooks/useCart.jsx";
import { useUi } from "../hooks/useUi.jsx";
import { formatBRL, installments, stockIcon, stockLabel, totalStock, productPrice, starsText, publicUrl } from "../lib/utils.js";

function assetUrl(src) {
  if (!src) return publicUrl("assets/logo-dg-modas.png");
  return publicUrl(String(src).replace(/^\//, ""));
}

export function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { add } = useCart();
  const ui = useUi();

  const product = useMemo(() => products.find((p) => p.slug === slug || p.id === slug), [products, slug]);

  const [variantIdx, setVariantIdx] = useState(0);
  const [size, setSize] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});

  useLayoutEffect(() => {
    if (!product) return;
    setVariantIdx(0);
    const v = product.variants[0];
    setSize(Object.keys(v.sizes).find((s) => v.sizes[s] > 0) || Object.keys(v.sizes)[0]);
    setImgIdx(0);
    document.title = `${product.name} — DG Modas`;
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return (product.related || []).map((id) => products.find((p) => p.id === id)).filter(Boolean);
  }, [product, products]);

  if (loading) return <div className="container" style={{ padding: "4rem 0" }} />;

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Produto não encontrado</p>
          <Link className="btn btn--wine" to="/catalogo">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[variantIdx];
  const price = productPrice(product, variant);
  const qty = size ? variant.sizes[size] || 0 : 0;
  const status = qty === 0 ? "unavailable" : variant.stockStatus;
  const images = variant.images;

  const selectVariant = (i) => {
    setVariantIdx(i);
    setImgIdx(0);
    const v = product.variants[i];
    setSize(Object.keys(v.sizes).find((s) => v.sizes[s] > 0) || Object.keys(v.sizes)[0]);
  };

  const doAdd = () => {
    if (!size || !variant.sizes[size]) {
      ui.toast("Tamanho indisponível", "error");
      return false;
    }
    add({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      color: variant.color,
      size,
      sku: variant.sku,
      price,
      image: variant.images[0],
      qty: 1,
    });
    ui.toast("Adicionado ao carrinho", "success");
    return true;
  };

  const onAddCart = () => {
    if (doAdd()) ui.openCart();
  };

  const onBuyNow = () => {
    if (doAdd()) navigate("/checkout");
  };

  const onZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(1.6)" });
  };
  const onZoomLeave = () => setZoomStyle({ transform: "scale(1)" });

  return (
    <div className="container" style={{ paddingBottom: "3rem" }}>
      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__main-img" onMouseMove={onZoomMove} onMouseLeave={onZoomLeave}>
            <img
              src={assetUrl(images[imgIdx])}
              alt={product.name}
              style={zoomStyle}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = publicUrl("assets/logo-dg-modas.png");
              }}
            />
          </div>
          <div className="pdp__thumbs">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`pdp__thumb ${i === imgIdx ? "is-active" : ""}`}
                onClick={() => setImgIdx(i)}
              >
                <img
                  src={assetUrl(src)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = publicUrl("assets/logo-dg-modas.png");
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp__info">
          <p className="eyebrow">
            <Icon name="tag" /> {product.category} · {variant.sku}
          </p>
          <h1>{product.name}</h1>
          <div className="pdp__rating">
            {starsText(5)} <span>{product.reviews.length} avaliações</span>
          </div>
          <div className="pdp__price">
            {product.salePrice ? <span className="price-old">{formatBRL(product.price)}</span> : null}
            <span className="price">{formatBRL(price)}</span>
          </div>
          <p className="pdp__installment">{installments(price)}</p>
          <p className={`pdp__stock stock stock--${status}`}>
            <Icon name={stockIcon(status)} /> {stockLabel(status, totalStock(variant.sizes))}
          </p>
          <p className="pdp__desc">{product.description}</p>

          <div className="pdp__option">
            <span>
              Cor: <strong>{variant.color}</strong>
            </span>
            <div className="swatch-row">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  className={`swatch swatch--btn ${i === variantIdx ? "is-active" : ""}`}
                  style={{ "--swatch": v.hex }}
                  title={v.color}
                  aria-label={v.color}
                  onClick={() => selectVariant(i)}
                />
              ))}
            </div>
          </div>

          <div className="pdp__option">
            <span>Tamanho</span>
            <div className="size-row">
              {Object.entries(variant.sizes).map(([s, q]) => (
                <button
                  key={s}
                  type="button"
                  className={`size-btn ${s === size ? "is-active" : ""}`}
                  disabled={q === 0}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp__actions">
            <button type="button" className="btn btn--wine" disabled={status === "unavailable"} onClick={onAddCart}>
              <Icon name="bag" /> Adicionar ao carrinho
            </button>
            <button
              type="button"
              className="btn btn--outline-gold"
              disabled={status === "unavailable"}
              onClick={onBuyNow}
            >
              Pedir agora
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-pressed={ui.hasFav(product.id)}
              onClick={() => ui.toggleFav(product.id)}
            >
              <Icon name="heart" />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-pressed={ui.hasCmp(product.id)}
              onClick={() => ui.toggleCompare(product.id)}
            >
              <Icon name="compare" />
            </button>
          </div>

          <ul className="pdp__benefits">
            {product.benefits.map((b) => (
              <li key={b}>
                <Icon name="check" /> {b}
              </li>
            ))}
          </ul>
          <p className="pdp__meta">
            <Icon name="truck" /> Prazo estimado: {product.deliveryDays[0]}–{product.deliveryDays[1]} dias ·{" "}
            <Icon name="shield" /> {product.guarantee}
          </p>
        </div>
      </div>

      <section className="pdp-section reveal-lux">
        <h2>
          <Icon name="info" /> Descrição completa
        </h2>
        <p>{product.longDescription}</p>
      </section>

      <section className="pdp-section reveal-lux">
        <h2>
          <Icon name="grid" /> Especificações
        </h2>
        <table className="specs-table">
          <tbody>
            {Object.entries(product.specs).map(([k, v]) => (
              <tr key={k}>
                <th>{k}</th>
                <td>{v}</td>
              </tr>
            ))}
            <tr>
              <th>Dimensões</th>
              <td>{product.dimensions}</td>
            </tr>
            <tr>
              <th>SKU</th>
              <td>{variant.sku}</td>
            </tr>
            <tr>
              <th>Referência</th>
              <td>{product.skuBase}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="pdp-section reveal-lux">
        <h2>
          <Icon name="star" /> Avaliações
        </h2>
        <div className="reviews">
          {product.reviews.map((r) => (
            <article key={r.id} className="review-card">
              <div className="review-card__head">
                <strong>{r.name}</strong>
                {r.verified ? (
                  <span className="verified">
                    <Icon name="check" /> Verificado
                  </span>
                ) : null}
                <span className="review-card__date">{r.date}</span>
              </div>
              <div className="stars">{starsText(r.rating)}</div>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pdp-section reveal-lux">
        <h2>
          <Icon name="chat" /> Perguntas frequentes
        </h2>
        <div className="faq">
          {product.faq.map((f) => (
            <details key={f.q}>
              <summary>
                <Icon name="info" /> {f.q}
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="pdp-section reveal-lux">
          <h2>
            <Icon name="spark" /> Quem comprou também gostou
          </h2>
          <div className="product-grid reveal-stagger">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
