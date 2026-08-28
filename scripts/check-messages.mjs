/**
 * Compares the message catalogues across locales and reports keys that exist in
 * one and not the other.
 *
 * next-intl falls back silently at runtime, so a missing Danish key ships as
 * English copy on a Danish page and nobody notices until a customer does. Run this
 * in CI, and as part of npm run verify.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

// fileURLToPath rather than URL.pathname: on Windows the latter yields "/C:/..."
// and every path built from it comes out as "C:\C:\...".
const root = fileURLToPath(new URL("../src/messages/", import.meta.url));

/** Flattens to dotted paths. Arrays count as leaves: order and length are content. */
function flatten(value, prefix = "", out = new Set()) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    out.add(prefix);
    return out;
  }

  for (const [key, child] of Object.entries(value)) {
    flatten(child, prefix ? `${prefix}.${key}` : key, out);
  }

  return out;
}

async function loadLocale(locale) {
  const dir = join(root, locale);
  const files = (await readdir(dir)).filter((file) => file.endsWith(".json"));

  const keys = new Set();
  for (const file of files) {
    const parsed = JSON.parse(await readFile(join(dir, file), "utf8"));
    for (const key of flatten(parsed)) keys.add(key);
  }

  return keys;
}

const locales = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (locales.length < 2) {
  console.log("Only one locale present, nothing to compare.");
  process.exit(0);
}

const catalogues = new Map();
for (const locale of locales) catalogues.set(locale, await loadLocale(locale));

const [reference, ...others] = locales;
const referenceKeys = catalogues.get(reference);
let problems = 0;

for (const locale of others) {
  const keys = catalogues.get(locale);

  const missing = [...referenceKeys].filter((key) => !keys.has(key)).sort();
  const extra = [...keys].filter((key) => !referenceKeys.has(key)).sort();

  for (const key of missing) {
    console.error(`missing in ${locale}: ${key}`);
    problems += 1;
  }
  for (const key of extra) {
    console.error(`missing in ${reference}: ${key}`);
    problems += 1;
  }
}

if (problems > 0) {
  console.error(`\n${problems} key mismatch(es) across ${locales.join(", ")}.`);
  process.exit(1);
}

console.log(`Message catalogues match across ${locales.join(", ")}.`);
