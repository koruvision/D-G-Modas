import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { Icon } from "../components/Icon.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useUi } from "../hooks/useUi.jsx";

export function FavoritesPage() {
  const { products, loading } = useProducts();
  const { favIds } = useUi();

  const list = useMemo(
    () => favIds.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [favIds, products]
  );

  return (
    <>
      <PageHero label="Wishlist" title="Seus" script="favoritos" />
      <div className="container" style={{ paddingBottom: "4rem" }}>
        {loading ? (
          <div className="product-grid" />
        ) : list.length ? (
          <div className="product-grid reveal-stagger">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="heart" />
            <p>Nenhum favorito ainda</p>
            <Link className="btn btn--wine" to="/catalogo">
              Explorar catálogo
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
