/**
 * One-shot: adds the brand slogan and the theme-toggle labels to both catalogues,
 * and notes the theme preference in the privacy policy. Not wired into any npm
 * script; kept only as a record of the edit.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/", import.meta.url));

const additions = {
  da: {
    slogan: "Dækker alt jeres behov fra A til Z",
    themeLabel: "Visning",
    themeLight: "Lys",
    themeDark: "Mørk",
    themeSystem: "Følg systemet",
    storagePrivacy:
      "Dit valg af lys eller mørk visning gemmes i browserens localStorage under nøglen callaz-theme. Det er en teknisk nødvendig indstilling, du selv har valgt aktivt, den forlader aldrig din browser, og den ryddes, hvis du sletter dine browserdata.",
  },
  en: {
    slogan: "Covers everything you need, from A to Z",
    themeLabel: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "Match system",
    storagePrivacy:
      "Your choice of light or dark appearance is kept in browser localStorage under the key callaz-theme. It is a strictly necessary setting you selected yourself, it never leaves your browser, and clearing your browsing data removes it.",
  },
};

for (const [locale, values] of Object.entries(additions)) {
  // site.json: slogan and the toggle labels
  const sitePath = `${root}${locale}/site.json`;
  const site = JSON.parse(readFileSync(sitePath, "utf8"));

  site.common.slogan = values.slogan;
  site.nav.themeLabel = values.themeLabel;
  site.nav.themeLight = values.themeLight;
  site.nav.themeDark = values.themeDark;
  site.nav.themeSystem = values.themeSystem;

  writeFileSync(sitePath, JSON.stringify(site, null, 2) + "\n");

  // pages.json: one more paragraph in the cookies section of the policy
  const pagesPath = `${root}${locale}/pages.json`;
  const pages = JSON.parse(readFileSync(pagesPath, "utf8"));
  const cookieSection = pages.privacy.sections.find((section) =>
    /^(Cookies)$/i.test(section.title),
  );

  if (cookieSection && !cookieSection.paragraphs.includes(values.storagePrivacy)) {
    cookieSection.paragraphs.push(values.storagePrivacy);
  }

  writeFileSync(pagesPath, JSON.stringify(pages, null, 2) + "\n");

  console.log(`${locale}: slogan, theme labels and privacy paragraph added`);
}
