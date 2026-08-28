/**
 * Exports every Danish sentence on the site to a spreadsheet for proofreading.
 *
 * The Danish copy lives in five JSON files. Handing those to someone who does not
 * write code is a bad idea: one missing comma or stray quote breaks the build, and
 * the error message will mean nothing to them. This produces a file they can open
 * in Excel or Google Sheets, where they type corrections in one column and ignore
 * everything else.
 *
 *   node scripts/export-review.mjs
 *
 * Then scripts/apply-review.mjs reads it back and writes the corrections into the
 * JSON, so the proofreader never touches a source file.
 *
 * Semicolon-separated with a byte-order mark, because that is what a Danish
 * install of Excel opens correctly without an import dialog. Comma-separated UTF-8
 * without a BOM turns æ, ø and å into mojibake there.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/da/", import.meta.url));
const OUT = fileURLToPath(new URL("../da-korrektur.csv", import.meta.url));

const files = ["site", "home", "solutions", "pages", "careers"];

/** Where each block of copy shows up, so the reader can look at the real page. */
const pages = [
  ["home.", "Forsiden", "/"],
  ["solutionsIndex.", "Løsninger", "/loesninger"],
  ["solutions.appointmentSetting.", "Mødebooking", "/loesninger/moedebooking"],
  ["solutions.outboundSales.", "Telefonsalg", "/loesninger/salg"],
  ["solutions.customerService.", "Kundeservice", "/loesninger/kundeservice"],
  ["solutions.leadGeneration.", "Leadgenerering", "/loesninger/leadgenerering"],
  ["solutions.shared.", "Alle løsningssider", "/loesninger/moedebooking"],
  ["howWeWork.", "Sådan arbejder vi", "/saadan-arbejder-vi"],
  ["industries.", "Brancher", "/brancher"],
  ["about.", "Om Callaz", "/om-callaz"],
  ["careers.jobs.", "Stillingsopslag", "/karriere/sales-agent"],
  ["careers.", "Ledige job", "/karriere"],
  ["contact.", "Kontakt", "/kontakt"],
  ["quote.", "Få et tilbud", "/faa-et-tilbud"],
  ["privacy.", "Privatlivspolitik", "/privatlivspolitik"],
  ["thankYou.", "Kvittering efter formular", "/tak-for-din-henvendelse"],
  ["notFound.", "404-siden", "/findes-ikke"],
  ["coverage.", "Forsiden, afsnittet om marked", "/"],
  ["cta.", "Nederst på de fleste sider", "/"],
  ["form.", "Formularen", "/faa-et-tilbud"],
  ["consent.", "Cookiebanneret", "/"],
  ["nav.", "Menuen", "/"],
  ["footer.", "Sidefoden", "/"],
  ["meta.", "Google-resultater og faneblade", "/"],
  ["common.", "Knapper og etiketter", "/"],
  ["metrics.", "Nøgletallene på forsiden", "/"],
  ["markets.", "Marked", "/"],
  ["languages.", "Sprog", "/"],
  ["countries.", "Landenavn", "/kontakt"],
];

/** Keys that are not prose and must not be edited. */
const skip = (key, value) =>
  /\.(datePosted|unit)$/.test(key) ||
  /^(markets|languages|countries)\./.test(key) ||
  value.length < 2 ||
  /^[\d\s.,:/-]+$/.test(value);

function locate(key) {
  const hit = pages.find((entry) => key.startsWith(entry[0]));
  return hit ? { page: hit[1], path: hit[2] } : { page: "Flere steder", path: "/" };
}

const rows = [];

function walk(node, prefix) {
  for (const [k, v] of Object.entries(node)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") rows.push([key, v]);
    else if (Array.isArray(v))
      v.forEach((item, i) =>
        typeof item === "string"
          ? rows.push([`${key}[${i}]`, item])
          : walk(item, `${key}[${i}]`),
      );
    else if (v && typeof v === "object") walk(v, key);
  }
}

for (const name of files) {
  walk(JSON.parse(readFileSync(`${root}${name}.json`, "utf8")), "");
}

const cell = (value) => `"${String(value).replace(/"/g, '""')}"`;

const lines = [
  ["NR", "SIDE", "URL", "NUVÆRENDE TEKST", "RETTELSE (skriv her)", "NØGLE"]
    .map(cell)
    .join(";"),
];

let n = 0;
for (const [key, value] of rows) {
  if (skip(key, value)) continue;
  n += 1;
  const { page, path } = locate(key);
  lines.push([n, page, path, value, "", key].map(cell).join(";"));
}

writeFileSync(OUT, "﻿" + lines.join("\r\n") + "\r\n", "utf8");

console.log(`Wrote ${OUT}`);
console.log(`  ${n} sentences to review`);
