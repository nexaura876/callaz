/**
 * Writes the Danish copy as one numbered document to read.
 *
 * The spreadsheet in export-review.mjs is for someone who wants to type
 * corrections into a column. This is for the far more likely case: a friend who
 * will read it on his phone and reply "42 and 51 are wrong, they should say X".
 * No columns, no software, nothing to fill in.
 *
 *   node scripts/export-reading.mjs
 *
 * The numbers match da-korrektur.csv exactly, so the two can be used together or
 * separately, and a correction can be applied from either.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/da/", import.meta.url));
const OUT = fileURLToPath(new URL("../DANSK-TEKST.md", import.meta.url));

const files = ["site", "home", "solutions", "pages", "careers"];

/*
 * Order matters twice over: it decides the numbering, which has to match the CSV,
 * and it decides the reading order, so the document walks the site the way a
 * visitor would rather than the way the JSON happens to be nested.
 */
const sections = [
  ["meta.", "Google-resultater og faneblade"],
  ["nav.", "Menuen"],
  ["common.", "Knapper og etiketter"],
  ["footer.", "Sidefoden"],
  ["consent.", "Cookiebanneret"],
  ["form.", "Kontaktformularen"],
  ["markets.", "Marked"],
  ["languages.", "Sprog"],
  ["metrics.", "Nøgletallene"],
  ["coverage.", "Afsnittet om marked og sprog"],
  ["cta.", "Opfordringen nederst på siderne"],
  ["notFound.", "404-siden"],
  ["thankYou.", "Kvittering efter formularen"],
  ["countries.", "Landenavn"],
  ["home.", "Forsiden"],
  ["solutionsIndex.", "Løsninger (oversigt)"],
  ["solutions.shared.", "Fælles for løsningssiderne"],
  ["solutions.appointmentSetting.", "Mødebooking"],
  ["solutions.outboundSales.", "Telefonsalg"],
  ["solutions.customerService.", "Kundeservice"],
  ["solutions.leadGeneration.", "Leadgenerering"],
  ["howWeWork.", "Sådan arbejder vi"],
  ["industries.", "Brancher"],
  ["about.", "Om Callaz"],
  ["contact.", "Kontakt"],
  ["quote.", "Få et tilbud"],
  ["privacy.", "Privatlivspolitik"],
  ["careers.jobs.", "Stillingsopslagene"],
  ["careers.", "Ledige job"],
];

const paths = {
  "Forsiden": "/",
  "Løsninger (oversigt)": "/loesninger",
  "Mødebooking": "/loesninger/moedebooking",
  "Telefonsalg": "/loesninger/salg",
  "Kundeservice": "/loesninger/kundeservice",
  "Leadgenerering": "/loesninger/leadgenerering",
  "Sådan arbejder vi": "/saadan-arbejder-vi",
  "Brancher": "/brancher",
  "Om Callaz": "/om-callaz",
  "Kontakt": "/kontakt",
  "Få et tilbud": "/faa-et-tilbud",
  "Privatlivspolitik": "/privatlivspolitik",
  "Ledige job": "/karriere",
  "Stillingsopslagene": "/karriere/sales-agent",
};

const skip = (key, value) =>
  /\.(datePosted|unit)$/.test(key) ||
  /^(markets|languages|countries)\./.test(key) ||
  value.length < 2 ||
  /^[\d\s.,:/-]+$/.test(value);

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

// Same numbering as the CSV: assign first, group second.
const numbered = [];
let n = 0;
for (const [key, value] of rows) {
  if (skip(key, value)) continue;
  n += 1;
  numbered.push({ n, key, value });
}

const out = [
  "# Dansk tekst på callaz.dk",
  "",
  "Hele hjemmesidens danske tekst, nummereret. Du skal ikke rette i det her",
  "dokument og ikke installere noget.",
  "",
  "**Læs igennem, og skriv tilbage med nummeret på det, der er galt, og hvad der",
  "bør stå i stedet.** For eksempel:",
  "",
  "> 42 — der mangler et komma: *I ved, hvem der ringer for jer*",
  "> 118 — det hedder ikke *fuld af*, men *fuldt af*",
  "",
  "Send det som besked, mail, talebesked eller hvad der er nemmest. Formen er",
  "ligegyldig, så længe nummeret er med.",
  "",
  "To ting, der er værd at vide:",
  "",
  "- Teksten er skrevet af en, der **ikke har dansk som modersmål**. Der er rettet",
  "  omkring 80 kommafejl allerede, men tonen kan stadig være skæv. Sig gerne til,",
  "  hvis en sætning er korrekt, men lyder forkert. Det er lige så nyttigt.",
  "- Du behøver ikke læse det hele på én gang. Afsnittene herunder følger",
  "  hjemmesiden, så du kan tage en side ad gangen.",
  "",
  "---",
  "",
];

const used = new Set();

for (const [prefix, title] of sections) {
  const items = numbered.filter(
    (item) => item.key.startsWith(prefix) && !used.has(item.n),
  );
  if (!items.length) continue;
  items.forEach((item) => used.add(item.n));

  out.push(`## ${title}`);
  if (paths[title]) out.push("", `Siden: \`${paths[title]}\``);
  out.push("");
  items.forEach((item) => out.push(`${item.n}. ${item.value}`, ""));
  out.push("---", "");
}

const orphans = numbered.filter((item) => !used.has(item.n));
if (orphans.length) {
  out.push("## Øvrigt", "");
  orphans.forEach((item) => out.push(`${item.n}. ${item.value}`, ""));
}

writeFileSync(OUT, out.join("\n"), "utf8");

console.log(`Wrote ${OUT}`);
console.log(`  ${numbered.length} numbered sentences`);
if (orphans.length) console.log(`  ${orphans.length} did not match a section`);
