import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { Icon } from "../components/Icon.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { filterProducts, uniqueColors, uniqueSizes } from "../services/api.js";
import { debounce } from "../lib/utils.js";

export function CatalogPage() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [qDraft, setQDraft] = useState(() => searchParams.get("q") || "");

  const filters = useMemo(
    () => ({
      category: searchParams.get("categoria") || "all",
      q: searchParams.get("q") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") || "",
      availability: searchParams.get("availability") || "",
      minPrice: searchParams.get("min") || "",
      maxPrice: searchParams.get("max") || "",
      sort: searchParams.get("sort") || "popular",
    }),
    [searchParams]
  );

  const setFilter = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const paramKey = { category: "categoria", minPrice: "min", maxPrice: "max" }[key] || key;
      if (value === "" || value == null || value === "all") next.delete(paramKey);
      else next.set(paramKey, value);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
    setQDraft("");
  };

  const debouncedQ = useMemo(() => debounce((value) => setFilter("q", value), 280), []);

  useEffect(() => {
    setQDraft(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    document.body.classList.toggle("filters-open", filtersOpen);
    return () => document.body.classList.remove("filters-open");
  }, [filtersOpen]);

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  const colors = useMemo(() => uniqueColors(products), [products]);
  const sizes = useMemo(() => uniqueSizes(products), [products]);
  const list = useMemo(() => filterProducts(products, filters), [products, filters]);

  const activeFilterCount = [
    filters.category !== "all",
    Boolean(filters.q),
    Boolean(filters.color),
    Boolean(filters.size),
    Boolean(filters.availability),
    Boolean(filters.minPrice),
    Boolean(filters.maxPrice),
  ].filter(Boolean).length;

  const FiltersForm = (
    <>
      <h3>
        <Icon name="filter" /> Filtros
      </h3>
      <label className="field">
        <span>Busca</span>
        <input
          type="search"
          placeholder="Nome, SKU…"
          value={qDraft}
          onChange={(e) => {
            setQDraft(e.target.value);
            debouncedQ(e.target.value);
          }}
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
            <option key={c.color} value={c.color}>
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
          inputMode="numeric"
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
          inputMode="numeric"
          value={filters.maxPrice}
          onChange={(e) => setFilter("maxPrice", e.target.value)}
        />
      </label>
      <label className="field filters__sort-desktop">
        <span>Ordenar</span>
        <select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)}>
          <option value="popular">Populares</option>
          <option value="newest">Mais novos</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
        </select>
      </label>
      <div className="filters__actions">
        <button type="button" className="btn btn--ghost btn--block" onClick={clearFilters}>
          Limpar filtros
        </button>
        <button type="button" className="btn btn--wine btn--block filters__apply" onClick={() => setFiltersOpen(false)}>
          Ver {list.length} produto{list.length !== 1 ? "s" : ""}
        </button>
      </div>
    </>
  );

  return (
    <>
      <PageHero label="Loja" title="Catálogo" script="completo">
        <p>{loading ? "Carregando…" : `${list.length} produto${list.length !== 1 ? "s" : ""}`}</p>
      </PageHero>
      <div className="container catalog-layout">
        <aside className="filters filters--desktop" aria-label="Filtros">
          {FiltersForm}
        </aside>

        <div className="catalog-main">
          <div className="catalog-toolbar">
            <button
              type="button"
              className="btn btn--outline-gold catalog-toolbar__filters"
              onClick={() => setFiltersOpen(true)}
            >
              <Icon name="filter" /> Filtros
              {activeFilterCount > 0 ? <span className="catalog-toolbar__badge">{activeFilterCount}</span> : null}
            </button>
            <label className="catalog-toolbar__sort field">
              <span className="sr-only">Ordenar</span>
              <select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)} aria-label="Ordenar">
                <option value="popular">Populares</option>
                <option value="newest">Mais novos</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </label>
          </div>

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
      </div>

      <div className={`filters-sheet ${filtersOpen ? "is-open" : ""}`} aria-hidden={!filtersOpen}>
        <div className="filters-sheet__overlay" onClick={() => setFiltersOpen(false)} />
        <aside className="filters-sheet__panel" role="dialog" aria-label="Filtros">
          <header className="filters-sheet__head">
            <h2>Filtros</h2>
            <button type="button" className="icon-btn" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)}>
              <Icon name="close" />
            </button>
          </header>
          <div className="filters-sheet__body filters">{FiltersForm}</div>
        </aside>
      </div>
    </>
  );
}
