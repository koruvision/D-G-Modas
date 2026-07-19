import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon.jsx";
import { useCart } from "../hooks/useCart.jsx";
import { useUi } from "../hooks/useUi.jsx";
import { loadShipping, loadConfig, findCoupon } from "../services/api.js";
import { openWhatsAppOrder } from "../services/whatsapp.js";
import { formatBRL, assetUrl } from "../lib/utils.js";

export function CartDrawer() {
  const ui = useUi();
  const { cart, totals, count, updateQty, remove, setCoupon, setShipping, setNotes, setGift } = useCart();
  const [shipping, setShippingList] = useState([]);
  const [cfg, setCfg] = useState(null);
  const [couponInput, setCouponInput] = useState(cart.coupon || "");
  const [couponMsg, setCouponMsg] = useState({ text: "", ok: true });
  const [notes, setLocalNotes] = useState(cart.notes || "");

  useEffect(() => {
    loadShipping().then(setShippingList);
    loadConfig().then(setCfg);
  }, []);

  useEffect(() => {
    setCouponInput(cart.coupon || "");
    setLocalNotes(cart.notes || "");
  }, [cart.coupon, cart.notes]);

  useEffect(() => {
    document.body.classList.toggle("cart-open", ui.cartOpen);
  }, [ui.cartOpen]);

  const applyCoupon = async () => {
    const result = await findCoupon(couponInput);
    if (!result.ok) {
      setCouponMsg({ text: result.error, ok: false });
      return;
    }
    setCoupon(result.coupon.code);
    setCouponMsg({ text: result.coupon.description, ok: true });
    ui.toast("Cupom aplicado!", "success");
  };

  const gift = cart.gift || {};

  return (
    <div className={`drawer ${ui.cartOpen ? "is-open" : ""}`}>
      <div className="drawer__overlay" onClick={ui.closeCart} />
      <aside className="drawer__panel" role="dialog" aria-label="Carrinho">
        <header className="drawer__head">
          <h2>
            <Icon name="bag" /> Carrinho <span className="badge-count">{count}</span>
          </h2>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={ui.closeCart}>
            <Icon name="close" />
          </button>
        </header>
        <div className="drawer__body">
          <div className="cart-list">
            {cart.items.length === 0 ? (
              <div className="empty-state">
                <Icon name="bag" className="icon icon--lg" />
                <p>Seu carrinho está vazio</p>
                <Link className="btn btn--wine btn--sm" to="/catalogo" onClick={ui.closeCart}>
                  Ver catálogo
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <article
                  key={`${item.productId}|${item.variantId}|${item.size}`}
                  className="cart-item"
                >
                  <img src={assetUrl(item.image || "assets/logo-dg-modas.webp")} alt={item.name} width="72" height="96" loading="lazy" decoding="async" />
                  <div className="cart-item__info">
                    <h4>{item.name}</h4>
                    <p>
                      {item.color} · {item.size} · {item.sku}
                    </p>
                    <p className="cart-item__price">{formatBRL(item.price)}</p>
                    <div className="qty">
                      <button
                        type="button"
                        aria-label="Diminuir"
                        onClick={() => updateQty(item.productId, item.variantId, item.size, item.qty - 1)}
                      >
                        <Icon name="minus" />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        onClick={() => updateQty(item.productId, item.variantId, item.size, item.qty + 1)}
                      >
                        <Icon name="plus" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="icon-btn cart-item__remove"
                    aria-label="Remover"
                    onClick={() => {
                      remove(item.productId, item.variantId, item.size);
                      ui.toast("Item removido", "info");
                    }}
                  >
                    <Icon name="close" />
                  </button>
                </article>
              ))
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="cart-extras">
              <label className="field">
                <span>
                  <Icon name="tag" /> Cupom
                </span>
                <div className="field-row">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Ex: DESCONTO10"
                  />
                  <button type="button" className="btn btn--ghost" onClick={applyCoupon}>
                    Aplicar
                  </button>
                </div>
                {couponMsg.text ? (
                  <small className={couponMsg.ok ? "field-ok" : "field-error"}>{couponMsg.text}</small>
                ) : null}
              </label>
              <label className="field">
                <span>
                  <Icon name="truck" /> Frete
                </span>
                <select value={cart.shippingId} onChange={(e) => setShipping(e.target.value)}>
                  {shipping.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatBRL(s.price)} ({s.daysMin}–{s.daysMax}d)
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>
                  <Icon name="chat" /> Observações
                </span>
                <textarea
                  rows="2"
                  placeholder="Observações do pedido"
                  value={notes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  onBlur={(e) => setNotes(e.target.value)}
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={!!gift.enabled}
                  onChange={(e) => setGift({ enabled: e.target.checked })}
                />
                <span>
                  <Icon name="gift" /> Enviar como presente{" "}
                  {gift.wrap && cfg ? `(+ ${formatBRL(cfg.giftWrapPrice)})` : ""}
                </span>
              </label>
              <div className={`gift-fields ${gift.enabled ? "" : "is-hidden"}`}>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={!!gift.wrap}
                    onChange={(e) => setGift({ wrap: e.target.checked })}
                  />{" "}
                  Embalagem para presente
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={!!gift.hidePrice}
                    onChange={(e) => setGift({ hidePrice: e.target.checked })}
                  />{" "}
                  Esconder preço
                </label>
                <input
                  type="text"
                  placeholder="Destinatário"
                  defaultValue={gift.recipient || ""}
                  onBlur={(e) => setGift({ recipient: e.target.value })}
                />
                <textarea
                  rows="2"
                  placeholder="Mensagem personalizada"
                  defaultValue={gift.message || ""}
                  onBlur={(e) => setGift({ message: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        {cart.items.length > 0 && totals && (
          <footer className="drawer__foot">
            <div className="totals">
              <div>
                <span>Subtotal</span>
                <strong>{formatBRL(totals.subtotal)}</strong>
              </div>
              <div>
                <span>Desconto</span>
                <strong>−{formatBRL(totals.discount)}</strong>
              </div>
              <div>
                <span>Frete</span>
                <strong>{formatBRL(totals.shippingPrice)}</strong>
              </div>
              {totals.giftPrice ? (
                <div>
                  <span>Presente</span>
                  <strong>{formatBRL(totals.giftPrice)}</strong>
                </div>
              ) : null}
              <div className="totals__total">
                <span>Total</span>
                <strong>{formatBRL(totals.total)}</strong>
              </div>
              <p className="totals__eta">
                <Icon name="truck" /> Entrega estimada: {totals.shipOpt.daysMin}–{totals.shipOpt.daysMax} dias úteis
              </p>
            </div>
            <Link className="btn btn--wine btn--block" to="/checkout" onClick={ui.closeCart}>
              Finalizar no checkout
            </Link>
            <button
              type="button"
              className="btn btn--outline-gold btn--block"
              onClick={async () => {
                await openWhatsAppOrder(cart);
                ui.toast("Abrindo WhatsApp com seu pedido…", "success");
              }}
            >
              Finalizar Pedido no WhatsApp
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
