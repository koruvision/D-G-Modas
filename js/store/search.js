import { store } from "./storage.js";

const KEY = "dg_search_history";

export const searchHistory = {
  get() {
    return store.get(KEY, []);
  },
  add(term) {
    const t = String(term || "").trim();
    if (!t) return this.get();
    const next = [t, ...this.get().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8);
    store.set(KEY, next);
    return next;
  },
  clear() {
    store.set(KEY, []);
  },
};
