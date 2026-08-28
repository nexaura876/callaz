/**
 * Danish proofreading pass, after a native speaker read the site.
 *
 * The dominant fault was the grammatical comma. Danish requires one in front of a
 * ledsætning — a subordinate clause — and the first draft left it out in dozens of
 * places, because English does not:
 *
 *   wrong   I ved hvem der ringer for jer
 *   right   I ved, hvem der ringer for jer
 *
 * The mirror of that mistake also appears: an earlier automated pass inserted a
 * comma in front of "der" whenever it followed a noun, which is wrong inside an
 * indirect question, where "der" is the subject rather than a relative pronoun:
 *
 *   wrong   at vide, hvilke regler, der gælder
 *   right   at vide, hvilke regler der gælder
 *
 * Alongside those there are real grammar errors: neuter agreement on "et CRM"
 * (fuld -> fuldt), a wrong preposition, and a few sentences that were simply
 * clumsy rather than incorrect.
 *
 * Every pair below is an exact string, verified in context, so a second run does
 * nothing. Replacements apply to both message files where a phrase appears twice.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/da/", import.meta.url));
const files = ["site", "home", "solutions", "pages", "careers"];

const fixes = [
  // ---------------------------------------------------------------- grammar
  // "et CRM" is neuter, so the adjective takes -t.
  ["Har I et CRM fuld af sovende kunder", "Har I et CRM fuldt af sovende kunder"],
  ["Jeres CRM er fuld af poster", "Jeres CRM er fuldt af poster"],
  // "kampagne mod" reads as a campaign against them.
  [
    "en engelsksproget kampagne mod danske virksomheder",
    "en engelsksproget kampagne rettet mod danske virksomheder",
  ],
  // The metric label was not a sentence in any language.
  ["Af samtaler optages", "Samtaler optaget"],
  // "svar på denne boks" is not idiomatic.
  ["Husker udelukkende dit svar på denne boks.", "Husker udelukkende dit valg i denne boks."],
  ["Siden er her ikke", "Siden findes ikke"],
  [
    "Et callcenter bygget, som vi selv ville behandles som kunder",
    "Et callcenter, der behandler sine kunder, som vi selv gerne vil behandles",
  ],
  [
    "Det oplagte valg når en pilot har vist sig.",
    "Det oplagte valg, når piloten har bevist sit værd.",
  ],
  [
    "Nogen tager telefonen, på det sprog, der blev ringet på",
    "Nogen tager telefonen på det sprog, der blev ringet på",
  ],

  // ------------------------------- comma wrongly inserted inside an indirect
  // ------------------------------- question, where "der" is the subject
  ["hvilke sider, der bliver læst", "hvilke sider der bliver læst"],
  ["hvilke regler, der gælder", "hvilke regler der gælder"],
  ["hvilken branchekode, der står", "hvilken branchekode der står"],
  ["hvilken af dem, der fører derhen", "hvilken af dem der fører derhen"],
  ["Hvilke dele af segmentet, der reagerede", "Hvilke dele af segmentet der reagerede"],
  ["hvilke dele af branchen, der har fortjent", "hvilke dele af branchen der har fortjent"],

  // ------------------------------------ missing comma before a ledsætning
  ["beskrivelse af hvad der ændrer sig", "beskrivelse af, hvad der ændrer sig"],
  ["Anonym måling af hvilke sider", "Anonym måling af, hvilke sider"],
  ["så vi ved hvad der skal forbedres", "så vi ved, hvad der skal forbedres"],
  ["Vælg venligst hvad henvendelsen handler om", "Vælg venligst, hvad henvendelsen handler om"],
  ["et skriftligt oplæg hvis det gør", "et skriftligt oplæg, hvis det gør"],
  ["den opgave opkaldene løser", "den opgave, opkaldene løser"],
  ["og præcis hvilke kriterier et resultat skal opfylde", "og præcis, hvilke kriterier et resultat skal opfylde"],
  ["Det, der afgør om udgående salg er pengene værd", "Det, der afgør, om udgående salg er pengene værd"],
  ["af, er om I kan se ind i den", "af, er, om I kan se ind i den"],
  ["ikke et udvalg vi har plukket", "ikke et udvalg, vi har plukket"],
  ["I ved hvem der ringer for jer", "I ved, hvem der ringer for jer"],
  ["Fuld oplæring før du tager det første live-opkald", "Fuld oplæring, før du tager det første live-opkald"],
  ["I finder ud af hvad markedet siger", "I finder ud af, hvad markedet siger"],
  ["Godt match når", "Godt match, når"],
  ["Ikke det rigtige valg når", "Ikke det rigtige valg, når"],
  ["ved præcis hvad der blev lovet på opkaldet", "ved præcis, hvad der blev lovet på opkaldet"],
  ["ringer, ved hvad virksomheden laver", "ringer, ved, hvad virksomheden laver"],
  ["de indvendinger vi hørte oftest", "de indvendinger, vi hørte oftest"],
  ["En salgsafdeling I ikke selv skal bygge", "En salgsafdeling, I ikke selv skal bygge"],
  ["Det vi bringer, er den disciplin", "Det, vi bringer, er den disciplin"],
  ["så I kan se hvor tilbuddet virker", "så I kan se, hvor tilbuddet virker"],
  ["kun det jeres eget team ikke når", "kun det, jeres eget team ikke når"],
  ["skriftligt præcis hvad vi løser", "skriftligt præcis, hvad vi løser"],
  ["klart billede af hvad jeres kunder faktisk ringer om", "klart billede af, hvad jeres kunder faktisk ringer om"],
  ["per kampagne efter hvor jeres kunder er", "per kampagne efter, hvor jeres kunder er"],
  ["Efter de regler I sætter", "Efter de regler, I sætter"],
  ["så I kan se hvad de reddede kunder er værd", "så I kan se, hvad de reddede kunder er værd"],
  ["på det sprog de kommer ind på", "på det sprog, de kommer ind på"],
  ["der afgør om alt det efterfølgende", "der afgør, om alt det efterfølgende"],
  ["Vi aftaler hvordan en målvirksomhed ser ud", "Vi aftaler, hvordan en målvirksomhed ser ud"],
  ["i termer I kan kontrollere", "i termer, I kan kontrollere"],
  ["der afklarer om der er grund", "der afklarer, om der er grund"],
  ["En liste I kan give en sælger", "En liste, I kan give en sælger"],
  ["der fortæller hvor I skal sigte", "der fortæller, hvor I skal sigte"],
  ["det er præcis det I skal bruge", "det er præcis det, I skal bruge"],
  ["De beskriver hvordan vi arbejder", "De beskriver, hvordan vi arbejder"],
  ["Fem ting vi ikke forhandler om", "Fem ting, vi ikke forhandler om"],
  ["De regler vi arbejder under", "De regler, vi arbejder under"],
  ["Den fastlægger hvad vi behandler", "Den fastlægger, hvad vi behandler"],
  ["adgang lukket samme dag en kampagne slutter", "adgang lukket samme dag, en kampagne slutter"],
  ["et tal nævnt før vi har hørt tilbuddet", "et tal nævnt, før vi har hørt tilbuddet"],
  ["justerer manuskriptet mens kampagnen kører", "justerer manuskriptet, mens kampagnen kører"],
  ["vurdering af om der skal fortsættes", "vurdering af, om der skal fortsættes"],
  ["De brancher vi tager kampagner i", "De brancher, vi tager kampagner i"],
  ["at kende indvendingerne før man hører dem", "at kende indvendingerne, før man hører dem"],
  ["at vide hvilke regler", "at vide, hvilke regler"],
  ["ikke en grænse for hvor vi kan", "ikke en grænse for, hvor vi kan"],
  ["et team man aldrig møder", "et team, man aldrig møder"],
  ["ingen kan sige om det virker", "ingen kan sige, om det virker"],
  ["har navne I kender", "har navne, I kender"],
  ["Det vi kan love, er den del", "Det, vi kan love, er den del"],
  ["hvad der sker når noget går galt", "hvad der sker, når noget går galt"],
  ["ingen udspørgen før I får fat i en person", "ingen udspørgen, før I får fat i en person"],
  ["Fortæl os hvad I sælger", "Fortæl os, hvad I sælger"],
  ["den besked du skrev", "den besked, du skrev"],
  ["er resten noget man kan lære", "er resten noget, man kan lære"],
  ["afhængigt af hvilken kampagne du er på", "afhængigt af, hvilken kampagne du er på"],
  ["og cirka hvilken volumen I er ude efter", "og cirka, hvilken volumen I er ude efter"],
  ["og cirka hvilken volumen I tænker", "og cirka, hvilken volumen I tænker"],
];

let applied = 0;
let missing = 0;

for (const name of files) {
  const path = `${root}${name}.json`;
  const original = readFileSync(path, "utf8");
  let next = original;

  for (const [from, to] of fixes) {
    if (next.includes(from)) {
      next = next.split(from).join(to);
      applied += 1;
    }
  }

  if (next !== original) {
    JSON.parse(next); // never write something that will not parse
    writeFileSync(path, next);
  }
}

// Report anything that matched nowhere, so a stale pair does not sit here unnoticed.
const all = files.map((n) => readFileSync(`${root}${n}.json`, "utf8")).join("\n");
for (const [from, to] of fixes) {
  if (!all.includes(to)) {
    console.warn(`  ! never applied: ${from.slice(0, 60)}`);
    missing += 1;
  }
}

console.log(`\n${applied} correction(s) applied across ${files.length} files.`);
if (missing) console.log(`${missing} pair(s) matched nothing — check them.`);
