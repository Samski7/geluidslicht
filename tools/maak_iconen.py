"""Maakt de app-iconen in ../icons/: een meter met een groen-oranje-rode boog en een naald.

Gebruik: python tools/maak_iconen.py  (vereist Pillow: pip install Pillow)
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw

PLATE = "#15181c"
INK = "#e8ecef"
GREEN = "#2bb062"
AMBER = "#f5a300"
RED = "#e5383b"

SUPER = 4  # eerst groter tekenen en dan verkleinen, voor zachte randen
OUT = Path(__file__).resolve().parent.parent / "icons"


def teken(size, scale):
    """Tekent het icoon. scale < 1 houdt de meter verder van de rand (voor maskable en iOS)."""
    s = size * SUPER
    img = Image.new("RGB", (s, s), PLATE)
    d = ImageDraw.Draw(img)

    def pt(x, y):
        return (s * (0.5 + (x - 0.5) * scale), s * (0.5 + (y - 0.5) * scale))

    def ln(v):
        return s * v * scale

    cx, cy, r, w = 0.5, 0.58, 0.30, 0.075
    c = pt(cx, cy)
    box = [c[0] - ln(r), c[1] - ln(r), c[0] + ln(r), c[1] + ln(r)]

    # Boog van linksonder over boven naar rechtsonder (Pillow: graden met de klok mee vanaf 3 uur).
    segmenten = [(150, 260, GREEN), (263, 316, AMBER), (319, 390, RED)]
    for start, end, kleur in segmenten:
        d.arc(box, start, end, fill=kleur, width=round(ln(w)))

    # Ronde uiteinden links en rechts.
    for hoek, kleur in ((150, GREEN), (390, RED)):
        a = math.radians(hoek)
        mx, my = c[0] + math.cos(a) * ln(r - w / 2), c[1] + math.sin(a) * ln(r - w / 2)
        d.ellipse([mx - ln(w / 2), my - ln(w / 2), mx + ln(w / 2), my + ln(w / 2)], fill=kleur)

    # Naald, wijst naar het oranje.
    a = math.radians(296)
    tip = (c[0] + math.cos(a) * ln(0.24), c[1] + math.sin(a) * ln(0.24))
    loodrecht = a + math.pi / 2
    voet = ln(0.024)
    d.polygon([
        tip,
        (c[0] + math.cos(loodrecht) * voet, c[1] + math.sin(loodrecht) * voet),
        (c[0] - math.cos(loodrecht) * voet, c[1] - math.sin(loodrecht) * voet),
    ], fill=INK)
    for straal, kleur in ((0.05, INK), (0.018, PLATE)):
        d.ellipse([c[0] - ln(straal), c[1] - ln(straal), c[0] + ln(straal), c[1] + ln(straal)], fill=kleur)

    return img.resize((size, size), Image.LANCZOS)


def main():
    OUT.mkdir(exist_ok=True)
    teken(192, 1.0).save(OUT / "icon-192.png", optimize=True)
    teken(512, 1.0).save(OUT / "icon-512.png", optimize=True)
    # Maskable: alles binnen de veilige cirkel (80% van de breedte).
    teken(512, 0.8).save(OUT / "icon-maskable-512.png", optimize=True)
    # iOS rondt de hoeken zelf af; geen transparantie.
    teken(180, 0.9).save(OUT / "apple-touch-icon.png", optimize=True)
    teken(32, 1.0).save(OUT / "favicon-32.png", optimize=True)
    print("Iconen gemaakt in", OUT)


if __name__ == "__main__":
    main()
