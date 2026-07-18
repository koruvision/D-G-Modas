import { icon, formatBRL } from "../utils.js";
import { cart } from "../store/cart.js";
import { computeTotals, findCoupon, loadShipping, loadConfig } from "../services/checkout.js";
import { openWhatsAppOrder } from "../services/whatsapp.js";
import { toast } from "./toast.js";
import { store } from "../store/storage.js";

let open = false;

export function isCartOpen() {
  return open;
}

export async function renderCartDrawer() {
  const root = document.getElementById("cartDrawer");
  if (!root) return;
  const data = cart.get();
  const totals = await computeTotals(data);
  const shipping = await loadShipping();
  const cfg = await loadConfig();

  const itemsHtml =
    data.items.length === 0
      ? `<div class="empty-state">
          ${icon("bag", "icon icon--lg")}
          <p>Seu carrinho está vazio</p>
          <a class="btn btn--wine btn--sm" href="catalogo.html">Ver catálogo</a>
        </div>`
      : data.items
          .map(
            (i) => `
        <article class="cart-item" data-pid="${i.productId}" data-vid="${i.variantId}" data-size="${i.size}">
          <img src="${i.image}" alt="${i.name}" width="72" height="96" />
          <div class="cart-item__info">
            <h4>${i.name}</h4>
            <p>${i.color} · ${i.size} · ${i.sku}</p>
            <p class="cart-item__price">${formatBRL(i.price)}</p>
            <div class="qty">
              <button type="button" data-qty="-1" aria-label="Diminuir">${icon("minus")}</button>
              <span>${i.qty}</span>
              <button type="button" data-qty="1" aria-label="Aumentar">${icon("plus")}</button>
            </div>
          </div>
          <button type="button" class="icon-btn cart-item__remove" data-remove aria-label="Remover">${icon("close")}</button>
        </article>`
          )
          .join("");

  root.innerHTML = `
    <div class="drawer__overlay" data-close-cart></div>
    <aside class="drawer__panel" role="dialog" aria-label="Carrinho">
      <header class="drawer__head">
        <h2>${icon("bag")} Carrinho <span class="badge-count">${cart.count()}</span></h2>
        <button type="button" class="icon-btn" data-close-cart aria-label="Fechar">${icon("close")}</button>
      </header>
      <div class="drawer__body">
        <div class="cart-list">${itemsHtml}</div>
        ${
          data.items.length
            ? `
        <div class="cart-extras">
          <label class="field">
            <span>${icon("tag")} Cupom</span>
            <div class="field-row">
              <input type="text" id="cartCoupon" value="${data.coupon || ""}" placeholder="Ex: DESCONTO10" />
              <button type="button" class="btn btn--ghost" id="applyCoupon">Aplicar</button>
            </div>
            <small id="couponMsg"></small>
          </label>
          <label class="field">
            <span>${icon("truck")} Frete</span>
            <select id="cartShipping">
              ${shipping
                .map(
                  (s) =>
                    `<option value="${s.id}" ${s.id === data.shippingId ? "selected" : ""}>${s.name} — ${formatBRL(s.price)} (${s.daysMin}–${s.daysMax}d)</option>`
                )
                .join("")}
            </select>
          </label>
          <label class="field">
            <span>${icon("chat")} Observações</span>
            <textarea id="cartNotes" rows="2" placeholder="Observações do pedido">${data.notes || ""}</textarea>
          </label>
          <label class="check">
            <input type="checkbox" id="cartGift" ${data.gift?.enabled ? "checked" : ""} />
            <span>${icon("gift")} Enviar como presente ${data.gift?.wrap ? `(+ ${formatBRL(cfg.giftWrapPrice)})` : ""}</span>
          </label>
          <div class="gift-fields ${data.gift?.enabled ? "" : "is-hidden"}" id="giftFields">
            <label class="check"><input type="checkbox" id="giftWrap" ${data.gift?.wrap ? "checked" : ""} /> Embalagem para presente</label>
            <label class="check"><input type="checkbox" id="giftHide" ${data.gift?.hidePrice ? "checked" : ""} /> Esconder preço</label>
            <input type="text" id="giftTo" placeholder="Destinatário" value="${data.gift?.recipient || ""}" />
            <textarea id="giftMsg" rows="2" placeholder="Mensagem personalizada">${data.gift?.message || ""}</textarea>
          </div>
        </div>`
            : ""
        }
      </div>
      ${
        data.items.length
          ? `
      <footer class="drawer__foot">
        <div class="totals">
          <div><span>Subtotal</span><strong>${formatBRL(totals.subtotal)}</strong></div>
          <div><span>Desconto</span><strong>−${formatBRL(totals.discount)}</strong></div>
          <div><span>Frete</span><strong>${formatBRL(totals.shippingPrice)}</strong></div>
          ${totals.giftPrice ? `<div><span>Presente</span><strong>${formatBRL(totals.giftPrice)}</strong></div>` : ""}
          <div class="totals__total"><span>Total</span><strong>${formatBRL(totals.total)}</strong></div>
          <p class="totals__eta">${icon("truck")} Entrega estimada: ${totals.shipOpt.daysMin}–${totals.shipOpt.daysMax} dias úteis</p>
        </div>
        <a class="btn btn--wine btn--block" href="checkout.html">Finalizar no checkout</a>
        <button type="button" class="btn btn--outline-gold btn--block" id="cartWhatsApp">Finalizar Pedido no WhatsApp</button>
      </footer>`
          : ""
      }
    </aside>`;

  bindCartEvents(root);
}

function bindCartEvents(root) {
  root.querySelectorAll("[data-close-cart]").forEach((el) => el.addEventListener("click", closeCart));

  root.querySelectorAll(".cart-item").forEach((row) => {
    const pid = row.dataset.pid;
    const vid = row.dataset.vid;
    const size = row.dataset.size;
    row.querySelectorAll("[data-qty]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const item = cart.get().items.find((i) => i.productId === pid && i.variantId === vid && i.size === size);
        if (!item) return;
        cart.updateQty(pid, vid, size, item.qty + Number(btn.dataset.qty));
        await renderCartDrawer();
        updateBadges();
      });
    });
    row.querySelector("[data-remove]")?.addEventListener("click", async () => {
      cart.remove(pid, vid, size);
      toast("Item removido", "info");
      await renderCartDrawer();
      updateBadges();
    });
  });

  const couponBtn = root.querySelector("#applyCoupon");
  couponBtn?.addEventListener("click", async () => {
    const code = root.querySelector("#cartCoupon")?.value || "";
    const result = await findCoupon(code);
    const msg = root.querySelector("#couponMsg");
    if (!result.ok) {
      msg.textContent = result.error;
      msg.className = "field-error";
      return;
    }
    cart.setCoupon(result.coupon.code);
    msg.textContent = result.coupon.description;
    msg.className = "field-ok";
    toast("Cupom aplicado!", "success");
    await renderCartDrawer();
  });

  root.querySelector("#cartShipping")?.addEventListener("change", async (e) => {
    cart.setShipping(e.target.value);
    await renderCartDrawer();
  });

  root.querySelector("#cartNotes")?.addEventListener("change", (e) => cart.setNotes(e.target.value));

  const syncGift = async () => {
    cart.setGift({
      enabled: root.querySelector("#cartGift")?.checked || false,
      wrap: root.querySelector("#giftWrap")?.checked || false,
      hidePrice: root.querySelector("#giftHide")?.checked || false,
      recipient: root.querySelector("#giftTo")?.value || "",
      message: root.querySelector("#giftMsg")?.value || "",
    });
    await renderCartDrawer();
  };
  root.querySelector("#cartGift")?.addEventListener("change", syncGift);
  root.querySelector("#giftWrap")?.addEventListener("change", syncGift);
  root.querySelector("#giftHide")?.addEventListener("change", syncGift);
  root.querySelector("#giftTo")?.addEventListener("change", (e) => cart.setGift({ recipient: e.target.value }));
  root.querySelector("#giftMsg")?.addEventListener("change", (e) => cart.setGift({ message: e.target.value }));

  root.querySelector("#cartWhatsApp")?.addEventListener("click", async () => {
    await openWhatsAppOrder(cart.get());
    toast("Abrindo WhatsApp com seu pedido…", "success");
  });
}

export async function openCart() {
  open = true;
  document.body.classList.add("cart-open");
  await renderCartDrawer();
  document.getElementById("cartDrawer")?.classList.add("is-open");
}

export function closeCart() {
  open = false;
  document.body.classList.remove("cart-open");
  document.getElementById("cartDrawer")?.classList.remove("is-open");
}

export function updateBadges() {
  const count = cart.count();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

store.subscribe((key) => {
  if (key === "dg_cart") updateBadges();
});
