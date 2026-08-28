/**
 * One-shot: renames the two metric entries whose ids changed in metrics.ts, gives
 * them units, and drops the market and language entries that are no longer offered.
 *
 * Leaving the old keys behind would not error — next-intl only complains at the
 * point of use — so the site would have rendered a metric with a missing label.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/", import.meta.url));

const config = {
  da: {
    recorded: { label: "Af samtaler optages", unit: "%" },
    notice: { label: "Opsigelsesvarsel", unit: "md." },
    keepMarkets: ["denmark"],
    keepLanguages: ["da", "en"],
  },
  en: {
    recorded: { label: "Of calls recorded", unit: "%" },
    notice: { label: "Notice period", unit: "mo" },
    keepMarkets: ["denmark"],
    keepLanguages: ["da", "en"],
  },
};

for (const [locale, cfg] of Object.entries(config)) {
  const path = `${root}${locale}/site.json`;
  const site = JSON.parse(readFileSync(path, "utf8"));

  // The ids in content/metrics.ts changed, so the message keys have to follow.
  delete site.metrics.markets;
  delete site.metrics.languages;
  site.metrics.recorded = cfg.recorded;
  site.metrics.notice = cfg.notice;

  // Countries and languages we do not offer have no business in the catalogue.
  site.markets = Object.fromEntries(
    Object.entries(site.markets).filter(([id]) => cfg.keepMarkets.includes(id)),
  );
  site.languages = Object.fromEntries(
    Object.entries(site.languages).filter(([id]) => cfg.keepLanguages.includes(id)),
  );

  writeFileSync(path, JSON.stringify(site, null, 2) + "\n");
  console.log(
    `${locale}: metrics -> ${Object.keys(site.metrics).join(", ")}; ` +
      `markets -> ${Object.keys(site.markets).join(", ")}; ` +
      `languages -> ${Object.keys(site.languages).join(", ")}`,
  );
}

// The native speaker role only existed to serve the markets that are now gone.
for (const locale of Object.keys(config)) {
  const path = `${root}${locale}/careers.json`;
  const careers = JSON.parse(readFileSync(path, "utf8"));

  if (careers.careers.jobs["native-speaker-agent"]) {
    delete careers.careers.jobs["native-speaker-agent"];
    writeFileSync(path, JSON.stringify(careers, null, 2) + "\n");
    console.log(`${locale}: native-speaker-agent posting removed`);
  }
}
