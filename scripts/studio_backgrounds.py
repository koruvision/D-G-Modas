"""
Local studio background pipeline for DG Modas.
Removes background and composites onto VARIED studio gradients
(angles, diagonals, horizontals, radials) so product photos don't look identical.
"""
from __future__ import annotations

import hashlib
import math
import os
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
ORIGINALS = ASSETS / "_originals"

WINE_DEEP = (110, 14, 20)
WINE_TOP = (138, 16, 24)
WINE_MID = (196, 30, 42)
WINE_SOFT = (224, 70, 80)
GOLD = (201, 167, 106)
CREAM = (246, 242, 238)
WHITE = (255, 252, 249)


def load_dotenv() -> None:
    env = ROOT / ".env"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())


def lerp_rgb(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    return (
        int(a[0] + (b[0] - a[0]) * t),
        int(a[1] + (b[1] - a[1]) * t),
        int(a[2] + (b[2] - a[2]) * t),
    )


def mix_stops(t: float, stops: list[tuple[float, tuple[int, int, int]]]) -> tuple[int, int, int]:
    if t <= stops[0][0]:
        return stops[0][1]
    if t >= stops[-1][0]:
        return stops[-1][1]
    for i in range(len(stops) - 1):
        t0, c0 = stops[i]
        t1, c1 = stops[i + 1]
        if t0 <= t <= t1:
            u = (t - t0) / max(t1 - t0, 1e-6)
            return lerp_rgb(c0, c1, u)
    return stops[-1][1]


PALETTES = [
    [(0.0, WINE_DEEP), (0.4, WINE_MID), (1.0, CREAM)],
    [(0.0, CREAM), (0.55, WINE_MID), (1.0, WINE_DEEP)],
    [(0.0, WINE_TOP), (0.35, WINE_SOFT), (0.7, GOLD), (1.0, CREAM)],
    [(0.0, WINE_MID), (0.5, CREAM), (1.0, WHITE)],
    [(0.0, WINE_DEEP), (0.5, GOLD), (1.0, CREAM)],
    [(0.0, CREAM), (0.45, GOLD), (1.0, WINE_TOP)],
]


def linear_gradient(size: tuple[int, int], angle_deg: float, palette_idx: int) -> Image.Image:
    """Fast angled linear gradient via oversized strip + rotate + crop."""
    w, h = size
    stops = PALETTES[palette_idx % len(PALETTES)]
    diag = int(math.ceil(math.hypot(w, h))) + 4
    strip = Image.new("RGB", (diag, diag))
    px = strip.load()
    for y in range(diag):
        t = y / max(diag - 1, 1)
        color = mix_stops(t, stops)
        for x in range(diag):
            px[x, y] = color
    rotated = strip.rotate(-angle_deg, resample=Image.BICUBIC, expand=False)
    left = (diag - w) // 2
    top = (diag - h) // 2
    return rotated.crop((left, top, left + w, top + h))


def radial_gradient(
    size: tuple[int, int],
    cx_ratio: float,
    cy_ratio: float,
    palette_idx: int,
) -> Image.Image:
    w, h = size
    stops = PALETTES[palette_idx % len(PALETTES)]
    cx, cy = w * cx_ratio, h * cy_ratio
    max_r = math.hypot(max(cx, w - cx), max(cy, h - cy))
    img = Image.new("RGB", (w, h))
    px = img.load()
    # Sample every other pixel then upsample for speed on large images
    step = 2 if max(w, h) > 900 else 1
    small_w, small_h = (w + step - 1) // step, (h + step - 1) // step
    small = Image.new("RGB", (small_w, small_h))
    spx = small.load()
    for sy in range(small_h):
        for sx in range(small_w):
            x, y = sx * step, sy * step
            t = math.hypot(x - cx, y - cy) / max(max_r, 1)
            spx[sx, sy] = mix_stops(t, stops)
    if step > 1:
        return small.resize((w, h), Image.BILINEAR)
    return small if step == 1 else img


# Named styles: (kind, params…)
STYLES: list[tuple] = [
    ("linear", 0),
    ("linear", 15),
    ("linear", 30),
    ("linear", 45),
    ("linear", 60),
    ("linear", 90),
    ("linear", 120),
    ("linear", 135),
    ("linear", 180),
    ("linear", 225),
    ("linear", 270),
    ("linear", 315),
    ("radial", 0.5, 0.35),
    ("radial", 0.3, 0.3),
    ("radial", 0.7, 0.25),
    ("radial", 0.5, 0.7),
    ("radial", 0.2, 0.8),
    ("radial", 0.8, 0.6),
]


def style_for_name(name: str) -> tuple:
    digest = hashlib.md5(name.encode("utf-8")).hexdigest()
    idx = int(digest[:8], 16)
    style = STYLES[idx % len(STYLES)]
    palette = idx % len(PALETTES)
    return style, palette


def studio_gradient(size: tuple[int, int], name: str) -> Image.Image:
    style, palette = style_for_name(name)
    kind = style[0]
    if kind == "linear":
        angle = float(style[1])
        return linear_gradient(size, angle, palette)
    cx, cy = float(style[1]), float(style[2])
    return radial_gradient(size, cx, cy, palette)


def soft_vignette(img: Image.Image, amount: float = 0.08) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGB", (w, h))
    px = overlay.load()
    cx, cy = w / 2, h / 2
    max_r = math.hypot(cx, cy)
    step = 2 if max(w, h) > 900 else 1
    for y in range(0, h, step):
        for x in range(0, w, step):
            t = math.hypot(x - cx, y - cy) / max_r
            shade = int(255 * (1.0 - amount * t * t))
            for dy in range(step):
                for dx in range(step):
                    xx, yy = x + dx, y + dy
                    if xx < w and yy < h:
                        px[xx, yy] = (shade, shade, shade)
    return Image.blend(img, overlay, 0.12)


def backup_once(name: str) -> None:
    src = ASSETS / name
    dest = ORIGINALS / name
    if not src.exists():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        shutil.copy2(src, dest)


def source_path(name: str) -> Path:
    original = ORIGINALS / name
    if original.exists():
        return original
    return ASSETS / name


def composite_studio(src_path: Path, out_path: Path, name: str, remove_bg) -> str:
    original = Image.open(src_path).convert("RGBA")
    cutout = remove_bg(original)
    if cutout.mode != "RGBA":
        cutout = cutout.convert("RGBA")
    style, palette = style_for_name(name)
    bg = soft_vignette(studio_gradient(cutout.size, name)).convert("RGBA")
    composed = Image.alpha_composite(bg, cutout)
    if out_path.suffix.lower() in {".jpg", ".jpeg"}:
        composed.convert("RGB").save(out_path, quality=92, optimize=True)
    else:
        composed.convert("RGB").save(out_path, optimize=True)
    label = f"{style[0]} {style[1:] if len(style) > 1 else ''} pal={palette}"
    return label


def list_targets(argv: list[str]) -> list[str]:
    only = [a for a in argv if not a.startswith("--")]
    if only:
        return only
    names: list[str] = []
    for f in sorted(ASSETS.iterdir()):
        if not f.is_file():
            continue
        n = f.name
        if n.startswith(("fem-", "masc-", "inf-")) and f.suffix.lower() in {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }:
            names.append(n)
    return names


def main() -> int:
    load_dotenv()
    ORIGINALS.mkdir(parents=True, exist_ok=True)

    try:
        from rembg import remove as remove_bg
    except ImportError:
        print("rembg not installed. Run: pip install rembg pillow onnxruntime", file=sys.stderr)
        return 1

    targets = list_targets(sys.argv[1:])
    print(f"Processing {len(targets)} image(s) with varied studio gradients…")
    ok = fail = 0
    for name in targets:
        src = source_path(name)
        if not src.exists():
            print(f"  skip missing {name}")
            continue
        backup_once(name)
        print(f"> {name}")
        try:
            label = composite_studio(src, ASSETS / name, name, remove_bg)
            print(f"  ok ({label})")
            ok += 1
        except Exception as exc:  # noqa: BLE001
            print(f"  fail {exc}")
            fail += 1
    print(f"\nDone. ok={ok} fail={fail}")
    return 1 if fail else 0


if __name__ == "__main__":
    raise SystemExit(main())
