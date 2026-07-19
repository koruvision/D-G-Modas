/**
 * Converte JPG/PNG em WebP otimizados (public/assets + assets).
 * Mantém favicons em PNG. Atualiza products.json para apontar .webp.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIRS = [path.join(root, "public", "assets"), path.join(root, "assets")];
const KEEP_PNG = new Set([
  "favicon.png",
  "favicon-32.png",
  "apple-touch-icon.png",
]);

const RULES = [
  { test: /^banner-hero/i, maxW: 1600, quality: 72 },
  { test: /^hero-loja|^sobre-loja|^familia/i, maxW: 1400, quality: 72 },
  { test: /^trust-|^review-/i, maxW: 640, quality: 70 },
  { test: /^logo|^coroa|^crown|^banner-coroa/i, maxW: 512, quality: 80 },
  { test: /-var-/i, maxW: 600, quality: 70 },
  { test: /.*/, maxW: 800, quality: 72 },
];

function ruleFor(name) {
  return RULES.find((r) => r.test.test(name)) || RULES[RULES.length - 1];
}

async function optimizeFile(filePath, outDir) {
  const base = path.basename(filePath);
  const ext = path.extname(base).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) return null;
  if (KEEP_PNG.has(base)) return null;

  const nameNoExt = base.replace(/\.[^.]+$/, "");
  const outPath = path.join(outDir, `${nameNoExt}.webp`);
  const { maxW, quality } = ruleFor(nameNoExt);
  const input = sharp(filePath, { animated: false, failOn: "none" });
  const meta = await input.metadata();
  let pipeline = sharp(filePath, { animated: false, failOn: "none" }).rotate();

  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize({ width: maxW, withoutEnlargement: true });
  }

  await pipeline.webp({ quality, effort: 6 }).toFile(outPath);

  const before = (await fs.stat(filePath)).size;
  const after = (await fs.stat(outPath)).size;
  // Remove original se não for o próprio webp de saída
  if (path.resolve(filePath) !== path.resolve(outPath)) {
    await fs.unlink(filePath);
  }
  return { base, before, after, out: path.basename(outPath) };
}

async function rewriteJsonImages(file) {
  let text = await fs.readFile(file, "utf8");
  const next = text
    .replace(/assets\/([^"']+)\.(jpe?g|png|gif)/gi, "assets/$1.webp")
    .replace(/"([^"']+)\.(jpe?g|png|gif)"/gi, (m, name, ext) => {
      // only rewrite asset-looking filenames inside products
      if (/^(assets\/|https?:)/i.test(name)) return m;
      if (/logo|favicon|apple/i.test(name)) return m;
      return `"${name}.webp"`;
    });
  // Safer: only replace image path patterns used in catalog
  text = text.replace(/"(assets\/[^"]+)\.(jpe?g|png|gif)"/gi, '"$1.webp"');
  await fs.writeFile(file, text);
}

async function rewriteProductsDeep(file) {
  const data = JSON.parse(await fs.readFile(file, "utf8"));
  const mapExt = (s) => {
    if (typeof s !== "string") return s;
    return s.replace(/\.(jpe?g|png|gif)$/i, ".webp");
  };
  for (const p of data) {
    for (const v of p.variants || []) {
      if (Array.isArray(v.images)) v.images = v.images.map(mapExt);
    }
  }
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
}

async function processDir(dir) {
  const entries = await fs.readdir(dir);
  let saved = 0;
  let count = 0;
  for (const name of entries) {
    const full = path.join(dir, name);
    const st = await fs.stat(full);
    if (!st.isFile()) continue;
    try {
      const res = await optimizeFile(full, dir);
      if (!res) continue;
      count += 1;
      saved += Math.max(0, res.before - res.after);
      const pct = res.before ? Math.round((1 - res.after / res.before) * 100) : 0;
      console.log(
        `✓ ${res.base} → ${res.out} (${(res.before / 1024).toFixed(0)}KB → ${(res.after / 1024).toFixed(0)}KB, -${pct}%)`
      );
    } catch (err) {
      console.warn(`skip ${name}:`, err.message);
    }
  }
  return { count, saved };
}

async function main() {
  let totalCount = 0;
  let totalSaved = 0;
  for (const dir of DIRS) {
    console.log(`\n=== ${path.relative(root, dir)} ===`);
    const { count, saved } = await processDir(dir);
    totalCount += count;
    totalSaved += saved;
  }

  for (const rel of ["public/data/products.json", "data/products.json"]) {
    const file = path.join(root, rel);
    try {
      await rewriteProductsDeep(file);
      console.log(`updated ${rel}`);
    } catch (err) {
      console.warn(`products skip ${rel}:`, err.message);
    }
  }

  console.log(
    `\nDone: ${totalCount} images, saved ~${(totalSaved / 1024 / 1024).toFixed(1)} MB`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
