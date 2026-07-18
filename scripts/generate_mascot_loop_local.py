"""
Gera um loop curto da mascote DG Modas a partir dos frames existentes.
100% local e gratuito (Pillow) — sem Veo/API.

Saídas:
  assets/mascot-celebrate-loop.webp  (preferida no site)
  assets/mascot-celebrate-loop.gif

Uso: py -3.13 scripts/generate_mascot_loop_local.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
START = ASSETS / "mascot-celebrate-start.png"
END = ASSETS / "mascot-celebrate-end.png"
OUT_WEBP = ASSETS / "mascot-celebrate-loop.webp"
OUT_GIF = ASSETS / "mascot-celebrate-loop.gif"

SIZE = 512
FPS = 12
DURATION_S = 2.0  # ciclo curto e leve
FRAMES = max(12, int(FPS * DURATION_S))


def load_square(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    # center-crop to square then resize
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    im = im.crop((left, top, left + side, top + side))
    return im.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def bounce(t: float) -> float:
    # 0..1 cycle: up then down
    return abs(math.sin(t * math.pi * 2))


def sway(t: float) -> float:
    return math.sin(t * math.pi * 2) * 0.035


def make_frame(a: Image.Image, b: Image.Image, t: float) -> Image.Image:
    """t in [0,1): blend poses + bounce + slight sway."""
    # pose crossfade twice per cycle (A->B->A)
    blend = 0.5 - 0.5 * math.cos(t * math.pi * 2)
    pose = Image.blend(a, b, blend)

    # bounce / squash
    lift = bounce(t) * 28
    squash = 1.0 - bounce(t) * 0.06
    stretch = 1.0 + bounce(t) * 0.05
    angle = sway(t) * 18  # degrees

    nw = max(1, int(SIZE * squash))
    nh = max(1, int(SIZE * stretch))
    scaled = pose.resize((nw, nh), Image.Resampling.LANCZOS)
    rotated = scaled.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)

    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    x = (SIZE - rotated.width) // 2 + int(sway(t) * SIZE * 0.35)
    y = (SIZE - rotated.height) // 2 - int(lift) + 10
    canvas.alpha_composite(rotated, (x, y))
    return canvas


def main() -> None:
    if not START.exists() or not END.exists():
        raise SystemExit(f"Missing frames:\n  {START}\n  {END}")

    a = load_square(START)
    b = load_square(END)
    frames = [make_frame(a, b, i / FRAMES) for i in range(FRAMES)]

    # WebP animado
    frames[0].save(
        OUT_WEBP,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=int(1000 / FPS),
        loop=0,
        quality=82,
        method=4,
    )
    print(f"OK {OUT_WEBP.relative_to(ROOT)} ({OUT_WEBP.stat().st_size // 1024} KB)")

    # GIF fallback
    gif_frames = [f.convert("P", palette=Image.ADAPTIVE, colors=192) for f in frames]
    gif_frames[0].save(
        OUT_GIF,
        format="GIF",
        save_all=True,
        append_images=gif_frames[1:],
        duration=int(1000 / FPS),
        loop=0,
        disposal=2,
        optimize=True,
    )
    print(f"OK {OUT_GIF.relative_to(ROOT)} ({OUT_GIF.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
