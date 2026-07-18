import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { cartApi } from "../store/cart.js";
import { store } from "../store/storage.js";
import { computeTotals } from "../services/api.js";

const CartContext = createContext(null);

let cartSnapshot = cartApi.get();

function getCartSnapshot() {
  return cartSnapshot;
}

function subscribe(cb) {
  return store.subscribe((key) => {
    if (key !== "dg_cart") return;
    cartSnapshot = cartApi.get();
    cb();
  });
}

export function CartProvider({ children }) {
  const cart = useSyncExternalStore(subscribe, getCartSnapshot, getCartSnapshot);
  const [totals, setTotals] = useState(null);
  const count = useMemo(() => cart.items.reduce((a, i) => a + i.qty, 0), [cart]);

  useEffect(() => {
    let alive = true;
    computeTotals(cart).then((t) => {
      if (alive) setTotals(t);
    });
    return () => {
      alive = false;
    };
  }, [cart]);

  const add = useCallback((item) => cartApi.add(item), []);
  const updateQty = useCallback((...args) => cartApi.updateQty(...args), []);
  const remove = useCallback((...args) => cartApi.remove(...args), []);
  const setCoupon = useCallback((c) => cartApi.setCoupon(c), []);
  const setShipping = useCallback((id) => cartApi.setShipping(id), []);
  const setNotes = useCallback((n) => cartApi.setNotes(n), []);
  const setGift = useCallback((g) => cartApi.setGift(g), []);
  const setCustomer = useCallback((c) => cartApi.setCustomer(c), []);
  const setAddress = useCallback((a) => cartApi.setAddress(a), []);
  const clear = useCallback(() => cartApi.clear(), []);

  const value = useMemo(
    () => ({
      cart,
      count,
      totals,
      add,
      updateQty,
      remove,
      setCoupon,
      setShipping,
      setNotes,
      setGift,
      setCustomer,
      setAddress,
      clear,
    }),
    [cart, count, totals, add, updateQty, remove, setCoupon, setShipping, setNotes, setGift, setCustomer, setAddress, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
