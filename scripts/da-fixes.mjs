/**
 * Hand-checked Danish corrections.
 *
 * Mostly the list comma: Danish takes no comma before the final "og" or "eller"
 * in a list ("rød, gul og grøn"), but does take one between two main clauses
 * ("Jeg kom, og han gik"). The first draft applied English habits and put one in
 * both cases. Only the list cases are corrected here; the main-clause commas are
 * correct and are left alone.
 *
 * Every pair is exact, so a second run is a no-op.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/da/", import.meta.url));

const fixes = [
  // --- list comma before "og" -------------------------------------------
  ["Marked, tilbud, målgruppe, og hvordan", "Marked, tilbud, målgruppe og hvordan"],
  ["Hvilket marked, hvilket tilbud, og hvordan", "Hvilket marked, hvilket tilbud og hvordan"],
  ["dokumenteret samtykkehåndtering, og data", "dokumenteret samtykkehåndtering og data"],
  ["resultater, og hvad markedet", "resultater og hvad markedet"],
  ["framelding, der virker, og data leveret", "framelding, der virker, og data leveret"],
  ["ingen delte logins, og adgang lukket", "ingen delte logins og adgang lukket"],
  ["jeres eget CRM, og verificering", "jeres eget CRM og verificering"],
  ["branche, geografi, og det signal", "branche, geografi og det signal"],
  ["med det samme, og ingen pressalg", "med det samme og ingen pressalg"],
  ["hvad I sælger, hvor, og cirka", "hvad I sælger, hvor og cirka"],
  ["hvem der køber det, og cirka", "hvem der køber det og cirka"],
  ["dette websted, hvorfor, og hvilke rettigheder", "dette websted, hvorfor og hvilke rettigheder"],
  ["det emne du valgte, og den besked", "det emne, du valgte, og den besked"],
  ["behandlingen begrænset, til at gøre indsigelse mod behandling baseret på legitim interesse, og til at få", "behandlingen begrænset, til at gøre indsigelse mod behandling baseret på legitim interesse og til at få"],
  ["Salg, og dokumentationen", "Salg og dokumentationen"],
  ["Indstillingen kan læres, og bliver lært her", "Indstillingen kan læres og bliver lært her"],
  ["lønstrukturen skrevet ud, og en startdato", "lønstrukturen skrevet ud og en startdato"],
  ["resultatløn oveni, og udregningen", "resultatløn oveni og udregningen"],
  ["korte opkald, og et marked", "korte opkald og et marked"],
  ["på dit marked, og foreslå", "på dit marked og foreslå"],
  ["der reagerede, og hvilke der var døde", "der reagerede, og hvilke der var døde"],
  ["hvor længe, og hvad der sker", "hvor længe og hvad der sker"],
  ["hvad vi løser, og hvad der går videre", "hvad vi løser, og hvad der går videre"],
  ["hvor jeres kunder er, og hvornår de ringer", "hvor jeres kunder er, og hvornår de ringer"],
  ["kampagner i, og en ærlig beskrivelse", "kampagner i, og en ærlig beskrivelse"],
  ["hvad vi tilbyder, og hvordan ansættelsesprocessen", "hvad vi tilbyder, og hvordan ansættelsesprocessen"],
  ["opbevarer personoplysninger, og hvilke rettigheder", "opbevarer personoplysninger og hvilke rettigheder"],

  // --- list comma before "eller" ----------------------------------------
  ["Ring, skriv, eller brug formularen", "Ring, skriv eller brug formularen"],
  ["Tag det hele, eller kun det", "Tag det hele eller kun det"],
  ["skriftlig vurdering, eller samtykke", "skriftlig vurdering eller samtykke"],

  // --- clarity and agreement --------------------------------------------
  [
    "Seks markeder, og det sprog kunden svarer på",
    "Seks markeder og det sprog, kunden svarer på",
  ],
  [
    "Så ændrer vi enten tilbuddet, listen, eller vi stopper.",
    "Så ændrer vi enten tilbuddet eller listen, eller også stopper vi.",
  ],
  // The relative clause needs closing as well as opening.
  ["Den, der ringer ved, hvad", "Den, der ringer, ved hvad"],
  // Relative clause with the pronoun left out still takes its comma.
  ["fortæl os resultatet I vil have", "fortæl os resultatet, I vil have"],
  ["efter kriterier I skriver ned inden vi går i gang", "efter kriterier, I skriver ned, inden vi går i gang"],
  ["at det du laver stadig kan ses", "at det, du laver, stadig kan ses"],
  ["over for folk du ikke har mødt", "over for folk, du ikke har mødt"],
  ["på det du hører", "på det, du hører"],
];

let changed = 0;

for (const name of ["site", "home", "solutions", "pages", "careers"]) {
  const path = `${root}${name}.json`;
  const original = readFileSync(path, "utf8");
  let next = original;

  for (const [from, to] of fixes) {
    if (from === to) continue;
    if (next.includes(from)) {
      next = next.split(from).join(to);
      changed += 1;
      console.log(`  ${name}: ${from.slice(0, 52)}…`);
    }
  }

  if (next !== original) {
    JSON.parse(next); // never write a file that will not parse
    writeFileSync(path, next);
  }
}

console.log(`\n${changed} correction(s) applied.`);
