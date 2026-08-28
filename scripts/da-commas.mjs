/**
 * Danish requires a comma in front of a relative clause: "et team, der ringer",
 * not "et team der ringer". The first draft of the copy missed it in a lot of
 * places. This inserts the comma before "der" and "hvor" when they genuinely open
 * a relative clause.
 *
 * Run with --write to apply; without it, every proposed change is printed and
 * nothing is touched.
 *
 * "som" is left alone on purpose. It is a relative pronoun in "regler, som I
 * arbejder under" but a comparison in "prissat som et projekt", and telling those
 * apart reliably needs a parser rather than a regex. Those were done by hand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/da/", import.meta.url));
const files = ["site", "home", "solutions", "pages", "careers"];
const write = process.argv.includes("--write");

/*
 * Words that make the following "der"/"hvor" something other than the start of a
 * relative clause:
 *   - hv-words already open a subordinate clause, so "hvad der sker" takes none
 *   - conjunctions are followed by an expletive "der": "eller der kan være"
 *   - a preposition before "hvor" makes it interrogative: "efter hvor kunderne er"
 */
const stop = new Set([
  "hvad", "hvem", "hvor", "hvornår", "hvilken", "hvilke", "hvilket", "hvis",
  "om", "at", "og", "eller", "men", "for", "så", "når", "da", "end", "efter",
  "se", "ser", "vide", "ved", "afgør", "afklarer", "finder", "spørgsmålet",
  "uanset", "ligegyldigt", "præcis", "netop", "også", "kun",
]);

/*
 * "der" is not always a relative pronoun. After a finite verb, or after a
 * subordinating conjunction, it is the expletive subject: "Er der noget", "sker
 * der", "før der bliver ringet". None of those take a comma.
 */
const expletiveBefore = new Set([
  "er", "var", "sker", "skete", "findes", "fandtes", "kommer", "kom",
  "står", "ligger", "bliver", "blev", "gik", "går", "før", "mens", "fordi",
]);

const pattern = /(\b[a-zA-ZæøåÆØÅ]+\b) (der|hvor) (?=[a-zæøå])/g;

let proposed = 0;

for (const name of files) {
  const path = `${root}${name}.json`;
  const original = readFileSync(path, "utf8");

  const next = original.replace(pattern, (match, before, word) => {
    const lower = before.toLowerCase();
    if (stop.has(lower)) return match;
    if (word === "der" && expletiveBefore.has(lower)) return match;
    // Already punctuated, nothing to do.
    if (/[,:;]$/.test(before)) return match;
    proposed += 1;
    if (!write) console.log(`  ${name}: "${before} ${word}" -> "${before}, ${word}"`);
    return `${before}, ${word} `;
  });

  if (write && next !== original) writeFileSync(path, next);
}

console.log(
  `\n${proposed} comma insertion(s) ${write ? "applied" : "proposed (dry run)"}.`,
);
