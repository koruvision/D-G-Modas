import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * DG Modas — mascote + vídeo de comemoração (Gemini image + Veo 3.1)
 * Run: npm run generate-mascot-video
 * Flags: --frames-only | --video-only
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const REF = path.join(ASSETS, "mascot-ref.png");
const FRAME_START = path.join(ASSETS, "mascot-celebrate-start.png");
const FRAME_END = path.join(ASSETS, "mascot-celebrate-end.png");
const VIDEO_OUT = path.join(ASSETS, "mascot-celebrate-loop.mp4");

const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const IMAGE_FALLBACKS = [
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-image-preview",
];
const VEO_MODEL = process.env.GEMINI_VEO_MODEL || "veo-3.1-generate-preview";
const VEO_FALLBACKS = [
  process.env.GEMINI_VEO_MODEL || "veo-3.1-generate-preview",
  "veo-3.1-fast-generate-preview",
  "veo-3.0-generate-preview",
  "veo-3.0-fast-generate-preview",
].filter((v, i, a) => a.indexOf(v) === i);
const BASE = "https://generativelanguage.googleapis.com/v1beta";

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

const PALETTE = `DG Modas brand palette ONLY:
- Deep wine red body: #c41e2a, #8a1018, #e02332
- Champagne gold accents: #c9a76a, #d4bc8a, #a8894f
- Soft cream studio background: #faf7f4 / #f6f2ee
- Clean white gloves and sneakers accents
No purple, no neon, no gray concrete.`;

const CHARACTER = `Keep the SAME cute CGI shopping-bag mascot from the reference:
- Wine leather shopping bag body with friendly cartoon face (big eyes, smile)
- Gold metallic thin arms/legs, oversized white cartoon gloves
- Matching wine sneakers with white soles and tiny gold crown detail
- Gold bag handles on top
- Small gold crown + "D&G MODAS" logo on the bag front (readable but elegant)
- Premium 3D Pixar-like fashion mascot, soft cinematic studio lighting`;

const START_PROMPT = `Edit/recreate this mascot as a premium 3D still for DG Modas checkout celebration.

${CHARACTER}

${PALETTE}

POSE — START / LOOP BASE (frame 1 of seamless loop):
- Standing centered, slight crouch ready to bounce
- One hand thumbs-up, other hand open at side
- Joyful confident expression
- Soft cream studio backdrop with subtle wine wall tone (match brand, cleaner than reference)
- Soft shadow under feet
- Square-friendly composition, character fills most of the frame, no extra text, no watermark
- Photoreal 3D render, 1:1 feel cropped for web`;

const END_PROMPT = `Edit/recreate this SAME DG Modas shopping-bag mascot as a premium 3D still.

${CHARACTER}

${PALETTE}

POSE — END / LOOP CLOSE (must almost match start for seamless infinite loop):
- Same camera, same lighting, same background, same character design
- Standing centered again after celebrating — nearly identical to a resting happy pose
- Both arms raised in a small cheer OR one thumbs-up returning down — subtle, loop-friendly
- Soft cream studio, wine accents, soft shadow
- No confetti leftovers that would break a loop (or only tiny gold sparkles near hands)
- Same framing as a celebration return pose, no text overlays, no watermark
- Photoreal 3D render`;

const VIDEO_PROMPT = `Seamless looping DANCE animation of the EXACT SAME DG Modas shopping-bag mascot from the provided first and last frames.
Do NOT redesign or replace the character — keep identical wine bag body, gold arms/legs, white gloves, wine sneakers, crown logo D&G MODAS, same face.
The mascot DANCES joyfully celebrating a purchase: rhythmic bounce jumps, hip sway, arm waves and thumbs-up, squash-and-stretch, cheerful smile, tiny champagne-gold sparkles that appear and fade.
Camera locked, cream studio background, wine and gold brand colors only.
Motion must start and end matching the provided first and last frames for a clean infinite loop.
Premium cute 3D fashion mascot commercial style, smooth 8-second loopable clip, no text overlays, no watermark, no camera cut, no new character.`;

const args = new Set(process.argv.slice(2));
const framesOnly = args.has("--frames-only");
const videoOnly = args.has("--video-only");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateEditedImage(inputPath, prompt, outPath, aspectRatio = "1:1") {
  const bytes = fs.readFileSync(inputPath);
  const base64 = bytes.toString("base64");
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/png", data: base64 } },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: { aspectRatio },
    },
  };

  const models = [IMAGE_MODEL, ...IMAGE_FALLBACKS.filter((m) => m !== IMAGE_MODEL)];
  let lastErr = null;

  for (const model of models) {
    const url = `${BASE}/models/${model}:generateContent?key=${encodeURIComponent(API_KEY)}`;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        console.log(`  image [${model}] attempt ${attempt}…`);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) {
          lastErr = new Error(json?.error?.message || res.statusText);
          if (res.status === 429 || res.status >= 500) {
            await sleep(2000 * attempt);
            continue;
          }
          break;
        }
        const parts = json?.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          const data = part.inlineData?.data || part.inline_data?.data;
          if (data) {
            const buf = Buffer.from(data, "base64");
            fs.writeFileSync(outPath, buf);
            console.log(`  ✓ saved ${path.relative(ROOT, outPath)} (${buf.length} bytes)`);
            return outPath;
          }
        }
        lastErr = new Error(`${model}: no image in response`);
        break;
      } catch (err) {
        lastErr = err;
        await sleep(1200 * attempt);
      }
    }
  }
  throw lastErr || new Error("Image generation failed");
}

async function generateVideo(firstPath, lastPath, outPath) {
  const firstB64 = fs.readFileSync(firstPath).toString("base64");
  const lastB64 = fs.readFileSync(lastPath).toString("base64");

  let lastErr = null;

  for (const model of VEO_FALLBACKS) {
    console.log(`  video model: ${model}`);
    const startUrl = `${BASE}/models/${model}:predictLongRunning`;

    const startRes = await fetch(startUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: VIDEO_PROMPT,
            image: { bytesBase64Encoded: firstB64, mimeType: "image/png" },
            lastFrame: { bytesBase64Encoded: lastB64, mimeType: "image/png" },
          },
        ],
        parameters: {
          aspectRatio: "9:16",
          resolution: "720p",
          durationSeconds: 8,
          personGeneration: "allow_adult",
        },
      }),
    });

    const startJson = await startRes.json();
    if (!startRes.ok) {
      lastErr = new Error(`${model}: ${startJson?.error?.message || JSON.stringify(startJson)}`);
      console.warn(`  ✗ ${lastErr.message}`);
      continue;
    }

    let opName = startJson.name;
    if (!opName) {
      lastErr = new Error(`${model}: No operation name: ${JSON.stringify(startJson)}`);
      console.warn(`  ✗ ${lastErr.message}`);
      continue;
    }
    console.log(`  operation: ${opName}`);

    for (let i = 0; i < 90; i += 1) {
      await sleep(10000);
      const poll = await fetch(`${BASE}/${opName}`, {
        headers: { "x-goog-api-key": API_KEY },
      });
      const status = await poll.json();
      if (!poll.ok) throw new Error(status?.error?.message || JSON.stringify(status));

      if (status.done) {
        if (status.error) throw new Error(JSON.stringify(status.error));

        const sample =
          status.response?.generateVideoResponse?.generatedSamples?.[0] ||
          status.response?.generatedVideos?.[0] ||
          status.response?.generateVideoResponse?.generatedVideos?.[0];

        const uri =
          sample?.video?.uri ||
          sample?.video?.downloadUri ||
          status.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;

        if (!uri) {
          console.error(JSON.stringify(status, null, 2).slice(0, 4000));
          throw new Error("Video ready but no download URI found");
        }

        console.log(`  downloading…`);
        const vidRes = await fetch(uri, { headers: { "x-goog-api-key": API_KEY } });
        if (!vidRes.ok) throw new Error(`Download failed: ${vidRes.status}`);
        const buf = Buffer.from(await vidRes.arrayBuffer());
        fs.writeFileSync(outPath, buf);
        console.log(`  ✓ saved ${path.relative(ROOT, outPath)} (${buf.length} bytes)`);
        return outPath;
      }

      const progress = status.metadata?.progressPercent;
      console.log(`  waiting… ${progress != null ? `${progress}%` : `tick ${i + 1}`}`);
    }

    lastErr = new Error(`${model}: timed out`);
  }

  throw lastErr || new Error("Video generation failed");
}

async function main() {
  if (!fs.existsSync(REF)) {
    console.error(`Missing reference: ${REF}`);
    process.exit(1);
  }

  console.log("DG Modas — mascot celebration pipeline\n");

  if (!videoOnly) {
    console.log("1) Start frame (palette + pose)…");
    await generateEditedImage(REF, START_PROMPT, FRAME_START, "1:1");
    console.log("2) End frame (loop close)…");
    // Use start frame as reference so end stays consistent with the new palette version
    const endRef = fs.existsSync(FRAME_START) ? FRAME_START : REF;
    await generateEditedImage(endRef, END_PROMPT, FRAME_END, "1:1");
  } else {
    if (!fs.existsSync(FRAME_START) || !fs.existsSync(FRAME_END)) {
      console.error("Need mascot-celebrate-start.png and mascot-celebrate-end.png for --video-only");
      process.exit(1);
    }
  }

  if (!framesOnly) {
    console.log("3) Veo video (first + last frame)…");
    await generateVideo(FRAME_START, FRAME_END, VIDEO_OUT);
  }

  console.log("\nDone.");
  console.log(`  start: ${path.relative(ROOT, FRAME_START)}`);
  console.log(`  end:   ${path.relative(ROOT, FRAME_END)}`);
  if (!framesOnly) console.log(`  video: ${path.relative(ROOT, VIDEO_OUT)}`);
}

main().catch((err) => {
  console.error("\nFailed:", err.message || err);
  process.exit(1);
});
