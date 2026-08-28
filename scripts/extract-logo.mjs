/**
 * Lifts the Callaz logo out of the wall mockup and writes a transparent PNG.
 *
 * The only artwork supplied was a photo of the logo on a reception wall, so it
 * carries a warm beige gradient, vignetting and a soft drop shadow. Nothing here
 * is redrawn: the wall behind each pixel is estimated, an alpha is derived from
 * how much darker the pixel is than that wall, and the wall colour is then
 * un-mixed back out. What survives is the original artwork, minus the wall.
 *
 *   node scripts/extract-logo.mjs
 *
 * Measured off the source, which is what the constants below are tuned against:
 *
 *   wall            luma ~220
 *   grey globe      luma ~130  ->  ~0.86 alpha
 *   navy C and band luma  ~55  ->  saturates at 1.0
 *
 * That gap is why the floor can sit as high as it does: it removes the shadow and
 * the residual wall texture outright, while the pale grey globe lines are still
 * nowhere near it.
 *
 * Replace all of this the moment a clean file exists. A photo of a logo is never
 * as good as the logo, and no amount of matting recovers what the JPEG lost.
 */
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOURCE = "C:/Users/lenovo/Desktop/WhatsApp Image 2026-08-24 at 3.19.38 PM.jpeg";
const OUT = fileURLToPath(new URL("../public/media/callaz-logo.png", import.meta.url));

/*
 * Crop to the logo first. The full frame has a dark doorway and vignetting that
 * are darker than the wall in front of them, and would otherwise be matted in as
 * though they were artwork.
 */
const REGION = { left: 195, top: 150, width: 655, height: 375 };

/** How much darker than the wall counts as fully opaque. */
const FULL = 105;

/*
 * Below LOW is wall, shadow or JPEG noise and goes fully transparent; above HIGH
 * is solid artwork; between them the alpha ramps, which is what keeps edges
 * antialiased rather than stepped.
 */
const LOW = 0.45;
const HIGH = 0.62;

const lumaOf = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * Separable sliding-window maximum. The wall is brighter than every part of the
 * logo, so the local maximum over a window wider than the largest enclosed gap
 * reconstructs the wall the logo is covering.
 *
 * The radius has to clear the inside of the globe. A smaller window never reaches
 * untouched wall in there, so the estimate comes out too dark and the difference
 * reads as artwork — which is exactly what left grey blotches inside the globe on
 * the first attempt.
 */
function maxFilter(src, w, h, radius) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let m = 0;
      const from = Math.max(0, x - radius);
      const to = Math.min(w - 1, x + radius);
      for (let i = from; i <= to; i += 1) m = Math.max(m, src[y * w + i]);
      tmp[y * w + x] = m;
    }
  }

  for (let x = 0; x < w; x += 1) {
    for (let y = 0; y < h; y += 1) {
      let m = 0;
      const from = Math.max(0, y - radius);
      const to = Math.min(h - 1, y + radius);
      for (let i = from; i <= to; i += 1) m = Math.max(m, tmp[i * w + x]);
      out[y * w + x] = m;
    }
  }

  return out;
}

/** Separable box blur, to take the stepping off the reconstructed wall. */
function blur(src, w, h, radius) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let sum = 0;
      let n = 0;
      const from = Math.max(0, x - radius);
      const to = Math.min(w - 1, x + radius);
      for (let i = from; i <= to; i += 1, n += 1) sum += src[y * w + i];
      tmp[y * w + x] = sum / n;
    }
  }

  for (let x = 0; x < w; x += 1) {
    for (let y = 0; y < h; y += 1) {
      let sum = 0;
      let n = 0;
      const from = Math.max(0, y - radius);
      const to = Math.min(h - 1, y + radius);
      for (let i = from; i <= to; i += 1, n += 1) sum += tmp[i * w + x];
      out[y * w + x] = sum / n;
    }
  }

  return out;
}

/** 3x3 median, which clears single-pixel speckle without softening edges. */
function median3(src, w, h) {
  const out = new Float32Array(w * h);
  const win = new Array(9);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const yy = Math.min(h - 1, Math.max(0, y + dy));
          const xx = Math.min(w - 1, Math.max(0, x + dx));
          win[n] = src[yy * w + xx];
          n += 1;
        }
      }
      win.sort((a, b) => a - b);
      out[y * w + x] = win[4];
    }
  }

  return out;
}

const { data, info } = await sharp(SOURCE)
  .extract(REGION)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: w, height: h, channels } = info;

// Per-channel wall reconstruction.
const wall = [0, 1, 2].map((c) => {
  const plane = new Float32Array(w * h);
  for (let i = 0; i < w * h; i += 1) plane[i] = data[i * channels + c];
  return blur(maxFilter(plane, w, h, 70), w, h, 40);
});

// Alpha is built as its own plane so it can be cleaned before being applied.
let alpha = new Float32Array(w * h);
for (let i = 0; i < w * h; i += 1) {
  const here = lumaOf(data[i * channels], data[i * channels + 1], data[i * channels + 2]);
  const behind = lumaOf(wall[0][i], wall[1][i], wall[2][i]);
  const raw = Math.min(1, (behind - here) / FULL);
  alpha[i] = Math.max(0, Math.min(1, (raw - LOW) / (HIGH - LOW)));
}
alpha = median3(alpha, w, h);

const out = Buffer.alloc(w * h * 4);

for (let i = 0; i < w * h; i += 1) {
  const a = alpha[i];

  if (a <= 0) {
    out[i * 4 + 3] = 0;
    continue;
  }

  // px = fg*a + wall*(1-a)  ->  fg = (px - wall*(1-a)) / a
  const unmix = (v, behind) =>
    Math.max(0, Math.min(255, Math.round((v - behind * (1 - a)) / a)));

  out[i * 4] = unmix(data[i * channels], wall[0][i]);
  out[i * 4 + 1] = unmix(data[i * channels + 1], wall[1][i]);
  out[i * 4 + 2] = unmix(data[i * channels + 2], wall[2][i]);
  out[i * 4 + 3] = Math.round(a * 255);
}

const raw = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .png()
  .toBuffer();

const trimmed = await sharp(raw)
  .trim({ threshold: 1 })
  .extend({
    top: 6,
    bottom: 6,
    left: 6,
    right: 6,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  /*
   * Palette rather than truecolour. The artwork is two flat colours, so
   * quantising is visually identical here and takes the file from about 227KB to
   * under 100KB, which is worth having on something that loads with priority on
   * every page.
   */
  .png({ palette: true, quality: 80, compressionLevel: 9 })
  .toBuffer();

mkdirSync(dirname(OUT), { recursive: true });
await sharp(trimmed).toFile(OUT);

const final = await sharp(OUT).metadata();
console.log(`Wrote ${OUT}`);
console.log(`  ${final.width}x${final.height}, alpha: ${final.hasAlpha}`);
