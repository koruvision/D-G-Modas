import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Placeholders premium locais (wine/gold/cream) para a proposta.
 * Usado quando Gemini image quota não está disponível.
 * Run: node scripts/generate-proposal-placeholders.mjs
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "assets", "proposta");

const SPECS = [
  { file: "hero-ecosystem.webp", w: 1600, h: 900, label: "Ecossistema", style: "nodes" },
  { file: "ecosystem-map.webp", w: 1600, h: 900, label: "8 pilares", style: "hub" },
  { file: "ecommerce-mockup.webp", w: 1600, h: 1000, label: "E-commerce", style: "ui" },
  { file: "catalogo-mobile.webp", w: 900, h: 1600, label: "Catálogo", style: "phone" },
  { file: "landing-mockup.webp", w: 1400, h: 1050, label: "Landing", style: "ui" },
  { file: "social-grid.webp", w: 1600, h: 900, label: "Social", style: "grid" },
  { file: "posts-calendar.webp", w: 1600, h: 900, label: "Posts", style: "calendar" },
  { file: "posts-ai.webp", w: 1400, h: 1050, label: "IA", style: "ai" },
  { file: "ads-dashboard.webp", w: 1600, h: 900, label: "Tráfego", style: "charts" },
  { file: "bling-dashboard.webp", w: 1600, h: 900, label: "Bling", style: "charts" },
  { file: "crm-kanban.webp", w: 1600, h: 900, label: "CRM", style: "kanban" },
  { file: "combos-visual.webp", w: 1600, h: 900, label: "Combos", style: "cards" },
];

function svgFor(spec) {
  const { w, h, label, style } = spec;
  const wine = "#c41e2a";
  const deep = "#8a1018";
  const gold = "#c9a76a";
  const cream = "#faf7f4";

  const overlays = {
    nodes: `
      <circle cx="${w * 0.5}" cy="${h * 0.48}" r="54" fill="${wine}" opacity="0.95"/>
      <circle cx="${w * 0.28}" cy="${h * 0.32}" r="28" fill="${gold}" opacity="0.9"/>
      <circle cx="${w * 0.72}" cy="${h * 0.3}" r="26" fill="${deep}" opacity="0.85"/>
      <circle cx="${w * 0.25}" cy="${h * 0.68}" r="22" fill="${gold}" opacity="0.8"/>
      <circle cx="${w * 0.75}" cy="${h * 0.7}" r="24" fill="${wine}" opacity="0.75"/>
      <circle cx="${w * 0.5}" cy="${h * 0.78}" r="20" fill="${gold}" opacity="0.7"/>
      <path d="M${w * 0.5} ${h * 0.48} L${w * 0.28} ${h * 0.32} M${w * 0.5} ${h * 0.48} L${w * 0.72} ${h * 0.3}
        M${w * 0.5} ${h * 0.48} L${w * 0.25} ${h * 0.68} M${w * 0.5} ${h * 0.48} L${w * 0.75} ${h * 0.7}
        M${w * 0.5} ${h * 0.48} L${w * 0.5} ${h * 0.78}" stroke="${gold}" stroke-width="2" opacity="0.55"/>`,
    hub: `
      <circle cx="${w / 2}" cy="${h / 2}" r="70" fill="${wine}"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315]
        .map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const cx = w / 2 + Math.cos(rad) * Math.min(w, h) * 0.28;
          const cy = h / 2 + Math.sin(rad) * Math.min(w, h) * 0.28;
          return `<circle cx="${cx}" cy="${cy}" r="36" fill="${i % 2 ? gold : deep}" opacity="0.88"/>
            <line x1="${w / 2}" y1="${h / 2}" x2="${cx}" y2="${cy}" stroke="${gold}" stroke-width="2" opacity="0.45"/>`;
        })
        .join("")}`,
    ui: `
      <rect x="${w * 0.12}" y="${h * 0.14}" width="${w * 0.76}" height="${h * 0.72}" rx="18" fill="#fff" opacity="0.92"/>
      <rect x="${w * 0.12}" y="${h * 0.14}" width="${w * 0.76}" height="${h * 0.1}" rx="18" fill="${deep}"/>
      <rect x="${w * 0.18}" y="${h * 0.34}" width="${w * 0.28}" height="${h * 0.38}" rx="12" fill="${wine}" opacity="0.15"/>
      <rect x="${w * 0.5}" y="${h * 0.34}" width="${w * 0.14}" height="${h * 0.18}" rx="10" fill="${gold}" opacity="0.35"/>
      <rect x="${w * 0.67}" y="${h * 0.34}" width="${w * 0.14}" height="${h * 0.18}" rx="10" fill="${wine}" opacity="0.25"/>
      <rect x="${w * 0.5}" y="${h * 0.56}" width="${w * 0.31}" height="${h * 0.16}" rx="10" fill="${deep}" opacity="0.12"/>`,
    phone: `
      <rect x="${w * 0.18}" y="${h * 0.06}" width="${w * 0.64}" height="${h * 0.88}" rx="48" fill="#1a1a1a"/>
      <rect x="${w * 0.22}" y="${h * 0.1}" width="${w * 0.56}" height="${h * 0.8}" rx="36" fill="${cream}"/>
      <rect x="${w * 0.26}" y="${h * 0.16}" width="${w * 0.48}" height="${h * 0.22}" rx="16" fill="${wine}" opacity="0.85"/>
      <rect x="${w * 0.26}" y="${h * 0.42}" width="${w * 0.22}" height="${h * 0.16}" rx="12" fill="${gold}" opacity="0.5"/>
      <rect x="${w * 0.52}" y="${h * 0.42}" width="${w * 0.22}" height="${h * 0.16}" rx="12" fill="${deep}" opacity="0.35"/>
      <rect x="${w * 0.26}" y="${h * 0.62}" width="${w * 0.48}" height="${h * 0.2}" rx="12" fill="${wine}" opacity="0.18"/>`,
    grid: `
      ${[0, 1, 2, 3, 4, 5]
        .map((i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = w * 0.1 + col * w * 0.28;
          const y = h * 0.16 + row * h * 0.34;
          const fill = i % 2 ? wine : gold;
          return `<rect x="${x}" y="${y}" width="${w * 0.24}" height="${h * 0.28}" rx="14" fill="${fill}" opacity="${0.35 + (i % 3) * 0.15}"/>`;
        })
        .join("")}`,
    calendar: `
      <rect x="${w * 0.08}" y="${h * 0.12}" width="${w * 0.84}" height="${h * 0.76}" rx="20" fill="#fff" opacity="0.9"/>
      ${Array.from({ length: 28 }, (_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const x = w * 0.14 + col * w * 0.1;
        const y = h * 0.28 + row * h * 0.14;
        const active = [3, 8, 11, 16, 22].includes(i);
        return `<rect x="${x}" y="${y}" width="${w * 0.08}" height="${h * 0.1}" rx="8" fill="${active ? wine : gold}" opacity="${active ? 0.55 : 0.18}"/>`;
      }).join("")}`,
    ai: `
      <circle cx="${w * 0.5}" cy="${h * 0.45}" r="90" fill="${wine}" opacity="0.2"/>
      <circle cx="${w * 0.5}" cy="${h * 0.45}" r="48" fill="${gold}" opacity="0.85"/>
      <rect x="${w * 0.18}" y="${h * 0.22}" width="${w * 0.2}" height="${h * 0.12}" rx="12" fill="#fff" opacity="0.85"/>
      <rect x="${w * 0.62}" y="${h * 0.58}" width="${w * 0.22}" height="${h * 0.14}" rx="12" fill="#fff" opacity="0.85"/>
      <rect x="${w * 0.2}" y="${h * 0.62}" width="${w * 0.18}" height="${h * 0.1}" rx="12" fill="${deep}" opacity="0.35"/>`,
    charts: `
      <rect x="${w * 0.1}" y="${h * 0.15}" width="${w * 0.8}" height="${h * 0.7}" rx="18" fill="#fff" opacity="0.9"/>
      <path d="M${w * 0.18} ${h * 0.68} L${w * 0.3} ${h * 0.5} L${w * 0.42} ${h * 0.55} L${w * 0.55} ${h * 0.35} L${w * 0.7} ${h * 0.4} L${w * 0.82} ${h * 0.28}"
        fill="none" stroke="${wine}" stroke-width="6" stroke-linecap="round"/>
      <rect x="${w * 0.2}" y="${h * 0.72}" width="${w * 0.08}" height="${h * 0.08}" rx="4" fill="${gold}" opacity="0.7"/>
      <rect x="${w * 0.32}" y="${h * 0.65}" width="${w * 0.08}" height="${h * 0.15}" rx="4" fill="${wine}" opacity="0.55"/>
      <rect x="${w * 0.44}" y="${h * 0.58}" width="${w * 0.08}" height="${h * 0.22}" rx="4" fill="${gold}" opacity="0.65"/>
      <rect x="${w * 0.56}" y="${h * 0.5}" width="${w * 0.08}" height="${h * 0.3}" rx="4" fill="${deep}" opacity="0.55"/>`,
    kanban: `
      <rect x="${w * 0.08}" y="${h * 0.14}" width="${w * 0.84}" height="${h * 0.72}" rx="18" fill="#fff" opacity="0.9"/>
      ${[0, 1, 2, 3]
        .map((c) => {
          const x = w * 0.12 + c * w * 0.2;
          return `<rect x="${x}" y="${h * 0.2}" width="${w * 0.16}" height="${h * 0.08}" rx="8" fill="${c === 1 ? wine : gold}" opacity="0.45"/>
            <rect x="${x}" y="${h * 0.34}" width="${w * 0.16}" height="${h * 0.14}" rx="10" fill="${cream}" stroke="${gold}" stroke-width="2"/>
            <rect x="${x}" y="${h * 0.52}" width="${w * 0.16}" height="${h * 0.14}" rx="10" fill="${cream}" stroke="${wine}" stroke-width="1.5" opacity="0.8"/>
            <rect x="${x}" y="${h * 0.7}" width="${w * 0.16}" height="${h * 0.1}" rx="10" fill="${deep}" opacity="0.12"/>`;
        })
        .join("")}`,
    cards: `
      <rect x="${w * 0.18}" y="${h * 0.28}" width="${w * 0.28}" height="${h * 0.42}" rx="22" fill="#fff" opacity="0.75" transform="rotate(-6 ${w * 0.32} ${h * 0.5})"/>
      <rect x="${w * 0.36}" y="${h * 0.22}" width="${w * 0.3}" height="${h * 0.48}" rx="22" fill="${wine}" opacity="0.85"/>
      <rect x="${w * 0.55}" y="${h * 0.3}" width="${w * 0.28}" height="${h * 0.42}" rx="22" fill="${gold}" opacity="0.8" transform="rotate(7 ${w * 0.69} ${h * 0.5})"/>`,
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${cream}"/>
      <stop offset="55%" stop-color="#f3ebe4"/>
      <stop offset="100%" stop-color="#efe4d8"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="20%" r="50%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${gold}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="15%" cy="80%" r="45%">
      <stop offset="0%" stop-color="${wine}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${wine}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#glow2)"/>
  ${overlays[style] || overlays.ui}
  <text x="${w / 2}" y="${h - 48}" text-anchor="middle" fill="${deep}" font-family="Georgia, serif" font-size="${Math.max(22, Math.round(w * 0.028))}" opacity="0.55">${label}</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const spec of SPECS) {
    const svg = Buffer.from(svgFor(spec));
    const out = path.join(OUT, spec.file);
    await sharp(svg).webp({ quality: 88 }).toFile(out);
    console.log("✓", spec.file);
  }
  console.log("Placeholders prontos em public/assets/proposta/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
