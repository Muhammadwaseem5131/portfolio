"""Build a publishable copy of the site into dist/.

Two jobs, both about what a reviewer must never see:

  1. Strip author-facing comments. `<!-- DRAFT - replace with your own... -->`
     ships to the browser and is one view-source away. It tells anyone looking
     that the copy is templated.

  2. Refuse to publish an unfinished page. Any [square bracket] left in the
     visible content is a placeholder a reviewer could read. This exits
     non-zero and names them rather than quietly shipping.

    python prepublish.py            # check, then build if clean
    python prepublish.py --force    # build anyway (placeholders and all)

Your working index.html is never modified.
"""
import io, os, re, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
# "docs" because GitHub Pages can deploy from main:/docs with no extra branch,
# and Cloudflare Pages takes it as the output directory unchanged.
DIST = os.path.join(ROOT, "docs")

# copied verbatim; everything else in the folder is local-only
ASSETS = [
    "portrait.jpg", "portrait.webp", "portrait.avif",
    "portrait@1080.jpg", "portrait@1080.webp", "portrait@1080.avif",
    "favicon.svg", "apple-touch-icon.png", "og.png",
    "research.html",
]

# whole folders copied as-is
ASSET_DIRS = ["shots", "certs", "logos"]

AUTHOR_FACING = re.compile(
    r"\bEDIT\b|DRAFT|replace with|not your|you can defend|your own|your real|"
    r"copy this|per project|per certification|rewrite in",
    re.I,
)

src = io.open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

# ── 1. strip author-facing comments ───────────────────────────────────────
removed = 0


def scrub(m):
    global removed
    body = m.group(1)
    if not AUTHOR_FACING.search(body):
        return m.group(0)                      # structural divider: keep
    # a divider that also carries instructions keeps only the divider line
    keep = [l for l in body.split("\n")
            if ("═" in l or "──" in l) and not AUTHOR_FACING.search(l)]
    removed += 1
    return "<!--%s-->" % ("\n".join(keep)) if keep else ""


out = re.sub(r"<!--(.*?)-->", scrub, src, flags=re.S)

# ── 2. refuse to publish visible placeholders ─────────────────────────────
visible = re.sub(r"<script.*?</script>|<style.*?</style>", "", out, flags=re.S)
holes = sorted(set(re.findall(r"\[[A-Za-z][^\]\n<]{3,60}\]", visible)))

print("author-facing comments removed : %d" % removed)
print("placeholders still visible     : %d" % len(holes))
for h in holes:
    print("   %s" % h)

if holes and "--force" not in sys.argv:
    print("\nNot building. These would be published as written.")
    print("Fill them in, or run:  python prepublish.py --force")
    sys.exit(1)

# ── 3. write dist/ ────────────────────────────────────────────────────────
os.makedirs(DIST, exist_ok=True)
io.open(os.path.join(DIST, "index.html"), "w", encoding="utf-8",
        newline="\n").write(out)

for d in ASSET_DIRS:
    src_dir = os.path.join(ROOT, d)
    if os.path.isdir(src_dir):
        dst_dir = os.path.join(DIST, d)
        if os.path.isdir(dst_dir):
            shutil.rmtree(dst_dir)
        shutil.copytree(src_dir, dst_dir)

missing = []
for a in ASSETS:
    p = os.path.join(ROOT, a)
    if os.path.exists(p):
        shutil.copy2(p, os.path.join(DIST, a))
    else:
        missing.append(a)

before = len(src.encode("utf-8"))
after = len(out.encode("utf-8"))
print("\nbuilt docs/  (%d files)" % (1 + len(ASSETS) - len(missing)))
print("index.html   %.1f KB -> %.1f KB" % (before / 1024, after / 1024))
if missing:
    print("MISSING assets: %s" % ", ".join(missing))
print("\nPublish the contents of docs/ - not the project root.")
