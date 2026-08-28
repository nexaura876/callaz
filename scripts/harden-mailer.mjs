/**
 * One-shot: adds header sanitising to the mailer. Kept as a record of the edit;
 * it is idempotent and not wired into any npm script.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(new URL("../src/lib/mailer.ts", import.meta.url));
let source = readFileSync(path, "utf8");

const helper = [
  'const endpoint = "https://api.resend.com/emails";',
  "",
  "/**",
  " * Collapses control characters, CR and LF included, out of anything that ends up",
  " * in a mail header.",
  " *",
  " * Resend takes JSON rather than raw SMTP, so a newline cannot split a header the",
  " * classic way. This is belt and braces for the day the transport changes, and it",
  " * also stops a company name full of line breaks from mangling the subject.",
  " */",
  "function headerSafe(value, maxLength = 120) {",
  "  return value",
  "    .replace(/[\\u0000-\\u001f\\u007f]/g, \" \")",
  "    .replace(/\\s+/g, \" \")",
  "    .trim()",
  "    .slice(0, maxLength);",
  "}",
].join("\n");

if (!source.includes("headerSafe")) {
  source = source.replace(
    'const endpoint = "https://api.resend.com/emails";',
    helper,
  );

  // TypeScript, so give the helper its types back.
  source = source.replace(
    "function headerSafe(value, maxLength = 120) {",
    "function headerSafe(value: string, maxLength = 120) {",
  );

  source = source.replace(
    "subject: `Enquiry from ${enquiry.company} (${enquiry.topic})`,",
    "subject: `Enquiry from ${headerSafe(enquiry.company, 80)} (${enquiry.topic})`,",
  );

  writeFileSync(path, source);
  console.log("mailer hardened");
} else {
  console.log("mailer already hardened, nothing to do");
}
