/**
 * Generates the App Store Connect promotional images for the Loop Plus
 * in-app purchases (monthly + yearly).
 *
 * Apple's requirements: JPG or PNG, exactly 1024 x 1024, 72 dpi, RGB,
 * flattened (no alpha) and no rounded corners.
 *
 * Run: node scripts/gen-iap-promo.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "store", "iap");
mkdirSync(OUT, { recursive: true });

// Straight from src/theme.ts.
const CREAM = "#FBF4EA";
const TERRA = "#C85D4D";
const TEXT = "#3B2F2A";

const SANS = "Avenir Next, Helvetica Neue, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, Iowan Old Style, Times New Roman, serif";

/**
 * The Loop yarn-ball mark, same geometry as scripts/gen-assets.mjs but
 * parameterised so it can be dropped anywhere on the 1024 canvas.
 */
function yarnMark({ cx, cy, r, ball, line, tail, id }) {
  const strandScale = r / 300;
  const s = (n) => n * strandScale;
  return `
    <defs>
      <clipPath id="clip-${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    </defs>
    <path d="M ${cx + s(250)} ${cy + s(130)}
             C ${cx + s(360)} ${cy + s(230)}, ${cx + s(300)} ${cy + s(360)}, ${cx + s(180)} ${cy + s(340)}
             C ${cx + s(90)} ${cy + s(325)}, ${cx + s(120)} ${cy + s(220)}, ${cx + s(210)} ${cy + s(250)}"
          fill="none" stroke="${tail}" stroke-width="${s(34)}" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ball}"/>
    <g clip-path="url(#clip-${id})" stroke="${line}" stroke-width="${s(16)}" fill="none"
       opacity="0.55" stroke-linecap="round">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${s(120)}" transform="rotate(25 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${s(120)}" transform="rotate(75 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${s(120)}" transform="rotate(125 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${s(120)}" ry="${r}" transform="rotate(20 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${s(120)}" ry="${r}" transform="rotate(-30 ${cx} ${cy})"/>
    </g>`;
}

/**
 * Faint concentric stitch rings behind the mark. Clipped above the text block
 * so the dashes never run through the wordmark.
 */
function halo(cx, cy, stroke) {
  const rings = [300, 380, 462]
    .map(
      (r, i) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}"
           stroke-width="3" opacity="${0.45 - i * 0.12}" stroke-dasharray="14 18"/>`,
    )
    .join("");
  return `<defs><clipPath id="haloClip"><rect x="0" y="0" width="1024" height="566"/></clipPath></defs>
    <g clip-path="url(#haloClip)">${rings}</g>`;
}

/** A rounded "pill" badge with centred text. */
function pill({ cx, y, w, h, fill, stroke, text, color, size, weight = 600, spacing = 2 }) {
  return `
    <rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"
          fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="3"` : ""}/>
    <text x="${cx}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="central"
          font-family="${SANS}" font-size="${size}" font-weight="${weight}"
          letter-spacing="${spacing}" fill="${color}">${text}</text>`;
}

/**
 * One promo image. `variant` drives the colourway so the two products are
 * instantly distinguishable in the store and in offer-code redemption.
 */
function promo({ term, tagline, badge, variant }) {
  const cx = 512;
  const light = variant === "light";

  const bg = light
    ? `<rect width="1024" height="1024" fill="${CREAM}"/>
       <rect width="1024" height="1024" fill="url(#warm)"/>`
    : `<rect width="1024" height="1024" fill="url(#terra)"/>`;

  const mark = yarnMark({
    cx,
    cy: 320,
    r: 185,
    ball: light ? TERRA : CREAM,
    line: light ? "#E58C77" : "#E4CFB4",
    tail: light ? TERRA : CREAM,
    id: variant,
  });

  const titleColor = light ? TEXT : CREAM;
  const subColor = light ? "#8A7A6D" : "#F3D9CF";

  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#F4E9D8" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="terra" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#D46B54"/>
        <stop offset="1" stop-color="#A8442F"/>
      </linearGradient>
    </defs>
    ${bg}
    ${halo(cx, 320, light ? "#DCCBB3" : "#F3D9CF")}
    ${mark}

    ${
      badge
        ? pill({
            cx,
            y: 604,
            w: 268,
            h: 62,
            fill: light ? "#E4EADD" : "#FBF4EA",
            stroke: light ? "#7C9070" : "none",
            text: badge,
            color: light ? "#4E6244" : "#A8442F",
            size: 26,
            weight: 700,
            spacing: 3,
          })
        : ""
    }

    <text x="${cx}" y="${badge ? 764 : 726}" text-anchor="middle"
          font-family="${SERIF}" font-size="104" font-weight="700"
          letter-spacing="-1" fill="${titleColor}">Loop Plus</text>

    <text x="${cx}" y="${badge ? 846 : 808}" text-anchor="middle"
          font-family="${SANS}" font-size="46" font-weight="600"
          letter-spacing="8" fill="${light ? TERRA : CREAM}">${term.toUpperCase()}</text>

    <text x="${cx}" y="${badge ? 922 : 884}" text-anchor="middle"
          font-family="${SANS}" font-size="34" font-weight="400"
          fill="${subColor}">${tagline}</text>
  </svg>`;
}

const VARIANTS = [
  {
    file: "loop-plus-monthly-1024.png",
    svg: promo({
      term: "Monthly",
      tagline: "Unlimited projects, counters &amp; stash",
      badge: null,
      variant: "light",
    }),
  },
  {
    file: "loop-plus-yearly-1024.png",
    svg: promo({
      term: "Yearly",
      tagline: "Unlimited projects, counters &amp; stash",
      badge: "BEST VALUE",
      variant: "dark",
    }),
  },
];

for (const { file, svg } of VARIANTS) {
  await sharp(Buffer.from(svg))
    .resize(1024, 1024)
    // Flatten onto an opaque background: Apple rejects images with alpha.
    .flatten({ background: CREAM })
    .removeAlpha()
    .withMetadata({ density: 72 })
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, file));

  const meta = await sharp(join(OUT, file)).metadata();
  console.log(
    `wrote ${file} — ${meta.width}x${meta.height}, ${meta.density}dpi, ` +
      `${meta.space}, channels=${meta.channels}, alpha=${meta.hasAlpha}`,
  );
}
