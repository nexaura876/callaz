/**
 * Builds the favicon and the app icon from the real logo, rather than from a
 * redrawing of it.
 *
 * The full lockup is far too wide to read at 32px, so the icons use the mark on
 * its own — the globe with the headset C — cropped straight out of the extracted
 * artwork. It sits on a white plate because the mark is dark navy and would vanish
 * against dark browser chrome.
 *
 * Run after scripts/extract-logo.mjs:
 *   node scripts/generate-icons.mjs
 */
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const LOGO = fileURLToPath(new URL("../public/media/callaz-logo.png", import.meta.url));
const APP = fileURLToPath(new URL("../src/app", import.meta.url));

const meta = await sharp(LOGO).metadata();

/*
 * The mark occupies the left half of the lockup. The big C is shared between the
 * mark and the wordmark, so the crop has to reach far enough right to keep it
 * whole, while stopping short of the a-l-l-a-z.
 */
/*
 * The crop stops just after the C and before the a. It is not square — the mark
 * is taller than it is wide once the headset boom is included — so it is padded
 * onto a square canvas afterwards rather than cropped to one, which would clip
 * either the boom or the C.
 */
const region = {
  left: 0,
  top: 0,
  width: Math.round(meta.width * 0.435),
  height: Math.round(meta.height * 0.85),
};

// Two passes: sharp applies extract and trim to the same source in one chain,
// which makes the trim fight the crop and throws on the resulting area.
const cropped = await sharp(LOGO).extract(region).toBuffer();
const mark = await sharp(cropped).trim({ threshold: 1 }).toBuffer();

/** Square plate with the mark centred and a little breathing room. */
async function icon(size, outfile) {
  const inner = Math.round(size * 0.78);
  const scaled = await sharp(mark)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: scaled, gravity: "center" }])
    // Palette, for the same reason as the logo itself: identical here, far smaller.
    .png({ palette: true, quality: 90, compressionLevel: 9 })
    .toFile(outfile);
}

await icon(512, `${APP}/icon.png`);
await icon(180, `${APP}/apple-icon.png`);

console.log(`Mark cropped from ${region.width}x${region.height} of the lockup.`);
console.log("Wrote src/app/icon.png (512) and src/app/apple-icon.png (180).");

