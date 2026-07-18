import { useEffect, useState } from "react";
import { loadProducts } from "../services/api.js";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    loadProducts()
      .then((list) => {
        if (alive) setProducts(list);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  return { products, loading };
}
