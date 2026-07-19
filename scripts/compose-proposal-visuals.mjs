import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "assets", "proposta");
const LOGO = path.join(ROOT, "public", "assets", "logo-header.webp");

const SOURCES = {
  "hero-ecosystem.webp": "public/assets/banner-hero-1.webp",
  "ecosystem-map.webp": "public/assets/familia-imperio.webp",
  "ecommerce-mockup.webp": "public/assets/banner-hero-2.webp",
  "catalogo-mobile.webp": "public/assets/cat-feminino.webp",
  "landing-mockup.webp": "public/assets/banner-hero-3.webp",
  "social-grid.webp": "public/assets/cat-masculino.webp",
  "posts-calendar.webp": "public/assets/banner-coroa.webp",
  "posts-ai.webp": "public/assets/coroa-marca.webp",
  "ads-dashboard.webp": "public/assets/banner-hero-1.webp",
  "bling-dashboard.webp": "public/assets/cat-infantil.webp",
  "crm-kanban.webp": "public/assets/banner-hero-2.webp",
  "combos-visual.webp": "public/assets/logo-imperial.webp",
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const logoBuf = await sharp(LOGO).resize({ width: 220, withoutEnlargement: true }).png().toBuffer();

  for (const [outName, srcRel] of Object.entries(SOURCES)) {
    const src = path.join(ROOT, srcRel);
    if (!fs.existsSync(src)) {
      console.warn("missing", srcRel);
      continue;
    }
    const isPhone = outName.includes("catalogo");
    const w = isPhone ? 900 : 1600;
    const h = isPhone ? 1600 : 900;
    const base = await sharp(src)
      .resize(w, h, { fit: "cover", position: "centre" })
      .modulate({ brightness: 0.84, saturation: 1.06 })
      .toBuffer();

    const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8a1018" stop-opacity="0.5"/>
      <stop offset="55%" stop-color="#c41e2a" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#c9a76a" stop-opacity="0.32"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="40" y="${h - 130}" width="${Math.min(460, w - 80)}" height="70" rx="16" fill="rgba(250,247,244,0.9)"/>
</svg>`);

    await sharp(base)
      .composite([
        { input: overlay, top: 0, left: 0 },
        { input: logoBuf, top: h - 122, left: 56 },
      ])
      .webp({ quality: 86 })
      .toFile(path.join(OUT, outName));

    console.log("✓", outName);
  }
  console.log("Visuais da proposta compostos com logo D&G Modas.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
