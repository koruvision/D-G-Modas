let coupons = null;
let shipping = null;
let config = null;

export async function loadConfig() {
  if (config) return config;
  const res = await fetch("data/config.json");
  config = await res.json();
  return config;
}

export async function loadCoupons() {
  if (coupons) return coupons;
  const res = await fetch("data/coupons.json");
  coupons = await res.json();
  return coupons;
}

export async function loadShipping() {
  if (shipping) return shipping;
  const res = await fetch("data/shipping.json");
  shipping = await res.json();
  return shipping;
}

export async function findCoupon(code) {
  const list = await loadCoupons();
  const found = list.find((c) => c.code.toUpperCase() === String(code || "").toUpperCase());
  if (!found) return { ok: false, error: "Cupom inválido" };
  if (new Date(found.validUntil) < new Date()) return { ok: false, error: "Cupom expirado" };
  return { ok: true, coupon: found };
}

export async function estimateShipping(cep, shippingId) {
  const options = await loadShipping();
  const option = options.find((o) => o.id === shippingId) || options[1];
  const digits = String(cep || "").replace(/\D/g, "");
  let multiplier = 1;
  if (digits.length >= 8) {
    const region = Number(digits.slice(0, 2));
    if (region >= 1 && region <= 19) multiplier = 0.85;
    else if (region >= 80) multiplier = 1.25;
  }
  return {
    ...option,
    price: Math.round(option.price * multiplier * 100) / 100,
  };
}

export async function computeTotals(cartData) {
  const cfg = await loadConfig();
  const options = await loadShipping();
  const subtotal = cartData.items.reduce((a, i) => a + i.price * i.qty, 0);
  let discount = 0;
  let freeShipping = false;
  let couponMeta = null;

  if (cartData.coupon) {
    const result = await findCoupon(cartData.coupon);
    if (result.ok) {
      couponMeta = result.coupon;
      if (subtotal >= result.coupon.minSubtotal) {
        if (result.coupon.type === "percent") discount = (subtotal * result.coupon.value) / 100;
        if (result.coupon.type === "fixed") discount = result.coupon.value;
        if (result.coupon.freeShipping) freeShipping = true;
      }
    }
  }

  if (subtotal >= cfg.freeShippingMin) freeShipping = true;

  const shipOpt = options.find((o) => o.id === cartData.shippingId) || options[1];
  let shippingPrice = freeShipping && shipOpt.id !== "retirada" ? 0 : shipOpt.price;
  const cep = cartData.address?.cep;
  if (cep && shipOpt.id !== "retirada") {
    const est = await estimateShipping(cep, shipOpt.id);
    shippingPrice = freeShipping ? 0 : est.price;
  }

  let giftPrice = 0;
  if (cartData.gift?.enabled && cartData.gift?.wrap) giftPrice = cfg.giftWrapPrice;

  const total = Math.max(0, subtotal - discount + shippingPrice + giftPrice);
  return {
    subtotal,
    discount,
    shippingPrice,
    giftPrice,
    total,
    freeShipping,
    couponMeta,
    shipOpt,
  };
}
