import { company } from "@/content/company";
import { siteUrl } from "@/lib/site";

/**
 * RFC 9116. It tells someone who finds a vulnerability where to report it, which
 * is the difference between a quiet email and a public disclosure.
 *
 * The expiry is required by the spec and has to be in the future, so it is
 * computed at build time as a year out rather than hard-coded and left to rot.
 */
export const dynamic = "force-static";

export function GET() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const body = [
    `Contact: mailto:${company.email}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    "Preferred-Languages: da, en",
    `Canonical: ${siteUrl}/.well-known/security.txt`,
    "",
    "# Please report privately first and give us a reasonable chance to fix it.",
    "# No bug bounty is offered, but credit is given gladly.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
