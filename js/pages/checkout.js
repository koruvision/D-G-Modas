import { boot } from "../app.js";
import { cart } from "../store/cart.js";
import { formatBRL, icon } from "../utils.js";
import { computeTotals, findCoupon, loadShipping, loadConfig } from "../services/checkout.js";
import { openWhatsAppOrder } from "../services/whatsapp.js";
import { toast } from "../ui/toast.js";
import { bagMascotHtml, initBagMascot } from "../ui/bag-mascot.js";

function ensureSearchModal() {
  if (document.getElementById("searchModal")) return;
  const el = document.createElement("div");
  el.id = "searchModal";
  el.className = "search-modal";
  el.innerHTML = `
    <div class="search-modal__overlay" data-close-search></div>
    <div class="search-modal__panel">
      <form id="searchForm" class="search-modal__form">
        ${icon("search")}
        <input id="searchInput" type="search" placeholder="Buscar…" />
        <button type="button" class="icon-btn" data-close-search>${icon("close")}</button>
      </form>
      <div id="searchResults"></div>
    </div>`;
  document.body.appendChild(el);
}

let step = 1;
let mascotReady = false;

function mountMascot() {
  const slot = document.getElementById("checkoutMascot");
  if (!slot || mascotReady) return;
  slot.innerHTML = bagMascotHtml();
  mascotReady = true;
  // Wait a tick so GSAP CDN is available
  requestAnimationFrame(() => initBagMascot(slot));
}

async function initCheckout() {
  mountMascot();
  const data = cart.get();
  if (!data.items.length) {
    document.getElementById("checkoutRoot").innerHTML = `
      <div class="empty-state">
        ${icon("bag")}
        <p>Seu carrinho está vazio</p>
        <a class="btn btn--wine" href="catalogo.html">Ver catálogo</a>
      </div>`;
    return;
  }
  await render();
}

async function render() {
  const root = document.getElementById("checkoutRoot");
  const data = cart.get();
  const totals = await computeTotals(data);
  const shipping = await loadShipping();
  const cfg = await loadConfig();

  const steps = [
    { n: 1, label: "Dados", icon: "user" },
    { n: 2, label: "Endereço", icon: "map" },
    { n: 3, label: "Frete", icon: "truck" },
    { n: 4, label: "Cupom", icon: "tag" },
    { n: 5, label: "Presente", icon: "gift" },
    { n: 6, label: "Resumo", icon: "check" },
  ];

  root.innerHTML = `
    <div class="checkout">
      <ol class="checkout-steps">
        ${steps
          .map(
            (s) =>
              `<li class="${s.n === step ? "is-active" : ""} ${s.n < step ? "is-done" : ""}">${icon(s.icon)}<span>${s.label}</span></li>`
          )
          .join("")}
      </ol>
      <div class="checkout__grid">
        <div class="checkout__main" id="stepPanel"></div>
        <aside class="checkout__summary">
          <h3>${icon("bag")} Resumo do pedido</h3>
          <ul class="summary-items">
            ${data.items
              .map(
                (i) =>
                  `<li><img src="${i.image}" alt="" /><span><strong>${i.name}</strong><small>${i.color} · ${i.size} · ${i.qty}x</small></span><strong>${formatBRL(i.price * i.qty)}</strong></li>`
              )
              .join("")}
          </ul>
          <div class="totals">
            <div><span>Subtotal</span><strong>${formatBRL(totals.subtotal)}</strong></div>
            <div><span>Desconto</span><strong>−${formatBRL(totals.discount)}</strong></div>
            <div><span>Frete</span><strong>${formatBRL(totals.shippingPrice)}</strong></div>
            ${totals.giftPrice ? `<div><span>Presente</span><strong>${formatBRL(totals.giftPrice)}</strong></div>` : ""}
            <div class="totals__total"><span>Total</span><strong>${formatBRL(totals.total)}</strong></div>
          </div>
        </aside>
      </div>
    </div>`;

  const panel = root.querySelector("#stepPanel");
  const c = data.customer || {};
  const a = data.address || {};

  if (step === 1) {
    panel.innerHTML = `
      <h2>${icon("user")} Seus dados</h2>
      <form id="formCustomer" class="form-grid">
        <label class="field"><span>Nome completo</span><input name="name" required value="${c.name || ""}" /></label>
        <label class="field"><span>Telefone / WhatsApp</span><input name="phone" required value="${c.phone || ""}" /></label>
        <label class="field"><span>E-mail</span><input name="email" type="email" value="${c.email || ""}" /></label>
        <button type="submit" class="btn btn--wine">Continuar</button>
      </form>`;
    panel.querySelector("#formCustomer").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      cart.setCustomer({ name: fd.get("name"), phone: fd.get("phone"), email: fd.get("email") });
      step = 2;
      render();
    });
  }

  if (step === 2) {
    panel.innerHTML = `
      <h2>${icon("map")} Endereço de entrega</h2>
      <form id="formAddress" class="form-grid">
        <label class="field"><span>CEP</span><input name="cep" required value="${a.cep || ""}" placeholder="00000-000" /></label>
        <label class="field"><span>Rua</span><input name="street" required value="${a.street || ""}" /></label>
        <label class="field field--sm"><span>Número</span><input name="number" required value="${a.number || ""}" /></label>
        <label class="field field--sm"><span>Complemento</span><input name="complement" value="${a.complement || ""}" /></label>
        <label class="field"><span>Bairro</span><input name="district" required value="${a.district || ""}" /></label>
        <label class="field field--sm"><span>Cidade</span><input name="city" required value="${a.city || ""}" /></label>
        <label class="field field--sm"><span>UF</span><input name="state" required maxlength="2" value="${a.state || ""}" /></label>
        <div class="form-actions">
          <button type="button" class="btn btn--ghost" data-back>Voltar</button>
          <button type="submit" class="btn btn--wine">Continuar</button>
        </div>
      </form>`;
    panel.querySelector("[data-back]").onclick = () => {
      step = 1;
      render();
    };
    panel.querySelector("#formAddress").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      cart.setAddress(Object.fromEntries(fd.entries()));
      step = 3;
      render();
    });
  }

  if (step === 3) {
    panel.innerHTML = `
      <h2>${icon("truck")} Modalidade de frete</h2>
      <div class="ship-list">
        ${shipping
          .map(
            (s) => `
          <label class="ship-option ${data.shippingId === s.id ? "is-active" : ""}">
            <input type="radio" name="ship" value="${s.id}" ${data.shippingId === s.id ? "checked" : ""} />
            <span>
              <strong>${s.name}</strong>
              <small>${s.description} · ${s.daysMin}–${s.daysMax} dias úteis</small>
            </span>
            <strong>${formatBRL(s.price)}</strong>
          </label>`
          )
          .join("")}
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--ghost" data-back>Voltar</button>
        <button type="button" class="btn btn--wine" data-next>Continuar</button>
      </div>`;
    panel.querySelectorAll("input[name=ship]").forEach((inp) =>
      inp.addEventListener("change", async () => {
        cart.setShipping(inp.value);
        await render();
      })
    );
    panel.querySelector("[data-back]").onclick = () => {
      step = 2;
      render();
    };
    panel.querySelector("[data-next]").onclick = () => {
      step = 4;
      render();
    };
  }

  if (step === 4) {
    panel.innerHTML = `
      <h2>${icon("tag")} Cupom de desconto</h2>
      <div class="field-row">
        <input type="text" id="chkCoupon" value="${data.coupon || ""}" placeholder="PRIMEIRACOMPRA, DESCONTO10…" />
        <button type="button" class="btn btn--ghost" id="applyChkCoupon">Aplicar</button>
      </div>
      <p id="chkCouponMsg" class="field-ok">${totals.couponMeta ? totals.couponMeta.description : "Cupons: PRIMEIRACOMPRA · DESCONTO10 · CLIENTEVIP · FRETEGRATIS · BEMVINDA5"}</p>
      <label class="field"><span>${icon("chat")} Observações</span><textarea id="chkNotes" rows="3">${data.notes || ""}</textarea></label>
      <div class="form-actions">
        <button type="button" class="btn btn--ghost" data-back>Voltar</button>
        <button type="button" class="btn btn--wine" data-next>Continuar</button>
      </div>`;
    panel.querySelector("#applyChkCoupon").onclick = async () => {
      const code = panel.querySelector("#chkCoupon").value;
      const result = await findCoupon(code);
      const msg = panel.querySelector("#chkCouponMsg");
      if (!result.ok) {
        msg.textContent = result.error;
        msg.className = "field-error";
        return;
      }
      cart.setCoupon(result.coupon.code);
      toast("Cupom aplicado", "success");
      await render();
    };
    panel.querySelector("#chkNotes").onchange = (e) => cart.setNotes(e.target.value);
    panel.querySelector("[data-back]").onclick = () => {
      step = 3;
      render();
    };
    panel.querySelector("[data-next]").onclick = () => {
      cart.setNotes(panel.querySelector("#chkNotes").value);
      step = 5;
      render();
    };
  }

  if (step === 5) {
    const g = data.gift || {};
    panel.innerHTML = `
      <h2>${icon("gift")} Lista de presentes</h2>
      <label class="check"><input type="checkbox" id="gEnable" ${g.enabled ? "checked" : ""} /> Enviar como presente</label>
      <div class="gift-box ${g.enabled ? "" : "is-hidden"}" id="gBox">
        <label class="check"><input type="checkbox" id="gWrap" ${g.wrap ? "checked" : ""} /> Embalagem para presente (+ ${formatBRL(cfg.giftWrapPrice)})</label>
        <label class="check"><input type="checkbox" id="gHide" ${g.hidePrice ? "checked" : ""} /> Esconder preço</label>
        <label class="check"><input type="checkbox" id="gDirect" /> Entregar diretamente ao destinatário</label>
        <input type="text" id="gTo" placeholder="Nome do destinatário" value="${g.recipient || ""}" />
        <textarea id="gMsg" rows="3" placeholder="Mensagem personalizada">${g.message || ""}</textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--ghost" data-back>Voltar</button>
        <button type="button" class="btn btn--wine" data-next>Ver resumo</button>
      </div>`;
    const sync = async () => {
      cart.setGift({
        enabled: panel.querySelector("#gEnable").checked,
        wrap: panel.querySelector("#gWrap")?.checked || false,
        hidePrice: panel.querySelector("#gHide")?.checked || false,
        recipient: panel.querySelector("#gTo")?.value || "",
        message: panel.querySelector("#gMsg")?.value || "",
      });
      await render();
    };
    panel.querySelector("#gEnable").onchange = sync;
    panel.querySelector("#gWrap")?.addEventListener("change", sync);
    panel.querySelector("[data-back]").onclick = () => {
      step = 4;
      render();
    };
    panel.querySelector("[data-next]").onclick = async () => {
      cart.setGift({
        enabled: panel.querySelector("#gEnable").checked,
        wrap: panel.querySelector("#gWrap")?.checked || false,
        hidePrice: panel.querySelector("#gHide")?.checked || false,
        recipient: panel.querySelector("#gTo")?.value || "",
        message: panel.querySelector("#gMsg")?.value || "",
      });
      step = 6;
      await render();
    };
  }

  if (step === 6) {
    panel.innerHTML = `
      <h2>${icon("check")} Confirmação</h2>
      <div class="confirm-box">
        <p><strong>Cliente:</strong> ${data.customer?.name} · ${data.customer?.phone}</p>
        <p><strong>Endereço:</strong> ${data.address?.street}, ${data.address?.number} — ${data.address?.city}/${data.address?.state}</p>
        <p><strong>Frete:</strong> ${totals.shipOpt.name}</p>
        <p><strong>Total:</strong> ${formatBRL(totals.total)}</p>
        <p class="muted">Ao finalizar, abriremos o WhatsApp com todos os dados do pedido para atendimento personalizado. Não há pagamento online.</p>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--ghost" data-back>Voltar</button>
        <button type="button" class="btn btn--wine btn--lg" id="finalize">${icon("chat")} Finalizar Pedido no WhatsApp</button>
      </div>`;
    panel.querySelector("[data-back]").onclick = () => {
      step = 5;
      render();
    };
    panel.querySelector("#finalize").onclick = async () => {
      await openWhatsAppOrder(cart.get());
      toast("Pedido enviado ao WhatsApp!", "success");
    };
  }
}

ensureSearchModal();
boot(initCheckout);
