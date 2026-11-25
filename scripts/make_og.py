#!/usr/bin/env python3
"""Generate the 1200x630 Open Graph image from the logo and the hero photograph."""
import sys, os
from PIL import Image, ImageDraw, ImageFont
root = sys.argv[1] if len(sys.argv) > 1 else "."
img = lambda p: Image.open(os.path.join(root, "public/images", p))
W, H = 1200, 630
navy, orange = (7, 24, 47), (255, 81, 38)
bg = Image.new("RGB", (W, H), navy)
photo = img("gallery/industrial-processing-hall-equipment.webp").convert("RGB")
ph = photo.resize((int(H * photo.width / photo.height), H), Image.LANCZOS)
bg.paste(ph.crop((ph.width - 640, 0, ph.width, H)), (W - 640, 0))
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(shade)
for x in range(W - 700, W - 60):                                  # soft navy fade into the photo
    a = int(255 * max(0, 1 - (x - (W - 700)) / 640) ** 1.4)
    d.line([(x, 0), (x, H)], fill=(7, 24, 47, a))
bg = Image.alpha_composite(bg.convert("RGBA"), shade).convert("RGB")
d = ImageDraw.Draw(bg)
plate = Image.new("RGB", (190, 160), "white"); bg.paste(plate, (72, 72))
logo = img("brand/smarctek-logo.png").convert("RGBA"); logo.thumbnail((150, 124))
bg.paste(logo, (72 + (190 - logo.width) // 2, 72 + (160 - logo.height) // 2), logo)
F = lambda n, s: ImageFont.truetype(f"/usr/share/fonts/opentype/inter/Inter-{n}.otf", s)
d.text((72, 300), "SMARCTEK LLC", font=F("ExtraBold", 64), fill="white")
d.rectangle([72, 392, 132, 396], fill=orange)
d.text((72, 420), "Engineering Solutions.", font=F("SemiBold", 36), fill=(214, 224, 240))
d.text((72, 466), "Connecting Global Opportunities.", font=F("SemiBold", 36), fill=(214, 224, 240))
d.text((72, 560), "Industrial machinery  ·  Agricultural processing  ·  Glastonbury, Connecticut", font=F("Medium", 21), fill=(160, 178, 205))
out = os.path.join(root, "public/images/brand/og-default.jpg")
bg.save(out, quality=88, optimize=True); print(out, os.path.getsize(out) // 1024, "KB")
