/**
 * Reads the proofread spreadsheet back and writes the corrections into the Danish
 * message files.
 *
 *   node scripts/apply-review.mjs            show what would change
 *   node scripts/apply-review.mjs --write    apply it
 *
 * Only rows with something in the RETTELSE column are touched, so the proofreader
 * can leave every line they are happy with blank. The key column is what decides
 * where a correction goes, which is why the export tells them not to edit it.
 *
 * Everything is checked before anything is written: a key that no longer exists,
 * a row whose original no longer matches the file, or a correction that would
 * break the JSON all stop the run with the row number, so nothing lands
 * half-applied.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/da/", import.meta.url));
const CSV = fileURLToPath(new URL("../da-korrektur.csv", import.meta.url));
const files = ["site", "home", "solutions", "pages", "careers"];
const write = process.argv.includes("--write");

/** Minimal RFC 4180 parser: quoted fields, doubled quotes, embedded newlines. */
function parseCsv(text, sep = ";") {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];

    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
      } else field += c;
      continue;
    }

    if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }

  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/** Walks a dotted key with [n] segments down to its parent and final accessor. */
function resolve(tree, key) {
  const parts = key.split(".");
  let node = tree;

  for (let p = 0; p < parts.length; p += 1) {
    const segments = parts[p].split(/[[\]]/).filter(Boolean);

    for (let s = 0; s < segments.length; s += 1) {
      const accessor = /^\d+$/.test(segments[s]) ? Number(segments[s]) : segments[s];
      const last = p === parts.length - 1 && s === segments.length - 1;

      if (last) return { parent: node, accessor };
      node = node?.[accessor];
      if (node === undefined) return null;
    }
  }

  return null;
}

const raw = readFileSync(CSV, "utf8").replace(/^﻿/, "");
const rows = parseCsv(raw);
const header = rows.shift();

const col = {
  nr: header.indexOf("NR"),
  current: header.indexOf("NUVÆRENDE TEKST"),
  fix: header.findIndex((h) => h.startsWith("RETTELSE")),
  key: header.indexOf("NØGLE"),
};

if (Object.values(col).some((i) => i === -1)) {
  console.error("The spreadsheet is missing a column. Re-export and try again.");
  process.exit(1);
}

const trees = Object.fromEntries(
  files.map((name) => [name, JSON.parse(readFileSync(`${root}${name}.json`, "utf8"))]),
);

const changes = [];
const problems = [];

for (const row of rows) {
  if (!row[col.key]) continue;

  const fix = (row[col.fix] ?? "").trim();
  if (!fix) continue;

  const key = row[col.key].trim();
  const current = row[col.current] ?? "";
  const file = files.find((name) => resolve(trees[name], key));

  if (!file) {
    problems.push(`row ${row[col.nr]}: key not found — ${key}`);
    continue;
  }

  const { parent, accessor } = resolve(trees[file], key);
  const existing = parent[accessor];

  if (typeof existing !== "string") {
    problems.push(`row ${row[col.nr]}: key does not point at text — ${key}`);
    continue;
  }

  // Guards against a stale spreadsheet overwriting newer copy.
  if (existing !== current) {
    problems.push(
      `row ${row[col.nr]}: the site text has changed since the export — ${key}\n` +
        `    spreadsheet: ${current}\n` +
        `    site now:    ${existing}`,
    );
    continue;
  }

  if (fix === existing) continue;

  changes.push({ file, key, from: existing, to: fix, parent, accessor });
}

if (problems.length) {
  console.error(`${problems.length} problem(s), nothing written:\n`);
  problems.forEach((p) => console.error("  " + p));
  process.exit(1);
}

if (!changes.length) {
  console.log("No corrections found in the spreadsheet.");
  process.exit(0);
}

for (const change of changes) {
  console.log(`${change.key}\n  -  ${change.from}\n  +  ${change.to}\n`);
  if (write) change.parent[change.accessor] = change.to;
}

if (write) {
  for (const name of files) {
    writeFileSync(`${root}${name}.json`, JSON.stringify(trees[name], null, 2) + "\n");
  }
  console.log(`${changes.length} correction(s) applied. Now run: npm run verify`);
} else {
  console.log(`${changes.length} correction(s) ready. Re-run with --write to apply.`);
}
