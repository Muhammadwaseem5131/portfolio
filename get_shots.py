"""Pull the screenshots out of your own repos and build two sizes of each.

Served locally rather than hot-linked from GitHub: a hot-linked image is a
third-party request on every page view, and it breaks the day you rename a
file. These are your own assets from your own public repos.

    python get_shots.py
"""
import io, os, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "shots")
RAW = "https://raw.githubusercontent.com/Muhammadwaseem5131"

SHOTS = [
    # (local name, url, caption)
    ("omniaudit-findings", f"{RAW}/OmniAudit01/main/assets/screenshot_findings.png",
     "Findings dashboard"),
    ("omniaudit-fixide", f"{RAW}/OmniAudit01/main/assets/screenshot_fixide.png",
     "Remediation IDE — backlog, code with inline diff, diagnostics"),
    ("omniaudit-upload", f"{RAW}/OmniAudit01/main/assets/screenshot_upload.png",
     "Upload — drag a folder or .zip, nothing leaves the browser"),
    ("iot-dashboard", f"{RAW}/IoT-Sentinel/main/docs/screenshots/dashboard.png",
     "Discovered devices, risk overview and wireless findings"),
    ("iot-device", f"{RAW}/IoT-Sentinel/main/docs/screenshots/device-detail.png",
     "Device detail — open ports and two critical vulnerabilities"),
    ("iot-wireless", f"{RAW}/IoT-Sentinel/main/docs/screenshots/wireless.png",
     "Wireless audit — adapter status and detected networks"),
    ("iot-map", f"{RAW}/IoT-Sentinel/main/docs/screenshots/network-map.png",
     "Network map of the scanned subnet"),
]

THUMB_W, FULL_W = 560, 1600

os.makedirs(OUT, exist_ok=True)
print("%-22s %10s %10s %10s" % ("name", "source", "thumb", "full"))

ok = 0
for name, url, _caption in SHOTS:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "portfolio-build"})
        data = urllib.request.urlopen(req, timeout=30).read()
    except Exception as e:
        print("%-22s  FAILED  %s" % (name, e))
        continue

    im = Image.open(io.BytesIO(data)).convert("RGB")

    def save(width, suffix):
        w = min(width, im.width)
        h = round(im.height * w / im.width)
        out = im.resize((w, h), Image.LANCZOS)
        path = os.path.join(OUT, "%s%s.webp" % (name, suffix))
        out.save(path, "WEBP", quality=82, method=6)
        return os.path.getsize(path)

    t = save(THUMB_W, "")
    f = save(FULL_W, "@full")
    ok += 1
    print("%-22s %9.0fK %9.0fK %9.0fK" % (name, len(data) / 1024, t / 1024, f / 1024))

print("\n%d of %d fetched into shots/" % (ok, len(SHOTS)))
