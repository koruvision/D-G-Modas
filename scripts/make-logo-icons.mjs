import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const logoSrc = "public/assets/logo-header.webp";
const sizes = [
  { out: "public/assets/favicon.png", size: 32, pad: 0.18 },
  { out: "public/assets/favicon-32.png", size: 32, pad: 0.18 },
  { out: "public/assets/apple-touch-icon.png", size: 180, pad: 0.16 },
  { out: "public/assets/logo-mark.webp", size: 256, pad: 0.14 },
];

function gradientSvg(size) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="g" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#c41e2a"/>
      <stop offset="55%" stop-color="#8a1018"/>
      <stop offset="100%" stop-color="#5a0c12"/>
    </radialGradient>
  </defs>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#g)"/>
</svg>`);
}

for (const t of sizes) {
  const bg = await sharp(gradientSvg(t.size)).png().toBuffer();
  const inner = Math.round(t.size * (1 - t.pad * 2));
  const logo = await sharp(logoSrc)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const isWebp = t.out.endsWith(".webp");
  const composed = await sharp(bg)
    .composite([{ input: logo, gravity: "centre" }])
    .toFormat(isWebp ? "webp" : "png", isWebp ? { quality: 85 } : undefined)
    .toBuffer();

  const tmp = path.join(os.tmpdir(), path.basename(t.out));
  fs.writeFileSync(tmp, composed);
  try {
    fs.unlinkSync(t.out);
  } catch {
    /* ignore */
  }
  fs.copyFileSync(tmp, t.out);
  const mirror = t.out.replace("public/assets/", "assets/");
  try {
    fs.copyFileSync(tmp, mirror);
  } catch {
    /* ignore */
  }
  console.log(t.out, `${Math.round(composed.length / 1024)}KB`);
}
