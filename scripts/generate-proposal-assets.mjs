import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Gera imagens da proposta comercial via Gemini Image API.
 * Run: npm run generate-proposal
 * Requires GEMINI_API_KEY in .env
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "assets", "proposta");

const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const FALLBACK_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-image-preview",
  "gemini-3.1-flash-lite-image",
  "gemini-3-pro-image-preview",
];

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const PALETTE = `Palette: deep wine red (#8a1018 / #c41e2a), champagne gold (#c9a76a), cream (#faf7f4 / #f6f2ee). Soft premium lighting, generous negative space, luxury fashion-tech brand mood. No logos, no watermarks, no readable fake UI text (use blurred abstract UI shapes only).`;

const ASSETS = [
  {
    file: "hero-ecosystem.webp",
    ratio: "16:9",
    prompt: `Create a premium abstract hero visual for a digital ecosystem presentation for Brazilian luxury fashion brand D&G Modas by Koruvision agency.
Composition: interconnected glowing nodes and soft ribbons suggesting commerce, CRM, ads, social and inventory flowing into one hub.
${PALETTE}
Editorial agency look like Stripe/Apple keynote still. Wide cinematic 16:9.`,
  },
  {
    file: "ecosystem-map.webp",
    ratio: "16:9",
    prompt: `Create a clean premium diagram-like illustration of a digital business ecosystem with 8 soft circular modules arranged around a central hub.
Modules suggest storefront, catalog, landing page, social, scheduling, ads, ERP, CRM — abstract icons only, no text.
${PALETTE}
Flat elegant 3D soft clay style, lots of cream negative space.`,
  },
  {
    file: "ecommerce-mockup.webp",
    ratio: "16:9",
    prompt: `Create a realistic laptop screen mockup showing a luxury fashion e-commerce homepage UI (blurred unreadable text), wine and gold accents, cream background, elegant product grid with soft shadows.
${PALETTE}
Photoreal product marketing shot, screen content abstract.`,
  },
  {
    file: "catalogo-mobile.webp",
    ratio: "9:16",
    prompt: `Create a realistic smartphone mockup showing a digital fashion catalog app UI with category tiles and product cards, blurred text, wine/gold accents.
${PALETTE}
Vertical 9:16, premium lifestyle commerce look.`,
  },
  {
    file: "landing-mockup.webp",
    ratio: "4:3",
    prompt: `Create a tablet mockup of a high-converting fashion campaign landing page: large hero apparel image, soft cream panels, gold CTA button shape (no readable text).
${PALETTE}
Clean marketing agency visual.`,
  },
  {
    file: "social-grid.webp",
    ratio: "16:9",
    prompt: `Create a premium Instagram-style content grid collage for a luxury clothing brand: elegant apparel photos, soft wine overlays, gold frames, stories strips — no logos, no readable captions.
${PALETTE}
Social media management portfolio look.`,
  },
  {
    file: "posts-calendar.webp",
    ratio: "16:9",
    prompt: `Create a modern SaaS dashboard mockup of a social media calendar: month grid with colored post cards, sidebar, soft shadows, wine and gold accent chips. Blur all text.
${PALETTE}
Notion/Stripe aesthetic product screenshot vibe.`,
  },
  {
    file: "posts-ai.webp",
    ratio: "4:3",
    prompt: `Create a futuristic but elegant UI illustration of AI assisting social content: floating caption cards, hashtag pills, image generation sparkles around a dashboard panel. Blur text.
${PALETTE}
Premium AI product marketing visual.`,
  },
  {
    file: "ads-dashboard.webp",
    ratio: "16:9",
    prompt: `Create a marketing analytics dashboard mockup with soft charts, conversion funnels, and campaign cards in wine/gold. Blur labels. Clean SaaS look.
${PALETTE}`,
  },
  {
    file: "bling-dashboard.webp",
    ratio: "16:9",
    prompt: `Create an inventory/ERP dashboard mockup: stock bars, product rows, finance widgets, soft cream panels with wine accents. Blur all text.
${PALETTE}
Professional operations software aesthetic.`,
  },
  {
    file: "crm-kanban.webp",
    ratio: "16:9",
    prompt: `Create a CRM kanban board mockup with columns of soft cards, WhatsApp-green subtle accent dots, wine headers, cream background. Blur text.
${PALETTE}
Modern customer success / sales CRM UI.`,
  },
  {
    file: "combos-visual.webp",
    ratio: "16:9",
    prompt: `Create an abstract premium visual of stacked solution packages / product bundles as elegant glass cards floating in cream space with wine-gold gradients.
${PALETTE}
Luxury agency packaging concept, no text.`,
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function generateImage(prompt, aspectRatio) {
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: { aspectRatio: aspectRatio || "16:9" },
    },
  };

  const models = [MODEL, ...FALLBACK_MODELS.filter((m) => m !== MODEL)];
  let lastErr = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(API_KEY)}`;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) {
          const msg = json?.error?.message || res.statusText;
          lastErr = new Error(`${model}: ${msg}`);
          if (res.status === 429 || res.status >= 500) {
            await sleep(1800 * attempt);
            continue;
          }
          break;
        }
        const parts = json?.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          const data = part.inlineData?.data || part.inline_data?.data;
          if (data) {
            return {
              buffer: Buffer.from(data, "base64"),
              mime: part.inlineData?.mimeType || part.inline_data?.mime_type || "image/png",
              model,
            };
          }
        }
        lastErr = new Error(`${model}: no image in response`);
        break;
      } catch (err) {
        lastErr = err;
        await sleep(1000 * attempt);
      }
    }
  }

  throw lastErr || new Error("Image generation failed");
}

async function toWebp(buffer, mime) {
  try {
    const sharp = (await import("sharp")).default;
    return await sharp(buffer).webp({ quality: 84 }).toBuffer();
  } catch {
    if (mime?.includes("webp")) return buffer;
    // keep original bytes with .webp name if sharp missing — still usable in most cases as png bytes
    return buffer;
  }
}

async function main() {
  ensureDir(OUT_DIR);
  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const force = process.argv.includes("--force");
  const list = only.length
    ? ASSETS.filter((a) => only.some((o) => a.file.includes(o)))
    : ASSETS;

  console.log(`Generating ${list.length} proposal asset(s)…`);
  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const asset of list) {
    const outPath = path.join(OUT_DIR, asset.file);
    if (!force && fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
      console.log(`↷ skip existing ${asset.file}`);
      skip += 1;
      continue;
    }
    try {
      console.log(`→ ${asset.file}`);
      const result = await generateImage(asset.prompt, asset.ratio);
      const webp = await toWebp(result.buffer, result.mime);
      fs.writeFileSync(outPath, webp);
      console.log(`  ✓ saved (${result.model}, ${(webp.length / 1024).toFixed(0)} KB)`);
      ok += 1;
      await sleep(600);
    } catch (err) {
      fail += 1;
      console.error(`  ✗ ${asset.file}: ${err.message || err}`);
    }
  }

  console.log(`\nDone. ok=${ok} skip=${skip} fail=${fail}`);
  if (ok === 0 && fail > 0 && !only.length) {
    console.log("Gemini indisponível — gerando placeholders locais…");
    const { spawnSync } = await import("node:child_process");
    const r = spawnSync(process.execPath, ["scripts/generate-proposal-placeholders.mjs"], {
      cwd: ROOT,
      stdio: "inherit",
    });
    if (r.status === 0) process.exitCode = 0;
    else process.exitCode = 1;
    return;
  }
  if (fail > 0) process.exitCode = 1;
}

main();
