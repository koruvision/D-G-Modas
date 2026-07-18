"""
Local color-variant generator (fallback when Gemini is unavailable).
Run: py -3.13 scripts/generate_variants_local.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
PRODUCTS = ROOT / "data" / "products.json"


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def recolor(img: Image.Image, target: tuple[int, int, int], strength: float = 0.42) -> Image.Image:
    base = img.convert("RGB")
    # Soft color wash — keeps photo readable while shifting palette
    overlay = Image.new("RGB", base.size, target)
    mixed = Image.blend(base, overlay, strength)
    # Restore a bit of contrast/clarity
    mixed = ImageEnhance.Contrast(mixed).enhance(1.08)
    mixed = ImageEnhance.Color(mixed).enhance(1.12)
    return mixed


def main() -> None:
    products = json.loads(PRODUCTS.read_text(encoding="utf-8"))
    generated = 0

    for p in products:
        base = p["variants"][0]["images"][0].replace("assets/", "")
        src = ASSETS / base
        if not src.exists():
            print(f"! missing base {base}")
            continue
        base_img = Image.open(src)
        for vi, v in enumerate(p["variants"]):
            if vi == 0:
                # ensure primary path is consistent
                v["images"] = [f"assets/{base}"]
                continue
            hint = (v.get("imageHint") or "").replace("assets/", "")
            if not hint:
                stem = re.sub(r"\.jpe?g$", "", base, flags=re.I)
                hint = f"{stem}-var-{vi}.jpg"
            out = ASSETS / hint
            if out.exists() and out.stat().st_size > 1000:
                asset_path = f"assets/{hint}"
                v["images"] = [asset_path]
                v["imageHint"] = asset_path
                continue
            print(f"> {base} -> {hint} ({v['color']})")
            recolor(base_img, hex_to_rgb(v["hex"])).save(out, quality=88, optimize=True)
            asset_path = f"assets/{hint}"
            v["images"] = [asset_path]
            v["imageHint"] = asset_path
            generated += 1

    PRODUCTS.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Done. generated={generated}")


if __name__ == "__main__":
    main()
