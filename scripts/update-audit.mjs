/**
 * One-shot: the market and language claims are settled now, so the audit moves
 * them out of "unconfirmed" and records what they actually turned out to be.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(new URL("../CONTENT-AUDIT.md", import.meta.url));
let audit = readFileSync(path, "utf8");

// Drop the two rows that are no longer open questions.
audit = audit.replace(/\| Six markets: DK, SE, NO, DE, NL, GB \|[^\n]*\n/, "");
audit = audit.replace(/\| Six languages: da, en, sv, no, de, tr \|[^\n]*\n/, "");

const resolved = [
  "### Resolved since the first audit",
  "",
  "| Was claimed | Actually | Where it had reached |",
  "| ----------- | -------- | -------------------- |",
  "| Six markets: DK, SE, NO, DE, NL, GB | **Denmark only** | Coverage section, footer, `areaServed` in structured data |",
  "| Six languages: da, en, sv, no, de, tr | **Danish and English only** | Same, plus the customer service page and the careers copy |",
  "| A remote native-speaker role for SE, NO, DE, TR | **Removed** | It existed only to serve markets that were never real. Two Kolding roles remain. |",
  "",
  "The owner confirmed the first two directly. Both are now tagged CLIENT in",
  "`content/company.ts` rather than ASSUMED, and the two metric tiles that counted",
  "them were replaced with the recording and notice-period commitments, because a",
  "headline figure of one market argues against itself.",
  "",
  "This is the failure mode the audit was written to catch: the copy was fluent and",
  "internally consistent, and still described a company that did not exist.",
  "",
  "### Scale and capability — still to confirm",
].join("\n");

audit = audit.replace("### Scale and capability — the important ones", resolved);

writeFileSync(path, audit);
console.log("CONTENT-AUDIT.md updated");
