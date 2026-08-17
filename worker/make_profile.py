"""Extract the KB entries from index.html into the Worker's grounding profile.

Generated rather than hand-copied, so the page and the model cannot drift.
Placeholder answers are skipped: grounding the model on "[Your CGPA...]" would
teach it to state a placeholder as fact.
"""
import io, re, html, os

SRC = r"D:\Portfolio\index.html"
OUT_TXT = r"D:\Portfolio\worker\profile.txt"
OUT_JS = r"D:\Portfolio\worker\profile.js"

src = io.open(SRC, encoding="utf-8").read()
start = src.index("const KB = [")
end = src.index("\n  ];", start)
kb = src[start:end]

entries = re.findall(r't:"([^"]+)"[\s\S]*?a:`([\s\S]*?)`\s*\}', kb)


def clean(h):
    h = re.sub(r"<br\s*/?>", "\n", h)
    h = re.sub(r"</p>", "\n", h)
    h = re.sub(r"<[^>]+>", "", h)
    h = html.unescape(h)
    h = "\n".join(line.strip() for line in h.split("\n"))
    h = re.sub(r"[ \t]+", " ", h)
    h = re.sub(r"\n{3,}", "\n\n", h)
    return h.strip()


parts, skipped = [], []
for title, body in entries:
    text = clean(body)
    if re.search(r"\[[^\]]{15,}\]", text):
        skipped.append(title)
        continue
    parts.append("## %s\n%s" % (title, text))

profile = "\n\n".join(parts) + "\n"
os.makedirs(os.path.dirname(OUT_TXT), exist_ok=True)
io.open(OUT_TXT, "w", encoding="utf-8", newline="\n").write(profile)

# JS module for the Worker bundle. Escape what a template literal would eat.
esc = profile.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
io.open(OUT_JS, "w", encoding="utf-8", newline="\n").write(
    "// GENERATED from index.html by make_profile.py — do not edit by hand.\n"
    "export default `%s`;\n" % esc
)

print("entries found :", len(entries))
print("grounded      :", len(parts))
print("skipped       :", len(skipped))
for s in skipped:
    print("   - still placeholder:", s)
print("profile bytes :", len(profile.encode("utf-8")))
