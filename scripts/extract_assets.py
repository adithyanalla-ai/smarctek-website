#!/usr/bin/env python3
"""
Extract and optimise image assets for the Smarctek website.

Inputs  : TGG proforma PDF (embedded JPEGs extracted with `pdfimages -all`)
          and the letterhead screenshot (logo).
Outputs : public/images/**  (WebP, SEO file names) + assets-manifest.json

Usage   : python3 scripts/extract_assets.py <pdf> <letterhead.png> <site-root>
Requires: poppler-utils (pdfimages), Pillow, numpy, opencv-python
The original embedded images are never screenshots of whole pages.
"""
import sys, os, json, glob, hashlib, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter
import cv2

pdf, letterhead, root = sys.argv[1], sys.argv[2], sys.argv[3]
out = os.path.join(root, "public", "images")
for d in ("products", "gallery", "engineering", "brand"):
    os.makedirs(os.path.join(out, d), exist_ok=True)
raw = tempfile.mkdtemp()
subprocess.run(["pdfimages", "-all", pdf, os.path.join(raw, "img")], check=True)
R = lambda n: os.path.join(raw, f"img-{n:03d}.jpg")
manifest = {"source": "TGG Group proforma (14 pp.)", "images": []}

def denoise(im):
    a = cv2.cvtColor(np.array(im.convert("RGB")), cv2.COLOR_RGB2BGR)
    a = cv2.bilateralFilter(a, 5, 18, 5)           # soften JPEG blocking only
    return Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB))

def trim(im, pad=0.05, thr=236, bg=None):
    a = np.array(im.convert("RGB")).astype(int)
    if bg is None:
        mask = (a < thr).any(axis=2)
    else:
        mask = (np.abs(a - np.array(bg)).sum(axis=2) > 40)
    ys, xs = np.where(mask)
    if len(xs) == 0: return im
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    p = int(max(x1 - x0, y1 - y0) * pad)
    return im.crop((max(0, x0 - p), max(0, y0 - p), min(im.width, x1 + p), min(im.height, y1 + p)))

def upscale(im, target=720, cap=4):
    f = min(cap, max(1.0, target / max(im.size)))
    if f > 1.01:
        im = im.resize((round(im.width * f), round(im.height * f)), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=55, threshold=3)), f

def save(im, rel, meta):
    p = os.path.join(out, rel)
    im.save(p, "WEBP", quality=84, method=6)
    meta.update(file="/images/" + rel, width=im.width, height=im.height,
                bytes=os.path.getsize(p))
    manifest["images"].append(meta)
    print(f"{rel:70s} {im.width}x{im.height} {meta['bytes']//1024}KB")

# ---------- products (pages 2-9) ----------
P = [  # slug-file, source img, page, note
 ("flour-conveyor-vh-200", 3, 2), ("bucket-elevator-kel-20x20", 5, 2),
 ("industrial-breaker-hammer-system", 8, 3), ("degerminator-cereal-germ-separator", 9, 3),
 ("vibro-separator-rt-100", 10, 3), ("roller-mill-store-feeding-hopper", 13, 4),
 ("super-sonic-filter-ssf-52x2400", 14, 4), ("rotoflow-rw-60-discharge-unit", 15, 4),
 ("blower-pump-bp-50-lt", 16, 4), ("air-lock-feeder-pneumatic-conveying", 17, 4),
 ("aspirator-asp-industrial-fan", 18, 4), ("pneumatic-cyclone-group", 20, 5),
 ("pneumatic-fan-pf-75", 21, 5), ("vibrator-vibro-discharge-unit", 23, 5),
 ("quadro-plansifter-ke-8x28", 25, 6), ("flour-packaging-machine-25-50kg", 29, 7),
 ("plc-control-panel-cabinet", 32, 8), ("plc-control-panel-motor-cabinets", 34, 8),
]
for name, n, page in P:
    im = Image.open(R(n)).convert("RGB")
    bg = tuple(int(x) for x in np.array(im)[2, 2]) if n == 17 else None
    if bg is not None:   # flat grey studio backdrop -> white (soft key, keeps machine shading)
        a = np.array(im).astype(float)
        dist = np.sqrt(((a - np.array(bg)) ** 2).sum(axis=2))
        w = np.clip(1 - dist / 28.0, 0, 1)[..., None]
        im = Image.fromarray((a * (1 - w) + 255 * w).astype(np.uint8))
        bg = None
    im = trim(denoise(im), bg=bg)
    src_size = Image.open(R(n)).size
    im, f = upscale(im)
    save(im, f"products/{name}.webp", dict(id=name, kind="product", pdf_page=page,
         source_embedded=f"{src_size[0]}x{src_size[1]}", upscale=round(f, 2)))

# Roller mill: image has a soft mask (transparent surround) -> composite on white
m = Image.open(os.path.join(raw, "img-027.png")).convert("L")
base = Image.open(R(26)).convert("RGB")
m = m.crop((3, 3, m.width - 3, m.height - 3)); base = base.crop((3, 3, base.width - 3, base.height - 3))
white = Image.new("RGB", base.size, "white"); white.paste(base, mask=m)
im = trim(denoise(white), pad=0.05, thr=225)
im, f = upscale(im)
save(im, "products/pneumatic-roller-mill-spv-250x1000.webp",
     dict(id="pneumatic-roller-mill-spv-250x1000", kind="product", pdf_page=6,
          source_embedded="178x440", upscale=round(f, 2)))

# Air lock: lower portion of the shared cyclone-group / air-lock photograph (page 5)
base = Image.open(R(20)).convert("RGB")
crop = trim(denoise(base.crop((0, int(base.height * 0.62), base.width, base.height))), pad=0.08)
im, f = upscale(crop, target=640)
save(im, "products/air-lock-hvk-240-rotary-valve.webp",
     dict(id="air-lock-hvk-240-rotary-valve", kind="product", pdf_page=5,
          source_embedded="160x371 (cropped, shared with cyclone group)", upscale=round(f, 2)))

# ---------- engineering imagery (pages 7-8) ----------
for name, n, page in [("flow-and-air-piping-fabrication", 30, 7), ("installation-hand-tools", 33, 8)]:
    im = Image.open(R(n)).convert("RGB")
    src = im.size
    im = denoise(im)
    if n == 33: im = trim(im)
    im, f = upscale(im, target=640, cap=4)
    save(im, f"engineering/{name}.webp", dict(id=name, kind="engineering", pdf_page=page,
         source_embedded=f"{src[0]}x{src[1]}", upscale=round(f, 2)))

# ---------- page 14 facility photographs ----------
hero = Image.open(R(47)).convert("RGB")
h2 = denoise(hero).resize((hero.width * 2, hero.height * 2), Image.LANCZOS).filter(
    ImageFilter.UnsharpMask(radius=1.4, percent=45, threshold=3))
save(h2, "gallery/industrial-processing-hall-equipment.webp",
     dict(id="industrial-processing-hall-equipment", kind="facility", pdf_page=14,
          source_embedded="649x361", upscale=2.0))
h1 = h2.resize((900, round(900 * h2.height / h2.width)), Image.LANCZOS)
save(h1, "gallery/industrial-processing-hall-equipment-900.webp",
     dict(id="industrial-processing-hall-equipment-900", kind="facility", pdf_page=14,
          source_embedded="649x361", upscale=1.4))

sheet = Image.open(R(48)).convert("RGB")
cols = [(9, 148), (173, 315), (335, 481), (508, 644), (671, 808)]
rows = [(7, 112), (134, 240), (263, 371)]
T = ["factory-hall-inclined-conveyor-belt-dryer", "multi-layer-belt-dryer-industrial",
     "chilli-conveyor-drying-line-feed", "grain-storage-silos-steel-towers",
     "hot-air-furnace-drying-unit-ducting", "chilli-heaps-inclined-conveyor",
     "chilli-on-belt-dryer", "bulk-material-pile-storage-towers",
     "chilli-piles-belt-line", "factory-hall-dryer-installation",
     "factory-hall-bulk-material-handling", "inclined-conveyor-chilli-loading",
     "heat-pump-dryer-unit", "multi-layer-belt-dryer-workshop",
     "chilli-on-conveyor-belt"]
k = 0
for r in rows:
    for c in cols:
        t = sheet.crop((c[0] + 1, r[0] + 1, c[1] - 1, r[1] - 1))   # drop thumbnail border pixels
        s0 = t.size
        t = denoise(t).resize((t.width * 4, t.height * 4), Image.LANCZOS).filter(
            ImageFilter.UnsharpMask(radius=1.6, percent=50, threshold=3))
        save(t, f"gallery/{T[k]}.webp", dict(id=T[k], kind="facility-thumb", pdf_page=14,
             tile=k + 1, source_embedded=f"{s0[0]}x{s0[1]}", upscale=4.0))
        k += 1

# ---------- logo (letterhead screenshot) ----------
L = Image.open(letterhead).convert("RGB")
crop = L.crop((92, 226, 404, 494))
a = np.array(crop).astype(float)
bgc = np.median(np.concatenate([a[:12, :].reshape(-1, 3), a[-12:, :].reshape(-1, 3)]), axis=0)
d = np.sqrt(((a - bgc) ** 2).sum(axis=2))
alpha = np.clip((d - 10) / 55.0, 0, 1)                       # soft key, keeps anti-aliasing
af = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1 - alpha[..., None]) * bgc) / af, 0, 255)
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
logo = Image.fromarray(rgba, "RGBA")
bb = logo.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
logo = logo.crop(bb)
logo.save(os.path.join(out, "brand", "smarctek-logo.png"))
logo.save(os.path.join(out, "brand", "smarctek-logo.webp"), "WEBP", quality=95, method=6, lossless=False)
print("logo", logo.size)
manifest["logo"] = {"file": "/images/brand/smarctek-logo.png", "size": list(logo.size),
                    "note": "native resolution of supplied letterhead; not redrawn or recoloured"}

# favicon / app icons: the globe mark on white tile
tile = Image.new("RGBA", (512, 512), (255, 255, 255, 255))
mark = logo.copy(); mark.thumbnail((440, 440), Image.LANCZOS)
tile.alpha_composite(mark, ((512 - mark.width) // 2, (512 - mark.height) // 2))
tile.convert("RGB").save(os.path.join(root, "public", "icon-512.png"))
tile.resize((180, 180), Image.LANCZOS).convert("RGB").save(os.path.join(root, "public", "apple-touch-icon.png"))
tile.resize((32, 32), Image.LANCZOS).save(os.path.join(root, "public", "favicon-32.png"))
tile.save(os.path.join(root, "public", "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])

json.dump(manifest, open(os.path.join(root, "assets-manifest.json"), "w"), indent=1)
print("done", len(manifest["images"]), "images")
