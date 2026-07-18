import { formatBRL } from "../lib/utils.js";
import { loadConfig, computeTotals } from "./api.js";

export async function buildWhatsAppMessage(cartData) {
  const cfg = await loadConfig();
  const totals = await computeTotals(cartData);
  const lines = [];
  lines.push(`*Novo pedido — ${cfg.brand}*`);
  lines.push("");

  if (cartData.customer) {
    lines.push(`*Cliente:* ${cartData.customer.name || "—"}`);
    if (cartData.customer.phone) lines.push(`*Telefone:* ${cartData.customer.phone}`);
    if (cartData.customer.email) lines.push(`*E-mail:* ${cartData.customer.email}`);
  }

  if (cartData.address) {
    const a = cartData.address;
    lines.push(
      `*Endereço:* ${a.street || ""}, ${a.number || ""} ${a.complement || ""} — ${a.district || ""}, ${a.city || ""}/${a.state || ""} — CEP ${a.cep || ""}`
    );
  }

  lines.push("");
  lines.push("*Itens:*");
  cartData.items.forEach((i) => {
    lines.push(
      `• ${i.name} | ${i.size} | ${i.color} | ${i.sku} | ${i.qty}x ${formatBRL(i.price)} = ${formatBRL(i.price * i.qty)}`
    );
  });

  lines.push("");
  lines.push(`*Subtotal:* ${formatBRL(totals.subtotal)}`);
  if (totals.discount > 0) {
    lines.push(
      `*Desconto:* −${formatBRL(totals.discount)}${totals.couponMeta ? ` (${totals.couponMeta.code})` : ""}`
    );
  }
  lines.push(
    `*Frete:* ${totals.shipOpt.name} — ${formatBRL(totals.shippingPrice)} (${totals.shipOpt.daysMin}–${totals.shipOpt.daysMax} dias)`
  );
  if (totals.giftPrice > 0) lines.push(`*Embalagem presente:* ${formatBRL(totals.giftPrice)}`);
  lines.push(`*Total:* ${formatBRL(totals.total)}`);

  if (cartData.gift?.enabled) {
    lines.push("");
    lines.push("*Presente:* Sim");
    if (cartData.gift.hidePrice) lines.push("Esconder preço: Sim");
    if (cartData.gift.recipient) lines.push(`Destinatário: ${cartData.gift.recipient}`);
    if (cartData.gift.message) lines.push(`Mensagem: ${cartData.gift.message}`);
  }

  if (cartData.notes) {
    lines.push("");
    lines.push(`*Observações:* ${cartData.notes}`);
  }

  lines.push("");
  lines.push("_Pedido gerado pelo site DG Modas_");
  return lines.join("\n");
}

export async function openWhatsAppOrder(cartData) {
  const cfg = await loadConfig();
  const text = await buildWhatsAppMessage(cartData);
  const url = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}

export async function whatsappLink(text = "") {
  const cfg = await loadConfig();
  return `https://wa.me/${cfg.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
