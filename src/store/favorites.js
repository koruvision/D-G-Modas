import { store } from "./storage.js";

const KEY = "dg_favorites";

export const favoritesApi = {
  get() {
    return store.get(KEY, []);
  },
  has(id) {
    return this.get().includes(id);
  },
  toggle(id) {
    const list = this.get();
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    store.set(KEY, next);
    return next;
  },
  count() {
    return this.get().length;
  },
};
