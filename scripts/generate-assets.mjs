
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Gemini image pipeline for DG Modas e-commerce.
 * Run: npm run generate-assets
 * Flags: --banner | --products | --support | --variants | --hero
 * Requires GEMINI_API_KEY in .env
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const ORIGINALS = path.join(ASSETS, "_originals");

const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const FALLBACK_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
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

const GRADIENT_STYLES = [
  "diagonal 45° wine→cream",
  "diagonal 135° cream→wine",
  "horizontal 90° wine→off-white",
  "horizontal 270° cream→wine",
  "angled 15° wine→gold→cream",
  "angled 30° deep wine→soft red→cream",
  "angled 60° cream→wine",
  "angled 120° wine→cream",
  "angled 225° gold→wine→cream",
  "radial center wine fading to cream",
  "radial top-left wine glow to cream",
  "radial bottom-right cream with wine rim light",
];

function pickGradientStyle(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENT_STYLES[h % GRADIENT_STYLES.length];
}

const PRODUCT_PROMPT_BASE = `Edit this fashion product photo for a luxury clothing catalog (DG Modas).

CRITICAL RULES:
- Keep the EXACT same person/model, face, skin tone, hair, pose, body, and clothing cut unchanged.
- Keep garment textures, prints, and details (unless recoloring is requested separately).
- REMOVE store/interior/street background and props clutter.
- Replace background with a seamless professional photography STUDIO backdrop using this exact style: __GRADIENT__.
  Palette: deep wine red (#8a1018 / #c41e2a), soft champagne gold (#c9a76a), off-white (#f6f2ee).
- Soft studio lighting, clean fashion catalog look, no text, no logos, no watermarks.
- Preserve the input aspect ratio.`;

function productPromptFor(fileName) {
  return PRODUCT_PROMPT_BASE.replace("__GRADIENT__", pickGradientStyle(fileName));
}

const RECOLOR_PROMPT = (colorName, hex) => `Edit this fashion product photo for DG Modas luxury catalog.

CRITICAL RULES:
- Keep the EXACT same person/model, face, skin, hair, pose, body, framing.
- Recolor ONLY the main garment fabric to ${colorName} (approx ${hex}).
- Preserve prints/patterns if present (tint them into the new color family).
- Keep studio wine-to-off-white diagonal gradient background.
- Soft premium lighting, no text, no logos, no watermarks.`;

const HERO_PROMPT = `Create a premium fashion e-commerce HERO BANNER for DG Modas (Brazilian luxury fashion).

Composition:
- Editorial full-bleed look inspired by high-fashion boutiques / atelier.
- Split or asymmetric composition with generous negative space on the RIGHT for white headline overlay.
- Atmosphere: soft studio light, wine red (#c41e2a / #8a1018), champagne gold accents (#c9a76a), off-white (#f6f2ee).
- Suggest clothing on elegant props (mannequin stand or mid-century chair) without readable fake brand names.
- Mesh gradient depth, subtle glow, no clutter, no logos, no watermarks, no fake UI text.
- Wide cinematic 16:9 web banner, polished luxury ecommerce mood.`;

const SUPPORT_PROMPT = productPromptFor("support");

function mimeOf(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function backupOnce(relName) {
  const src = path.join(ASSETS, relName);
  const dest = path.join(ORIGINALS, relName);
  if (!fs.existsSync(src)) return;
  ensureDir(path.dirname(dest));
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function generateEditedImage(inputPath, prompt, aspectRatio) {
  const bytes = fs.readFileSync(inputPath);
  const base64 = bytes.toString("base64");
  const mimeType = mimeOf(inputPath);

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: { aspectRatio: aspectRatio || "3:4" },
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
            await sleep(1500 * attempt);
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

async function processOne(relName, prompt, aspectRatio, outRelName) {
  const inputPath = path.join(ASSETS, relName);
  if (!fs.existsSync(inputPath)) {
    console.warn(`Skip missing: ${relName}`);
    return false;
  }
  backupOnce(relName);
  const outName = outRelName || relName;
  const outPath = path.join(ASSETS, outName);
  console.log(`→ ${relName} → ${outName}`);
  const result = await generateEditedImage(inputPath, prompt, aspectRatio);
  fs.writeFileSync(outPath, result.buffer);
  console.log(`  ✓ saved (${result.model})`);
  return true;
}

function listProductFiles() {
  return fs
    .readdirSync(ASSETS)
    .filter((f) => /^(fem|masc|inf)-.+\.(jpe?g|png|webp)$/i.test(f))
    .filter((f) => !/-var-\d+\./i.test(f))
    .sort();
}

function variantTasks() {
  const productsPath = path.join(ROOT, "data", "products.json");
  if (!fs.existsSync(productsPath)) return [];
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const tasks = [];
  for (const p of products) {
    const baseImg = (p.variants[0]?.images[0] || "").replace(/^assets\//, "");
    if (!baseImg) continue;
    p.variants.forEach((v, vi) => {
      if (vi === 0 || !v.imageHint) return;
      const out = v.imageHint.replace(/^assets\//, "");
      tasks.push({
        rel: baseImg,
        prompt: RECOLOR_PROMPT(v.color, v.hex),
        ratio: "3:4",
        out,
        color: v.color,
        productId: p.id,
        variantIdx: vi,
      });
    });
  }
  return tasks;
}

function patchProductsWithVariantImages(tasksDone) {
  const productsPath = path.join(ROOT, "data", "products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  let changed = 0;
  for (const task of tasksDone) {
    const p = products.find((x) => x.id === task.productId);
    if (!p) continue;
    const v = p.variants[task.variantIdx];
    if (!v) continue;
    const assetPath = `assets/${task.out}`;
    if (fs.existsSync(path.join(ROOT, assetPath))) {
      v.images = [assetPath, ...v.images.filter((i) => i !== assetPath)];
      changed += 1;
    }
  }
  if (changed) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf8");
    console.log(`Updated products.json images for ${changed} variant(s)`);
  }
}

async function main() {
  ensureDir(ORIGINALS);
  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const bannerOnly = process.argv.includes("--banner") || process.argv.includes("--hero");
  const productsOnly = process.argv.includes("--products");
  const supportOnly = process.argv.includes("--support");
  const variantsOnly = process.argv.includes("--variants");

  if (variantsOnly) {
    const tasks = variantTasks().slice(0, only.length ? undefined : 12);
    console.log(`Generating ${tasks.length} color variant(s)…`);
    const done = [];
    let ok = 0;
    let fail = 0;
    for (const task of tasks) {
      if (only.length && !only.some((o) => task.out.includes(o) || task.rel.includes(o))) continue;
      try {
        const saved = await processOne(task.rel, task.prompt, task.ratio, task.out);
        if (saved) {
          ok += 1;
          done.push(task);
        }
        await sleep(500);
      } catch (err) {
        fail += 1;
        console.error(`  ✗ ${task.out}: ${err.message || err}`);
      }
    }
    patchProductsWithVariantImages(done);
    console.log(`\nVariants done. ok=${ok} fail=${fail}`);
    if (fail > 0) process.exitCode = 1;
    return;
  }

  const tasks = [];

  if (!productsOnly && !supportOnly) {
    const heroSrc = fs.existsSync(path.join(ASSETS, "hero-banner-studio.png"))
      ? "hero-banner-studio.png"
      : "hero-full.png";
    tasks.push({
      rel: heroSrc,
      prompt: HERO_PROMPT,
      ratio: "16:9",
      out: "hero-banner-studio.png",
    });
  }

  if (!bannerOnly && !supportOnly) {
    const products = only.length ? only : listProductFiles();
    for (const f of products) {
      if (!/^(fem|masc|inf)-/i.test(f) && only.length === 0) continue;
      tasks.push({ rel: f, prompt: productPromptFor(f), ratio: "3:4" });
    }
  }

  if (!bannerOnly && !productsOnly) {
    for (const f of ["sobre-loja.png", "produtos-1.png", "produtos-2.png", "produtos-3.png"]) {
      if (only.length && !only.includes(f)) continue;
      tasks.push({
        rel: f,
        prompt: SUPPORT_PROMPT,
        ratio: f.startsWith("sobre") ? "3:4" : "1:1",
      });
    }
  }

  console.log(`Processing ${tasks.length} image(s) with model preference: ${MODEL}`);
  let ok = 0;
  let fail = 0;
  for (const task of tasks) {
    try {
      const done = await processOne(task.rel, task.prompt, task.ratio, task.out);
      if (done) ok += 1;
      await sleep(400);
    } catch (err) {
      fail += 1;
      console.error(`  ✗ ${task.rel}: ${err.message || err}`);
    }
  }
  console.log(`\nDone. ok=${ok} fail=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main();
