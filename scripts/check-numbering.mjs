/**
 * Confirms DANSK-TEKST.md and da-korrektur.csv carry the same numbering.
 *
 * They are generated separately, and the whole point is that a correction can
 * arrive quoting a number from either one. If the two ever drift, a correction
 * would land on the wrong sentence, so this is worth checking after a regenerate.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const md = readFileSync(
  fileURLToPath(new URL("../DANSK-TEKST.md", import.meta.url)),
  "utf8",
);
const csv = readFileSync(
  fileURLToPath(new URL("../da-korrektur.csv", import.meta.url)),
  "utf8",
).replace(/^﻿/, "");

/** Minimal quoted-CSV field splitter. */
function fields(line, sep = ";") {
  const out = [];
  let cur = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else quoted = false;
      } else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }

  out.push(cur);
  return out;
}

// Every numbered line in the markdown, as number -> text.
const inMarkdown = new Map();
for (const line of md.split("\n")) {
  const m = line.match(/^(\d+)\. (.+)$/);
  if (m) inMarkdown.set(m[1], m[2]);
}

const rows = csv.split(/\r?\n/).slice(1).filter(Boolean);
let checked = 0;
let bad = 0;

for (const row of rows) {
  const f = fields(row);
  const nr = f[0];
  const text = f[3];
  checked += 1;

  const found = inMarkdown.get(nr);
  if (found !== text) {
    if (bad < 5) {
      console.log(`  ${nr}`);
      console.log(`    csv: ${text.slice(0, 70)}`);
      console.log(`    md:  ${(found ?? "(missing)").slice(0, 70)}`);
    }
    bad += 1;
  }
}

console.log(`\nchecked ${checked} rows against ${inMarkdown.size} markdown lines`);
console.log(bad === 0 ? "numbering matches" : `${bad} mismatch(es)`);
process.exit(bad === 0 ? 0 : 1);
