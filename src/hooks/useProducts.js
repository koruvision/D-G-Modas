import { useEffect, useState } from "react";
import { loadProducts } from "../services/api.js";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    loadProducts()
      .then((list) => {
        if (!alive) return;
        setProducts(Array.isArray(list) ? list : []);
        setError(null);
      })
      .catch((err) => {
        if (!alive) return;
        setProducts([]);
        setError(err?.message || "Não foi possível carregar os produtos");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { products, loading, error };
}
