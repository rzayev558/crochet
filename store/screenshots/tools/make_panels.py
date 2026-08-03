#!/usr/bin/env python3
"""
Composes App Store Connect screenshots for Loop.

Takes the raw simulator captures and wraps each in a 1320x2868 (6.9") marketing
panel: headline, subline and a device frame. Three of the ten panels are
quote panels instead — a pull-quote about what the app is for, with the app
icon. Rendered with headless Chrome so the output is exact pixels.

Usage: make_panels.py <raw-shots-dir> <out-dir> <en|de>
"""
import base64
import pathlib
import subprocess
import sys
import tempfile
import time

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
W, H = 1320, 2868

# --- palette (mirrors src/theme.ts) -----------------------------------------
TEXT = "#3B2F2A"
MUTED = "#8A7A6D"
PRIMARY = "#C85D4D"
PRIMARY_DARK = "#A8442F"
SAGE = "#5D7050"

QUOTE_THEMES = [
    {"bg": "linear-gradient(165deg,#F7EEE0 0%,#F1E3CC 100%)", "accent": PRIMARY_DARK},
    {"bg": "linear-gradient(165deg,#E9EFE2 0%,#DCE5D3 100%)", "accent": SAGE},
    {"bg": "linear-gradient(165deg,#FBE6DE 0%,#F5D6C9 100%)", "accent": PRIMARY_DARK},
]

# --- copy -------------------------------------------------------------------
PANELS = {
    "en": [
        ("feature", "counter", "Never lose<br>your place",
         "A giant tap-anywhere counter with a gentle buzz on every row."),
        ("feature", "projects", "A home for<br>every project",
         "Sweaters, blankets, granny squares — each with its own counters, notes and photo."),
        ("quote", None, "The screen stays awake<br>while your hands are busy.",
         "MADE FOR REAL CRAFTING"),
        ("feature", "project", "Count every<br>piece at once",
         "Body, sleeves, cable repeats — separate counters, one project."),
        ("feature", "stash", "Know your<br>stash by heart",
         "Every skein: brand, colourway, weight, fibre and how much is left."),
        ("quote", None, "No account. No cloud.<br>No internet needed.",
         "YOURS, AND OFFLINE"),
        ("feature", "patterns", "Every pattern,<br>always with you",
         "Import a PDF, photograph a page, or keep a link — all in one library."),
        ("feature", "learn", "Learn to crochet,<br>step by step",
         "Eight short lessons, from holding the hook to reading a pattern."),
        ("feature", "lesson", "Clear, unhurried<br>instructions",
         "One step at a time, in big readable type, with a tip where you need it."),
        ("quote", None, "Big type and big buttons,<br>because squinting<br>isn't a feature.",
         "BUILT TO BE READABLE"),
    ],
    "de": [
        ("feature", "counter", "Verliere nie<br>deine Stelle",
         "Ein riesiger Zähler — tippe irgendwo, mit sanftem Summen bei jeder Reihe."),
        ("feature", "projects", "Ein Zuhause für<br>jedes Projekt",
         "Pullover, Decken, Granny Squares — jedes mit eigenen Zählern, Notizen und Foto."),
        ("quote", None, "Der Bildschirm bleibt an,<br>während du häkelst.",
         "FÜRS ECHTE HANDARBEITEN"),
        ("feature", "project", "Zähle alle Teile<br>gleichzeitig",
         "Rückenteil, Ärmel, Zopf-Rapporte — eigene Zähler, ein Projekt."),
        ("feature", "stash", "Kenne deinen<br>Garnvorrat",
         "Jedes Knäuel: Marke, Farbe, Stärke, Faser und wie viel noch übrig ist."),
        ("quote", None, "Kein Konto. Keine Cloud.<br>Kein Internet nötig.",
         "DEINE DATEN, OFFLINE"),
        ("feature", "patterns", "Jede Anleitung,<br>immer dabei",
         "PDF importieren, Seite fotografieren oder Link speichern — alles in einer Bibliothek."),
        ("feature", "learn", "Häkeln lernen,<br>Schritt für Schritt",
         "Acht kurze Lektionen — vom Halten der Nadel bis zum Lesen einer Anleitung."),
        ("feature", "lesson", "Klare, ruhige<br>Anleitungen",
         "Ein Schritt nach dem anderen, in großer Schrift, mit Tipp wo du ihn brauchst."),
        ("quote", None, "Große Schrift, große Tasten.<br>Kneifen ist kein Feature.",
         "GUT LESBAR"),
    ],
}

SERIF = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif"
SANS = "-apple-system,'SF Pro Text','Helvetica Neue',Arial,sans-serif"

CSS = f"""
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:{W}px;height:{H}px;overflow:hidden}}
.page{{width:{W}px;height:{H}px;overflow:hidden;display:flex;flex-direction:column;
  align-items:center;position:relative}}

/* ---- feature panels ---- */
.page.feature{{padding:130px 100px 76px;
  background:radial-gradient(125% 78% at 50% -6%,#FFFDF9 0%,#FBF4EA 44%,#F1E2CB 100%)}}
.head{{height:420px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;flex:0 0 auto}}
h1{{font:600 104px/1.06 {SERIF};color:{TEXT};letter-spacing:-1px;text-align:center}}
.sub{{font:400 43px/1.36 {SANS};color:{MUTED};text-align:center;margin-top:32px;max-width:1010px}}
.stage{{flex:1;min-height:0;display:flex;justify-content:center;align-items:flex-start;
  margin-top:70px}}

.device{{flex:0 0 auto;width:1020px;padding:22px;background:#1A1715;border-radius:96px;
  box-shadow:0 44px 88px rgba(94,64,38,.30),0 4px 14px rgba(94,64,38,.18)}}
.screen{{border-radius:76px;overflow:hidden;background:#FBF4EA}}
.screen img{{display:block;width:100%;height:auto}}

/* ---- quote panels ---- */
.page.quote{{justify-content:center;padding:0 92px;position:relative}}
.mark{{font:700 200px/.55 {SERIF};opacity:.18;margin-bottom:8px}}
.label{{font:700 33px/1 {SANS};letter-spacing:.24em;text-transform:uppercase}}
blockquote{{font:400 110px/1.22 {SERIF};color:{TEXT};text-align:center;margin-top:52px;
  letter-spacing:-.5px;max-width:1136px}}
.stitch{{width:240px;border-top:9px dashed;opacity:.32;margin-top:80px}}
.brand{{display:flex;align-items:center;gap:30px;margin-top:112px}}
.brand img{{width:140px;height:140px;border-radius:33px;
  box-shadow:0 14px 34px rgba(94,64,38,.26)}}
.brand span{{font:600 54px/1 {SERIF};color:{TEXT}}}
"""


def data_uri(path: pathlib.Path) -> str:
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode()


def feature_html(headline: str, sub: str, shot: pathlib.Path) -> str:
    return f"""<div class="page feature">
  <div class="head"><h1>{headline}</h1><div class="sub">{sub}</div></div>
  <div class="stage"><div class="device"><div class="screen">
    <img src="{data_uri(shot)}">
  </div></div></div>
</div>"""


def quote_html(quote: str, label: str, theme: dict, icon: pathlib.Path) -> str:
    # Size to the longest authored line so the explicit <br> breaks are the only
    # breaks — otherwise a line re-wraps and strands a word on its own.
    # ~0.5em average glyph width for this serif at the 1136px measure.
    longest = max(len(line) for line in quote.split("<br>"))
    size = max(62, min(108, int(1136 / (0.5 * longest))))
    return f"""<div class="page quote" style="background:{theme['bg']}">
  <div class="mark" style="color:{theme['accent']}">&ldquo;</div>
  <div class="label" style="color:{theme['accent']}">{label}</div>
  <blockquote style="font-size:{size}px">{quote}</blockquote>
  <div class="stitch" style="border-color:{theme['accent']}"></div>
  <div class="brand"><img src="{data_uri(icon)}"><span>Loop</span></div>
</div>"""


def render(html: str, out: pathlib.Path, workdir: pathlib.Path, idx: int) -> None:
    """Chrome writes the PNG but then hangs on this machine, so wait for the
    file to stop growing and kill it rather than waiting for a clean exit."""
    page = workdir / f"panel-{idx}.html"
    page.write_text(f"<meta charset='utf-8'><style>{CSS}</style>{html}", encoding="utf-8")
    out.unlink(missing_ok=True)
    proc = subprocess.Popen(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
         "--no-first-run", "--no-default-browser-check",
         "--force-device-scale-factor=1", f"--window-size={W},{H}",
         f"--user-data-dir={workdir / 'chrome'}",
         f"--screenshot={out}", page.as_uri()],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    size, stable, waited = -1, 0, 0.0
    while waited < 60:
        time.sleep(0.5)
        waited += 0.5
        now = out.stat().st_size if out.exists() else -1
        stable = stable + 1 if now == size and now > 0 else 0
        size = now
        if stable >= 3:  # unchanged for 1.5s — fully written
            break
    proc.terminate()
    try:
        proc.wait(timeout=10)
    except subprocess.TimeoutExpired:
        proc.kill()
    if not out.exists() or out.stat().st_size == 0:
        raise RuntimeError(f"chrome produced no screenshot for {out.name}")


def main() -> None:
    shots_dir, out_dir, lang = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), sys.argv[3]
    out_dir.mkdir(parents=True, exist_ok=True)
    icon = pathlib.Path("/Users/rzayev/Documents/Coding/loop-crochet/assets/icon.png")

    quote_n = 0
    with tempfile.TemporaryDirectory() as tmp:
        workdir = pathlib.Path(tmp)
        for i, (kind, shot, a, b) in enumerate(PANELS[lang], start=1):
            if kind == "feature":
                html = feature_html(a, b, shots_dir / f"{shot}.png")
                name = f"{i:02d}-{shot}.png"
            else:
                html = quote_html(a, b, QUOTE_THEMES[quote_n], icon)
                quote_n += 1
                name = f"{i:02d}-quote-{quote_n}.png"
            out = out_dir / name
            for attempt in (1, 2, 3):  # chrome occasionally starts up and writes nothing
                try:
                    render(html, out, workdir, i)
                    break
                except RuntimeError:
                    if attempt == 3:
                        raise
                    print(f"retrying {name}")
                    time.sleep(2)
            print(f"rendered {name}")


if __name__ == "__main__":
    main()
