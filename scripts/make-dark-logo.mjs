/**
 * Derives the reversed logo, for use on the dark theme.
 *
 * The supplied artwork is dark navy with a grey globe, drawn for a light wall. On
 * the evening theme it either disappears into the page or has to sit on a white
 * plate, and a white plate under a logo reads as a photo someone pasted on rather
 * than as part of the page.
 *
 * So this produces the reversed version every brand ends up needing. It keeps the
 * artwork exactly — same shapes, same alpha, same proportions — and only remaps
 * the two tones so the relationship between them survives on a dark ground:
 *
 *   navy  (luma ~55)   ->  white          the C, wordmark, headset, tagline
 *   grey  (luma ~130)  ->  muted blue     the globe, which stays secondary
 *
 * Pixels are classified by luminance with a smooth crossover, so antialiased
 * edges blend between the two targets instead of stepping.
 *
 *   node scripts/make-dark-logo.mjs
 *
 * If an official reversed logo ever arrives, drop it at the output path and
 * delete this. A real one beats a derived one.
 */
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SRC = fileURLToPath(new URL("../public/media/callaz-logo.png", import.meta.url));
const OUT = fileURLToPath(
  new URL("../public/media/callaz-logo-reversed.png", import.meta.url),
);

/** Measured off the source artwork. */
const NAVY_LUMA = 55;
const GREY_LUMA = 130;

/** What each tone becomes on a dark ground. */
const NAVY_TO = [255, 255, 255];
const GREY_TO = [139, 163, 191];

const lumaOf = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Hermite smoothstep, so the crossover between the tones is not a hard edge. */
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

const out = Buffer.alloc(info.width * info.height * 4);

for (let i = 0; i < info.width * info.height; i += 1) {
  const r = data[i * 4];
  const g = data[i * 4 + 1];
  const b = data[i * 4 + 2];
  const a = data[i * 4 + 3];

  if (a === 0) {
    out[i * 4 + 3] = 0;
    continue;
  }

  // 0 at the navy end, 1 at the grey end.
  const t = smoothstep(NAVY_LUMA, GREY_LUMA, lumaOf(r, g, b));

  out[i * 4] = Math.round(NAVY_TO[0] * (1 - t) + GREY_TO[0] * t);
  out[i * 4 + 1] = Math.round(NAVY_TO[1] * (1 - t) + GREY_TO[1] * t);
  out[i * 4 + 2] = Math.round(NAVY_TO[2] * (1 - t) + GREY_TO[2] * t);
  out[i * 4 + 3] = a;
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ palette: true, quality: 80, compressionLevel: 9 })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`Wrote ${OUT}`);
console.log(`  ${meta.width}x${meta.height}, alpha: ${meta.hasAlpha}`);
