/**
 * Generates Loop's app icon, splash mark, adaptive icon and favicon from
 * inline SVG. Run: node scripts/gen-assets.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

const CREAM = "#FBF4EA";
const TERRA = "#C85D4D";

/**
 * A wound ball of yarn with a little trailing loop. `ball` is the fill colour,
 * `line` the winding lines, and `bg` optional (a full rounded background).
 */
function yarnSvg({ ball, line, bg = null, tail = ball, size = 1024 }) {
  const cx = 512;
  const cy = 520;
  const r = 300;
  const winding = `
    <g clip-path="url(#ballClip)" stroke="${line}" stroke-width="16" fill="none" opacity="0.55" stroke-linecap="round">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="120" transform="rotate(25 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="120" transform="rotate(75 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="120" transform="rotate(125 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="120" ry="${r}" transform="rotate(20 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="120" ry="${r}" transform="rotate(-30 ${cx} ${cy})"/>
    </g>`;
  // A loose strand curling off the lower-right into a small loop.
  const strand = `
    <path d="M ${cx + 250} ${cy + 130}
             C ${cx + 360} ${cy + 230}, ${cx + 300} ${cy + 360}, ${cx + 180} ${cy + 340}
             C ${cx + 90} ${cy + 325}, ${cx + 120} ${cy + 220}, ${cx + 210} ${cy + 250}"
          fill="none" stroke="${tail}" stroke-width="34" stroke-linecap="round"/>`;

  return `<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="ballClip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#D46B54"/>
        <stop offset="1" stop-color="#B8472F"/>
      </linearGradient>
    </defs>
    ${bg ? `<rect width="1024" height="1024" rx="0" fill="${bg === "grad" ? "url(#bgGrad)" : bg}"/>` : ""}
    ${strand}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ball}"/>
    ${winding}
  </svg>`;
}

async function render(svg, size, out) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(ASSETS, out));
  console.log("wrote", out, `${size}px`);
}

const fullIcon = yarnSvg({ bg: "grad", ball: CREAM, line: "#E4CFB4", tail: CREAM });
const creamMark = yarnSvg({ ball: CREAM, line: "#E4CFB4", tail: CREAM });
const terraMark = yarnSvg({ ball: TERRA, line: "#E58C77", tail: TERRA });
const monoMark = yarnSvg({ ball: "#000000", line: "#000000", tail: "#000000" });

await render(fullIcon, 1024, "icon.png");
await render(terraMark, 1024, "splash-icon.png"); // terracotta ball on cream splash bg
await render(creamMark, 1024, "android-icon-foreground.png"); // cream ball on terra bg
await render(monoMark, 1024, "android-icon-monochrome.png");
await render(fullIcon, 64, "favicon.png");
console.log("done");
