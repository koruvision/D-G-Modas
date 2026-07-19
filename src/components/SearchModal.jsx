import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon.jsx";
import { useUi } from "../hooks/useUi.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { filterProducts } from "../services/api.js";
import { store } from "../store/storage.js";
import { formatBRL, debounce, assetUrl } from "../lib/utils.js";

const HISTORY_KEY = "dg_search_history";

function getHistory() {
  return store.get(HISTORY_KEY, []);
}
function addHistory(term) {
  const t = String(term || "").trim();
  if (!t) return getHistory();
  const next = [t, ...getHistory().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8);
  store.set(HISTORY_KEY, next);
  return next;
}

export function SearchModal() {
  const ui = useUi();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(getHistory);
  const inputRef = useRef(null);

  const popular = useMemo(() => products.filter((p) => p.popular).slice(0, 4), [products]);
  const results = useMemo(() => (query.trim() ? filterProducts(products, { q: query.trim() }).slice(0, 8) : []), [
    products,
    query,
  ]);

  const debouncedSetQuery = useMemo(() => debounce((v) => setQuery(v), 180), []);

  useEffect(() => {
    if (ui.searchOpen) {
      setHistory(getHistory());
      document.body.classList.add("modal-open");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [ui.searchOpen]);

  const close = () => {
    ui.closeSearch();
    setQuery("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    addHistory(q);
    close();
    navigate(`/catalogo?q=${encodeURIComponent(q)}`);
  };

  const goToProduct = (slug) => {
    close();
    navigate(`/produto/${slug}`);
  };

  const list = query.trim() ? results : popular;
  const title = query.trim() ? "Sugestões" : "Populares";

  return (
    <div className={`search-modal ${ui.searchOpen ? "is-open" : ""}`}>
      <div className="search-modal__overlay" onClick={close} />
      <div className="search-modal__panel" role="dialog" aria-label="Busca">
        <form className="search-modal__form" onSubmit={onSubmit}>
          <Icon name="search" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Buscar produtos, categorias…"
            autoComplete="off"
            defaultValue=""
            onChange={(e) => debouncedSetQuery(e.target.value)}
          />
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={close}>
            <Icon name="close" />
          </button>
        </form>
        <div className="search-modal__results">
          {!query.trim() && history.length ? (
            <>
              <p className="search-title">Histórico</p>
              <div className="chip-row">
                {history.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className="chip"
                    onClick={() => {
                      setQuery(h);
                      if (inputRef.current) inputRef.current.value = h;
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {list.length ? (
            <>
              <p className="search-title">{title}</p>
              <ul className="search-list">
                {list.map((p) => {
                  const img = p.variants[0]?.images?.[0];
                  const price = p.salePrice ?? p.price;
                  return (
                    <li key={p.id}>
                      <a
                        href={`/produto/${p.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          goToProduct(p.slug);
                        }}
                      >
                        <img src={img ? assetUrl(img) : assetUrl("assets/logo-dg-modas.webp")} alt="" width="48" height="64" loading="lazy" decoding="async" />
                        <span>
                          <strong>{p.name}</strong>
                          <small>{formatBRL(price)}</small>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : query.trim() ? (
            <div className="empty-state">
              <p>Nenhum produto encontrado</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
