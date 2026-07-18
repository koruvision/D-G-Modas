import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { favoritesApi } from "../store/favorites.js";
import { compareApi } from "../store/compare.js";
import { store } from "../store/storage.js";

const UiContext = createContext(null);
const EMPTY = Object.freeze([]);

let favSnapshot = favoritesApi.get();
let cmpSnapshot = compareApi.get();

function getFavSnapshot() {
  return favSnapshot;
}
function getCmpSnapshot() {
  return cmpSnapshot;
}
function getServerSnapshot() {
  return EMPTY;
}

function subscribeFav(cb) {
  return store.subscribe((key) => {
    if (key !== "dg_favorites") return;
    favSnapshot = favoritesApi.get();
    cb();
  });
}

function subscribeCmp(cb) {
  return store.subscribe((key) => {
    if (key !== "dg_compare") return;
    cmpSnapshot = compareApi.get();
    cb();
  });
}

export function UiProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const favIds = useSyncExternalStore(subscribeFav, getFavSnapshot, getServerSnapshot);
  const cmpIds = useSyncExternalStore(subscribeCmp, getCmpSnapshot, getServerSnapshot);

  const toast = useCallback((message, type = "info") => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const clearCompare = useCallback(() => compareApi.clear(), []);

  const toggleFav = useCallback(
    (id) => {
      const list = favoritesApi.toggle(id);
      toast(list.includes(id) ? "Adicionado aos favoritos" : "Removido dos favoritos", "success");
      return list;
    },
    [toast]
  );

  const toggleCompare = useCallback(
    (id) => {
      const list = compareApi.toggle(id);
      toast(list.includes(id) ? "Adicionado à comparação" : "Removido da comparação", "success");
      return list;
    },
    [toast]
  );

  const hasFav = useCallback((id) => favIds.includes(id), [favIds]);
  const hasCmp = useCallback((id) => cmpIds.includes(id), [cmpIds]);

  const value = useMemo(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      searchOpen,
      openSearch,
      closeSearch,
      toasts,
      toast,
      favIds,
      cmpIds,
      favCount: favIds.length,
      cmpCount: cmpIds.length,
      hasFav,
      hasCmp,
      toggleFav,
      toggleCompare,
      clearCompare,
    }),
    [
      cartOpen,
      openCart,
      closeCart,
      searchOpen,
      openSearch,
      closeSearch,
      toasts,
      toast,
      favIds,
      cmpIds,
      hasFav,
      hasCmp,
      toggleFav,
      toggleCompare,
      clearCompare,
    ]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi outside provider");
  return ctx;
}
