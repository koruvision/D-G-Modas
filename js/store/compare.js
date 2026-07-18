import { store } from "./storage.js";

const KEY = "dg_compare";
const MAX = 4;

export const compare = {
  get() {
    return store.get(KEY, []);
  },
  has(id) {
    return this.get().includes(id);
  },
  toggle(id) {
    let list = this.get();
    if (list.includes(id)) list = list.filter((x) => x !== id);
    else {
      if (list.length >= MAX) list = [...list.slice(1), id];
      else list = [...list, id];
    }
    store.set(KEY, list);
    return list;
  },
  clear() {
    store.set(KEY, []);
  },
  count() {
    return this.get().length;
  },
};
