/**
 * One-shot: the necessary-cookies description promised to remember a language
 * choice, which stopped being true once localeCookie was switched off. The locale
 * now lives in the URL and the only cookie left is the consent record itself.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/", import.meta.url));

const copy = {
  da: "Husker udelukkende dit svar på denne boks. Kan ikke slås fra, da vi ellers ville spørge dig på hver eneste side. Dit sprogvalg ligger i adressen og kræver ingen cookie.",
  en: "Remembers only your answer to this box. It cannot be switched off, because without it we would ask you again on every page. Your language is carried in the address and needs no cookie.",
};

for (const [locale, necessaryBody] of Object.entries(copy)) {
  const path = `${root}${locale}/site.json`;
  const site = JSON.parse(readFileSync(path, "utf8"));
  site.consent.necessaryBody = necessaryBody;
  writeFileSync(path, JSON.stringify(site, null, 2) + "\n");
  console.log(`${locale}: consent copy corrected`);
}
