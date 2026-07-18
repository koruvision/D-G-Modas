import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon.jsx";
import { BagMascot } from "../components/BagMascot.jsx";
import { useCart } from "../hooks/useCart.jsx";
import { useUi } from "../hooks/useUi.jsx";
import { loadShipping, loadConfig, findCoupon } from "../services/api.js";
import { openWhatsAppOrder } from "../services/whatsapp.js";
import { formatBRL } from "../lib/utils.js";

const STEPS = [
  { n: 1, label: "Dados", icon: "user" },
  { n: 2, label: "Endereço", icon: "map" },
  { n: 3, label: "Frete", icon: "truck" },
  { n: 4, label: "Cupom", icon: "tag" },
  { n: 5, label: "Presente", icon: "gift" },
  { n: 6, label: "Resumo", icon: "check" },
];

function StepCustomer({ cart, onNext }) {
  const c = cart.customer || {};
  const { setCustomer } = useCart();
  return (
    <>
      <h2>
        <Icon name="user" /> Seus dados
      </h2>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          setCustomer({ name: fd.get("name"), phone: fd.get("phone"), email: fd.get("email") });
          onNext();
        }}
      >
        <label className="field">
          <span>Nome completo</span>
          <input name="name" required defaultValue={c.name || ""} />
        </label>
        <label className="field">
          <span>Telefone / WhatsApp</span>
          <input name="phone" required defaultValue={c.phone || ""} />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input name="email" type="email" defaultValue={c.email || ""} />
        </label>
        <button type="submit" className="btn btn--wine">
          Continuar
        </button>
      </form>
    </>
  );
}

function StepAddress({ cart, onNext, onBack }) {
  const a = cart.address || {};
  const { setAddress } = useCart();
  return (
    <>
      <h2>
        <Icon name="map" /> Endereço de entrega
      </h2>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          setAddress(Object.fromEntries(fd.entries()));
          onNext();
        }}
      >
        <label className="field">
          <span>CEP</span>
          <input name="cep" required defaultValue={a.cep || ""} placeholder="00000-000" />
        </label>
        <label className="field">
          <span>Rua</span>
          <input name="street" required defaultValue={a.street || ""} />
        </label>
        <label className="field field--sm">
          <span>Número</span>
          <input name="number" required defaultValue={a.number || ""} />
        </label>
        <label className="field field--sm">
          <span>Complemento</span>
          <input name="complement" defaultValue={a.complement || ""} />
        </label>
        <label className="field">
          <span>Bairro</span>
          <input name="district" required defaultValue={a.district || ""} />
        </label>
        <label className="field field--sm">
          <span>Cidade</span>
          <input name="city" required defaultValue={a.city || ""} />
        </label>
        <label className="field field--sm">
          <span>UF</span>
          <input name="state" required maxLength="2" defaultValue={a.state || ""} />
        </label>
        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            Voltar
          </button>
          <button type="submit" className="btn btn--wine">
            Continuar
          </button>
        </div>
      </form>
    </>
  );
}

function StepShipping({ cart, shipping, onNext, onBack }) {
  const { setShipping } = useCart();
  return (
    <>
      <h2>
        <Icon name="truck" /> Modalidade de frete
      </h2>
      <div className="ship-list">
        {shipping.map((s) => (
          <label key={s.id} className={`ship-option ${cart.shippingId === s.id ? "is-active" : ""}`}>
            <input
              type="radio"
              name="ship"
              value={s.id}
              checked={cart.shippingId === s.id}
              onChange={() => setShipping(s.id)}
            />
            <span>
              <strong>{s.name}</strong>
              <small>
                {s.description} · {s.daysMin}–{s.daysMax} dias úteis
              </small>
            </span>
            <strong>{formatBRL(s.price)}</strong>
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Voltar
        </button>
        <button type="button" className="btn btn--wine" onClick={onNext}>
          Continuar
        </button>
      </div>
    </>
  );
}

function StepCoupon({ cart, totals, onNext, onBack }) {
  const { setCoupon, setNotes } = useCart();
  const [code, setCode] = useState(cart.coupon || "");
  const [notes, setLocalNotes] = useState(cart.notes || "");
  const [msg, setMsg] = useState({
    text: totals?.couponMeta
      ? totals.couponMeta.description
      : "Cupons: PRIMEIRACOMPRA · DESCONTO10 · CLIENTEVIP · FRETEGRATIS · BEMVINDA5",
    ok: true,
  });

  const apply = async () => {
    const result = await findCoupon(code);
    if (!result.ok) {
      setMsg({ text: result.error, ok: false });
      return;
    }
    setCoupon(result.coupon.code);
    setMsg({ text: result.coupon.description, ok: true });
  };

  return (
    <>
      <h2>
        <Icon name="tag" /> Cupom de desconto
      </h2>
      <div className="field-row">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="PRIMEIRACOMPRA, DESCONTO10…"
        />
        <button type="button" className="btn btn--ghost" onClick={apply}>
          Aplicar
        </button>
      </div>
      <p className={msg.ok ? "field-ok" : "field-error"}>{msg.text}</p>
      <label className="field">
        <span>
          <Icon name="chat" /> Observações
        </span>
        <textarea rows="3" value={notes} onChange={(e) => setLocalNotes(e.target.value)} />
      </label>
      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Voltar
        </button>
        <button
          type="button"
          className="btn btn--wine"
          onClick={() => {
            setNotes(notes);
            onNext();
          }}
        >
          Continuar
        </button>
      </div>
    </>
  );
}

function StepGift({ cart, cfg, onNext, onBack }) {
  const { setGift } = useCart();
  const g = cart.gift || {};
  const [enabled, setEnabled] = useState(!!g.enabled);
  const [wrap, setWrap] = useState(!!g.wrap);
  const [hidePrice, setHidePrice] = useState(!!g.hidePrice);
  const [recipient, setRecipient] = useState(g.recipient || "");
  const [message, setMessage] = useState(g.message || "");

  const sync = (patch) => setGift({ enabled, wrap, hidePrice, recipient, message, ...patch });

  return (
    <>
      <h2>
        <Icon name="gift" /> Lista de presentes
      </h2>
      <label className="check">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            setEnabled(e.target.checked);
            sync({ enabled: e.target.checked });
          }}
        />{" "}
        Enviar como presente
      </label>
      <div className={`gift-box ${enabled ? "" : "is-hidden"}`}>
        <label className="check">
          <input
            type="checkbox"
            checked={wrap}
            onChange={(e) => {
              setWrap(e.target.checked);
              sync({ wrap: e.target.checked });
            }}
          />{" "}
          Embalagem para presente (+ {cfg ? formatBRL(cfg.giftWrapPrice) : "—"})
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={hidePrice}
            onChange={(e) => {
              setHidePrice(e.target.checked);
              sync({ hidePrice: e.target.checked });
            }}
          />{" "}
          Esconder preço
        </label>
        <input
          type="text"
          placeholder="Nome do destinatário"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <textarea
          rows="3"
          placeholder="Mensagem personalizada"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Voltar
        </button>
        <button
          type="button"
          className="btn btn--wine"
          onClick={() => {
            sync({});
            onNext();
          }}
        >
          Ver resumo
        </button>
      </div>
    </>
  );
}

function StepConfirm({ cart, totals, onBack }) {
  const ui = useUi();
  return (
    <>
      <h2>
        <Icon name="check" /> Confirmação
      </h2>
      <div className="confirm-box">
        <p>
          <strong>Cliente:</strong> {cart.customer?.name} · {cart.customer?.phone}
        </p>
        <p>
          <strong>Endereço:</strong> {cart.address?.street}, {cart.address?.number} — {cart.address?.city}/
          {cart.address?.state}
        </p>
        <p>
          <strong>Frete:</strong> {totals?.shipOpt?.name}
        </p>
        <p>
          <strong>Total:</strong> {totals ? formatBRL(totals.total) : "—"}
        </p>
        <p className="muted">
          Ao finalizar, abriremos o WhatsApp com todos os dados do pedido para atendimento personalizado. Não há
          pagamento online.
        </p>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Voltar
        </button>
        <button
          type="button"
          className="btn btn--wine btn--lg"
          onClick={async () => {
            await openWhatsAppOrder(cart);
            ui.toast("Pedido enviado ao WhatsApp!", "success");
          }}
        >
          <Icon name="chat" /> Finalizar Pedido no WhatsApp
        </button>
      </div>
    </>
  );
}

export function CheckoutPage() {
  const { cart, totals } = useCart();
  const [step, setStep] = useState(1);
  const [shipping, setShippingList] = useState([]);
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    loadShipping().then(setShippingList);
    loadConfig().then(setCfg);
  }, []);

  if (!cart.items.length) {
    return (
      <div className="container">
        <div className="empty-state">
          <Icon name="bag" />
          <p>Seu carrinho está vazio</p>
          <Link className="btn btn--wine" to="/catalogo">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-hero page-hero--checkout reveal-lux">
        <div className="container page-hero__checkout">
          <div className="page-hero__copy">
            <div className="section-label">Checkout</div>
            <h1>
              Finalizar <span className="script">pedido</span>
            </h1>
            <p>Pagamento e confirmação pelo WhatsApp com atendimento personalizado.</p>
          </div>
          <BagMascot />
        </div>
      </div>
      <div className="container">
        <div className="checkout">
          <ol className="checkout-steps reveal-lux">
            {STEPS.map((s) => (
              <li key={s.n} className={`${s.n === step ? "is-active" : ""} ${s.n < step ? "is-done" : ""}`.trim()}>
                <Icon name={s.icon} />
                <span>{s.label}</span>
              </li>
            ))}
          </ol>
          <div className="checkout__grid">
            <div className="checkout__main reveal-lux">
              {step === 1 && <StepCustomer cart={cart} onNext={() => setStep(2)} />}
              {step === 2 && <StepAddress cart={cart} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
              {step === 3 && (
                <StepShipping
                  cart={cart}
                  shipping={shipping}
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && (
                <StepCoupon cart={cart} totals={totals} onNext={() => setStep(5)} onBack={() => setStep(3)} />
              )}
              {step === 5 && (
                <StepGift cart={cart} cfg={cfg} onNext={() => setStep(6)} onBack={() => setStep(4)} />
              )}
              {step === 6 && <StepConfirm cart={cart} totals={totals} onBack={() => setStep(5)} />}
            </div>
            <aside className="checkout__summary reveal-lux">
              <h3>
                <Icon name="bag" /> Resumo do pedido
              </h3>
              <ul className="summary-items">
                {cart.items.map((i) => (
                  <li key={`${i.productId}|${i.variantId}|${i.size}`}>
                    <img src={i.image?.startsWith("/") ? i.image : `/${i.image}`} alt="" />
                    <span>
                      <strong>{i.name}</strong>
                      <small>
                        {i.color} · {i.size} · {i.qty}x
                      </small>
                    </span>
                    <strong>{formatBRL(i.price * i.qty)}</strong>
                  </li>
                ))}
              </ul>
              {totals && (
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
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
