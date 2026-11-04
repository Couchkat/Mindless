"""Builds Mindless into one self-contained page.

    python3 build.py

Writes index.html: open it directly, serve it with GitHub Pages, or publish it
as a Claude artifact (where account storage, Google Calendar and AI turn on).
"""
from pathlib import Path

root = Path(__file__).parent
src = root / "src"
template = (src / "template.html").read_text()
css = (src / "style.css").read_text()
engine = (src / "engine.js").read_text().replace(
    "if (typeof module !== 'undefined') module.exports = { PLACES, MODES, schedule, optimize, fmt, dur, travel };", "")
app = (src / "app.js").read_text()

body = template.replace("/*CSS*/", "\n" + css).replace("/*ENGINE*/", engine).replace("/*APP*/", app)
page = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>body{margin:0}[hidden]{display:none!important}</style></head><body>'
        + body + "</body></html>\n")
(root / "index.html").write_text(page)
print(f"index.html written ({len(page):,} bytes)")
