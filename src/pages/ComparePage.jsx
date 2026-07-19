import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { Icon } from "../components/Icon.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useUi } from "../hooks/useUi.jsx";
import { formatBRL, assetUrl } from "../lib/utils.js";

const ROWS = [
  {
    label: "Produto",
    fn: (p) => (
      <>
        <img
          src={assetUrl(p.variants[0]?.images?.[0] || "assets/logo-dg-modas.webp")}
          alt=""
          width="80"
          height="100"
          loading="lazy"
          decoding="async"
        />
        <strong>{p.name}</strong>
      </>
    ),
  },
  { label: "Preço", fn: (p) => formatBRL(p.salePrice ?? p.price) },
  { label: "Categoria", fn: (p) => p.category },
  { label: "Material", fn: (p) => p.specs?.material || "—" },
  { label: "Cuidados", fn: (p) => p.specs?.cuidado || "—" },
  { label: "Dimensões", fn: (p) => p.dimensions },
  { label: "Benefícios", fn: (p) => p.benefits?.join(", ") || "—" },
  { label: "Diferenciais", fn: (p) => p.features?.join(", ") || "—" },
  { label: "Garantia", fn: (p) => p.guarantee },
];

export function ComparePage() {
  const { products, loading } = useProducts();
  const { cmpIds, toggleCompare, clearCompare } = useUi();

  const list = useMemo(
    () => cmpIds.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [cmpIds, products]
  );

  return (
    <>
      <PageHero label="Comparação" title="Comparar" script="produtos" />
      <div className="container" style={{ paddingBottom: "4rem" }}>
        {loading ? (
          <div className="empty-state" aria-busy="true">
            <p>Carregando…</p>
          </div>
        ) : list.length < 2 ? (
          <div className="empty-state">
            <Icon name="compare" />
            <p>Selecione ao menos 2 produtos para comparar</p>
            <Link className="btn btn--wine" to="/catalogo">
              Ir ao catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="compare-table-wrap reveal-lux">
              <table className="compare-table">
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.label}>
                      <th>{r.label}</th>
                      {list.map((p) => (
                        <td key={p.id}>{r.fn(p)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th />
                    {list.map((p) => (
                      <td key={p.id}>
                        <Link className="btn btn--wine btn--sm" to={`/produto/${p.slug}`}>
                          Ver produto
                        </Link>{" "}
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => toggleCompare(p.id)}
                        >
                          Remover
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn--ghost" onClick={clearCompare}>
              Limpar comparação
            </button>
          </>
        )}
      </div>
    </>
  );
}
