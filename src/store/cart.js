import { store } from "./storage.js";

const KEY = "dg_cart";

const empty = () => ({
  items: [],
  coupon: null,
  shippingId: "normal",
  notes: "",
  gift: { enabled: false, wrap: false, message: "", hidePrice: false, recipient: "" },
  customer: null,
  address: null,
});

export const cartApi = {
  get() {
    return { ...empty(), ...store.get(KEY, empty()) };
  },
  save(data) {
    store.set(KEY, data);
    return data;
  },
  clear() {
    return this.save(empty());
  },
  add(item) {
    const data = this.get();
    const key = `${item.productId}|${item.variantId}|${item.size}`;
    const existing = data.items.find((i) => `${i.productId}|${i.variantId}|${i.size}` === key);
    if (existing) existing.qty += item.qty || 1;
    else data.items.push({ ...item, qty: item.qty || 1 });
    return this.save(data);
  },
  updateQty(productId, variantId, size, qty) {
    const data = this.get();
    data.items = data.items
      .map((i) =>
        i.productId === productId && i.variantId === variantId && i.size === size
          ? { ...i, qty: Math.max(0, qty) }
          : i
      )
      .filter((i) => i.qty > 0);
    return this.save(data);
  },
  remove(productId, variantId, size) {
    const data = this.get();
    data.items = data.items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId && i.size === size)
    );
    return this.save(data);
  },
  setCoupon(code) {
    const data = this.get();
    data.coupon = code;
    return this.save(data);
  },
  setShipping(id) {
    const data = this.get();
    data.shippingId = id;
    return this.save(data);
  },
  setNotes(notes) {
    const data = this.get();
    data.notes = notes;
    return this.save(data);
  },
  setGift(gift) {
    const data = this.get();
    data.gift = { ...data.gift, ...gift };
    return this.save(data);
  },
  setCustomer(customer) {
    const data = this.get();
    data.customer = customer;
    return this.save(data);
  },
  setAddress(address) {
    const data = this.get();
    data.address = address;
    return this.save(data);
  },
  count() {
    return this.get().items.reduce((a, i) => a + i.qty, 0);
  },
};
