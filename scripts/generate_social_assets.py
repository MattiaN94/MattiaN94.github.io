"""Generate committed social/PWA bitmap assets with Pillow.

This script is for reproducibility only; the website does not require Python.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts") / name,
        Path("/usr/share/fonts/truetype/dejavu") / ("DejaVuSans-Bold.ttf" if "bd" in name else "DejaVuSans.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default(size=size)


BOLD_80 = font("arialbd.ttf", 80)
BOLD_72 = font("arialbd.ttf", 72)
BOLD_26 = font("arialbd.ttf", 26)
BOLD_18 = font("arialbd.ttf", 18)
REGULAR_22 = font("arial.ttf", 22)
MONO_14 = font("consola.ttf", 14)


def draw_icon(size: int, filename: str) -> None:
    scale = 4
    image = Image.new("RGB", (size * scale, size * scale), "#111318")
    draw = ImageDraw.Draw(image)
    pad = round(size * 0.07 * scale)
    dot = round(size * 0.07 * scale)
    draw.ellipse(
        (size * scale - pad - dot * 2, pad, size * scale - pad, pad + dot * 2),
        fill="#b7f34a",
    )
    label_font = font("arialbd.ttf", round(size * 0.34 * scale))
    text = "MN"
    bounds = draw.textbbox((0, 0), text, font=label_font)
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    draw.text(
        ((size * scale - width) / 2, (size * scale - height) / 2 - bounds[1]),
        text,
        fill="#aaa6ff",
        font=label_font,
        anchor=None,
    )
    image.resize((size, size), Image.Resampling.LANCZOS).save(ASSETS / filename, optimize=True)


def draw_social_card() -> None:
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), "#f3f1ea")

    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((-190, -240, 390, 340), fill=(91, 82, 214, 92))
    glow_draw.ellipse((510, -300, 1030, 220), fill=(49, 168, 196, 55))
    image = Image.alpha_composite(image.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(48)))
    draw = ImageDraw.Draw(image)

    for x in range(0, width, 42):
        draw.line((x, 0, x, height), fill="#d5d5cc", width=1)
    for y in range(0, height, 42):
        draw.line((0, y, width, y), fill="#d5d5cc", width=1)

    draw.rounded_rectangle((50, 42, 112, 104), radius=20, fill="#111318")
    small_monogram = font("arialbd.ttf", 20)
    draw.text((81, 73), "MN", font=small_monogram, fill="#aaa6ff", anchor="mm")
    draw.text((132, 49), "MATTIA NECCHIO", font=BOLD_18, fill="#111318")
    draw.text((132, 76), "AI PRODUCT · WORKFLOW DESIGN", font=MONO_14, fill="#62666f")

    draw.rounded_rectangle((560, 47, 752, 84), radius=18, outline="#c8c7d0", width=1, fill="#fcfbf7")
    badge = "PORTFOLIO / 2026"
    badge_box = draw.textbbox((0, 0), badge, font=MONO_14)
    draw.text((656 - (badge_box[2] - badge_box[0]) / 2, 58), badge, font=MONO_14, fill="#62666f")

    draw.text((54, 160), "AI products for", font=BOLD_80, fill="#111318", spacing=-8)
    draw.text((54, 242), "complex workflows.", font=BOLD_72, fill="#62666f", spacing=-8)
    draw.multiline_text(
        (58, 354),
        "Map the work. Prototype the flow.\nMeasure what actually helps.",
        font=REGULAR_22,
        fill="#555a64",
        spacing=8,
    )

    draw.rounded_rectangle((54, 475, 738, 558), radius=18, fill="#fcfbf7", outline="#c8c7d0", width=1)
    stages = ["DOMAIN", "WORKFLOW", "SYSTEM", "EVALUATION"]
    positions = [82, 241, 425, 578]
    for index, (stage, x) in enumerate(zip(stages, positions)):
        draw.text((x, 507), stage, font=BOLD_18, fill="#111318")
        if index < len(stages) - 1:
            draw.text((x + 112, 505), "→", font=BOLD_26, fill="#858a94")

    panel = (790, 40, 1150, 590)
    draw.rounded_rectangle(panel, radius=36, fill="#111318", outline="#343741", width=1)
    draw.text((826, 74), "WORKFLOW.TRACE", font=MONO_14, fill="#8b909a")
    draw.ellipse((1100, 74, 1112, 86), fill="#b7f34a")

    draw.text((826, 126), "MESSY INPUTS", font=BOLD_26, fill="#f4f5f1")
    draw.text((826, 157), "USABLE OUTPUT", font=BOLD_26, fill="#aaa6ff")

    nodes = [
        ("01", "STRUCTURE", "RULES", "#7dd8ff"),
        ("02", "INTERPRET", "LLM", "#b8a6ff"),
        ("03", "VERIFY", "RULES", "#7dd8ff"),
        ("04", "DECIDE", "HUMAN", "#ff9a70"),
    ]
    y = 226
    for number, label, kind, colour in nodes:
        draw.rounded_rectangle((820, y, 1120, y + 62), radius=14, fill="#1c1f26", outline="#30343e", width=1)
        draw.text((839, y + 22), number, font=MONO_14, fill="#747a86")
        draw.text((882, y + 20), label, font=BOLD_18, fill="#f4f5f1")
        kind_box = draw.textbbox((0, 0), kind, font=MONO_14)
        draw.text((1098 - (kind_box[2] - kind_box[0]), y + 23), kind, font=MONO_14, fill=colour)
        y += 75

    draw.rounded_rectangle((820, 535, 1120, 562), radius=13, fill="#b7f34a")
    output = "USEFUL · REVIEWABLE · MEASURABLE"
    output_box = draw.textbbox((0, 0), output, font=MONO_14)
    draw.text((970 - (output_box[2] - output_box[0]) / 2, 541), output, font=MONO_14, fill="#111318")

    image.convert("RGB").save(ASSETS / "og-card.png", optimize=True, quality=92)


if __name__ == "__main__":
    ASSETS.mkdir(parents=True, exist_ok=True)
    draw_icon(192, "icon-192.png")
    draw_icon(512, "icon-512.png")
    draw_icon(180, "apple-touch-icon.png")
    draw_social_card()
    print("Generated og-card.png, icon-192.png, icon-512.png and apple-touch-icon.png")
