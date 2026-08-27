"""Regenerate the portrait derivatives from portrait.png.

The page renders the portrait at 330 CSS px, so 720 px already covers a 2x
display exactly. This adds a 1080 px set for 3x phones and wires both widths
into a srcset, so a high-density screen gets a sharp image and everyone else
still downloads the small one. Nothing is upscaled — the source is 1254 px.

    python make_images.py
"""
import io, os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "portrait.png")

# (width, quality) — AVIF and WebP hold detail far better than JPEG at the
# same file size, so JPEG (the universal fallback) gets the higher setting.
WIDTHS = [720, 1080]
FORMATS = [
    ("avif", {"quality": 62}),
    ("webp", {"quality": 82, "method": 6}),
    ("jpg", {"quality": 86, "optimize": True, "progressive": True}),
]

src = Image.open(SRC).convert("RGB")
print("source: %s  %dx%d  %.0f KB\n" % (
    os.path.basename(SRC), src.width, src.height, os.path.getsize(SRC) / 1024))

rows = []
for w in WIDTHS:
    if w > src.width:
        print("skip %dpx — larger than the source, would only upscale" % w)
        continue
    resized = src.resize((w, w), Image.LANCZOS)
    for ext, opts in FORMATS:
        name = "portrait.%s" % ext if w == 720 else "portrait@%d.%s" % (w, ext)
        path = os.path.join(ROOT, name)
        fmt = "JPEG" if ext == "jpg" else ext.upper()
        resized.save(path, fmt, **opts)
        rows.append((name, w, os.path.getsize(path)))

print("%-22s %6s %10s" % ("file", "px", "size"))
for name, w, size in rows:
    print("%-22s %6d %8.0f KB" % (name, w, size / 1024))
print("\ntotal for one visitor (best format, one width): %.0f KB"
      % (min(s for n, w, s in rows if w == 720) / 1024))
