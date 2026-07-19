import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { Icon } from "../components/Icon.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { filterProducts, uniqueColors, uniqueSizes } from "../services/api.js";

export function CatalogPage() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    category: searchParams.get("categoria") || "all",
    q: searchParams.get("q") || "",
    color: searchParams.get("color") || "",
    size: searchParams.get("size") || "",
    availability: searchParams.get("availability") || "",
    minPrice: searchParams.get("min") || "",
    maxPrice: searchParams.get("max") || "",
    sort: searchParams.get("sort") || "popular",
  };

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const paramKey = { category: "categoria", minPrice: "min", maxPrice: "max" }[key] || key;
    if (value === "" || value == null || value === "all") next.delete(paramKey);
    else next.set(paramKey, value);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const colors = useMemo(() => uniqueColors(products), [products]);
  const sizes = useMemo(() => uniqueSizes(products), [products]);
  const list = useMemo(() => filterProducts(products, filters), [products, filters]);

  return (
    <>
      <PageHero label="Loja" title="Catálogo" script="completo">
        <p>{loading ? "Carregando…" : `${list.length} produto${list.length !== 1 ? "s" : ""}`}</p>
      </PageHero>
      <div className="container catalog-layout">
        <aside className="filters reveal-lux" aria-label="Filtros">
          <h3>
            <Icon name="filter" /> Filtros
          </h3>
          <label className="field">
            <span>Busca</span>
            <input
              type="search"
              placeholder="Nome, SKU…"
              value={filters.q}
              onChange={(e) => setFilter("q", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Categoria</span>
            <select value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
              <option value="all">Todas</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="infantil">Infantil</option>
            </select>
          </label>
          <label className="field">
            <span>Cor</span>
            <select value={filters.color} onChange={(e) => setFilter("color", e.target.value)}>
              <option value="">Todas</option>
              {colors.map((c) => (
                <option key={c.color} value={c.color} style={{ background: c.hex }}>
                  {c.color}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Tamanho</span>
            <select value={filters.size} onChange={(e) => setFilter("size", e.target.value)}>
              <option value="">Todos</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Disponibilidade</span>
            <select value={filters.availability} onChange={(e) => setFilter("availability", e.target.value)}>
              <option value="">Todas</option>
              <option value="in_stock">Em estoque</option>
              <option value="new">Novidades</option>
              <option value="sale">Promoções</option>
            </select>
          </label>
          <label className="field">
            <span>Preço mín.</span>
            <input
              type="number"
              min="0"
              step="10"
              value={filters.minPrice}
              onChange={(e) => setFilter("minPrice", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Preço máx.</span>
            <input
              type="number"
              min="0"
              step="10"
              value={filters.maxPrice}
              onChange={(e) => setFilter("maxPrice", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Ordenar</span>
            <select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)}>
              <option value="popular">Populares</option>
              <option value="newest">Mais novos</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </label>
        </aside>

        {loading ? (
          <div className="product-grid" aria-busy="true">
            <div className="empty-state">
              <p>Carregando produtos…</p>
            </div>
          </div>
        ) : error ? (
          <div className="product-grid">
            <div className="empty-state">
              <Icon name="alert" />
              <p>{error}</p>
              <button type="button" className="btn btn--wine" onClick={() => window.location.reload()}>
                Tentar de novo
              </button>
            </div>
          </div>
        ) : list.length ? (
          <div className="product-grid reveal-stagger">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="product-grid">
            <div className="empty-state">
              <Icon name="search" />
              <p>Nenhum produto com esses filtros</p>
              <button type="button" className="btn btn--wine" onClick={clearFilters}>
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
