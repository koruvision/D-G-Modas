"""
Replace studio backgrounds with VARIED gradients (angles / radial).
Fast NumPy version — no rembg required.
"""
from __future__ import annotations

import hashlib
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

WINE_DEEP = (110, 14, 20)
WINE_TOP = (138, 16, 24)
WINE_MID = (196, 30, 42)
WINE_SOFT = (224, 70, 80)
GOLD = (201, 167, 106)
CREAM = (246, 242, 238)
WHITE = (255, 252, 249)

PALETTES = [
    [(0.0, WINE_DEEP), (0.4, WINE_MID), (1.0, CREAM)],
    [(0.0, CREAM), (0.55, WINE_MID), (1.0, WINE_DEEP)],
    [(0.0, WINE_TOP), (0.35, WINE_SOFT), (0.7, GOLD), (1.0, CREAM)],
    [(0.0, WINE_MID), (0.5, CREAM), (1.0, WHITE)],
    [(0.0, WINE_DEEP), (0.5, GOLD), (1.0, CREAM)],
    [(0.0, CREAM), (0.45, GOLD), (1.0, WINE_TOP)],
]

STYLES = [
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


def style_for_name(name: str):
    idx = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
    return STYLES[idx % len(STYLES)], idx % len(PALETTES)


def colorize_field(t: np.ndarray, stops) -> np.ndarray:
    """Map scalar field t (0..1) to RGB using color stops. Returns HxWx3 uint8."""
    out = np.zeros(t.shape + (3,), dtype=np.float32)
    t = np.clip(t, 0.0, 1.0)
    for i in range(len(stops) - 1):
        t0, c0 = stops[i]
        t1, c1 = stops[i + 1]
        mask = (t >= t0) & (t <= t1)
        if not np.any(mask):
            continue
        u = (t[mask] - t0) / max(t1 - t0, 1e-6)
        for ch in range(3):
            out[..., ch][mask] = c0[ch] + (c1[ch] - c0[ch]) * u
    # edges
    out[t <= stops[0][0]] = stops[0][1]
    out[t >= stops[-1][0]] = stops[-1][1]
    return np.clip(out, 0, 255).astype(np.uint8)


def linear_gradient(h: int, w: int, angle_deg: float, palette_idx: int) -> np.ndarray:
    stops = PALETTES[palette_idx % len(PALETTES)]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ang = math.radians(angle_deg)
    # project onto angle axis
    proj = xx * math.cos(ang) + yy * math.sin(ang)
    t = (proj - proj.min()) / max(float(proj.max() - proj.min()), 1e-6)
    return colorize_field(t, stops)


def radial_gradient(h: int, w: int, cx_r: float, cy_r: float, palette_idx: int) -> np.ndarray:
    stops = PALETTES[palette_idx % len(PALETTES)]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = w * cx_r, h * cy_r
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    max_r = math.hypot(max(cx, w - cx), max(cy, h - cy))
    t = dist / max(max_r, 1e-6)
    return colorize_field(t, stops)


def studio_bg_mask(rgb: np.ndarray) -> np.ndarray:
    """Float mask 0..1 — high where pixel looks like wine/cream studio backdrop."""
    r = rgb[..., 0].astype(np.float32)
    g = rgb[..., 1].astype(np.float32)
    b = rgb[..., 2].astype(np.float32)
    mask = np.zeros(r.shape, dtype=np.float32)

    cream = (r > 210) & (g > 200) & (b > 190) & (np.abs(r - g) < 30) & (np.abs(g - b) < 30)
    wine = (r > 70) & (r > g + 25) & (r > b + 25) & (g < 120) & (b < 120)
    wine_deep = wine & (g < 90) & (b < 90)
    soft = (r > 140) & (r < 230) & (g > 40) & (g < 140) & (b > 40) & (b < 140) & (r > g) & (r > b)
    soft = soft & ((r - np.minimum(g, b)) / np.maximum(r, 1) > 0.25)

    mask[cream] = 1.0
    mask[wine_deep] = 0.92
    mask[wine & ~wine_deep] = 0.65
    mask[soft] = np.maximum(mask[soft], 0.55)

    # blur soft edges
    from PIL import ImageFilter

    m_img = Image.fromarray((mask * 255).astype(np.uint8), mode="L")
    m_img = m_img.filter(ImageFilter.GaussianBlur(radius=8))
    return np.asarray(m_img, dtype=np.float32) / 255.0


def rebackground(path: Path) -> str:
    img = Image.open(path).convert("RGB")
    rgb = np.asarray(img)
    h, w = rgb.shape[:2]
    style, palette = style_for_name(path.name)
    if style[0] == "linear":
        bg = linear_gradient(h, w, float(style[1]), palette)
    else:
        bg = radial_gradient(h, w, float(style[1]), float(style[2]), palette)

    alpha = studio_bg_mask(rgb)[..., None]
    out = (bg.astype(np.float32) * alpha + rgb.astype(np.float32) * (1.0 - alpha)).astype(np.uint8)
    result = Image.fromarray(out, mode="RGB")
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        result.save(path, quality=92, optimize=True)
    else:
        result.save(path, optimize=True)
    return f"{style[0]}{list(style[1:])} pal={palette}"


def list_targets(argv):
    only = [a for a in argv if not a.startswith("--")]
    if only:
        return only
    names = []
    for f in sorted(ASSETS.iterdir()):
        if f.is_file() and f.name.startswith(("fem-", "masc-", "inf-")) and f.suffix.lower() in {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }:
            names.append(f.name)
    return names


def main() -> int:
    targets = list_targets(sys.argv[1:])
    print(f"Varying backgrounds on {len(targets)} image(s)…", flush=True)
    ok = fail = 0
    for name in targets:
        path = ASSETS / name
        print(f"> {name}", flush=True)
        try:
            label = rebackground(path)
            print(f"  ok ({label})", flush=True)
            ok += 1
        except Exception as exc:  # noqa: BLE001
            print(f"  fail {exc}", flush=True)
            fail += 1
    print(f"\nDone. ok={ok} fail={fail}", flush=True)
    return 1 if fail else 0


if __name__ == "__main__":
    raise SystemExit(main())
